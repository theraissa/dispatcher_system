"""
Módulo de rotas relacionadas aos despachantes.

Este módulo agrupa endpoints responsáveis por:
    - Gerenciamento de despachantes (CRUD)
    - Busca e filtros
    - Associação entre despachantes e serviços
"""

from flask import Flask, Response, jsonify, request
from flask_jwt_extended import jwt_required

from models.dispatcher import CreateDispatcherFullRequest, UpdateDispatcherFullRequest
from services.associate_service_details import AssociateServiceDetailsDispatcherService
from services.dispatcher import DispatcherService


def register_dispatcher_routes(
    app: Flask,
    dispatcher_service: DispatcherService,
    associate_service: AssociateServiceDetailsDispatcherService,
) -> None:
    """
    Registra as rotas relacionadas ao domínio de despachantes.

    Args:
        app (Flask): Instância da aplicação Flask.
        dispatcher_service (DispatcherService): Serviço responsável pelas regras de negócio dos despachantes.
        associate_service (AssociateServiceDetailsDispatcherService): Serviço responsável pelo vínculo entre despachantes e serviços.
    """

    # ==========================================================
    # DESPACHANTES (CRUD)
    # ==========================================================

    @app.get("/api/dispatcher-system/dispatcher")
    def list_dispatcher() -> Response:
        """Lista todos os despachantes cadastrados."""
        dispatchers = dispatcher_service.list_dispatcher()
        return jsonify(dispatchers.model_dump(mode="json")), 200

    @app.get("/api/dispatcher-system/dispatcher/<int:dispatcher_id>")
    @jwt_required()
    def get_dispatcher_by_id(dispatcher_id) -> Response:
        """Obtém os dados de um despachante pelo ID."""
        dispatcher = dispatcher_service.get_dispatcher_by_id(dispatcher_id)
        return jsonify(dispatcher.model_dump(mode="json")), 200

    @app.post("/api/dispatcher-system/dispatcher")
    def create_dispatcher() -> Response:
        """Cria um novo despachante."""
        body = CreateDispatcherFullRequest.model_validate(request.get_json())
        created_dispatcher = dispatcher_service.create_dispatcher(body)
        return jsonify(created_dispatcher), 201

    @app.put("/api/dispatcher-system/dispatcher/<int:user_id>")
    @jwt_required()
    def update_dispatcher(user_id):
        """Atualiza os dados de um despachante."""
        data = request.get_json()
        updated_dispatcher = dispatcher_service.update_dispatcher_full(user_id, UpdateDispatcherFullRequest(**data))
        return jsonify(updated_dispatcher), 200

    @app.delete("/api/dispatcher-system/dispatcher/<int:dispatcher_id>")
    @jwt_required()
    def delete_dispatcher(dispatcher_id) -> Response:
        """Remove um despachante do sistema."""
        deleted_dispatcher = dispatcher_service.delete_dispatcher(dispatcher_id)
        return jsonify(deleted_dispatcher.model_dump(mode="json")), 200

    # ==========================================================
    # BUSCA DE DESPACHANTES
    # ==========================================================

    @app.get("/api/dispatcher-system/dispatcher/search")
    @jwt_required()
    def search_dispatchers() -> Response:
        """Busca despachantes com base em um filtro (query)."""
        query = request.args.get("query")
        dispatchers = dispatcher_service.search_dispatchers(query)
        return jsonify(dispatchers.model_dump(mode="json")), 200

    # ==========================================================
    # VÍNCULO DESPACHANTE ↔ SERVIÇOS
    # ==========================================================

    @app.get("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/services")
    @jwt_required()
    def get_services_from_dispatcher(dispatcher_id):
        """Lista todos os serviços detalhados associados a um despachante."""
        services = associate_service.get_services_details_from_dispatcher(dispatcher_id)
        return jsonify(services.model_dump(mode="json")), 200

    @app.post("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/service/<int:service_id>")
    @jwt_required()
    def add_service_for_dispatcher(dispatcher_id, service_id):
        """Vincula um serviço ao despachante."""
        result = associate_service.add_service_for_dispatcher(dispatcher_id, service_id)
        return jsonify(result), 201

    @app.put("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/service/<int:service_id>")
    @jwt_required()
    def update_dispatcher_service(dispatcher_id, service_id):
        """Atualiza o serviço detalhado vínculado ao despachante."""
        body = request.get_json()
        result = associate_service.update_dispatcher_service_details(dispatcher_id, service_id, body)
        return jsonify(result), 200

    @app.delete("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/service/<int:service_id>")
    @jwt_required()
    def remove_dispatcher_service(dispatcher_id, service_id):
        """Remove o serviço detalhado vínculado ao despachante."""
        result = associate_service.delete_dispatcher_service_details(dispatcher_id, service_id)
        return jsonify(result), 200
