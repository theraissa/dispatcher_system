"""
Módulo de rotas relacionadas aos usuários.
"""

from flask import Flask, Response, jsonify, request
from models.user import CreateUserRequest, LoginUserRequest
from services.user import UserService


def register_users_routes(
    app: Flask,
    user_service: UserService,
) -> None:
    """Registra as rotas dos usuários na aplicação Flask."""

    @app.post("/api/dispatcher-system/login")
    def login() -> Response:
        """Logar"""
        body = LoginUserRequest.model_validate(request.get_json())
        user = user_service.get_user_by_email_and_password(body)
        return jsonify(user), 200

    @app.get("/api/dispatcher-system/user")
    def list_user() -> Response:
        """Lista os usuários no banco de dados"""
        list_users = user_service.list_user()
        return jsonify(list_users), 200

    @app.post("/api/dispatcher-system/user")
    def create_user() -> Response:
        """Cria um usuário no banco de dados"""
        body = CreateUserRequest.model_validate(request.get_json())
        created_user = user_service.create_user(body)
        return jsonify(created_user), 201

    @app.put("/api/dispatcher-system/user/<user_id>")
    def update_user(user_id) -> Response:
        """Atualiza um usuário no banco de dados"""
        body = CreateUserRequest.model_validate(request.get_json())
        updated_user = user_service.update_user(user_id, body)
        return jsonify(updated_user), 200

    @app.delete("/api/dispatcher-system/user/<user_id>")
    def delete_user(user_id) -> Response:
        """Deleta um usuário no banco de dados"""
        deleted_user = user_service.delete_user(user_id)
        return jsonify(deleted_user), 200
