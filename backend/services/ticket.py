"""
Módulo responsável pela implementação do serviço de chamados (TicketService).

Este serviço encapsula a lógica de acesso e manipulação de dados relacionados
a chamados, incluindo criação, consulta detalhada e listagem por usuário.
"""

# pylint: disable=not-callable

from datetime import datetime

from flask import abort
from flask_jwt_extended import get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from database.tables import DispatcherDB, ServiceDetailsDB, TicketDB, TicketTimelineDB, UserDB
from models.pagination import PaginatedResponse
from models.ticket import (
    CreateTicketRequest,
    DispatcherInfo,
    DispatcherTicketStatisticsResponse,
    ListTicketUser,
    ServiceDetailsInfo,
    TicketResponse,
    TicketTimeline,
    TicketUserResponse,
    UserInfo,
)


class TicketService:
    """
    Serviço de domínio responsável por operações relacionadas a chamados (tickets).

    Centraliza regras de negócio, validações e consultas ao banco de dados,
    retornando dados estruturados através de schemas (Pydantic).
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
                joinedload(TicketDB.user).joinedload(UserDB.address),
                joinedload(TicketDB.service_details).joinedload(ServiceDetailsDB.service),
                joinedload(TicketDB.dispatcher).joinedload(DispatcherDB.user).joinedload(UserDB.address),
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
            deleted_at=ticket.deleted_at,
            user=UserInfo(
                id=ticket.user.id,
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
                service_id=ticket.service_details.service_id,
                name=ticket.service_details.service.name,
                description=ticket.service_details.service.description,
            ),
            dispatcher=DispatcherInfo(
                id=ticket.dispatcher.id,
                name=ticket.dispatcher.user.name,
                email=ticket.dispatcher.user.email,
                contact=ticket.dispatcher.user.address.contact,
                address=ticket.dispatcher.user.address.address,
                city=ticket.dispatcher.user.address.city,
                state=ticket.dispatcher.user.address.state,
                number=ticket.dispatcher.user.address.number,
                neighborhood=ticket.dispatcher.user.address.neighborhood,
            ),
        )

    def list_tickets_by_user(self, user_id: int, page: int = 1, per_page: int = 10) -> PaginatedResponse[ListTicketUser]:
        """
        Lista todos os chamados associados a um usuário.

        - Se o usuário for um cliente → retorna chamados criados por ele
        - Se o usuário for um despachante → retorna chamados vinculados a ele

        Os resultados incluem informações resumidas do serviço e da contraparte,
        sendo ordenados do mais recente para o mais antigo.

        Args:
            user_id (int): Identificador do usuário.
            page (int): Página atual.
            per_page (int): Quantidade de itens por página.

        Returns:
            PaginatedResponse[ListTicketUser]: Lista paginada de chamados.
        """
        user = (
            self.db.session.query(UserDB)
            .options(joinedload(UserDB.dispatcher))
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
            joinedload(TicketDB.user),
            joinedload(TicketDB.dispatcher).joinedload(DispatcherDB.user),
        )

        # Se for despachante → chamados vinculados a ele
        if is_dispatcher:
            query = query.filter(TicketDB.dispatcher_id == user.dispatcher.id)

        # Se for cliente → chamados criados por ele
        else:
            query = query.filter(TicketDB.user_id == user_id)

        paginated = query.order_by(TicketDB.updated_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False,
        )

        response = [
            ListTicketUser(
                id=ticket.id,
                status=ticket.status,
                created_at=ticket.created_at,
                deleted_at=ticket.deleted_at,
                name_service=ticket.service_details.service.name,
                name_dispatcher=(ticket.dispatcher.user.name if not is_dispatcher else None),
                name_client=(ticket.user.name if is_dispatcher else None),
            )
            for ticket in paginated.items
        ]
        return PaginatedResponse[ListTicketUser].from_pagination(paginated, response)

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
        context_user_id = int(get_jwt_identity())

        user = UserDB.query.filter(UserDB.id == context_user_id, UserDB.deleted_at.is_(None)).first()
        if not user:
            abort(404, description=f"Usuário com o ID '{context_user_id}' não foi encontrado.")

        dispatcher = DispatcherDB.query.filter(
            DispatcherDB.id == data.dispatcher_id,
            DispatcherDB.deleted_at.is_(None),
        ).first()
        if not dispatcher:
            abort(404, description=f"Despachante com o ID '{data.dispatcher_id}' não foi encontrado.")

        service_details = ServiceDetailsDB.query.filter(
            ServiceDetailsDB.id == data.service_details_id,
            ServiceDetailsDB.deleted_at.is_(None),
        ).first()
        if not service_details:
            abort(404, description=f"Serviço com o ID '{data.service_details_id}' não foi encontrado.")

        self._validate_user_profile_complete(user)

        new_ticket = TicketDB(**data.model_dump(), user_id=context_user_id)

        self.db.session.add(new_ticket)
        self.db.session.flush()  # Necessário para obter o ID do ticket antes de criar a timeline

        # CRIA TIMELINE INICIAl
        timeline = TicketTimelineDB(
            ticket_id=new_ticket.id,
            description="Chamado criado e aguardando atendimento",
            action_by=context_user_id,
            status=TicketTimeline.PENDENTE.value,
        )

        self.db.session.add(timeline)
        self.db.session.commit()

        return TicketResponse.model_validate(new_ticket)

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

    def get_dispatcher_ticket_statistics(self, user_id: int) -> DispatcherTicketStatisticsResponse:
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
            DispatcherTicketStatisticsResponse: Dicionário contendo as estatísticas do despachante.
        """
        user = UserDB.query.options(joinedload(UserDB.dispatcher)).filter(UserDB.id == user_id).first()
        if not user or not user.dispatcher:
            abort(404, description="Despachante não encontrado.")

        dispatcher_id = user.dispatcher.id

        # Base query
        base_query = self.db.session.query(TicketDB).filter(TicketDB.dispatcher_id == dispatcher_id)

        # Pendentes
        pending = base_query.filter(TicketDB.status == TicketTimeline.PENDENTE.value).count()

        # Em andamento
        in_progress = base_query.filter(TicketDB.status == TicketTimeline.EM_ANDAMENTO.value).count()

        # Finalizados no mês
        now = datetime.now()
        finished_month = base_query.filter(
            TicketDB.status == TicketTimeline.FINALIZADO.value,
            func.extract("month", TicketDB.deleted_at) == now.month,
            func.extract("year", TicketDB.deleted_at) == now.year,
        ).count()

        # Lucro (soma dos serviços finalizados)
        revenue = (
            self.db.session.query(func.sum(ServiceDetailsDB.price))
            .join(TicketDB, TicketDB.service_details_id == ServiceDetailsDB.id)
            .filter(
                TicketDB.dispatcher_id == dispatcher_id,
                TicketDB.status == TicketTimeline.FINALIZADO.value,
                func.extract("month", TicketDB.deleted_at) == now.month,
                func.extract("year", TicketDB.deleted_at) == now.year,
            )
            .scalar()
            or 0
        )

        return DispatcherTicketStatisticsResponse(
            pending=pending,
            in_progress=in_progress,
            finished_month=finished_month,
            monthly_revenue=float(revenue),
        )
