"""
Testes unitários do ServiceCatalogService.
"""

from datetime import datetime
from unittest.mock import MagicMock

import pytest
from werkzeug.exceptions import HTTPException

from admin.service_catalog import ServiceCatalogService
from models.service_catalog import ServiceCatalogResponse


@pytest.fixture
def mock_db():
    """
    Cria um mock da sessão SQLAlchemy.

    Permite testar o serviço isoladamente sem banco real.
    """
    db = MagicMock()
    db.session = MagicMock()
    return db


@pytest.fixture
def service_catalog(mock_db):
    """Instância do serviço."""
    return ServiceCatalogService(mock_db)


@pytest.fixture
def service():
    """Mock de serviço."""
    service_mock = MagicMock()
    service_mock.id = 1
    service_mock.name = "Transferência"
    service_mock.description = "Serviço teste"
    service_mock.created_at = datetime.now()
    service_mock.updated_at = datetime.now()
    service_mock.deleted_at = None
    return service_mock


def test_list_service_returns_services(mock_db, service_catalog, service):
    """
    Deve retornar lista de serviços ativos (não deletados).
    """
    query_mock = MagicMock()
    query_mock.filter.return_value.all.return_value = [service]

    mock_db.session.query.return_value = query_mock

    result = service_catalog.list_service()

    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0]["id"] == 1
    assert result[0]["name"] == "Transferência"


def test_list_service_empty(mock_db, service_catalog):
    """
    Deve retornar lista vazia quando não houver serviços.
    """
    query_mock = MagicMock()
    query_mock.filter.return_value.all.return_value = []

    mock_db.session.query = MagicMock(return_value=query_mock)

    result = service_catalog.list_service()
    assert isinstance(result, list)
    assert len(result) == 0


def test_create_service_success(mock_db, service_catalog):
    """
    Deve criar um novo serviço e persistir no banco.
    """

    service_data = MagicMock()
    service_data.model_dump.return_value = {
        "name": "Transferência",
        "description": "Serviço teste",
    }

    new_service = MagicMock()
    new_service.id = 1
    new_service.name = "Transferência"
    new_service.description = "Serviço teste"

    ServiceCatalogResponse.model_validate = MagicMock(return_value=new_service)

    result = service_catalog.create_service(service_data)

    mock_db.session.add.assert_called_once()
    mock_db.session.commit.assert_called_once()

    assert result is not None


def test_update_service_success(mock_db, service_catalog):
    """
    Deve atualizar um serviço existente corretamente.
    """

    service_obj = MagicMock()
    service_obj.id = 1

    mock_db.session.query.return_value.filter.return_value.first.return_value = service_obj

    service_data = MagicMock()
    service_data.model_dump.return_value = {
        "name": "Atualizado",
        "description": "Atualizado desc",
    }

    ServiceCatalogResponse.model_validate = MagicMock(return_value=service_obj)

    result = service_catalog.update_service(1, service_data)

    assert service_obj.name == "Atualizado"
    assert mock_db.session.commit.called
    assert result is not None


def test_update_service_not_found(mock_db, service_catalog):
    """
    Deve lançar 404 quando serviço não existir.
    """
    mock_db.session.query.return_value.filter.return_value.first.return_value = None

    service_data = MagicMock()
    service_data.model_dump.return_value = {}

    with pytest.raises(HTTPException) as exc:
        service_catalog.update_service(999, service_data)

    assert exc.value.code == 404


def test_delete_service_success(mock_db, service_catalog):
    """
    Deve marcar serviço como deletado (soft delete).
    """
    service_obj = MagicMock()
    service_obj.deleted_at = None

    mock_db.session.query.return_value.filter.return_value.first.return_value = service_obj

    ServiceCatalogResponse.model_validate = MagicMock(return_value=service_obj)

    result = service_catalog.delete_service(1)
    assert service_obj.deleted_at is not None
    assert mock_db.session.commit.called
    assert result is not None


def test_delete_service_not_found(mock_db, service_catalog):
    """
    Deve retornar 404 quando serviço não existir.
    """
    mock_db.session.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service_catalog.delete_service(1)

    assert exc.value.code == 404
