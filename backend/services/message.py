"""
Serviço responsável pela gestão de mensagens de chamados (tickets).
"""

from flask import abort
from flask_sqlalchemy import SQLAlchemy

from database.tables import TicketDB, TicketMessageDB
from models.message import CreateMessageRequest, ListTicketMessageResponse, TicketMessageResponse


class MessageService:
    """
    Serviço de domínio para manipulação de mensagens de chamados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_messages_by_ticket(self, ticket_id: int) -> ListTicketMessageResponse:
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
                TicketMessageDB.deleted_at.is_(None),
            )
            .order_by(TicketMessageDB.created_at.asc())
            .all()
        )

        response = [
            TicketMessageResponse(
                id=msg.id,
                message=msg.message,
                created_at=msg.created_at,
                user_id=msg.user_id,
            )
            for msg in messages
        ]

        return ListTicketMessageResponse(root=response).model_dump()

    def create_message(self, ticket_id: int, data: CreateMessageRequest) -> TicketMessageResponse:
        """
        Cria e persiste uma nova mensagem para um chamado.

        Args:
            ticket_id (int): ID do chamado ao qual a mensagem será associada.
            user_id (int): ID do usuário remetente da mensagem.
            message (str): Conteúdo da mensagem.

        Returns:
            dict: Estrutura serializada contendo os dados da mensagem criada,
            conforme definido por TicketMessageResponse.
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        if not data.message or not data.message.strip():
            abort(400, description="Mensagem não pode ser vazia.")

        new_message = TicketMessageDB(
            ticket_id=ticket_id,
            user_id=data.user_id,
            message=data.message,
        )

        self.db.session.add(new_message)
        self.db.session.commit()

        return TicketMessageResponse(
            id=new_message.id,
            message=new_message.message,
            created_at=new_message.created_at,
            user_id=new_message.user_id,
        ).model_dump()
