"""
Módulo de rotas relacionadas aos chamados.
"""

from flask import Flask, Response, jsonify, request
from require_auth import require_auth
from services.ticket import TicketService
from services.timeline import TimelineService
from services.message import MessageService
from models.ticket import CreateReviewRequest, CreateTicketRequest
from models.timeline import CreateTimelineRequest


def register_ticket_routes(
    app: Flask,
    ticket_service: TicketService,
    message_service: MessageService,
    timeline_service: TimelineService,
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
        response = message_service.list_messages_by_ticket(ticket_id)
        return jsonify(response), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/messages")
    @require_auth
    def create_message(ticket_id):
        """Cria uma mensagem no chat do ticket"""
        data = request.get_json()
        message = message_service.create_message(
            ticket_id=ticket_id,
            user_id=data["user_id"],
            message=data["message"],
        )
        return jsonify(message), 201

    # Rotas relacionado a tabela TicketReviewDB

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/review")
    @require_auth
    def create_review(ticket_id):
        """Cria uma avaliação para o despachante associada ao chamado."""
        data = CreateReviewRequest(**request.get_json())
        response = ticket_service.create_review(ticket_id, data)
        return jsonify(response), 201

    # Rotas relacionado a tabela TicketTimelineDB

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>/timeline")
    @require_auth
    def list_timeline(ticket_id):
        """Lista os eventos de timeline do chamado."""
        return jsonify(timeline_service.list_timeline_by_ticket(ticket_id)), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/timeline")
    @require_auth
    def create_timeline(ticket_id):
        """Cria um evento na timeline do chamado."""
        data = CreateTimelineRequest(**request.get_json())
        response = timeline_service.create_timeline(ticket_id, data)
        return jsonify(response), 201
