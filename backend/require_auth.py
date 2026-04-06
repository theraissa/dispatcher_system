"""
Módulo de autenticação para proteger rotas que exigem login.
"""

from functools import wraps

import jwt
from flask import request, jsonify, g

SECRET_KEY = "sua_chave_secreta"


def require_auth(f):
    """Decorador para proteger rotas que exigem autenticação."""

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Token não fornecido"}), 401

        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # salva usuário no contexto da request
            g.user_id = payload["user_id"]

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expirado"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message": "Token inválido"}), 401

        return f(*args, **kwargs)

    return decorated
