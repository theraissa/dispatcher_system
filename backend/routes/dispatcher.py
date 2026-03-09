"""
Módulo de rotas relacionadas aos despachantes.
"""

from flask import Flask, Response, jsonify, request
from models.dispatcher import CreateDispatcherFullRequest, CreateDispatcherRequest
from services.dispatcher import DispatcherService


def register_dispatcher_routes(
    app: Flask,
    dispatcher_service: DispatcherService,
) -> None:
    """Registra as rotas dos despachantes na aplicação Flask."""

    @app.get("/api/dispatcher-system/dispatcher")
    def list_dispatcher() -> Response:
        """Listar despachantes no banco de dados"""
        list_dispatcher = dispatcher_service.list_dispatcher()
        return jsonify(list_dispatcher), 200

    @app.post("/api/dispatcher-system/dispatcher")
    def create_dispatcher() -> Response:
        """Cria um despachante no banco de dados"""
        body = CreateDispatcherFullRequest.model_validate(request.get_json())
        created_dispatcher = dispatcher_service.create_dispatcher(body)
        return jsonify(created_dispatcher), 201

    @app.put("/api/dispatcher-system/dispatcher/<dispatcher_id>")
    def update_dispatcher(dispatcher_id) -> Response:
        """Atualiza um despachante no banco de dados"""
        body = CreateDispatcherRequest.model_validate(request.get_json())
        updated_dispatcher = dispatcher_service.update_dispatcher(dispatcher_id, body)
        return jsonify(updated_dispatcher), 200

    @app.delete("/api/dispatcher-system/dispatcher/<dispatcher_id>")
    def delete_ispatcher(dispatcher_id) -> Response:
        """Deleta um despachante no banco de dados"""
        deleted_dispatcher = dispatcher_service.delete_dispatcher(dispatcher_id)
        return jsonify(deleted_dispatcher), 200
