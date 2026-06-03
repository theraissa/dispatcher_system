"""
Testes unitários do TicketService.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from werkzeug.exceptions import HTTPException

from models.ticket import (
    CreateTicketRequest,
    TicketTimeline,
)
from services.ticket import TicketService

# ==========================================================
# FIXTURES
# ==========================================================


@pytest.fixture
def db():
    """Mock do banco."""
    db = MagicMock()
    db.session = MagicMock()
    return db


@pytest.fixture
def service(db):
    """Instância do serviço."""
    return TicketService(db)


@pytest.fixture
def user():
    """Mock de usuário."""
    user = MagicMock()
    user.id = 1
    user.name = "João"
    user.email = "joao@email.com"
    user.contact = "51999999999"
    user.cpf = "12345678901"
    user.date_birth = "1990-01-01"

    user.address = MagicMock()
    user.address.address = "Rua A"
    user.address.number = 100
    user.address.neighborhood = "Centro"
    user.address.city = "Sapiranga"
    user.address.state = "RS"
    user.address.zip_code = "93800000"

    user.dispatcher = None

    return user


@pytest.fixture
def dispatcher():
    """Mock de despachante."""

    dispatcher = MagicMock()
    dispatcher.id = 10
    dispatcher.user = MagicMock()
    dispatcher.user.name = "Despachante"
    dispatcher.user.email = "despachante@email.com"
    dispatcher.user.address = MagicMock()
    dispatcher.user.address.contact = "51999999999"
    dispatcher.user.address.address = "Rua B"
    dispatcher.user.address.city = "Sapiranga"
    dispatcher.user.address.state = "RS"
    dispatcher.user.address.number = 200
    dispatcher.user.address.neighborhood = "Centro"

    return dispatcher


@pytest.fixture
def service_details():
    """Mock de serviço."""
    detail = MagicMock()
    detail.id = 20
    detail.price = 150
    detail.service_id = 5

    detail.service = MagicMock()
    detail.service.name = "Transferência"
    detail.service.description = "Descrição"

    return detail


@pytest.fixture
def ticket(user, dispatcher, service_details):
    """Mock de chamado."""
    ticket = MagicMock()

    ticket.id = 1
    ticket.status = TicketTimeline.PENDENTE.value

    ticket.created_at = datetime.now()
    ticket.updated_at = datetime.now()
    ticket.deleted_at = None

    ticket.user = user
    ticket.dispatcher = dispatcher
    ticket.service_details = service_details

    return ticket


@pytest.fixture(autouse=True)
def mock_joinedload():
    """Evita execução real do joinedload."""
    with patch("services.ticket.joinedload") as mock:
        loader = MagicMock()
        loader.joinedload.return_value = loader
        mock.return_value = loader
        yield mock


# ==========================================================
# GET TICKET
# ==========================================================


def test_get_ticket_by_id_success(service, ticket):
    """Deve retornar chamado pelo ID."""

    service.db.session.query.return_value.options.return_value.filter.return_value.first.return_value = ticket

    result = service.get_ticket_by_id(1)

    assert result.id == ticket.id


def test_get_ticket_by_id_not_found(service):
    """Deve retornar erro quando chamado não existir."""

    service.db.session.query.return_value.options.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.get_ticket_by_id(1)

    assert exc.value.code == 404


# ==========================================================
# LISTAGEM
# ==========================================================


def test_list_tickets_by_client(service, user, ticket):
    """Deve listar chamados de cliente."""

    user.dispatcher = None

    service.db.session.query.return_value.options.return_value.filter.return_value.first.return_value = user

    paginated = MagicMock()
    paginated.items = [ticket]
    paginated.total = 1
    paginated.pages = 1
    paginated.page = 1
    paginated.per_page = 10

    query_mock = MagicMock()
    query_mock.filter.return_value.order_by.return_value.paginate.return_value = paginated

    service.db.session.query.return_value.options.return_value = query_mock

    result = service.list_tickets_by_user(1)

    assert len(result.items) == 1


def test_list_tickets_by_dispatcher(service, user, ticket):
    """Deve listar chamados de despachante."""

    user.dispatcher = MagicMock()
    user.dispatcher.id = 10

    service.db.session.query.return_value.options.return_value.filter.return_value.first.return_value = user

    paginated = MagicMock()
    paginated.items = [ticket]
    paginated.total = 1
    paginated.pages = 1
    paginated.page = 1
    paginated.per_page = 10

    query_mock = MagicMock()
    query_mock.filter.return_value.order_by.return_value.paginate.return_value = paginated

    service.db.session.query.return_value.options.return_value = query_mock

    result = service.list_tickets_by_user(1)

    assert len(result.items) == 1


def test_list_tickets_by_user_not_found(service):
    """Deve retornar erro quando usuário não existir."""

    service.db.session.query.return_value.options.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.list_tickets_by_user(1)

    assert exc.value.code == 404


# ==========================================================
# CREATE
# ==========================================================


@patch("services.ticket.TicketResponse.model_validate")
@patch("services.ticket.get_jwt_identity")
@patch("services.ticket.ServiceDetailsDB")
@patch("services.ticket.DispatcherDB")
@patch("services.ticket.UserDB")
def test_create_ticket_success(
    user_db_mock,
    dispatcher_db_mock,
    service_details_db_mock,
    jwt_mock,
    model_validate_mock,
    service,
    user,
    dispatcher,
    service_details,
):
    """Deve criar chamado."""

    jwt_mock.return_value = "1"

    model_validate_mock.return_value = MagicMock()

    user_db_mock.query.filter.return_value.first.return_value = user

    dispatcher_db_mock.query.filter.return_value.first.return_value = dispatcher

    service_details_db_mock.query.filter.return_value.first.return_value = service_details

    payload = CreateTicketRequest(
        dispatcher_id=dispatcher.id,
        service_details_id=service_details.id,
    )

    service.create_ticket(payload)

    assert service.db.session.add.call_count == 2
    service.db.session.flush.assert_called_once()
    service.db.session.commit.assert_called_once()
