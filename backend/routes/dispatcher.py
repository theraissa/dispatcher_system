"""
Módulo de rotas relacionadas aos despachantes.
"""

from flask import Flask, jsonify, Response, request
from services.user_dispatcher import UserDispatcherService
from models.user_dispatcher import CreateUserDispatcherRequest

def register_dispatcher_routes(
    app: Flask,
    user_dispatcher_service: UserDispatcherService,
) -> None:
    """Registra as rotas dos despachantes na aplicação Flask."""

    @app.get("/api/dispatcher-system/dispatcher")
    def list_user_dispatcher() -> Response:
        """Lista um usuário do tipo despachante no banco de dados"""
        list_user_dispatcher = user_dispatcher_service.list_user_dispatcher()
        return jsonify(list_user_dispatcher), 200
    
    @app.post("/api/dispatcher-system/dispatcher")
    def create_user_dispatcher() -> Response:
        """Cria um usuário do tipo despachante no banco de dados"""
        body = CreateUserDispatcherRequest.model_validate(request.get_json())
        created_user_dispatcher = user_dispatcher_service.create_user_dispatcher(body)
        return jsonify(created_user_dispatcher), 201

    @app.put("/api/dispatcher-system/dispatcher/<dispatcher_id>")
    def update_user_dispatcher(dispatcher_id) -> Response:
        """Atualiza um usuário do tipo despachante no banco de dados"""
        body = CreateUserDispatcherRequest.model_validate(request.get_json())
        created_user_dispatcher = user_dispatcher_service.update_user_dispatcher(dispatcher_id, body)
        return jsonify(created_user_dispatcher), 200
    
    @app.delete("/api/dispatcher-system/dispatcher/<dispatcher_id>")
    def delete_user_dispatcher(dispatcher_id) -> Response:
        """Deleta um usuário do tipo despachante no banco de dados"""
        deleted_user_dispatcher = user_dispatcher_service.delete_user_dispatcher(dispatcher_id)
        return jsonify(deleted_user_dispatcher), 200
