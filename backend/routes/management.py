"""
Módulo de rotas administrativas do sistema.

Responsável por operações restritas ao administrador, incluindo:
    - Gestão de despachantes (aprovação e status)
    - Administração do catálogo de serviços (CRUD)
"""

from flask import Flask, Response, jsonify, request

from admin.management import AdminService
from admin.service_catalog import ServiceCatalogService
from models.service_catalog import CreateServiceCatologRequest


def register_admin_routes(
    app: Flask,
    admin_service: AdminService,
    catalog_service: ServiceCatalogService,
) -> None:
    """
    Registra as rotas administrativas da aplicação.

    Este módulo centraliza endpoints acessíveis apenas por administradores,
    delegando a lógica de negócio para serviços especializados.

    Args:
        app (Flask): Instância da aplicação Flask.
        admin_service (AdminService): Serviço responsável por regras administrativas de despachantes.
        catalog_service (ServiceCatalogService): Serviço responsável pela gestão do catálogo de serviços.
    """

    # ==========================================================
    # GESTÃO DE DESPACHANTES (ADMIN)
    # ==========================================================

    @app.get("/api/dispatcher-system/admin/dispatchers")
    def list_dispatchers() -> Response:
        """Lista despachantes com status pendente de aprovação."""
        result = admin_service.list_dispatchers_by_status()
        return jsonify(result), 200

    @app.put("/api/dispatcher-system/admin/dispatcher/<int:dispatcher_id>/status")
    def update_dispatcher_status(dispatcher_id: int) -> Response:
        """Atualiza o status de um despachante."""
        data = request.get_json()
        result = admin_service.update_dispatcher_status(dispatcher_id, data["status"])
        return jsonify(result), 200

    # ==========================================================
    # ADMINISTRAÇÃO DE SERVIÇOS (CRUD)
    # ==========================================================

    @app.get("/api/dispatcher-system/admin/service")
    def list_service() -> Response:
        """Lista todos os serviços ativos do sistema."""
        list_services = catalog_service.list_service()
        return jsonify(list_services), 200

    @app.post("/api/dispatcher-system/admin/service")
    def create_service() -> Response:
        """Cria um novo serviço no catálogo."""
        body = CreateServiceCatologRequest.model_validate(request.get_json())
        created_service = catalog_service.create_service(body)
        return jsonify(created_service), 201

    @app.put("/api/dispatcher-system/admin/service/<service_id>")
    def update_service(service_id: str) -> Response:
        """Atualiza os dados de um serviço existente."""
        body = CreateServiceCatologRequest.model_validate(request.get_json())
        updated_service = catalog_service.update_service(service_id, body)
        return jsonify(updated_service), 200

    @app.delete("/api/dispatcher-system/admin/service/<service_id>")
    def delete_service(service_id: str) -> Response:
        """Remove um serviço do catálogo (soft delete)."""
        deleted_service = catalog_service.delete_service(service_id)
        return jsonify(deleted_service), 200
