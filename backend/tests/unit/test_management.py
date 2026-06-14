"""
Testes unitários do AdminService.
"""

from unittest.mock import MagicMock

import pytest
from werkzeug.exceptions import HTTPException

from admin.management import AdminService
from models.auth import DispatcherStatusEnum


@pytest.fixture
def mock_db():
    """
    Cria um mock da sessão do SQLAlchemy.

    Usado para isolar o serviço de qualquer dependência de banco real.
    """
    db = MagicMock()
    db.session = MagicMock()
    return db


def test_list_dispatchers_by_status_returns_formatted_data(mock_db):
    """
    Deve retornar lista formatada de despachantes com status PENDENTE.
    """

    # Mock do usuário associado ao dispatcher
    user_mock = MagicMock()
    user_mock.name = "João Teste"
    user_mock.email = "joao@email.com"

    # Mock do dispatcher
    dispatcher_mock = MagicMock()
    dispatcher_mock.id = 1
    dispatcher_mock.user = user_mock

    # Mock da query encadeada (query -> options -> filter -> all)
    query_mock = MagicMock()
    query_mock.options.return_value.filter.return_value.all.return_value = [dispatcher_mock]

    mock_db.session.query.return_value = query_mock

    service = AdminService(mock_db)

    result = service.list_dispatchers_by_status()

    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0]["id"] == 1
    assert result[0]["name"] == "João Teste"
    assert result[0]["email"] == "joao@email.com"


def test_list_dispatchers_by_status_empty(mock_db):
    """
    Deve retornar lista vazia quando não houver despachantes pendentes.
    """

    query_mock = MagicMock()
    query_mock.options.return_value.filter.return_value.all.return_value = []

    mock_db.session.query.return_value = query_mock

    service = AdminService(mock_db)

    result = service.list_dispatchers_by_status()

    assert result == []


def test_update_dispatcher_status_success(mock_db):
    """
    Deve atualizar o status do despachante e retornar mensagem de sucesso.
    """
    dispatcher = MagicMock()
    dispatcher.id = 1
    dispatcher.status = DispatcherStatusEnum.PENDENTE
    dispatcher.updated_at = None

    mock_db.session.get.return_value = dispatcher

    service = AdminService(mock_db)

    result = service.update_dispatcher_status(
        dispatcher_id=1,
        status=DispatcherStatusEnum.APROVADO,
    )

    assert dispatcher.status == DispatcherStatusEnum.APROVADO
    assert dispatcher.updated_at is not None

    mock_db.session.commit.assert_called_once()

    assert "Despachante" in result["message"]
    assert "sucesso" in result["message"]


def test_update_dispatcher_status_not_found(mock_db):
    """
    Deve lançar erro 404 quando despachante não existir.
    """

    mock_db.session.get.return_value = None

    service = AdminService(mock_db)

    with pytest.raises(HTTPException) as exc:
        service.update_dispatcher_status(
            dispatcher_id=999,
            status=DispatcherStatusEnum.APROVADO,
        )

    assert exc.value.code == 404


def test_update_dispatcher_status_commits_changes(mock_db):
    """
    Deve garantir que commit é chamado ao atualizar status.
    """

    dispatcher = MagicMock()
    mock_db.session.get.return_value = dispatcher

    service = AdminService(mock_db)

    service.update_dispatcher_status(
        dispatcher_id=1,
        status=DispatcherStatusEnum.NEGADO,
    )

    mock_db.session.commit.assert_called_once()
