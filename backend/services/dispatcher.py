"""
Serviço responsável pelo gerenciamento de despachantes no sistema.
"""

from datetime import datetime
from typing import Any

from flask import abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_

from database.tables import DispatcherDB, OfficeDB, ProfileDB, ServiceDB, ServiceDetailsDB, UserDB
from models.dispatcher import (
    CreateDispatcherFullRequest,
    CreateDispatcherFullResponse,
    DispatcherResponse,
    ListDispatcherResponse,
    OfficeResponse,
    ProfileResponse,
    UpdateDispatcherFullRequest,
)
from models.user import UserResponse


class DispatcherService:
    """
    Serviço de domínio responsável pela gestão de despachantes.

    Este serviço orquestra múltiplas entidades relacionadas ao despachante:
        - Usuário (User)
        - Despachante (Dispatcher)
        - Escritório (Office)
        - Perfil (Profile)

    Args:
        db (SQLAlchemy): Sessão do SQLAlchemy utilizada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatcher(self) -> ListDispatcherResponse:
        """
        Lista todos os despachantes ativos no sistema.

        Considera apenas registros não deletados (soft delete).

        Returns:
            ListDispatcherResponse: Lista de despachantes contendo:
                - Dados do usuário
                - Dados do despachante
                - Informações do escritório
                - Perfil

            Retorna lista vazia caso não existam registros.
        """
        results = (
            self.db.session.query(DispatcherDB, UserDB, OfficeDB, ProfileDB)
            .join(UserDB, DispatcherDB.user_id == UserDB.id)
            .join(OfficeDB, OfficeDB.dispatcher_id == DispatcherDB.id)
            .join(ProfileDB, ProfileDB.dispatcher_id == DispatcherDB.id)
            .filter(DispatcherDB.deleted_at.is_(None))
            .all()
        )

        response = []
        for dispatcher, user, office, profile in results:
            response.append(
                CreateDispatcherFullResponse(
                    user=UserResponse.model_validate(user),
                    dispatcher=DispatcherResponse.model_validate(dispatcher),
                    office=OfficeResponse.model_validate(office),
                    profile=ProfileResponse.model_validate(profile),
                )
            )
        return ListDispatcherResponse(root=response).model_dump()

    def get_dispatcher_by_id(self, dispatcher_id: str) -> dict:
        """
        Recupera os dados completos de um despachante pelo ID do usuário associado.

        Args:
            dispatcher_id (str): ID do usuário vinculado ao despachante.

        Returns:
            dict: Estrutura contendo:
                - user
                - dispatcher
                - office (opcional)
                - profile
        """
        dispatcher = (
            self.db.session.query(DispatcherDB).filter(DispatcherDB.user_id == dispatcher_id, DispatcherDB.deleted_at.is_(None)).first()
        )

        if not dispatcher:
            abort(404, description=f"Dispatcher with ID {dispatcher_id} not found")

        user = self.db.session.query(UserDB).filter(UserDB.id == dispatcher.user_id).first()
        office = self.db.session.query(OfficeDB).filter(OfficeDB.dispatcher_id == dispatcher.id).first()
        profile = self.db.session.query(ProfileDB).filter(ProfileDB.dispatcher_id == dispatcher.id).first()

        return CreateDispatcherFullResponse(
            user=UserResponse.model_validate(user),
            dispatcher=DispatcherResponse.model_validate(dispatcher),
            office=OfficeResponse.model_validate(office) if office else None,
            profile=ProfileResponse.model_validate(profile),
        ).model_dump()

    def create_dispatcher(self, dispatcher_data: CreateDispatcherFullRequest) -> dict[str, Any]:
        """
        Cria um novo despachante com todas as entidades relacionadas.

        Este processo inclui:
            - Criação do usuário
            - Criação do despachante
            - Criação do escritório

        A operação é transacional (rollback em caso de erro).

        Args:
            dispatcher_data (CreateDispatcherFullRequest): Dados completos para criação.

        Returns:
            dict[str, Any]: Identificadores das entidades criadas:
                - user_id
                - dispatcher_id
                - office_id
        """
        try:
            new_user = UserDB(
                cpf=dispatcher_data.user.cpf,
                name=dispatcher_data.user.name,
                date_birth=dispatcher_data.user.date_birth,
                contact=dispatcher_data.user.contact,
                email=dispatcher_data.user.email,
                password=dispatcher_data.user.password,
            )

            self.db.session.add(new_user)
            self.db.session.flush()

            new_dispatcher = DispatcherDB(
                user_id=new_user.id,
                regis_crdd=dispatcher_data.dispatcher.regis_crdd,
                date_exp_regis=dispatcher_data.dispatcher.date_exp_regis,
            )

            self.db.session.add(new_dispatcher)
            self.db.session.flush()

            new_office = OfficeDB(
                dispatcher_id=new_dispatcher.id,
                contact=dispatcher_data.office.contact,
                number=int(dispatcher_data.office.number),
                neighborhood=dispatcher_data.office.neighborhood,
                address=dispatcher_data.office.address,
                city=dispatcher_data.office.city,
                state=dispatcher_data.office.state,
                zip_code=int(dispatcher_data.office.zip_code),
            )

            self.db.session.add(new_office)
            self.db.session.commit()

            return {
                "user_id": new_user.id,
                "dispatcher_id": new_dispatcher.id,
                "office_id": new_office.id,
            }

        except Exception as e:
            self.db.session.rollback()
            raise e

    def update_dispatcher_full(self, user_id: int, data: UpdateDispatcherFullRequest) -> dict:
        """
        Atualiza os dados completos de um despachante.

        Permite atualização parcial das seguintes entidades:
            - Usuário
            - Despachante
            - Escritório

        Apenas campos informados são atualizados.

        Args:
            user_id (int): ID do usuário associado ao despachante.
            data (UpdateDispatcherFullRequest): Dados atualizados.

        Returns:
            dict: Mensagem de sucesso da operação.
        """
        try:
            user = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
            if not user:
                abort(404, description="User not found")

            for key, value in data.user.model_dump(exclude_unset=True).items():
                setattr(user, key, value)

            dispatcher = DispatcherDB.query.filter_by(user_id=user_id).first()
            if dispatcher:
                for key, value in data.dispatcher.model_dump(exclude_unset=True).items():
                    setattr(dispatcher, key, value)

            office = OfficeDB.query.filter_by(dispatcher_id=dispatcher.id).first()
            if office:
                for key, value in data.office.model_dump(exclude_unset=True).items():
                    setattr(office, key, value)

            self.db.session.commit()
            return {"message": "Profile updated successfully"}

        except Exception as e:
            self.db.session.rollback()
            raise e

    def delete_dispatcher(self, dispatcher_id: str) -> dict:
        """
        Realiza a exclusão lógica (soft delete) de um despachante.

        O registro não é removido fisicamente, apenas marcado com timestamp.

        Args:
            dispatcher_id (str): ID do despachante.

        Returns:
            dict: Dados do despachante após marcação de exclusão.
        """
        dispatcher_to_delete = DispatcherDB.query.filter(
            DispatcherDB.id == dispatcher_id,
            DispatcherDB.deleted_at.is_(None),
        ).first()

        if not dispatcher_to_delete:
            abort(404, description=f"Dispatcher with ID '{dispatcher_id}' not found.")

        dispatcher_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return DispatcherResponse.model_validate(dispatcher_to_delete).model_dump()

    def search_dispatchers(self, query: str | None) -> ListDispatcherResponse:
        """
        Busca despachantes com base em um termo de pesquisa.

        O filtro é aplicado de forma flexível (ILIKE) nos seguintes campos:
            - Nome do usuário
            - Cidade do escritório
            - Nome do serviço associado

        Args:
            query (str | None): Termo de busca.

        Returns:
            ListDispatcherResponse: Lista de despachantes que correspondem ao filtro.
        """
        base_query = (
            self.db.session.query(DispatcherDB, UserDB, OfficeDB, ProfileDB)
            .join(UserDB, DispatcherDB.user_id == UserDB.id)
            .join(OfficeDB, OfficeDB.dispatcher_id == DispatcherDB.id)
            .join(ProfileDB, ProfileDB.dispatcher_id == DispatcherDB.id)
            .filter(DispatcherDB.deleted_at.is_(None))
        )

        if query:
            search = f"%{query}%"

            base_query = (
                base_query.outerjoin(ServiceDetailsDB, ServiceDetailsDB.dispatcher_id == DispatcherDB.id)
                .outerjoin(ServiceDB, ServiceDB.id == ServiceDetailsDB.service_id)
                .filter(
                    or_(
                        UserDB.name.ilike(search),
                        OfficeDB.city.ilike(search),
                        ServiceDB.name.ilike(search),
                    )
                )
            )

        base_query = base_query.offset(0).limit(10)

        results = base_query.all()

        response = []
        for dispatcher, user, office, profile in results:
            response.append(
                CreateDispatcherFullResponse(
                    user=UserResponse.model_validate(user),
                    dispatcher=DispatcherResponse.model_validate(dispatcher),
                    office=OfficeResponse.model_validate(office),
                    profile=ProfileResponse.model_validate(profile),
                )
            )

        return ListDispatcherResponse(root=response).model_dump()
