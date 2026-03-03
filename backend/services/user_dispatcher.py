"""
Módulo com implementação do serviço UserDispatcherService.
"""

from flask_sqlalchemy import SQLAlchemy
from database.tables import UserDispatcher
from models.user_dispatcher import CreateUserDispatcherRequest, UserDispatcherResponse, ListUserDispatcherResponse
from typing import Any
from flask import abort
from datetime import datetime


class UserDispatcherService:
    """
    Serviço para gerenciar usuário despachante no banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_user_dispatcher(self) -> ListUserDispatcherResponse:
        """
        Recupera todos os usuários despachantes ativos (não deletados).

        Returns:
            ListUserDispatcherResponse: Lista de usuários do tipo despachante.
            Retorna uma lista vazia quando nenhum usuário estiver cadastrado.
        """
        users_dispatcher = UserDispatcher.query.filter(UserDispatcher.deleted_at.is_(None)).all()
        response = ListUserDispatcherResponse(root=[UserDispatcherResponse.model_validate(user) for user in users_dispatcher])
        return response.model_dump()
    
    def create_user_dispatcher(self, user_dispatcher_data: CreateUserDispatcherRequest) -> dict[str, Any]:
        """
        Cria um novo usuário do tipo despachante.

        Args:
            user_dispatcher_data (CreateUserDispatcherRequest): O modelo Pydantic com os dados do novo usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto recém-criado.
        """
        new_user_dispatcher = UserDispatcher(**user_dispatcher_data.model_dump(mode="json"))

        self.db.session.add(new_user_dispatcher)
        self.db.session.commit()

        return UserDispatcherResponse.model_validate(new_user_dispatcher).model_dump()
    
    def update_user_dispatcher(self, dispatcher_id: str, user_dispatcher_data: CreateUserDispatcherRequest) -> dict[str, Any]:
        """
        Atualiza usuário do tipo despachante existente por seu ID.

        Args:
            dispatcher_id: O ID do usuário do despachante a ser atualizado.
            user_dispatcher_data: O modelo Pydantic com os dados atualizados do usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto atualizado.
        """
        user_to_update = UserDispatcher.query.filter(
            UserDispatcher.id == dispatcher_id, UserDispatcher.deleted_at.is_(None)
        ).first()
        if not user_to_update:
            abort(404, description=f"User Client with ID '{dispatcher_id}' not found.")

        for key, value in user_dispatcher_data.model_dump(mode="json").items():
            setattr(user_to_update, key, value)

        user_to_update.updated_at = datetime.now()
        self.db.session.commit()

        return UserDispatcherResponse.model_validate(user_to_update).model_dump()
    
    def delete_user_dispatcher(self, dispatcher_id: str) -> str:
        """
        Deleta logicamente (soft delete) um usuário despachante ativo por seu ID.

        Args:
            dispatcher_id: O ID do usuário despachante a ser marcado como deletada.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto marcado como deletado.
        """
        user_to_delete = UserDispatcher.query.filter(
            UserDispatcher.id == dispatcher_id, UserDispatcher.deleted_at.is_(None)
        ).first()
        if not user_to_delete:
            abort(404, description=f"User Dispatcher with ID '{dispatcher_id}' not found.")

        user_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return UserDispatcherResponse.model_validate(user_to_delete).model_dump()
