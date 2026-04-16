"""
Módulo responsável pela implementação do serviço de chamados (TicketService).

Este serviço encapsula a lógica de acesso e manipulação de dados relacionados
a chamados, incluindo criação, consulta detalhada e listagem por usuário.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload
from database.tables import TicketDB, UserDB, ServiceDetailsDB, DispatcherDB, TicketReviewDB, TicketTimelineDB
from flask import abort
from models.ticket import (
    CreateTicketRequest,
    ReviewResponse,
    TicketResponse,
    TicketUserResponse,
    ListTicketUserResponse,
    ServiceDetailsInfo,
    DispatcherInfo,
    UserInfo,
    ListTicketResponse,
    CreateReviewRequest,
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
        self.db.session.flush()  # Necessário para obter o ID do ticket antes de criar a timeline

        # CRIA TIMELINE INICIAl
        timeline = TicketTimelineDB(
            ticket_id=ticket.id,
            description="Chamado criado e aguardando atendimento",
            action_by=data.user_id,
            status="Pendente",
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

    # Métodos relacionado a tabela TicketReviewDB

    def create_review(self, ticket_id: int, data: CreateReviewRequest) -> ReviewResponse:
        """
        Cria uma avaliação para um chamado finalizado.

        Este método permite que o cliente avalie o despachante responsável
        após a conclusão do serviço.

        Regras de validação:
            - O chamado deve existir
            - O chamado deve pertencer ao usuário
            - O chamado deve estar finalizado
            - O chamado não pode já possuir avaliação
            - A nota deve estar entre 1 e 5

        Args:
            ticket_id (int): ID do chamado a ser avaliado.
            user_id (int): ID do usuário que está avaliando.
            rating (int): Nota atribuída ao despachante (1 a 5).
            comment (str | None): Comentário opcional da avaliação.

        Returns:
            dict: Dados da avaliação criada.
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket or ticket.deleted_at is not None:
            abort(404, description=f"Chamado com ID '{ticket_id}' não encontrado.")

        # valida status
        if ticket.status != "completed":
            abort(400, description="O chamado precisa estar finalizado para ser avaliado.")

        # valida duplicidade
        if ticket.review:
            abort(400, description="Este chamado já foi avaliado.")

        # valida rating
        if data.rating < 1 or data.rating > 5:
            abort(400, description="A avaliação deve estar entre 1 e 5.")

        review = TicketReviewDB(
            ticket_id=ticket.id,
            dispatcher_id=ticket.dispatcher_id,
            user_id=data.user_id,
            rating=data.rating,
            comment=data.comment,
        )

        self.db.session.add(review)
        self.db.session.commit()

        return ReviewResponse(
            id=review.id,
            ticket_id=review.ticket_id,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
        ).model_dump()
