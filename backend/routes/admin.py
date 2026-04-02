"""
Módulo de rotas relacionadas ao administrador.
"""

from flask import Flask, jsonify, request
from admin.admin import AdminService


def register_admin_routes(
    app: Flask,
    admin_service: AdminService,
) -> None:
    """Registra as rotas do admnistrador na aplicação Flask."""

    @app.get("/api/dispatcher-system/admin/dispatchers")
    def list_dispatchers():
        """
        Lista despachantes filtrando por status.

        Query Params:
            status (str): pending | approved | rejected
        """
        status = request.args.get("status", "pending")

        result = admin_service.list_dispatchers_by_status(status)

        return jsonify(result), 200

    @app.post("/api/dispatcher-system/admin/dispatcher/<int:dispatcher_id>/approve")
    def approve_dispatcher(dispatcher_id):
        """
        Aprova um despachante.
        """
        result = admin_service.approve_dispatcher(dispatcher_id)
        return jsonify(result), 200

    @app.post("/api/dispatcher-system/dispatcher/<int:dispatcher_id>/reject")
    def reject_dispatcher(dispatcher_id):
        """
        Reprova um despachante.
        """
        result = admin_service.reject_dispatcher(dispatcher_id)
        return jsonify(result), 200
