"""
Serviço responsável pelo gerenciamento de avaliações (reviews) de chamados.

Este módulo contém regras de negócio relacionadas à criação, listagem e
resumo de avaliações atribuídas aos despachantes.
"""

# pylint: disable=not-callable

from flask import abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from database.tables import TicketDB, TicketReviewDB, UserDB
from models.ticket import CreateReviewRequest, ReviewResponse, ReviewSummaryResponse, TicketTimeline


class TicketReviewService:
    """
    Serviço de gerenciamento de avaliações de chamados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatcher_reviews(self, user_id: int) -> list[ReviewResponse]:
        """
        Lista todas as avaliações associadas a um despachante.

        Args:
            user_id (int): ID do usuário (despachante).
        Returns:
            list[ReviewResponse]: Lista de avaliações ordenadas da mais recente para a mais antiga.
        """
        user = UserDB.query.options(joinedload(UserDB.dispatcher)).filter(UserDB.id == user_id).first()
        if not user or not user.dispatcher:
            abort(404, description=f"Despachante com o ID {user_id} não encontrado.")

        dispatcher_id = user.dispatcher.id

        reviews = (
            self.db.session.query(TicketReviewDB)
            .filter(TicketReviewDB.dispatcher_id == dispatcher_id)
            .order_by(TicketReviewDB.created_at.desc())
            .all()
        )

        return [ReviewResponse.model_validate(review) for review in reviews]

    def create_review(self, ticket_id: int, data: CreateReviewRequest) -> ReviewResponse:
        """
        Cria uma nova avaliação para um chamado finalizado.

        Permite que um usuário avalie o despachante responsável após a
        conclusão do serviço.

        Regras de validação:
            - O chamado deve existir
            - O chamado deve estar com status FINALIZADO
            - O chamado não pode possuir avaliação prévia
            - A nota deve estar entre 1 e 5

        Args:
            ticket_id (int): ID do chamado a ser avaliado.
            data (CreateReviewRequest): Dados da avaliação.
        Returns:
            ReviewResponse: Dados da avaliação criada.
        """
        ticket = TicketDB.query.filter(TicketDB.id == ticket_id, TicketDB.deleted_at.is_(None)).first()
        if not ticket:
            abort(404, description=f"Chamado com ID '{ticket_id}' não encontrado.")

        if ticket.review:
            abort(400, description="Este chamado já foi avaliado.")

        context_user_id = int(get_jwt_identity())

        user = UserDB.query.filter(UserDB.id == context_user_id, UserDB.deleted_at.is_(None)).first()
        if not user:
            abort(404, description="Usuário não foi encontrado")
        if ticket.user_id != context_user_id:
            abort(403, description="Você não possui permissão para avaliar este chamado.")

        current_status = TicketTimeline(ticket.status)

        if current_status == TicketTimeline.ENCERRADO:
            abort(400, description="O chamado não pode ser avaliado porque não foi devidamente finalizado.")

        if current_status != TicketTimeline.FINALIZADO:
            abort(400, description="O chamado precisa estar finalizado para ser avaliado.")

        if data.rating < 1 or data.rating > 5:
            abort(400, description="A avaliação deve estar entre 1 e 5.")

        review = TicketReviewDB(
            ticket_id=ticket.id,
            dispatcher_id=ticket.dispatcher_id,
            user_id=context_user_id,
            name_user=user.name,
            rating=data.rating,
            comment=data.comment,
        )

        self.db.session.add(review)
        self.db.session.commit()

        return ReviewResponse.model_validate(review)

    def get_dispatcher_review_summary(self, user_id: int) -> ReviewSummaryResponse:
        """
        Retorna o resumo das avaliações de um despachante.

        Calcula a média das notas e o total de avaliações utilizando
        funções agregadas do banco de dados.

        Args:
            user_id (int): ID do usuário (despachante).
        Returns:
            ReviewSummaryResponse: Dicionário contendo média e total de avaliações.
        """
        user = UserDB.query.options(joinedload(UserDB.dispatcher)).filter(UserDB.id == user_id).first()
        if not user or not user.dispatcher:
            abort(404, description=f"Despachante com o ID {user_id} não encontrado.")

        dispatcher_id = user.dispatcher.id

        result = (
            self.db.session.query(func.avg(TicketReviewDB.rating), func.count(TicketReviewDB.id))
            .filter(TicketReviewDB.dispatcher_id == dispatcher_id)
            .one()
        )

        average_rating, total_reviews = result

        return ReviewSummaryResponse(
            average_rating=round(float(average_rating), 1) if average_rating else 0.0,
            total_reviews=total_reviews,
        )
