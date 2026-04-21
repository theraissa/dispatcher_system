"""
Docstrings
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from database.tables import TicketTimelineDB, TicketDB
from flask import abort
from models.timeline import (
    TimelineResponse,
    ListTimelineResponse,
    CreateTimelineRequest,
    VALID_TRANSITIONS,
    TicketTimeline,
)
from require_auth import request_context


class TimelineService:
    """
    Docstrings

    Args:
        db (SQLAlchemy): Instância de acesso ao banco de dados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_timeline_by_ticket(self, ticket_id: int) -> ListTimelineResponse:
        """
        Lista todos os eventos de timeline de um chamado.

        Os eventos representam o histórico de ações realizadas no ticket,
        como mudanças de status ou interações relevantes.

        Args:
            ticket_id (int): Identificador do chamado.

        Returns:
            ListTimelineResponse: Lista ordenada de eventos da timeline.
        """
        timeline = (
            self.db.session.query(TicketTimelineDB)
            .filter(TicketTimelineDB.ticket_id == ticket_id)
            .order_by(TicketTimelineDB.created_at.asc())
            .all()
        )

        response = [
            TimelineResponse(
                id=item.id,
                description=item.description,
                status=item.status,
                action_by=item.action_by,
                created_at=item.created_at,
            )
            for item in timeline
        ]

        return ListTimelineResponse(root=response).model_dump()

    def create_timeline(self, ticket_id: int, data: CreateTimelineRequest) -> TimelineResponse:
        """
        Cria um novo evento na timeline de um chamado e atualiza o status do ticket.

        Regras:
        - Valida transição de status
        - Atualiza status do ticket
        - Cria evento na timeline

        Args:
            ticket_id (int): ID do chamado.
            data (CreateTimelineRequest): Dados do evento.
        Returns:
            TimelineResponse: Evento criado.
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        current_status_enum = TicketTimeline(ticket.status)
        new_status_enum = data.status or current_status_enum

        # Regra opcional: descrição obrigatória para encerrar
        if new_status_enum not in VALID_TRANSITIONS.get(current_status_enum, []):
            abort(400, description=f"Transição inválida de '{current_status_enum.value}' para '{new_status_enum.value}'")

        # Atualiza status do ticket
        ticket.status = new_status_enum.value

        # Caso o novo timeline seja "Finalizado" ou "Encerrado", marca o ticket como deletado logicamente
        if new_status_enum in [TicketTimeline.FINALIZADO, TicketTimeline.ENCERRADO]:
            ticket.deleted_at = datetime.now()

        action_by = request_context.user_id

        # Cria evento
        new_event = TicketTimelineDB(
            ticket_id=ticket_id,
            description=data.description,
            action_by=action_by,
            status=new_status_enum.value,
        )

        self.db.session.add(new_event)
        self.db.session.commit()

        return TimelineResponse(
            id=new_event.id,
            description=new_event.description,
            status=new_event.status,
            action_by=new_event.action_by,
            created_at=new_event.created_at,
        ).model_dump()
