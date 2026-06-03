"""
Testes unitários do serviço de timeline de chamados.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from werkzeug.exceptions import HTTPException

from models.ticket import CreateTimelineRequest, TicketTimeline
from services.timeline import TicketTimelineService

# ==========================================================
# FIXTURES
# ==========================================================


@pytest.fixture
def db():
    """Mock do banco de dados."""
    db = MagicMock()
    db.session = MagicMock()
    return db


@pytest.fixture
def service(db):
    """Instância do serviço."""
    return TicketTimelineService(db)


@pytest.fixture
def ticket():
    """Mock de chamado."""
    ticket = MagicMock()
    ticket.id = 1
    ticket.status = TicketTimeline.PENDENTE.value
    ticket.deleted_at = None
    return ticket


@pytest.fixture
def timeline():
    """Mock de evento da timeline."""
    timeline = MagicMock()
    timeline.id = 1
    timeline.ticket_id = 1
    timeline.description = "Evento criado"
    timeline.status = TicketTimeline.EM_ANDAMENTO.value
    timeline.action_by = 10
    timeline.created_at = datetime.now()
    return timeline


# ==========================================================
# LIST TIMELINE
# ==========================================================


@patch("services.timeline.TimelineResponse")
@patch("services.timeline.TicketTimelineDB")
@patch("services.timeline.TicketDB")
def test_list_timeline_by_ticket_id_success(
    mock_ticket_db,
    mock_timeline_db,
    mock_response,
    service,
    db,
    timeline,
):
    """Deve listar eventos da timeline."""

    db.session.get.return_value = MagicMock()

    db.session.query.return_value.filter.return_value.order_by.return_value.all.return_value = [timeline]

    mock_response.model_validate.return_value.model_dump.return_value = {
        "id": timeline.id,
    }

    result = service.list_timeline_by_ticket_id(1)

    assert len(result) == 1
    assert result[0]["id"] == 1


@patch("services.timeline.TicketDB")
def test_list_timeline_by_ticket_id_not_found(
    mock_ticket_db,
    service,
    db,
):
    """Deve lançar erro quando chamado não existir."""

    db.session.get.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.list_timeline_by_ticket_id(999)

    assert exc.value.code == 404


# ==========================================================
# CREATE TIMELINE
# ==========================================================


@patch("services.timeline.get_jwt_identity")
@patch("services.timeline.get_jwt")
@patch("services.timeline.TimelineResponse")
@patch("services.timeline.TicketTimelineDB")
@patch("services.timeline.TicketDB")
def test_create_timeline_success(
    mock_ticket_db,
    mock_timeline_db,
    mock_response,
    mock_get_jwt,
    mock_get_identity,
    service,
    db,
    ticket,
):
    """Deve criar evento de timeline."""

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    mock_get_jwt.return_value = {"role": "despachante"}
    mock_get_identity.return_value = "10"

    event = MagicMock()
    event.id = 1

    mock_timeline_db.return_value = event
    mock_response.model_validate.return_value = event

    data = CreateTimelineRequest(
        status=TicketTimeline.EM_ANDAMENTO,
        description="Chamado aceito",
    )

    result = service.create_timeline(1, data)

    assert ticket.status == TicketTimeline.EM_ANDAMENTO.value

    db.session.add.assert_called_once()
    db.session.commit.assert_called_once()

    assert result == event


@patch("services.timeline.TicketDB")
def test_create_timeline_ticket_not_found(
    mock_ticket_db,
    service,
    db,
):
    """Deve lançar erro quando chamado não existir."""

    db.session.query.return_value.filter.return_value.first.return_value = None

    data = CreateTimelineRequest(
        status=TicketTimeline.EM_ANDAMENTO,
        description="Teste",
    )

    with pytest.raises(HTTPException) as exc:
        service.create_timeline(1, data)

    assert exc.value.code == 404


@patch("services.timeline.get_jwt")
@patch("services.timeline.TicketDB")
def test_create_timeline_requires_dispatcher_role(
    mock_ticket_db,
    mock_get_jwt,
    service,
    db,
    ticket,
):
    """Deve impedir criação por usuário comum."""

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    mock_get_jwt.return_value = {"role": "cliente"}

    data = CreateTimelineRequest(
        status=TicketTimeline.EM_ANDAMENTO,
        description="Teste",
    )

    with pytest.raises(HTTPException) as exc:
        service.create_timeline(1, data)

    assert exc.value.code == 403


@patch("services.timeline.get_jwt")
@patch("services.timeline.TicketDB")
def test_create_timeline_same_status(
    mock_ticket_db,
    mock_get_jwt,
    service,
    db,
    ticket,
):
    """Deve impedir atualização para o mesmo status."""

    ticket.status = TicketTimeline.PENDENTE.value

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    mock_get_jwt.return_value = {"role": "despachante"}

    data = CreateTimelineRequest(
        status=TicketTimeline.PENDENTE,
        description="Teste",
    )

    with pytest.raises(HTTPException) as exc:
        service.create_timeline(1, data)

    assert exc.value.code == 400


@patch("services.timeline.get_jwt")
@patch("services.timeline.TicketDB")
def test_create_timeline_invalid_transition(
    mock_ticket_db,
    mock_get_jwt,
    service,
    db,
    ticket,
):
    """Deve impedir transição inválida."""

    ticket.status = TicketTimeline.PENDENTE.value

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    mock_get_jwt.return_value = {"role": "despachante"}

    data = CreateTimelineRequest(
        status=TicketTimeline.FINALIZADO,
        description="Teste",
    )

    with pytest.raises(HTTPException) as exc:
        service.create_timeline(1, data)

    assert exc.value.code == 400


@patch("services.timeline.get_jwt_identity")
@patch("services.timeline.get_jwt")
@patch("services.timeline.TimelineResponse")
@patch("services.timeline.TicketTimelineDB")
@patch("services.timeline.TicketDB")
def test_create_timeline_finalize_ticket(
    mock_ticket_db,
    mock_timeline_db,
    mock_response,
    mock_get_jwt,
    mock_get_identity,
    service,
    db,
    ticket,
):
    """Deve marcar chamado como deletado ao finalizar."""

    ticket.status = TicketTimeline.EM_ANDAMENTO.value

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    mock_get_jwt.return_value = {"role": "despachante"}
    mock_get_identity.return_value = "10"

    event = MagicMock()

    mock_timeline_db.return_value = event
    mock_response.model_validate.return_value = event

    data = CreateTimelineRequest(
        status=TicketTimeline.FINALIZADO,
        description="Finalizado",
    )

    service.create_timeline(1, data)

    assert ticket.deleted_at is not None
    assert ticket.status == TicketTimeline.FINALIZADO.value

    db.session.commit.assert_called_once()


@patch("services.timeline.get_jwt_identity")
@patch("services.timeline.get_jwt")
@patch("services.timeline.TimelineResponse")
@patch("services.timeline.TicketTimelineDB")
@patch("services.timeline.TicketDB")
def test_create_timeline_close_ticket(
    mock_ticket_db,
    mock_timeline_db,
    mock_response,
    mock_get_jwt,
    mock_get_identity,
    service,
    db,
    ticket,
):
    """Deve marcar chamado como deletado ao encerrar."""

    ticket.status = TicketTimeline.EM_ANDAMENTO.value

    db.session.query.return_value.filter.return_value.first.return_value = ticket

    mock_get_jwt.return_value = {"role": "despachante"}
    mock_get_identity.return_value = "10"

    event = MagicMock()

    mock_timeline_db.return_value = event
    mock_response.model_validate.return_value = event

    data = CreateTimelineRequest(
        status=TicketTimeline.ENCERRADO,
        description="Encerrado",
    )

    service.create_timeline(1, data)

    assert ticket.deleted_at is not None
    assert ticket.status == TicketTimeline.ENCERRADO.value

    db.session.commit.assert_called_once()
