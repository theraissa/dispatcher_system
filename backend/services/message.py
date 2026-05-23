"""
Serviço responsável pela gestão de mensagens de chamados (tickets).
"""

from flask import abort
from flask_jwt_extended import get_jwt_identity
from flask_sqlalchemy import SQLAlchemy

from database.tables import TicketDB, TicketMessageDB
from models.ticket import (
    CreateMessageRequest,
    ListTicketMessageResponse,
    TicketMessageResponse,
    TicketTimeline,
)


class MessageService:
    """
    Serviço de domínio para manipulação de mensagens de chamados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_messages_by_ticket_id(self, ticket_id: int) -> ListTicketMessageResponse:
        """
        Recupera todas as mensagens ativas de um chamado.

        Args:
            ticket_id (int): ID do chamado a ser consultado.
        Returns:
            dict: Estrutura serializada contendo a lista de mensagens,
            no formato definido por ListTicketMessageResponse.
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        messages = (
            self.db.session.query(TicketMessageDB)
            .filter(
                TicketMessageDB.ticket_id == ticket_id,
            )
            .order_by(TicketMessageDB.created_at.asc())
            .all()
        )
        response = [TicketMessageResponse.model_validate(msg) for msg in messages]
        return ListTicketMessageResponse(root=response)

    def create_message(self, ticket_id: int, data: CreateMessageRequest) -> TicketMessageResponse:
        """
        Cria e persiste uma nova mensagem para um chamado.

        Args:
            ticket_id (int): ID do chamado ao qual a mensagem será associada.
            user_id (int): ID do usuário remetente da mensagem.
            message (str): Conteúdo da mensagem.
        Returns:
            TicketMessageResponse: Estrutura serializada contendo os dados da mensagem criada.
        """
        ticket = self.db.session.query(TicketDB).filter(TicketDB.id == ticket_id, TicketDB.deleted_at.is_(None)).first()
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        current_status = TicketTimeline(ticket.status)
        if current_status in [TicketTimeline.FINALIZADO, TicketTimeline.ENCERRADO]:
            abort(400, description="Não é possível enviar mensagens para chamados finalizados ou encerrados.")

        if not data.message or not data.message.strip():
            abort(400, description="Mensagem não pode ser vazia.")

        new_message = TicketMessageDB(
            ticket_id=ticket_id,
            user_id=int(get_jwt_identity()),
            message=data.message,
        )

        self.db.session.add(new_message)
        self.db.session.commit()

        return TicketMessageResponse.model_validate(new_message)
