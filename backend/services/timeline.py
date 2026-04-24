"""
Módulo responsável pela gestão da timeline de chamados.

A timeline representa o histórico de mudanças de estado e ações realizadas
em um ticket, garantindo rastreabilidade e controle de fluxo.
"""

from datetime import datetime

from flask import abort
from flask_sqlalchemy import SQLAlchemy

from database.tables import TicketDB, TicketTimelineDB
from models.timeline import VALID_TRANSITIONS, CreateTimelineRequest, ListTimelineResponse, TicketTimeline, TimelineResponse
from require_auth import request_context


class TicketTimelineService:
    """
    Serviço de domínio responsável pelo gerenciamento da timeline de chamados.

    Este serviço encapsula:
    - Consulta do histórico (timeline) de um ticket
    - Criação de eventos de timeline
    - Validação de transições de status
    - Atualização do status do ticket

    Attributes:
        db (SQLAlchemy): Instância de acesso ao banco de dados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_timeline_by_ticket(self, ticket_id: int) -> ListTimelineResponse:
        """
        Lista todos os eventos da timeline de um chamado.

        Os eventos representam o histórico completo de ações realizadas
        no ticket, como mudanças de status e registros descritivos.

        A lista é retornada em ordem cronológica crescente (mais antigo → mais recente).

        Args:
            ticket_id (int): Identificador do chamado.

        Returns:
            dict: Lista serializada de eventos conforme ListTimelineResponse.
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
        Cria um novo evento na timeline e atualiza o status do ticket.
        Este método centraliza a regra de negócio de transição de status.

        Fluxo executado:
        1. Valida se o ticket existe
        2. Determina o novo status (ou mantém o atual)
        3. Valida se a transição é permitida (VALID_TRANSITIONS)
        4. Atualiza o status do ticket
        5. Aplica soft delete se o status for final
        6. Registra o evento na timeline

        Args:
            ticket_id (int): ID do chamado.
            data (CreateTimelineRequest): Dados do evento contendo:
                - status (opcional)
                - description (opcional)

        Returns:
            dict: Evento criado serializado conforme TimelineResponse.
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        current_status_enum = TicketTimeline(ticket.status)
        new_status_enum = data.status or current_status_enum

        # Validação de transição de status
        if new_status_enum not in VALID_TRANSITIONS.get(current_status_enum, []):
            abort(
                400,
                description=(f"Transição inválida de " f"'{current_status_enum.value}' para '{new_status_enum.value}'"),
            )

        # Atualiza status do ticket
        ticket.status = new_status_enum.value

        # Soft delete para estados finais
        if new_status_enum in [TicketTimeline.FINALIZADO, TicketTimeline.ENCERRADO]:
            ticket.deleted_at = datetime.now()

        # Usuário autenticado responsável pela ação
        action_by = request_context.user_id

        # Criação do evento de timeline
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
