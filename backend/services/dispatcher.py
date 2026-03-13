"""
Módulo com implementação do serviço DispatcherService.
"""

from datetime import datetime
from typing import Any

from database.tables import DispatcherDB, OfficeDB, UserDB
from flask import abort
from flask_sqlalchemy import SQLAlchemy
from models.dispatcher import (
    CreateDispatcherFullRequest,
    CreateDispatcherFullResponse,
    CreateDispatcherRequest,
    DispatcherResponse,
    ListDispatcherResponse,
    OfficeResponse,
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
            self.db.session.query(DispatcherDB, UserDB, OfficeDB)
            .join(UserDB, DispatcherDB.user_id == UserDB.id)
            .join(OfficeDB, OfficeDB.dispatcher_id == DispatcherDB.id)
            .filter(DispatcherDB.deleted_at.is_(None))
            .all()
        )

        response = []
        for dispatcher, user, office in results:
            response.append(
                CreateDispatcherFullResponse(
                    user=UserResponse.model_validate(user),
                    dispatcher=DispatcherResponse.model_validate(dispatcher),
                    office=OfficeResponse.model_validate(office),
                )
            )
        return ListDispatcherResponse(root=response).model_dump()

    def get_dispatcher_by_cpf(self, dispatcher_cpf: str) -> dict:
        """
        Recupera um despachante a partir do CPF do usuário associado.

        Args:
            dispatcher_cpf (str): CPF do usuário vinculado ao despachante.
        Returns:
            dict: Dados serializados do despachante encontrado.
        """
        dispatcher = (
            self.db.session.query(DispatcherDB)
            .join(UserDB, DispatcherDB.user_id == UserDB.id)
            .filter(UserDB.cpf == dispatcher_cpf)
            .filter(DispatcherDB.deleted_at.is_(None))
            .first()
        )

        if not dispatcher:
            abort(404, description=f"Dispatcher with CPF '{dispatcher_cpf}' not found.")

        return DispatcherResponse.model_validate(dispatcher).model_dump()

    def create_dispatcher(self, dispatcher_data: CreateDispatcherFullRequest) -> dict[str, Any]:
        """
        Cria um novo despachante.

        Args:
            dispatcher_data (CreateDispatcherRequest): O modelo Pydantic com os dados do novo despachante.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto recém-criado.
        """

        try:
            # criar usuário
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

            # criar dispatcher
            new_dispatcher = DispatcherDB(
                user_id=new_user.id,
                regis_crdd=dispatcher_data.dispatcher.regis_crdd,
                date_exp_regis=dispatcher_data.dispatcher.date_exp_regis,
            )

            self.db.session.add(new_dispatcher)
            self.db.session.flush()

            # criar office
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

    def update_dispatcher(self, dispatcher_id: str, dispatcher_data: CreateDispatcherRequest) -> dict[str, Any]:
        """
        Atualiza o despachante existente por seu ID.

        Args:
            dispatcher_id: O ID do despachante a ser atualizado.
            dispatcher_data: O modelo Pydantic com os dados atualizados do despachante.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto atualizado.
        """
        dispatcher_to_update = DispatcherDB.query.filter(DispatcherDB.id == dispatcher_id, DispatcherDB.deleted_at.is_(None)).first()
        if not dispatcher_to_update:
            abort(404, description=f"Dispatcher with ID '{dispatcher_id}' not found.")

        for key, value in dispatcher_data.model_dump(mode="json").items():
            setattr(dispatcher_to_update, key, value)

        dispatcher_to_update.updated_at = datetime.now()
        self.db.session.commit()

        return DispatcherResponse.model_validate(dispatcher_to_update).model_dump()

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
