"""
Docstrings
"""

from flask_sqlalchemy import SQLAlchemy
from database.tables import TicketMessageDB, TicketDB
from flask import abort
from models.ticket import (
    ListTicketMessageResponse,
    TicketMessageResponse,
)


class MessageService:
    """
    Docstrings

    Args:
        db (SQLAlchemy): Instância de acesso ao banco de dados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_messages_by_ticket(self, ticket_id: int) -> ListTicketMessageResponse:
        """
        Lista todas as mensagens associadas a um chamado.

        A consulta retorna apenas mensagens ativas (não deletadas),
        ordenadas cronologicamente da mais antiga para a mais recente.

        Args:
            ticket_id (int): Identificador do chamado.

        Returns:
            List[dict]: Lista de mensagens do chamado, contendo:
                - id (int): Identificador da mensagem
                - user_id (int): ID do usuário que enviou a mensagem
                - message (str): Conteúdo da mensagem
                - created_at (datetime): Data de criação da mensagem
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        messages = (
            self.db.session.query(TicketMessageDB)
            .filter(TicketMessageDB.ticket_id == ticket_id, TicketMessageDB.deleted_at.is_(None))
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

    def create_message(self, ticket_id: int, user_id: int, message: str) -> TicketMessageResponse:
        """
        Cria uma nova mensagem vinculada a um chamado.

        A mensagem é associada ao usuário remetente e persistida no banco de dados.

        Args:
            ticket_id (int): Identificador do chamado ao qual a mensagem pertence.
            user_id (int): Identificador do usuário que está enviando a mensagem.
            message (str): Conteúdo textual da mensagem.

        Returns:
            dict: Objeto com os dados da mensagem criada, contendo:
                - id (int): Identificador da mensagem
                - user_id (int): ID do usuário remetente
                - message (str): Conteúdo da mensagem
                - created_at (datetime): Data de criação da mensagem
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID {ticket_id} não encontrado.")

        if not message or not message.strip():
            abort(400, description="Mensagem não pode ser vazia.")

        new_message = TicketMessageDB(ticket_id=ticket_id, user_id=user_id, message=message)

        self.db.session.add(new_message)
        self.db.session.commit()

        return TicketMessageResponse(
            id=new_message.id,
            message=new_message.message,
            created_at=new_message.created_at,
            user_id=new_message.user_id,
        ).model_dump()
