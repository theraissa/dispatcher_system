"""
Módulo de autenticação para proteger rotas que exigem login.
"""

from functools import wraps
import jwt
from flask import request, jsonify, g, abort
from storage import redis_client

SECRET_KEY = "sua_chave_secreta"


def require_auth(f):
    """Decorador para proteger rotas que exigem autenticação com verificação de Blacklist."""

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Token não fornecido"}), 401

        try:
            # 1. Extrai o token
            token = auth_header.split(" ")[1]

            # 2. Decodifica o payload
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # 3. VERIFICAÇÃO DO REDIS (Blacklist)
            jti = payload.get("jti")
            if redis_client.exists(f"blacklist:{jti}"):
                return jsonify({"message": "Token revogado. Faça login novamente."}), 401

            # 4. Salva no contexto global da requisição (Flask g)
            g.user_id = payload["user_id"]
            g.user_role = payload.get("role")

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expirado"}), 401

        except (jwt.InvalidTokenError, IndexError):
            return jsonify({"message": "Token inválido ou malformado"}), 401

        return f(*args, **kwargs)

    return decorated


class RequestContext:
    """Docstring"""

    @property
    def user_id(self) -> int:
        """Docstring"""
        if not hasattr(g, "user_id"):
            abort(401, description="Usuário não encontrado no contexto da requisição")
        return g.user_id

    @property
    def user_role(self) -> str | None:
        """Docstring"""
        return getattr(g, "user_role", None)


request_context = RequestContext()
