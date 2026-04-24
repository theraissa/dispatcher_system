"""
Módulo responsável pela implementação do serviço de chamados (TicketService).

Este serviço encapsula a lógica de acesso e manipulação de dados relacionados
a chamados, incluindo criação, consulta detalhada e listagem por usuário.
"""

# pylint: disable=not-callable

from datetime import datetime

from flask import abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from database.tables import DispatcherDB, ServiceDetailsDB, TicketDB, TicketTimelineDB, UserDB
from models.ticket import (
    CreateTicketRequest,
    DispatcherInfo,
    ListTicketUser,
    ListTicketUserResponse,
    ServiceDetailsInfo,
    TicketResponse,
    TicketUserResponse,
    UserInfo,
)
from models.timeline import TicketTimeline


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
            .filter(TicketDB.id == ticket_id)
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

        - Se o usuário for um cliente → retorna chamados criados por ele
        - Se o usuário for um despachante → retorna chamados vinculados a ele

        Os resultados incluem informações resumidas do serviço e da contraparte,
        sendo ordenados do mais recente para o mais antigo.

        Args:
            user_id (int): Identificador do usuário.

        Returns:
            ListTicketUserResponse: Lista de chamados.
        """
        user = (
            UserDB.query.options(joinedload(UserDB.dispatcher))
            .filter(
                UserDB.id == user_id,
                UserDB.deleted_at.is_(None),
            )
            .first()
        )
        if not user:
            abort(404, description=f"Usuário com o ID '{user_id}' não foi encontrado.")

        is_dispatcher = user.dispatcher is not None

        query = self.db.session.query(TicketDB).options(
            joinedload(TicketDB.service_details).joinedload(ServiceDetailsDB.service),
            joinedload(TicketDB.user),  # cliente
            joinedload(TicketDB.dispatcher).joinedload(DispatcherDB.user),  # despachante
        )

        # se for despachante, filtra pelos chamados vinculados a ele;
        # se for cliente, filtra pelos chamados criados por ele.
        if is_dispatcher:
            query = query.filter(TicketDB.dispatcher_id == user.dispatcher.id)
        else:
            query = query.filter(TicketDB.user_id == user_id)

        tickets = query.order_by(TicketDB.created_at.desc()).all()

        response = [
            ListTicketUser(
                id=ticket.id,
                status=ticket.status,
                created_at=ticket.created_at,
                name_service=ticket.service_details.service.name,
                name_dispatcher=(ticket.dispatcher.user.name if not is_dispatcher else None),
                name_client=(ticket.user.name if is_dispatcher else None),
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
        self.db.session.flush()  # Necessário para obter o ID do ticket antes de criar a timeline

        # CRIA TIMELINE INICIAl
        timeline = TicketTimelineDB(
            ticket_id=ticket.id,
            description="Chamado criado e aguardando atendimento",
            action_by=data.user_id,
            status="pendente",
        )

        self.db.session.add(timeline)
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

    def get_dispatcher_ticket_statistics(self, user_id: int) -> dict:
        """
        Calcula e retorna estatísticas de chamados para o dashboard do despachante.

        Métricas retornadas:
            - pending: quantidade de chamados com status "pendente"
            - in_progress: quantidade de chamados com status "em andamento"
            - finished_month: quantidade de chamados finalizados no mês atual
            - monthly_revenue: soma dos valores dos serviços dos chamados
            finalizados no mês atual

        Args:
            user_id (int): ID do usuário.
        Returns:
            dict: Dicionário contendo as estatísticas do despachante.
        """
        user = UserDB.query.options(joinedload(UserDB.dispatcher)).filter(UserDB.id == user_id).first()
        if not user or not user.dispatcher:
            abort(404, description="Despachante não encontrado.")

        dispatcher_id = user.dispatcher.id

        # Base query
        base_query = self.db.session.query(TicketDB).filter(TicketDB.dispatcher_id == dispatcher_id)

        # Pendentes
        pending = base_query.filter(TicketDB.status == TicketTimeline.PENDENTE).count()

        # Em andamento
        in_progress = base_query.filter(TicketDB.status == TicketTimeline.EM_ANDAMENTO).count()

        # Finalizados no mês
        now = datetime.now()
        finished_month = base_query.filter(
            TicketDB.status == TicketTimeline.FINALIZADO,
            func.extract("month", TicketDB.created_at) == now.month,
            func.extract("year", TicketDB.created_at) == now.year,
        ).count()

        # Lucro (soma dos serviços finalizados)
        revenue = (
            self.db.session.query(func.sum(ServiceDetailsDB.price))
            .join(TicketDB, TicketDB.service_details_id == ServiceDetailsDB.id)
            .filter(
                TicketDB.dispatcher_id == dispatcher_id,
                TicketDB.status == TicketTimeline.FINALIZADO,
                func.extract("month", TicketDB.created_at) == now.month,
                func.extract("year", TicketDB.created_at) == now.year,
            )
            .scalar()
            or 0
        )

        return {
            "pending": pending,
            "in_progress": in_progress,
            "finished_month": finished_month,
            "monthly_revenue": float(revenue),
        }
