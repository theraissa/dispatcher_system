"""
Módulo de rotas relacionadas aos clientes.
"""

from flask import Flask, jsonify, Response, request
from services.user_client import UserClientService
from models.user_client import CreateUserClientRequest

def register_client_routes(
    app: Flask,
    user_client_service: UserClientService,
) -> None:
    """Registra as rotas dos clientes na aplicação Flask."""

    @app.get("/api/dispatcher-system/client")
    def list_user_client() -> Response:
        """Lista os usuários do tipo cliente no banco de dados"""
        list_user_client = user_client_service.list_user_client()
        return jsonify(list_user_client), 200
    
    @app.post("/api/dispatcher-system/client")
    def create_user_client() -> Response:
        """Cria um usuário do tipo cliente no banco de dados"""
        body = CreateUserClientRequest.model_validate(request.get_json())
        created_user_client = user_client_service.create_user_client(body)
        return jsonify(created_user_client), 201

    @app.put("/api/dispatcher-system/client/<client_id>")
    def update_user_client(client_id) -> Response:
        """Atualiza um usuário do tipo cliente no banco de dados"""
        body = CreateUserClientRequest.model_validate(request.get_json())
        created_user_client = user_client_service.update_user_client(client_id, body)
        return jsonify(created_user_client), 200
    
    @app.delete("/api/dispatcher-system/client/<client_id>")
    def delete_user_client(client_id) -> Response:
        """Deleta um usuário do tipo cliente no banco de dados"""
        deleted_user_client = user_client_service.delete_user_client(client_id)
        return jsonify(deleted_user_client), 200
