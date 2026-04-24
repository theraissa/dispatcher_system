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

from models.message import CreateMessageRequest
from models.review import CreateReviewRequest
from models.ticket import CreateTicketRequest
from models.timeline import CreateTimelineRequest
from require_auth import require_auth
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
    @require_auth
    def get_ticket(ticket_id) -> Response:
        """Obtém um chamado específico pelo ID."""
        ticket = ticket_service.get_ticket_by_id(ticket_id)
        return jsonify(ticket), 200

    @app.get("/api/dispatcher-system/ticket/user/<int:user_id>")
    @require_auth
    def list_user_tickets(user_id) -> Response:
        """Lista todos os chamados associados a um usuário."""
        tickets_user = ticket_service.list_tickets_by_user(user_id)
        return jsonify(tickets_user), 200

    @app.post("/api/dispatcher-system/ticket")
    @require_auth
    def create_ticket() -> Response:
        """Cria um novo chamado."""
        data = CreateTicketRequest(**request.get_json())
        result = ticket_service.create_ticket(data)
        return jsonify(result), 201

    # ==========================================================
    # ESTATÍSTICAS (dados agregados do despachante)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:user_id>/statistics")
    @require_auth
    def get_dispatcher_ticket_statistics(user_id):
        """Retorna estatísticas dos chamados de um despachante."""
        response = ticket_service.get_dispatcher_ticket_statistics(user_id)
        return jsonify(response), 200

    # ==========================================================
    # MENSAGENS (chat vinculado ao chamado)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>/messages")
    @require_auth
    def list_messages(ticket_id):
        """Lista todas as mensagens de um chamado."""
        response = message_service.list_messages_by_ticket(ticket_id)
        return jsonify(response), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/messages")
    @require_auth
    def create_message(ticket_id):
        """Adiciona uma nova mensagem ao chamado."""
        data = CreateMessageRequest(**request.get_json())
        message = message_service.create_message(ticket_id, data)
        return jsonify(message), 201

    # ==========================================================
    # AVALIAÇÕES (reviews do despachante)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:user_id>/review")
    @require_auth
    def list_dispatcher_reviews(user_id):
        """Lista todas as avaliações recebidas pelo despachante."""
        return jsonify(review_service.list_dispatcher_reviews(user_id)), 200

    @app.get("/api/dispatcher-system/ticket/<int:user_id>/review/summary")
    @require_auth
    def get_dispatcher_review_summary(user_id):
        """Retorna média e total de avaliações do despachante."""
        response = review_service.get_dispatcher_review_summary(user_id)
        return jsonify(response), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/review")
    @require_auth
    def create_review(ticket_id):
        """Cria uma avaliação para um chamado finalizado."""
        data = CreateReviewRequest(**request.get_json())
        response = review_service.create_review(ticket_id, data)
        return jsonify(response), 201

    # ==========================================================
    # TIMELINE (histórico de eventos do chamado)
    # ==========================================================

    @app.get("/api/dispatcher-system/ticket/<int:ticket_id>/timeline")
    @require_auth
    def list_timeline(ticket_id):
        """Lista os eventos da timeline de um chamado."""
        return jsonify(timeline_service.list_timeline_by_ticket(ticket_id)), 200

    @app.post("/api/dispatcher-system/ticket/<int:ticket_id>/timeline")
    @require_auth
    def create_timeline(ticket_id):
        """Adiciona um novo evento à timeline do chamado."""
        data = CreateTimelineRequest(**request.get_json())
        response = timeline_service.create_timeline(ticket_id, data)
        return jsonify(response), 201
