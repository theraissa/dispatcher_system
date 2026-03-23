"""
Módulo de rotas relacionadas aos serviços.
"""

from flask import Flask, Response, jsonify, request
from models.service import CreateServiceRequest
from services.service import Service


def register_service_routes(
    app: Flask,
    service: Service,
) -> None:
    """Registra as rotas dos serviços na aplicação Flask."""

    @app.get("/api/dispatcher-system/service")
    def list_service() -> Response:
        """Lista os serviços no banco de dados"""
        list_services = service.list_service()
        return jsonify(list_services), 200

    @app.post("/api/dispatcher-system/service")
    def create_service() -> Response:
        """Cria um serviço no banco de dados"""
        body = CreateServiceRequest.model_validate(request.get_json())
        created_service = service.create_service(body)
        return jsonify(created_service), 201

    @app.put("/api/dispatcher-system/service/<service_id>")
    def update_service(service_id) -> Response:
        """Atualiza um serviço no banco de dados"""
        body = CreateServiceRequest.model_validate(request.get_json())
        updated_service = service.update_service(service_id, body)
        return jsonify(updated_service), 200

    @app.delete("/api/dispatcher-system/service/<service_id>")
    def delete_service(service_id) -> Response:
        """Deleta um serviço no banco de dados"""
        deleted_service = service.delete_service(service_id)
        return jsonify(deleted_service), 200

    # Rotas que gerenciam os vinculo do serviços com os despachantes

    @app.get("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/services")
    def get_services_from_dispatcher(dispatcher_id):
        """Obtém todos os serviços vinculados a um despachante."""
        services = service.get_services_from_dispatcher(dispatcher_id)
        return jsonify(services), 200

    @app.post("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/service/<int:service_id>")
    def add_service_for_dispatcher(dispatcher_id, service_id):
        """Vincula um serviço a um despachante."""
        result = service.add_service_for_dispatcher(dispatcher_id, service_id)
        return jsonify(result), 201

    @app.put("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/service/<int:service_id>")
    def update_dispatcher_service(dispatcher_id, service_id):
        body = request.get_json()
        result = service.update_dispatcher_service(dispatcher_id, service_id, body)
        return jsonify(result), 200

    @app.delete("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/service/<int:service_id>")
    def remove_dispatcher_service(dispatcher_id, service_id):
        """Remove o vínculo entre um serviço e um despachante."""
        result = service.remove_dispatcher_service(dispatcher_id, service_id)
        return jsonify(result), 200
