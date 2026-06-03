"""
Testes unitários do serviço de avaliações de chamados.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from werkzeug.exceptions import HTTPException

from models.ticket import (
    CreateReviewRequest,
    TicketTimeline,
    UpdateReviewRequest,
)
from services.review import TicketReviewService

# ==========================================================
# FIXTURES
# ==========================================================


@pytest.fixture
def db():
    """Mock da instância do banco."""
    db = MagicMock()
    db.session = MagicMock()
    return db


@pytest.fixture
def service(db):
    """Instância do serviço testado."""
    return TicketReviewService(db)


@pytest.fixture
def dispatcher():
    """Mock de despachante."""
    dispatcher = MagicMock()
    dispatcher.id = 10
    dispatcher.user_id = 1
    dispatcher.deleted_at = None
    return dispatcher


@pytest.fixture
def user():
    """Mock de usuário."""
    user = MagicMock()
    user.id = 1
    user.name = "João"
    user.deleted_at = None
    return user


@pytest.fixture
def ticket():
    """Mock de chamado."""
    ticket = MagicMock()
    ticket.id = 1
    ticket.user_id = 1
    ticket.dispatcher_id = 10
    ticket.status = TicketTimeline.FINALIZADO.value
    ticket.review = None
    return ticket


@pytest.fixture
def review():
    """Mock de avaliação."""
    review = MagicMock()
    review.id = 1
    review.ticket_id = 1
    review.rating = 5
    review.comment = "Ótimo"
    review.created_at = datetime.now()
    return review


@pytest.fixture(autouse=True)
def mock_joinedload():
    with patch("services.review.joinedload") as mock:
        loader = MagicMock()
        loader.joinedload.return_value = loader
        mock.return_value = loader
        yield mock


# ==========================================================
# LIST DISPATCHER REVIEWS
# ==========================================================


@patch("services.review.DispatcherDB")
def test_list_dispatcher_reviews_success(
    dispatcher_db_mock,
    service,
    dispatcher,
    review,
):
    """Deve listar avaliações do despachante."""

    dispatcher_db_mock.query.filter.return_value.first.return_value = dispatcher

    service.db.session.query.return_value.join.return_value.options.return_value.filter.return_value.order_by.return_value.all.return_value = [
        review
    ]

    review.ticket.user.name = "Cliente"

    result = service.list_dispatcher_reviews(1)

    assert len(result) == 1
    assert result[0]["rating"] == 5


@patch("services.review.DispatcherDB")
def test_list_dispatcher_reviews_not_found(
    dispatcher_db_mock,
    service,
):
    """Deve retornar erro ao buscar despachante inexistente."""

    dispatcher_db_mock.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.list_dispatcher_reviews(1)

    assert exc.value.code == 404


# ==========================================================
# CREATE REVIEW
# ==========================================================


@patch("services.review.TicketReviewDB")
@patch("services.review.get_jwt_identity")
@patch("services.review.UserDB")
@patch("services.review.TicketDB")
def test_create_review_success(
    ticket_db_mock,
    user_db_mock,
    jwt_mock,
    review_db_mock,
    service,
    ticket,
    user,
):
    """Deve criar avaliação com sucesso."""

    jwt_mock.return_value = "1"

    ticket_db_mock.query.filter.return_value.first.return_value = ticket
    user_db_mock.query.filter.return_value.first.return_value = user

    review_instance = MagicMock()
    review_instance.id = 1
    review_instance.created_at = datetime.now()

    review_db_mock.return_value = review_instance

    payload = CreateReviewRequest(
        rating=5,
        comment="Excelente",
    )

    result = service.create_review(ticket.id, payload)

    assert result.rating == 5


@patch("services.review.TicketDB")
def test_create_review_ticket_not_found(
    ticket_db_mock,
    service,
):
    """Deve retornar erro para chamado inexistente."""

    ticket_db_mock.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.create_review(
            1,
            CreateReviewRequest(rating=5, comment="Teste"),
        )

    assert exc.value.code == 404


@patch("services.review.TicketDB")
def test_create_review_already_exists(
    ticket_db_mock,
    service,
    ticket,
):
    """Deve impedir avaliação duplicada."""

    ticket.review = MagicMock()

    ticket_db_mock.query.filter.return_value.first.return_value = ticket

    with pytest.raises(HTTPException) as exc:
        service.create_review(
            1,
            CreateReviewRequest(rating=5, comment="Teste"),
        )

    assert exc.value.code == 400


@patch("services.review.get_jwt_identity")
@patch("services.review.UserDB")
@patch("services.review.TicketDB")
def test_create_review_user_not_found(
    ticket_db_mock,
    user_db_mock,
    jwt_mock,
    service,
    ticket,
):
    """Deve retornar erro para usuário inexistente."""

    jwt_mock.return_value = "1"

    ticket_db_mock.query.filter.return_value.first.return_value = ticket
    user_db_mock.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.create_review(
            1,
            CreateReviewRequest(rating=5, comment="Teste"),
        )

    assert exc.value.code == 404


@patch("services.review.get_jwt_identity")
@patch("services.review.UserDB")
@patch("services.review.TicketDB")
def test_create_review_without_permission(
    ticket_db_mock,
    user_db_mock,
    jwt_mock,
    service,
    ticket,
    user,
):
    """Deve impedir avaliação por outro usuário."""

    ticket.user_id = 999

    jwt_mock.return_value = "1"

    ticket_db_mock.query.filter.return_value.first.return_value = ticket
    user_db_mock.query.filter.return_value.first.return_value = user

    with pytest.raises(HTTPException) as exc:
        service.create_review(
            1,
            CreateReviewRequest(rating=5, comment="Teste"),
        )

    assert exc.value.code == 403


@patch("services.review.get_jwt_identity")
@patch("services.review.UserDB")
@patch("services.review.TicketDB")
def test_create_review_invalid_status(
    ticket_db_mock,
    user_db_mock,
    jwt_mock,
    service,
    ticket,
    user,
):
    """Deve impedir avaliação de chamado não finalizado."""

    ticket.status = TicketTimeline.EM_ANDAMENTO.value

    jwt_mock.return_value = "1"

    ticket_db_mock.query.filter.return_value.first.return_value = ticket
    user_db_mock.query.filter.return_value.first.return_value = user

    with pytest.raises(HTTPException) as exc:
        service.create_review(
            1,
            CreateReviewRequest(rating=5, comment="Teste"),
        )

    assert exc.value.code == 400


@patch("services.review.get_jwt_identity")
@patch("services.review.UserDB")
@patch("services.review.TicketDB")
def test_create_review_invalid_rating(
    ticket_db_mock,
    user_db_mock,
    jwt_mock,
    service,
    ticket,
    user,
):
    """Deve impedir avaliação fora da faixa permitida."""

    jwt_mock.return_value = "1"

    ticket_db_mock.query.filter.return_value.first.return_value = ticket
    user_db_mock.query.filter.return_value.first.return_value = user

    with pytest.raises(HTTPException) as exc:
        service.create_review(
            1,
            CreateReviewRequest(rating=10, comment="Teste"),
        )

    assert exc.value.code == 400


# ==========================================================
# UPDATE REVIEW
# ==========================================================


@patch("services.review.get_jwt_identity")
@patch("services.review.UserDB")
@patch("services.review.TicketReviewDB")
@patch("services.review.TicketDB")
def test_update_review_success(
    ticket_db_mock,
    review_db_mock,
    user_db_mock,
    jwt_mock,
    service,
    ticket,
    review,
    user,
):
    """Deve atualizar avaliação."""

    jwt_mock.return_value = "1"

    ticket_db_mock.query.filter.return_value.first.return_value = ticket
    review_db_mock.query.filter.return_value.first.return_value = review
    user_db_mock.query.filter.return_value.first.return_value = user

    result = service.update_review(
        ticket.id,
        review.id,
        UpdateReviewRequest(
            rating=4,
            comment="Atualizada",
        ),
    )

    assert result.rating == 4
    service.db.session.commit.assert_called_once()


@patch("services.review.TicketDB")
def test_update_review_ticket_not_found(
    ticket_db_mock,
    service,
):
    """Deve retornar erro para chamado inexistente."""

    ticket_db_mock.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.update_review(
            1,
            1,
            UpdateReviewRequest(
                rating=5,
                comment="Teste",
            ),
        )

    assert exc.value.code == 404


@patch("services.review.TicketDB")
@patch("services.review.TicketReviewDB")
def test_update_review_not_found(
    review_db_mock,
    ticket_db_mock,
    service,
    ticket,
):
    """Deve retornar erro para avaliação inexistente."""

    ticket_db_mock.query.filter.return_value.first.return_value = ticket
    review_db_mock.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.update_review(
            1,
            1,
            UpdateReviewRequest(
                rating=5,
                comment="Teste",
            ),
        )

    assert exc.value.code == 404


# ==========================================================
# REVIEW SUMMARY
# ==========================================================


@patch("services.review.UserDB")
def test_get_dispatcher_review_summary_success(
    user_db_mock,
    service,
):
    """Deve retornar resumo das avaliações."""

    user = MagicMock()
    user.dispatcher.id = 10

    user_db_mock.query.options.return_value.filter.return_value.first.return_value = user

    service.db.session.query.return_value.join.return_value.filter.return_value.one.return_value = (
        4.5,
        8,
    )

    result = service.get_dispatcher_review_summary(1)

    assert result.average_rating == 4.5
    assert result.total_reviews == 8


@patch("services.review.UserDB")
def test_get_dispatcher_review_summary_not_found(
    user_db_mock,
    service,
):
    """Deve retornar erro para despachante inexistente."""

    user_db_mock.query.options.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.get_dispatcher_review_summary(1)

    assert exc.value.code == 404
