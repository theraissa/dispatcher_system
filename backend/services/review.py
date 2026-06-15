"""
Serviço responsável pelo gerenciamento de avaliações (reviews) de chamados.

Este módulo contém regras de negócio relacionadas à criação, listagem e
resumo de avaliações atribuídas aos despachantes.
"""

# pylint: disable=not-callable

from flask import abort
from flask_jwt_extended import get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from database.tables import DispatcherDB, TicketDB, TicketReviewDB, UserDB
from models.ticket import CreateReviewRequest, ReviewResponse, ReviewSummaryResponse, TicketTimeline, UpdateReviewRequest


class TicketReviewService:
    """
    Serviço de gerenciamento de avaliações de chamados.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatcher_reviews(self, dispatcher_id: int) -> list[ReviewResponse]:
        """
        Lista todas as avaliações associadas a um despachante.

        Args:
            dispatcher_id (int): ID do usuário despachante.
        Returns:
            list[ReviewResponse]: Lista de avaliações ordenadas da mais recente para a mais antiga.
        """
        dispatcher = DispatcherDB.query.filter(
            DispatcherDB.id == dispatcher_id,
            DispatcherDB.deleted_at.is_(None),
        ).first()

        if not dispatcher:
            abort(
                404,
                description=f"Despachante com o ID {dispatcher_id} não encontrado.",
            )

        reviews = (
            self.db.session.query(TicketReviewDB)
            .join(TicketDB)
            .options(joinedload(TicketReviewDB.ticket).joinedload(TicketDB.user))
            .filter(TicketDB.dispatcher_id == dispatcher_id)
            .order_by(TicketReviewDB.created_at.desc())
            .all()
        )

        return [
            ReviewResponse(
                id=review.id,
                ticket_id=review.ticket_id,
                user_name=review.ticket.user.name,
                rating=review.rating,
                comment=review.comment,
                created_at=review.created_at,
            ).model_dump(mode="json")
            for review in reviews
        ]

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
        ticket = TicketDB.query.filter(TicketDB.id == ticket_id).first()
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
            rating=data.rating,
            comment=data.comment,
        )

        self.db.session.add(review)
        self.db.session.commit()

        return ReviewResponse(
            id=review.id,
            ticket_id=ticket_id,
            user_name=user.name,
            rating=data.rating,
            comment=data.comment,
            created_at=review.created_at,
        )

    def update_review(self, ticket_id: int, review_id: int, data: UpdateReviewRequest) -> ReviewResponse:
        """
        Atualiza uma avaliação existente.
        Permite que o autor da avaliação edite sua nota/comentário.

        Args:
            review_id (int): ID da avaliação.
            data (UpdateReviewRequest): Dados atualizados.
        Returns:
            ReviewResponse: Avaliação atualizada.
        """
        ticket = TicketDB.query.filter(TicketDB.id == ticket_id).first()
        if not ticket:
            abort(404, description="Chamado não encontrado.")

        update_review = TicketReviewDB.query.filter(
            TicketReviewDB.id == review_id,
            TicketReviewDB.ticket_id == ticket_id,
        ).first()
        if not update_review:
            abort(404, description="Avaliação não encontrada.")

        context_user_id = int(get_jwt_identity())

        user = UserDB.query.filter(UserDB.id == context_user_id, UserDB.deleted_at.is_(None)).first()
        if not user:
            abort(404, description="Usuário não foi encontrado")
        if ticket.user_id != context_user_id:
            abort(403, description="Você não possui permissão para editar este chamado.")

        current_status = TicketTimeline(ticket.status)

        if current_status != TicketTimeline.FINALIZADO:
            abort(400, description="A avaliação só pode ser editada em chamados finalizados.")

        if data.rating < 1 or data.rating > 5:
            abort(400, description="A avaliação deve estar entre 1 e 5.")

        update_review.rating = data.rating
        update_review.comment = data.comment

        self.db.session.commit()

        return ReviewResponse(
            id=update_review.id,
            ticket_id=ticket_id,
            user_name=user.name,
            rating=data.rating,
            comment=data.comment,
            created_at=update_review.created_at,
        )

    def get_dispatcher_review_summary(self, dispatcher_id: int) -> ReviewSummaryResponse:
        """
        Retorna o resumo das avaliações de um despachante.

        Calcula a média das notas e o total de avaliações utilizando
        funções agregadas do banco de dados.

        Args:
            dispatcher_id (int): ID do despachante.
        Returns:
            ReviewSummaryResponse: Dicionário contendo média e total de avaliações.
        """
        dispatcher = DispatcherDB.query.filter(
            DispatcherDB.id == dispatcher_id,
            DispatcherDB.deleted_at.is_(None),
        ).first()
        if not dispatcher:
            abort(
                404,
                description=f"Despachante com o ID {dispatcher_id} não encontrado.",
            )

        # filtramos apenas os tickets do despachante informado.
        average_rating, total_reviews = (
            self.db.session.query(
                # Calcula a média de todas as notas.
                func.avg(TicketReviewDB.rating),
                # Conta quantas avaliações existem.
                func.count(TicketReviewDB.id),
            )
            .join(TicketDB, TicketDB.id == TicketReviewDB.ticket_id)
            .filter(TicketDB.dispatcher_id == dispatcher_id)
            .one()
        )

        return ReviewSummaryResponse(
            average_rating=round(float(average_rating), 1) if average_rating is not None else 0.0,
            total_reviews=total_reviews,
        )
