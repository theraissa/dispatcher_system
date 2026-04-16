"""
Docstrings
"""

from flask_sqlalchemy import SQLAlchemy
from database.tables import TicketTimelineDB, TicketDB
from flask import abort
from models.timeline import (
    TimelineResponse,
    ListTimelineResponse,
    CreateTimelineRequest,
)


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
        Cria um novo evento na timeline de um chamado.

        Esse método é utilizado para registrar ações relevantes,
        como mudança de status ou atualizações no atendimento.

        Args:
            ticket_id (int): ID do chamado.
            data (CreateTimelineRequest): Dados do evento.

        Returns:
            dict: Evento criado.
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        event = TicketTimelineDB(
            ticket_id=ticket_id,
            description=data.description,
            action_by=data.action_by,
            status=data.status or ticket.status,
        )

        self.db.session.add(event)
        self.db.session.commit()

        return TimelineResponse(
            id=event.id,
            description=event.description,
            status=event.status,
            action_by=event.action_by,
            created_at=event.created_at,
        ).model_dump()
