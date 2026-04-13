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

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>")
    @require_auth
    def get_ticket(ticket_id) -> Response:
        """Obtém um chamado pelo ID."""
        ticket = ticket_service.get_ticket_by_id(ticket_id)
        return jsonify(ticket), 200

    @app.get("/api/dispatcher-system/ticket/user/<int:user_id>")
    @require_auth
    def list_user_tickets(user_id) -> Response:
        """Lista os chamados do usuário."""
        tickets_user = ticket_service.list_tickets_by_user(user_id)
        return jsonify(tickets_user), 200

    @app.post("/api/dispatcher-system/ticket")
    @require_auth
    def create_ticket() -> Response:
        """Cria um chamado para o usuário e despachante"""
        data = CreateTicketRequest(**request.get_json())
        result = ticket_service.create_ticket(data)
        return jsonify(result), 201

    # Rotas relacionado a tabela TicketMessageDB

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>/messages")
    @require_auth
    def list_messages(ticket_id):
        """Lista as mensagens do chat do ticket"""
        return jsonify(ticket_service.list_messages_by_ticket(ticket_id)), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/messages")
    @require_auth
    def create_message(ticket_id):
        """Cria uma mensagem no chat do ticket"""
        data = request.get_json()
        message = ticket_service.create_message(
            ticket_id=ticket_id,
            user_id=data["user_id"],
            message=data["message"],
        )
        return jsonify(message), 201
