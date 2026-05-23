"""
Módulo com implementação do serviço AuthService.
"""

from datetime import timedelta

from flask import abort
from flask_jwt_extended import create_access_token, get_jwt
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash

from database.tables import DispatcherDB, UserDB
from models.auth import LoginUserRequest, LoginUserResponse, RoleType
from storage import redis_client


class AuthService:
    """
    Serviço para gerenciar autenticação dos usuários do banco de dados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def login(self, user_data: LoginUserRequest) -> LoginUserResponse:
        """
        Realiza autenticação do usuário.
        """
        user = UserDB.query.filter(
            UserDB.email == user_data.email,
            UserDB.deleted_at.is_(None),
        ).first()

        if not user:
            abort(404, description="Usuário não foi encontrado.")

        if not check_password_hash(user.password, user_data.password):
            abort(401, description="Credenciais inválidas.")

        dispatcher = DispatcherDB.query.filter(
            DispatcherDB.user_id == user.id,
            DispatcherDB.deleted_at.is_(None),
        ).first()

        if dispatcher:
            if dispatcher.status == "pendente":
                abort(401, description="Seu registro está pendente.")

            if dispatcher.status == "negado":
                abort(401, description="Seu registro foi negado.")

        role: RoleType = "despachante" if dispatcher and dispatcher.status == "aprovado" else "cliente"

        token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": role,
            },
            expires_delta=timedelta(hours=1),
        )

        return LoginUserResponse(
            id=user.id,
            dispatcher_id=dispatcher.id if dispatcher else None,
            name=user.name,
            email=user.email,
            role=role,
            token=token,
        )

    def logout(self):
        """
        Revoga o token JWT atual.
        """
        jti = get_jwt()["jti"]

        if redis_client:
            redis_client.set(f"blacklist:{jti}", "true", ex=3600)
