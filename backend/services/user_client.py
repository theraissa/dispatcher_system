"""
Módulo com implementação do serviço UserClient.
"""

from flask_sqlalchemy import SQLAlchemy
from database.tables import UserClient
from models.user_client import CreateUserClientRequest, UserClientResponse, ListUserClientResponse
from typing import Any
from flask import abort
from datetime import datetime


class UserClientService:
    """
    Serviço para gerenciar usuário cliente banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_user_client(self) -> ListUserClientResponse:
        """
        Recupera todos os usuários clientes ativos (não deletadas).

        Returns:
            ListUserClientResponse: Lista de usuários do tipo cliente.
            Retorna uma lista vazia quando nenhum usuário estiver cadastrado.
        """
        users_client = UserClient.query.filter(UserClient.deleted_at.is_(None)).all()
        response = ListUserClientResponse(root=[UserClientResponse.model_validate(user) for user in users_client])
        return response.model_dump()

    def create_user_client(self, user_client_data: CreateUserClientRequest) -> dict[str, Any]:
        """
        Cria um novo usuário cliente.

        Args:
            user_client_data (CreateUserClientRequest): O modelo Pydantic com os dados do novo usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto recém-criado.
        """
        new_user_client = UserClient(**user_client_data.model_dump(mode="json"))

        self.db.session.add(new_user_client)
        self.db.session.commit()

        return UserClientResponse.model_validate(new_user_client).model_dump()

    def update_user_client(self, client_id: str, user_client_data: CreateUserClientRequest) -> dict[str, Any]:
        """
        Atualiza usuário do tipo cliente existente por seu ID.

        Args:
            client_id: O ID do usuário cliente a ser atualizado.
            user_client_data: O modelo Pydantic com os dados atualizados do usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto  atualizado.
        """
        user_to_update = UserClient.query.filter(
            UserClient.id == client_id, UserClient.deleted_at.is_(None)
        ).first()
        if not user_to_update:
            abort(404, description=f"User Client with ID '{client_id}' not found.")

        for key, value in user_client_data.model_dump(mode="json").items():
            setattr(user_to_update, key, value)

        user_to_update.updated_at = datetime.now()
        self.db.session.commit()

        return UserClientResponse.model_validate(user_to_update).model_dump()

    def delete_user_client(self, client_id: str) -> dict[str, Any]:
        """
        Deleta logicamente (soft delete) um usuário cliente ativo por seu ID.

        Args:
            client_id: O ID do usuário cliente a ser marcado como deletada.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto marcado como deletado.
        """
        user_to_delete = UserClient.query.filter(
            UserClient.id == client_id, UserClient.deleted_at.is_(None)
        ).first()
        if not user_to_delete:
            abort(404, description=f"User Client with ID '{client_id}' not found.")

        user_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return UserClientResponse.model_validate(user_to_delete).model_dump()
