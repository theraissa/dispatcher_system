"""
Módulo de rotas relacionadas aos chamados.
"""

from flask import Flask, Response, jsonify, request
from require_auth import require_auth
from services.ticket import TicketService
from models.ticket import CreateTicketRequest


def register_ticket_routes(
    app: Flask,
    ticket_service: TicketService,
) -> None:
    """Registra as rotas dos chamados na aplicação Flask."""

    @app.get("/api/dispatcher-system/ticket/user/<int:user_id>")
    @require_auth
    def list_user_tickets(user_id) -> Response:
        """Lista os chamados do usuário."""
        tickets_user = ticket_service.list_tickets_by_user(user_id)
        return jsonify(tickets_user), 200

    @app.get("/api/dispatcher-system/ticket/dispatcher/<int:dispatcher_id>")
    @require_auth
    def list_dispatcher_tickets(dispatcher_id) -> Response:
        """Lista os chamados do despachante."""
        tickets = ticket_service.list_tickets_by_dispatcher(dispatcher_id)
        return jsonify(tickets), 200

    @app.post("/api/dispatcher-system/ticket")
    @require_auth
    def create_ticket() -> Response:
        """Cria um chamado para o usuário e despachante"""
        data = CreateTicketRequest(**request.get_json())
        result = ticket_service.create_ticket(data)
        return jsonify(result), 201
