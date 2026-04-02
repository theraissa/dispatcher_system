"""
Módulo de rotas relacionadas aos despachantes.
"""

from flask import Flask, Response, jsonify, request
from models.dispatcher import CreateDispatcherFullRequest
from services.dispatcher import DispatcherService


def register_dispatcher_routes(
    app: Flask,
    dispatcher_service: DispatcherService,
) -> None:
    """Registra as rotas dos despachantes na aplicação Flask."""

    @app.get("/api/dispatcher-system/dispatcher")
    def list_dispatcher() -> Response:
        """Listar despachantes no banco de dados"""
        dispatchers = dispatcher_service.list_dispatcher()
        return jsonify(dispatchers), 200

    @app.get("/api/dispatcher-system/dispatcher/<dispatcher_id>")
    def get_dispatcher_by_id(dispatcher_id) -> Response:
        """Obter despachantes no banco de dados pelo seu identificador"""
        dispatcher = dispatcher_service.get_dispatcher_by_id(dispatcher_id)
        return jsonify(dispatcher), 200

    @app.post("/api/dispatcher-system/dispatcher")
    def create_dispatcher() -> Response:
        """Cria um despachante no banco de dados"""
        body = CreateDispatcherFullRequest.model_validate(request.get_json())
        created_dispatcher = dispatcher_service.create_dispatcher(body)
        return jsonify(created_dispatcher), 201

    @app.put("/api/dispatcher-system/dispatcher/<int:user_id>")
    def update_dispatcher(user_id):
        """Atualiza um despachante no banco de dados"""
        data = request.get_json()
        result = dispatcher_service.update_dispatcher_full(user_id, CreateDispatcherFullRequest(**data))
        return jsonify(result), 200

    @app.delete("/api/dispatcher-system/dispatcher/<dispatcher_id>")
    def delete_ispatcher(dispatcher_id) -> Response:
        """Deleta um despachante no banco de dados"""
        deleted_dispatcher = dispatcher_service.delete_dispatcher(dispatcher_id)
        return jsonify(deleted_dispatcher), 200

    @app.get("/api/dispatcher-system/dispatcher/search")
    def search_dispatchers() -> Response:
        """Busca despachantes com filtro único"""
        query = request.args.get("query")
        dispatchers = dispatcher_service.search_dispatchers(query)
        return jsonify(dispatchers), 200
