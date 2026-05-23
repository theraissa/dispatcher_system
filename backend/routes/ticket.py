"""
Módulo de rotas relacionadas ao domínio de chamados (Ticket).

As rotas estão organizadas por contexto funcional:
    - Ticket (operações principais)
    - Mensagens (chat do chamado)
    - Estatísticas
    - Avaliações (reviews)
    - Timeline (histórico de eventos)
"""

from flask import Flask, Response, jsonify, request
from flask_jwt_extended import jwt_required

from models.ticket import (
    CreateMessageRequest,
    CreateReviewRequest,
    CreateTicketRequest,
    CreateTimelineRequest,
)
from services.message import MessageService
from services.review import TicketReviewService
from services.ticket import TicketService
from services.timeline import TicketTimelineService


def register_ticket_routes(
    app: Flask,
    ticket_service: TicketService,
    message_service: MessageService,
    timeline_service: TicketTimelineService,
    review_service: TicketReviewService,
) -> None:
    """
    Registra todas as rotas relacionadas ao domínio de chamados.

    Args:
        app (Flask): Instância da aplicação Flask.
        ticket_service (TicketService): Serviço de regras de negócio de chamados.
        message_service (MessageService): Serviço de mensagens do chamado.
        timeline_service (TicketTimelineService): Serviço de timeline.
        review_service (TicketReviewService): Serviço de avaliações.
    """

    # ==========================================================
    # TICKETS (operações principais do chamado)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>")
    @jwt_required()
    def get_ticket(ticket_id) -> Response:
        """Obtém um chamado específico pelo ID."""
        ticket_user = ticket_service.get_ticket_by_id(ticket_id)
        return jsonify(ticket_user.model_dump(mode="json")), 200

    @app.get("/api/dispatcher-system/ticket/user/<int:user_id>")
    @jwt_required()
    def list_user_tickets(user_id) -> Response:
        """Lista todos os chamados associados a um usuário."""
        listed_tickets_user = ticket_service.list_tickets_by_user(user_id)
        return jsonify(listed_tickets_user.model_dump(mode="json")), 200

    @app.post("/api/dispatcher-system/ticket")
    @jwt_required()
    def create_ticket() -> Response:
        """Cria um novo chamado."""
        data = CreateTicketRequest(**request.get_json())
        created_ticket = ticket_service.create_ticket(data)
        return jsonify(created_ticket.model_dump(mode="json")), 201

    # ==========================================================
    # ESTATÍSTICAS (dados agregados do despachante)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:user_id>/statistics")
    @jwt_required()
    def get_dispatcher_ticket_statistics(user_id):
        """Retorna estatísticas dos chamados de um despachante."""
        statistics_ticket_from_dispatcher = ticket_service.get_dispatcher_ticket_statistics(user_id)
        return jsonify(statistics_ticket_from_dispatcher.model_dump(mode="json")), 200

    # ==========================================================
    # MENSAGENS (chat vinculado ao chamado)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>/messages")
    @jwt_required()
    def list_messages(ticket_id):
        """Lista todas as mensagens de um chamado."""
        listed_message = message_service.list_messages_by_ticket_id(ticket_id)
        return jsonify(listed_message.model_dump(mode="json")), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/messages")
    @jwt_required()
    def create_message(ticket_id):
        """Adiciona uma nova mensagem ao chamado."""
        data = CreateMessageRequest(**request.get_json())
        created_message = message_service.create_message(ticket_id, data)
        return jsonify(created_message.model_dump(mode="json")), 201

    # ==========================================================
    # AVALIAÇÕES (reviews do despachante)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:user_id>/review")
    @jwt_required()
    def list_dispatcher_reviews(user_id):
        """Lista todas as avaliações recebidas pelo despachante."""
        listed_reviews = review_service.list_dispatcher_reviews(user_id)
        return jsonify(listed_reviews), 200

    @app.get("/api/dispatcher-system/ticket/<int:user_id>/review/summary")
    @jwt_required()
    def get_dispatcher_review_summary(user_id):
        """Retorna média e total de avaliações do despachante."""
        review_summary = review_service.get_dispatcher_review_summary(user_id)
        return jsonify(review_summary.model_dump(mode="json")), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/review")
    @jwt_required()
    def create_review(ticket_id):
        """Cria uma avaliação para um chamado finalizado."""
        data = CreateReviewRequest(**request.get_json())
        created_review = review_service.create_review(ticket_id, data)
        return jsonify(created_review.model_dump(mode="json")), 201

    # ==========================================================
    # TIMELINE (histórico de eventos do chamado)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>/timeline")
    @jwt_required()
    def list_timeline(ticket_id):
        """Lista os eventos da timeline de um chamado."""
        listed_timeline = timeline_service.list_timeline_by_ticket_id(ticket_id)
        return jsonify(listed_timeline.model_dump(mode="json")), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/timeline")
    @jwt_required()
    def create_timeline(ticket_id):
        """Adiciona um novo evento à timeline do chamado."""
        data = CreateTimelineRequest(**request.get_json())
        created_timeline = timeline_service.create_timeline(ticket_id, data)
        return jsonify(created_timeline.model_dump(mode="json")), 201
