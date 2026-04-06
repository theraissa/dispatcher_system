"""
Módulo com implementação do serviço AuthService.
"""

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from database.tables import DispatcherDB, UserDB
from flask import abort
from flask_sqlalchemy import SQLAlchemy
from models.auth import LoginUserRequest, LoginUserResponse, RoleType


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
            abort(404, description="Usuário não encontrado.")

        if user.password != user_data.password:
            abort(401, description="Credenciais inválidas.")

        dispatcher = DispatcherDB.query.filter_by(user_id=user.id).first()

        if dispatcher:
            if dispatcher.status == "pending":
                abort(401, description="Seu registro está pendente.")
            elif dispatcher.status == "rejected":
                abort(401, description="Seu registro foi rejeitado.")

        role: RoleType = "dispatcher" if dispatcher else "client"

        token = self._generate_token(user.id, role)

        return LoginUserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=role,
            token=token,
        )

    def _generate_token(self, user_id: int, role: RoleType) -> str:
        """
        Gera um token JWT para o usuário autenticado.

        Args:
            user_id (int): ID do usuário.
            role (RoleType): Papel do usuário (client ou dispatcher).
        Returns:
            str: Token JWT gerado.
        """
        payload = {
            "user_id": user_id,
            "role": role,
            "exp": datetime.now(timezone.utc) + timedelta(hours=2),
        }
        return jwt.encode(payload, "sua_chave_secreta", algorithm="HS256")
