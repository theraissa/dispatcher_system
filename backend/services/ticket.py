"""
Módulo com implementação do serviço TicketService.
"""

from flask_sqlalchemy import SQLAlchemy
from database.tables import TicketDB, UserDB, ServiceDB, DispatcherDB
from flask import abort
from models.ticket import (
    CreateTicketRequest,
    TicketResponse,
    TicketUserResponse,
    TicketDispatcherResponse,
    ListTicketUserResponse,
    ListTicketDispatcherResponse,
    ServiceInfo,
    DispatcherInfo,
    UserInfo,
)


class TicketService:
    """
    Serviço para gerenciar chamados no banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def create_ticket(self, data: CreateTicketRequest) -> TicketResponse:
        """
        Cria um chamado para o usuário e para o despachante.
        """
        user = self.db.session.get(UserDB, data.user_id)
        dispatcher = self.db.session.get(DispatcherDB, data.dispatcher_id)
        service = self.db.session.get(ServiceDB, data.service_id)

        if not user:
            abort(404, description=f"Usuário com o ID '{data.user_id}' não foi encontrado.")

        if not dispatcher:
            abort(404, description=f"Despachante com o ID '{data.dispatcher_id}' não foi encontrado.")

        if not service:
            abort(404, description=f"Serviço com o ID '{data.service_id}' não foi encontrado.")

        ticket = TicketDB(**data.model_dump())

        self.db.session.add(ticket)
        self.db.session.commit()

        return TicketResponse.model_validate(ticket).model_dump()

    def list_tickets_by_user(self, user_id: int) -> ListTicketUserResponse:
        """
        Listar os chamados pelo ID do usuário.
        """
        results = (
            self.db.session.query(TicketDB, ServiceDB, UserDB)
            .join(ServiceDB, TicketDB.service_id == ServiceDB.id)
            .join(DispatcherDB, TicketDB.dispatcher_id == DispatcherDB.id)
            .join(UserDB, DispatcherDB.user_id == UserDB.id)
            .filter(TicketDB.user_id == user_id, TicketDB.deleted_at.is_(None))
            .order_by(TicketDB.created_at.desc())
            .all()
        )
        response = [
            TicketUserResponse(
                ticket_id=ticket.id,
                status=ticket.status,
                created_at=ticket.created_at,
                service=ServiceInfo.model_validate(service),
                dispatcher=DispatcherInfo(
                    name=dispatcher_user.name,
                    contact=dispatcher_user.contact,
                ),
            )
            for ticket, service, dispatcher_user in results
        ]
        return ListTicketUserResponse(root=response).model_dump()

    def list_tickets_by_dispatcher(self, dispatcher_id: int) -> ListTicketDispatcherResponse:
        """
        Listar os chamados pelo ID do despachante.
        """
        results = (
            self.db.session.query(TicketDB, ServiceDB, UserDB)
            .join(ServiceDB, TicketDB.service_id == ServiceDB.id)
            .join(UserDB, TicketDB.user_id == UserDB.id)
            .filter(
                TicketDB.dispatcher_id == dispatcher_id,
                TicketDB.deleted_at.is_(None),
            )
            .order_by(TicketDB.created_at.desc())
            .all()
        )

        response = [
            TicketDispatcherResponse(
                ticket_id=ticket.id,
                status=ticket.status,
                created_at=ticket.created_at,
                service=ServiceInfo.model_validate(service),
                client=UserInfo(
                    name=user.name,
                    contact=user.contact,
                ),
            )
            for ticket, service, user in results
        ]

        return ListTicketDispatcherResponse(root=response).model_dump()
