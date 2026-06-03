"""
Testes unitários do serviço MessageService.
"""

from unittest.mock import MagicMock, patch

import pytest
from werkzeug.exceptions import HTTPException

from models.ticket import TicketTimeline
from services.message import MessageService

# ==========================================================
# FIXTURES
# ==========================================================


@pytest.fixture
def db():
    """Mock do SQLAlchemy."""
    db = MagicMock()
    db.session = MagicMock()
    return db


@pytest.fixture
def service(db):
    """Instância do serviço testado."""
    return MessageService(db)


@pytest.fixture
def ticket():
    """Mock de chamado."""
    ticket = MagicMock()
    ticket.id = 1
    ticket.status = TicketTimeline.EM_ANDAMENTO.value
    return ticket


@pytest.fixture
def message():
    """Mock de mensagem."""
    message = MagicMock()
    message.id = 1
    message.ticket_id = 1
    message.user_id = 10
    message.message = "Mensagem teste"
    return message


@pytest.fixture
def create_message_request():
    """Mock de CreateMessageRequest."""
    data = MagicMock()
    data.message = "Mensagem teste"
    return data


# ==========================================================
# LIST MESSAGES
# ==========================================================


@patch("services.message.ListTicketMessageResponse")
@patch("services.message.TicketMessageResponse")
def test_list_messages_by_ticket_id_success(
    response_mock,
    list_response_mock,
    service,
    db,
    ticket,
    message,
):
    """Deve listar mensagens do chamado."""

    db.session.get.return_value = ticket

    db.session.query.return_value.filter.return_value.order_by.return_value.all.return_value = [message]

    response_mock.model_validate.return_value = "message_response"

    result = service.list_messages_by_ticket_id(ticket.id)

    response_mock.model_validate.assert_called_once_with(message)
    list_response_mock.assert_called_once()

    assert result is not None


def test_list_messages_by_ticket_id_not_found(
    service,
    db,
):
    """Deve retornar erro quando chamado não existir."""

    db.session.get.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.list_messages_by_ticket_id(999)

    assert exc.value.code == 404


# ==========================================================
# CREATE MESSAGE
# ==========================================================


@patch("services.message.get_jwt_identity")
@patch("services.message.TicketMessageResponse")
@patch("services.message.TicketMessageDB")
def test_create_message_success(
    message_db_mock,
    response_mock,
    jwt_mock,
    service,
    db,
    ticket,
    create_message_request,
):
    """Deve criar mensagem com sucesso."""

    jwt_mock.return_value = "10"

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    created_message = MagicMock()

    message_db_mock.return_value = created_message
    response_mock.model_validate.return_value = "message_response"

    result = service.create_message(
        ticket.id,
        create_message_request,
    )

    assert result == "message_response"

    db.session.add.assert_called_once_with(created_message)
    db.session.commit.assert_called_once()


def test_create_message_ticket_not_found(
    service,
    db,
    create_message_request,
):
    """Deve retornar erro quando chamado não existir."""

    db.session.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.create_message(
            999,
            create_message_request,
        )

    assert exc.value.code == 404


def test_create_message_ticket_finalizado(
    service,
    db,
    ticket,
    create_message_request,
):
    """Deve impedir envio de mensagens em chamados finalizados."""

    ticket.status = TicketTimeline.FINALIZADO.value

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    with pytest.raises(HTTPException) as exc:
        service.create_message(
            ticket.id,
            create_message_request,
        )

    assert exc.value.code == 400


def test_create_message_ticket_encerrado(
    service,
    db,
    ticket,
    create_message_request,
):
    """Deve impedir envio de mensagens em chamados encerrados."""

    ticket.status = TicketTimeline.ENCERRADO.value

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    with pytest.raises(HTTPException) as exc:
        service.create_message(
            ticket.id,
            create_message_request,
        )

    assert exc.value.code == 400


def test_create_message_empty_message(
    service,
    db,
    ticket,
):
    """Deve impedir mensagem vazia."""

    data = MagicMock()
    data.message = ""

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    with pytest.raises(HTTPException) as exc:
        service.create_message(
            ticket.id,
            data,
        )

    assert exc.value.code == 400


def test_create_message_blank_message(
    service,
    db,
    ticket,
):
    """Deve impedir mensagem contendo apenas espaços."""

    data = MagicMock()
    data.message = "     "

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    with pytest.raises(HTTPException) as exc:
        service.create_message(
            ticket.id,
            data,
        )

    assert exc.value.code == 400
