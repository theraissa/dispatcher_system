"""
Módulo de rotas relacionadas ao administrador.
"""

from flask import Flask, jsonify, request
from admin.management import AdminService


def register_admin_routes(
    app: Flask,
    admin_service: AdminService,
) -> None:
    """Registra as rotas do admnistrador na aplicação Flask."""

    @app.get("/api/dispatcher-system/admin/dispatchers")
    def list_dispatchers():
        """
        Lista os despachantes com o status pendente.
        """
        result = admin_service.list_dispatchers_by_status()
        return jsonify(result), 200

    @app.put("/api/dispatcher-system/admin/dispatcher/<int:dispatcher_id>/status")
    def update_dispatcher_status(dispatcher_id):
        """
        Atualiza o status de um despachante.
        """
        data = request.get_json()
        result = admin_service.update_dispatcher_status(dispatcher_id, data["status"])
        return jsonify(result), 200
