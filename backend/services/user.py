"""
Módulo com implementação do serviço UserService.
"""

from typing import Any
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from database.tables import UserDB
from models.user import CreateUserRequest, UserResponse, ListUserResponse, LoginUserRequest
from flask import abort


class UserService:
    """
    Serviço para gerenciar usuários no banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_user(self) -> ListUserResponse:
        """
        Recupera todos os usuários ativos (não deletados).

        Returns:
            ListUserClientResponse: Lista de usuários.
            Retorna uma lista vazia quando nenhum usuário estiver cadastrado.
        """
        list_users = UserDB.query.filter(UserDB.deleted_at.is_(None)).all()
        response = ListUserResponse(root=[UserResponse.model_validate(user) for user in list_users])
        return response.model_dump()

    def get_user_by_cpf(self, user_cpf: str) -> dict[str, Any]:
        """
        Recupera um usuário a partir do CPF.

        Args:
            user_cpf (str): CPF do usuário.
        Returns:
            dict: Dados serializados do usuário encontrado.
        """
        user = UserDB.query.filter(UserDB.cpf == user_cpf, UserDB.deleted_at.is_(None))

        if not user:
            abort(404, description=f"User with CPF '{user_cpf}' not found.")

        return UserResponse.model_validate(user).model_dump()

    def get_user_by_email_and_password(self, user_data: LoginUserRequest) -> dict[str, Any]:
        """
        Recupera um usuário a partir do email e senha.

        Args:
            user_email (str): email do usuário.
            user_password (str): senha do usuário.
        Returns:
            dict: Dados serializados do usuário encontrado.
        """
        user = UserDB.query.filter(
            UserDB.email == user_data.email,
            UserDB.password == user_data.password,
            UserDB.deleted_at.is_(None),
        ).first()

        if not user:
            abort(404, description="User not found.")

        return UserResponse.model_validate(user).model_dump()

    def create_user(self, user_data: CreateUserRequest) -> dict[str, Any]:
        """
        Cria um novo usuário.

        Args:
            user_data (CreateUserRequest): O modelo Pydantic com os dados do novo usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto recém-criado.
        """
        new_user = UserDB(**user_data.model_dump(mode="json"))

        self.db.session.add(new_user)
        self.db.session.commit()

        return UserResponse.model_validate(new_user).model_dump()

    def update_user(self, user_id: str, user_data: CreateUserRequest) -> dict[str, Any]:
        """
        Atualiza usuário existente por seu ID.

        Args:
            client_id: O ID do usuário a ser atualizado.
            user_data: O modelo Pydantic com os dados atualizados do usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto  atualizado.
        """
        user_to_update = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
        if not user_to_update:
            abort(404, description=f"User with ID '{user_id}' not found.")

        for key, value in user_data.model_dump(mode="json").items():
            setattr(user_to_update, key, value)

        user_to_update.updated_at = datetime.now()
        self.db.session.commit()

        return UserResponse.model_validate(user_to_update).model_dump()

    def delete_user(self, user_id: str) -> dict[str, Any]:
        """
        Deleta logicamente (soft delete) um usuário ativo por seu ID.

        Args:
            user_id: O ID do usuário a ser marcado como deletada.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto marcado como deletado.
        """
        user_to_delete = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
        if not user_to_delete:
            abort(404, description=f"User with ID '{user_id}' not found.")

        user_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return UserResponse.model_validate(user_to_delete).model_dump()
