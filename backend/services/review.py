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
from models.review import CreateReviewRequest, ReviewResponse
from models.timeline import TicketTimeline


class TicketReviewService:
    """
    Serviço de gerenciamento de avaliações de chamados.

    Responsável por:
        - Listar avaliações de um despachante
        - Calcular métricas agregadas (média e total)
        - Criar novas avaliações

    Args:
        db (SQLAlchemy): Instância do SQLAlchemy utilizada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatcher_reviews(self, user_id: int) -> list[ReviewResponse]:
        """
        Lista todas as avaliações associadas a um despachante.

        Este método busca o usuário informado, valida se ele possui um
        despachante associado e retorna todas as avaliações vinculadas
        aos seus chamados.

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

        return [
            ReviewResponse(
                id=review.id,
                ticket_id=review.ticket_id,
                name_user=review.name_user,
                rating=review.rating,
                comment=review.comment,
                created_at=review.created_at,
            ).model_dump()
            for review in reviews
        ]

    def get_dispatcher_review_summary(self, user_id: int) -> dict:
        """
        Retorna o resumo das avaliações de um despachante.

        Calcula a média das notas e o total de avaliações utilizando
        funções agregadas do banco de dados.

        Args:
            user_id (int): ID do usuário (despachante).

        Returns:
            dict: Dicionário contendo:
                - average_rating (float): Média das avaliações (0.0 se não houver avaliações)
                - total_reviews (int): Quantidade total de avaliações
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

        return {
            "average_rating": round(float(average_rating), 1) if average_rating else 0.0,
            "total_reviews": total_reviews,
        }

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
            data (CreateReviewRequest): Dados da avaliação contendo:
                - user_id (int): ID do usuário avaliador
                - rating (int): Nota atribuída (1 a 5)
                - comment (str | None): Comentário opcional

        Returns:
            ReviewResponse: Dados da avaliação criada.
        """
        ticket = self.db.session.get(TicketDB, ticket_id)
        if not ticket:
            abort(404, description=f"Chamado com ID '{ticket_id}' não encontrado.")

        if ticket.status == TicketTimeline.ENCERRADO:
            abort(400, description="O chamado não pode ser avaliado porque não foi devidamente finalizado.")

        if ticket.status != TicketTimeline.FINALIZADO:
            abort(400, description="O chamado precisa estar finalizado para ser avaliado.")

        if ticket.review:
            abort(400, description="Este chamado já foi avaliado.")

        if data.rating < 1 or data.rating > 5:
            abort(400, description="A avaliação deve estar entre 1 e 5.")

        user = self.db.session.get(UserDB, data.user_id)

        review = TicketReviewDB(
            ticket_id=ticket.id,
            dispatcher_id=ticket.dispatcher_id,
            user_id=data.user_id,
            name_user=user.name,
            rating=data.rating,
            comment=data.comment,
        )

        self.db.session.add(review)
        self.db.session.commit()

        return ReviewResponse(
            id=review.id,
            ticket_id=review.ticket_id,
            name_user=review.name_user,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
        ).model_dump()
