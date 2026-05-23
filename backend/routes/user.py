"""
Módulo de rotas relacionadas aos usuários.

Responsável pelo gerenciamento de usuários do sistema,
incluindo operações de cadastro, consulta e atualização.
"""

import json

from flask import Flask, Response, jsonify, request
from flask_jwt_extended import jwt_required

from models.user import CreateUserRequest, UpdateUserProfileRequest, UpdateUserRequest
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
    @jwt_required()
    def list_user() -> Response:
        """Lista todos os usuários cadastrados."""
        list_users = user_service.list_user()
        return jsonify(list_users.model_dump(mode="json")), 200

    @app.get("/api/dispatcher-system/user/<int:user_id>")
    @jwt_required()
    def get_user_by_id(user_id) -> Response:
        """Obtém os dados de um usuário pelo ID."""
        user = user_service.get_user_by_id(user_id)
        return jsonify(user.model_dump(mode="json")), 200

    @app.post("/api/dispatcher-system/user")
    def create_user() -> Response:
        """Cria um novo usuário."""
        body = CreateUserRequest.model_validate(request.get_json())
        created_user = user_service.create_user(body)
        return jsonify(created_user.model_dump(mode="json")), 201

    @app.put("/api/dispatcher-system/user/<int:user_id>")
    @jwt_required()
    def update_user(user_id) -> Response:
        """Atualiza os dados de um usuário."""
        body = UpdateUserRequest.model_validate(request.get_json())
        updated_user = user_service.update_user(user_id, body)
        return jsonify(updated_user.model_dump(mode="json")), 200

    @app.put("/api/dispatcher-system/user/<int:user_id>/profile")
    @jwt_required()
    def update_user_profile_public(user_id) -> Response:
        """Atualiza os dados do perfil de um usuário."""
        data = json.loads(request.form.get("data", "{}"))
        photo = request.files.get("photo")
        result = user_service.update_user_profile_public(
            user_id=user_id,
            data=UpdateUserProfileRequest(**data),
            photo=photo,
        )
        return jsonify(result.model_dump(mode="json")), 200

    @app.delete("/api/dispatcher-system/user/<int:user_id>")
    @jwt_required()
    def delete_user(user_id) -> Response:
        """Remove um usuário do sistema."""
        deleted_user = user_service.delete_user(user_id)
        return jsonify(deleted_user.model_dump(mode="json")), 200
