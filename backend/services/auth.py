"""
Módulo com implementação do serviço AuthService.
"""

from typing import Any

from database.tables import DispatcherDB, UserDB
from flask import abort
from flask_sqlalchemy import SQLAlchemy
from models.user import UserResponse, LoginUserRequest


class AuthService:
    """
    Serviço para gerenciar autenticação dos usuários do banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def login(self, user_data: LoginUserRequest) -> dict[str, Any]:
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
            UserDB.deleted_at.is_(None),
        ).first()
        if not user:
            abort(404, description="User not found.")
        if user.password != user_data.password:
            abort(401, description="Invalid credentials.")

        dispatcher = DispatcherDB.query.filter_by(user_id=user.id).first()

        if dispatcher:
            if dispatcher.status == "pending":
                abort(401, description="Your registration is still pending.")

            elif dispatcher.status == "rejected":
                abort(401, description="Your registration was rejected.")

        role = "dispatcher" if dispatcher else "client"

        user_data_response = UserResponse.model_validate(user).model_dump()
        user_data_response["role"] = role

        return user_data_response
