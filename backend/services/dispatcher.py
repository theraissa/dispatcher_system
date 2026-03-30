"""
Módulo com implementação do serviço DispatcherService.
"""

from datetime import datetime
from typing import Any

from database.tables import DispatcherDB, OfficeDB, ServiceDetailsDB, UserDB, ProfileDB, ServiceDB
from flask import abort
from flask_sqlalchemy import SQLAlchemy
from models.dispatcher import (
    CreateDispatcherFullRequest,
    CreateDispatcherFullResponse,
    DispatcherResponse,
    ListDispatcherResponse,
    OfficeResponse,
    ProfileResponse,
)
from models.user import UserResponse


class DispatcherService:
    """
    Serviço para gerenciar despachante no banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatcher(self) -> ListDispatcherResponse:
        """
        Recupera todos os despachantes ativos (não deletados).

        Returns:
            ListDispatcherResponse: Lista de despachantes.
            Retorna uma lista vazia quando nenhum despachante estiver cadastrado.
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
        Recupera um despachante a partir do ID do usuário associado.

        Args:
            dispatcher_id (str): ID do usuário vinculado ao despachante.
        Returns:
            dict: Dados serializados do despachante encontrado.
        """
        dispatcher = (
            self.db.session.query(DispatcherDB).filter(DispatcherDB.user_id == dispatcher_id, DispatcherDB.deleted_at.is_(None)).first()
        )
        if not dispatcher:
            abort(404, description="Dispatcher with ID {dispatcher_id} not found")

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
        Cria um novo usuário, despachante, estabelecimento e perfil.

        Args:
            dispatcher_data (CreateDispatcherRequest): O modelo Pydantic com os dados.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto recém-criado.
        """
        try:
            new_user = UserDB(
                cpf=dispatcher_data.user.cpf,
                rg=dispatcher_data.user.rg,
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

    def update_dispatcher_full(self, user_id: int, data: CreateDispatcherFullRequest) -> dict:
        """
        Atualiza o despachante existente por seu ID.

        Args:
            user_id: O ID do despachante a ser atualizado.
            dispatcher_data: O modelo Pydantic com os dados atualizados do despachante.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto atualizado.
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

    def delete_dispatcher(self, dispatcher_id: str) -> str:
        """
        Deleta logicamente (soft delete) um despachante ativo por seu ID.

        Args:
            dispatcher_id: O ID do despachante a ser marcado como deletada.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto marcado como deletado.
        """
        dispatcher_to_delete = DispatcherDB.query.filter(DispatcherDB.id == dispatcher_id, DispatcherDB.deleted_at.is_(None)).first()
        if not dispatcher_to_delete:
            abort(404, description=f"Dispatcher with ID '{dispatcher_id}' not found.")

        dispatcher_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return DispatcherResponse.model_validate(dispatcher_to_delete).model_dump()

    def search_dispatchers(self, name: str | None, city: str | None, service: str | None) -> ListDispatcherResponse:
        """
        Busca despachantes com filtros opcionais por nome, cidade e serviço.

        Args:
            name (str | None): Filtro por nome do despachante.
            city (str | None): Filtro por cidade do escritório do despachante.
            service (str | None): Filtro por serviço oferecido no perfil do despachante.
        Returns:
            ListDispatcherResponse: Lista de despachantes que correspondem aos filtros.
        """
        query = (
            self.db.session.query(DispatcherDB, UserDB, OfficeDB, ProfileDB)
            .join(UserDB, DispatcherDB.user_id == UserDB.id)
            .join(OfficeDB, OfficeDB.dispatcher_id == DispatcherDB.id)
            .join(ProfileDB, ProfileDB.dispatcher_id == DispatcherDB.id)
            .filter(DispatcherDB.deleted_at.is_(None))
        )

        # Filtrar por nome
        if name:
            query = query.filter(UserDB.name.ilike(f"%{name}%"))

        # Filtrar por cidade
        if city:
            query = query.filter(OfficeDB.city.ilike(f"%{city}%"))

        # Filtrar por serviço
        if service:
            query = (
                query.join(ServiceDetailsDB, ServiceDetailsDB.dispatcher_id == DispatcherDB.id)
                .join(ServiceDB, ServiceDB.id == ServiceDetailsDB.service_id)
                .filter(ServiceDB.name.ilike(f"%{service}%"))
            )

        # paginação - limitando a 10 resultados por página
        query = query.offset((1 - 1) * 10).limit(10)

        results = query.all()

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
