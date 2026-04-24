"""
Módulo com implementação do serviço AuthService.
"""

import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from flask import abort
from flask_sqlalchemy import SQLAlchemy

from database.tables import DispatcherDB, UserDB
from models.auth import LoginUserRequest, LoginUserResponse, RoleType
from storage import redis_client


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
            if dispatcher.status == "pendente":
                abort(401, description="Seu registro está pendente.")
            elif dispatcher.status == "rejected":
                abort(401, description="Seu registro foi rejeitado.")

        role: RoleType = "dispatcher" if dispatcher else "client"

        token = self._generate_token(user.id, role)

        return LoginUserResponse(
            id=user.id,
            dispatcher_id=dispatcher.id if dispatcher else None,
            name=user.name,
            email=user.email,
            role=role,
            token=token,
        )

    def logout(self, token: str):
        """
        Invalida um token JWT, adicionando seu JTI a uma blacklist no Redis. O token ficará inválido
        até expirar naturalmente, e o Redis irá remover a blacklist automaticamente quando isso acontecer.

        Args:
            token (str): Token JWT a ser invalidado.
        """
        try:
            # Decodificamos o token para pegar o JTI e o tempo de expiração
            payload = jwt.decode(token, "sua_chave_secreta", algorithms=["HS256"])
            jti = payload["jti"]
            exp = payload["exp"]

            # Calculamos quanto tempo o token ainda seria válido
            now = datetime.now(timezone.utc).timestamp()
            ttl = int(exp - now)

            if ttl > 0:
                # Armazenamos o JTI no Redis. O valor pode ser qualquer um ("true").
                # O segredo é o 'ex=ttl', que deleta a chave do Redis automaticamente
                # quando o token expiraria naturalmente.
                redis_client.set(f"blacklist:{jti}", "true", ex=ttl)

        except jwt.PyJWTError:
            abort(401, description="Token inválido.")

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
            "jti": str(uuid.uuid4()),
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        }
        return jwt.encode(payload, "sua_chave_secreta", algorithm="HS256")
