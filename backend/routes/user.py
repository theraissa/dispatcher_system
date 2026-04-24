"""
Módulo de rotas relacionadas aos usuários.

Responsável pelo gerenciamento de usuários do sistema,
incluindo operações de cadastro, consulta e atualização.
"""

from flask import Flask, Response, jsonify, request

from models.user import CreateUserRequest, UpdateUserRequest
from require_auth import require_auth
from services.user import UserService


def register_users_routes(
    app: Flask,
    user_service: UserService,
) -> None:
    """
    Registra as rotas relacionadas aos usuários.

    Args:
        app (Flask): Instância da aplicação Flask.
        user_service (UserService): Serviço de regras de negócio dos usuários.
    """

    # ==========================================================
    # USUÁRIOS (CRUD)
    # ==========================================================

    @app.get("/api/dispatcher-system/user")
    def list_user() -> Response:
        """Lista todos os usuários cadastrados."""
        list_users = user_service.list_user()
        return jsonify(list_users), 200

    @app.get("/api/dispatcher-system/user/<user_id>")
    @require_auth
    def get_user_by_id(user_id) -> Response:
        """Obtém os dados de um usuário pelo ID."""
        user = user_service.get_user_by_id(user_id)
        return jsonify(user), 200

    @app.post("/api/dispatcher-system/user")
    def create_user() -> Response:
        """Cria um novo usuário."""
        body = CreateUserRequest.model_validate(request.get_json())
        created_user = user_service.create_user(body)
        return jsonify(created_user), 201

    @app.put("/api/dispatcher-system/user/<user_id>")
    @require_auth
    def update_user(user_id) -> Response:
        """Atualiza os dados de um usuário."""
        body = UpdateUserRequest.model_validate(request.get_json())
        updated_user = user_service.update_user(user_id, body)
        return jsonify(updated_user), 200

    @app.delete("/api/dispatcher-system/user/<user_id>")
    @require_auth
    def delete_user(user_id) -> Response:
        """Remove um usuário do sistema."""
        deleted_user = user_service.delete_user(user_id)
        return jsonify(deleted_user), 200
