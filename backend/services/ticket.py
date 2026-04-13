"""
Módulo responsável pela implementação do serviço de chamados (TicketService).

Este serviço encapsula a lógica de acesso e manipulação de dados relacionados
a chamados, incluindo criação, consulta detalhada e listagem por usuário.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload
from database.tables import TicketDB, UserDB, ServiceDetailsDB, DispatcherDB, TicketMessageDB
from flask import abort
from models.ticket import (
    CreateTicketRequest,
    TicketResponse,
    TicketUserResponse,
    ListTicketUserResponse,
    ServiceDetailsInfo,
    DispatcherInfo,
    UserInfo,
    ListTicketResponse,
    TicketMessageResponse,
    ListTicketMessageResponse,
)


class TicketService:
    """
    Serviço de domínio responsável por operações relacionadas a chamados (tickets).

    Centraliza regras de negócio, validações e consultas ao banco de dados,
    retornando dados estruturados através de schemas (Pydantic).

    Args:
        db (SQLAlchemy): Instância de acesso ao banco de dados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def get_ticket_by_id(self, ticket_id: int) -> TicketUserResponse:
        """
        Recupera os detalhes de um chamado pelo seu identificador.

        A consulta inclui dados relacionados ao serviço contratado e ao
        despachante responsável.

        Args:
            ticket_id (int): Identificador do chamado.
        Returns:
            TicketUserResponse: Estrutura com informações completas do chamado,
            incluindo serviço e dados do despachante.
        """
        ticket = (
            self.db.session.query(TicketDB)
            .options(
                joinedload(TicketDB.service_details).joinedload(ServiceDetailsDB.service),
                joinedload(TicketDB.dispatcher).joinedload(DispatcherDB.user),
                joinedload(TicketDB.dispatcher).joinedload(DispatcherDB.office),
            )
            .filter(TicketDB.id == ticket_id, TicketDB.deleted_at.is_(None))
            .first()
        )

        if not ticket:
            abort(404, description=f"Chamado com ID '{ticket_id}' não encontrado.")

        return TicketUserResponse(
            id=ticket.id,
            status=ticket.status,
            created_at=ticket.created_at,
            user=UserInfo(
                name=ticket.user.name,
                email=ticket.user.email,
                contact=ticket.user.contact,
                cpf=ticket.user.cpf,
                address=ticket.user.address.address,
                city=ticket.user.address.city,
                state=ticket.user.address.state,
                number=ticket.user.address.number,
                neighborhood=ticket.user.address.neighborhood,
            ),
            service_details=ServiceDetailsInfo(
                id=ticket.service_details.id,
                price=ticket.service_details.price,
                service_id=ticket.service_details.service.id,
                name=ticket.service_details.service.name,
                description=ticket.service_details.service.description,
            ),
            dispatcher=DispatcherInfo(
                name=ticket.dispatcher.user.name,
                email=ticket.dispatcher.user.email,
                contact=ticket.dispatcher.office.contact,
                address=ticket.dispatcher.office.address,
                city=ticket.dispatcher.office.city,
                state=ticket.dispatcher.office.state,
                number=ticket.dispatcher.office.number,
                neighborhood=ticket.dispatcher.office.neighborhood,
            ),
        ).model_dump()

    def list_tickets_by_user(self, user_id: int) -> ListTicketUserResponse:
        """
        Lista todos os chamados associados a um usuário.

        Os resultados incluem informações resumidas do serviço e do despachante,
        sendo ordenados do mais recente para o mais antigo.

        Args:
            user_id (int): Identificador do usuário.
        Returns:
            ListTicketUserResponse: Lista de chamados do usuário.
        """

        user = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
        if not user:
            abort(404, description=f"Usuário com o ID '{user_id}' não foi encontrado.")

        tickets = (
            self.db.session.query(TicketDB)
            .options(
                joinedload(TicketDB.service_details).joinedload(ServiceDetailsDB.service),
                joinedload(TicketDB.dispatcher).joinedload(DispatcherDB.user),
            )
            .filter(
                TicketDB.user_id == user_id,
                TicketDB.deleted_at.is_(None),
            )
            .order_by(TicketDB.created_at.desc())
            .all()
        )

        response = [
            ListTicketResponse(
                id=ticket.id,
                status=ticket.status,
                created_at=ticket.created_at,
                name_service=ticket.service_details.service.name,
                name_dispatcher=ticket.dispatcher.user.name,
            )
            for ticket in tickets
        ]

        return ListTicketUserResponse(root=response).model_dump()

    def create_ticket(self, data: CreateTicketRequest) -> TicketResponse:
        """
        Cria um novo chamado vinculando usuário, despachante e serviço.

        Antes da criação, valida a existência das entidades relacionadas
        para garantir integridade referencial.

        Args:
            data (CreateTicketRequest): Dados necessários para criação do chamado.
        Returns:
            TicketResponse: Dados do chamado criado.
        """
        user = self.db.session.get(UserDB, data.user_id)
        dispatcher = self.db.session.get(DispatcherDB, data.dispatcher_id)
        service_details = self.db.session.get(ServiceDetailsDB, data.service_details_id)

        if not user:
            abort(404, description=f"Usuário com o ID '{data.user_id}' não foi encontrado.")

        self._validate_user_profile_complete(user)

        if not dispatcher:
            abort(404, description=f"Despachante com o ID '{data.dispatcher_id}' não foi encontrado.")

        if not service_details:
            abort(404, description=f"Serviço com o ID '{data.service_details_id}' não foi encontrado.")

        ticket = TicketDB(**data.model_dump())

        self.db.session.add(ticket)
        self.db.session.commit()

        return TicketResponse.model_validate(ticket).model_dump()

    def _validate_user_profile_complete(self, user: UserDB) -> None:
        """
        Valida se o usuário possui todos os dados necessários para abrir um chamado.
        """

        def is_filled(value):
            return value is not None and str(value).strip() != ""

        # VALIDAÇÃO DO USUÁRIO
        user_fields = [
            user.name,
            user.email,
            user.contact,
            user.cpf,
            user.date_birth,
        ]

        if not all(is_filled(field) for field in user_fields):
            abort(400, description="Usuário com dados incompletos.")

        # VALIDAÇÃO DO ENDEREÇO
        if not user.address:
            abort(400, description="Usuário precisa cadastrar um endereço antes de abrir um chamado.")

        address = user.address

        address_fields = [
            address.address,
            address.number,
            address.neighborhood,
            address.city,
            address.state,
            address.zip_code,
        ]

        if not all(is_filled(field) for field in address_fields):
            abort(400, description="Endereço do usuário está incompleto.")

    # Métodos relacionado a tabela TicketMessageDB

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
            abort(404, description="Chamado com o ID {ticket_id} não encontrado.")

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
            abort(404, description="Chamado com o ID {ticket_id} não encontrado.")

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
        )

    # Métodos relacionado a tabela TicketReviewDB
