"""
Testes unitários do serviço de associação entre despachantes e serviços.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from werkzeug.exceptions import HTTPException

from services.associate_service_details import (
    AssociateServiceDetailsDispatcherService,
)

# ==========================================================
# FIXTURES
# ==========================================================


@pytest.fixture
def db_mock():
    """Mock do banco de dados."""
    return MagicMock()


@pytest.fixture
def service(db_mock):
    """Instância do serviço sob teste."""
    return AssociateServiceDetailsDispatcherService(db_mock)


# ==========================================================
# LISTAGEM
# ==========================================================


def test_get_services_details_from_dispatcher(service):
    """Deve listar os serviços vinculados ao despachante."""
    service_db = MagicMock()
    service_db.id = 5
    service_db.name = "Transferência"

    detail = MagicMock()
    detail.id = 1
    detail.dispatcher_id = 2
    detail.service = service_db
    detail.price = 100
    detail.created_at = datetime.now()
    detail.updated_at = datetime.now()
    detail.deleted_at = None

    pagination = MagicMock()
    pagination.items = [detail]
    pagination.page = 1
    pagination.pages = 1
    pagination.total = 1
    pagination.per_page = 10

    service_details_mock = MagicMock()

    service_details_mock.query.options.return_value.filter.return_value.order_by.return_value.paginate.return_value = pagination

    with (
        patch(
            "services.associate_service_details.ServiceDetailsDB",
            service_details_mock,
        ),
        patch(
            "services.associate_service_details.joinedload",
            return_value=None,
        ),
    ):
        result = service.get_services_details_from_dispatcher(dispatcher_id=2)

    assert result.total == 1
    assert len(result.items) == 1
    assert result.items[0].service_name == "Transferência"


# ==========================================================
# CRIAÇÃO
# ==========================================================


def test_add_service_for_dispatcher_success(service, db_mock):
    """Deve vincular um serviço ao despachante."""
    service_details_mock = MagicMock()

    service_details_mock.query.filter_by.return_value.first.return_value = None

    with patch(
        "services.associate_service_details.ServiceDetailsDB",
        service_details_mock,
    ):
        result = service.add_service_for_dispatcher(
            dispatcher_id=1,
            service_id=10,
        )

    assert result == {"message": "Serviço vinculado com sucesso!"}

    db_mock.session.add.assert_called_once()
    db_mock.session.commit.assert_called_once()


def test_add_service_for_dispatcher_duplicate(service):
    """Deve impedir vínculo duplicado de serviço."""
    existing_relation = MagicMock()

    service_details_mock = MagicMock()

    service_details_mock.query.filter_by.return_value.first.return_value = existing_relation

    with patch(
        "services.associate_service_details.ServiceDetailsDB",
        service_details_mock,
    ):
        with pytest.raises(HTTPException) as exc:
            service.add_service_for_dispatcher(
                dispatcher_id=1,
                service_id=10,
            )

    assert exc.value.code == 400


# ==========================================================
# ATUALIZAÇÃO
# ==========================================================


def test_update_dispatcher_service_details_success(service, db_mock):
    """Deve atualizar os detalhes do serviço vinculado."""
    relation = MagicMock()
    relation.price = 100

    service_details_mock = MagicMock()

    service_details_mock.query.filter.return_value.first.return_value = relation

    with patch(
        "services.associate_service_details.ServiceDetailsDB",
        service_details_mock,
    ):
        result = service.update_dispatcher_service_details(
            dispatcher_id=1,
            service_id=10,
            data={"price": 250},
        )

    assert result == {"message": "Serviço detalhado atualizado com sucesso!"}

    assert relation.price == 250
    db_mock.session.commit.assert_called_once()


def test_update_dispatcher_service_details_not_found(service):
    """Deve retornar erro ao atualizar vínculo inexistente."""
    service_details_mock = MagicMock()

    service_details_mock.query.filter.return_value.first.return_value = None

    with patch(
        "services.associate_service_details.ServiceDetailsDB",
        service_details_mock,
    ):
        with pytest.raises(HTTPException) as exc:
            service.update_dispatcher_service_details(
                dispatcher_id=1,
                service_id=10,
                data={"price": 250},
            )

    assert exc.value.code == 404


# ==========================================================
# REMOÇÃO
# ==========================================================


def test_delete_dispatcher_service_details_success(service, db_mock):
    """Deve remover o vínculo entre serviço e despachante."""
    relation = MagicMock()
    relation.deleted_at = None

    service_details_mock = MagicMock()

    service_details_mock.query.filter.return_value.first.return_value = relation

    with patch(
        "services.associate_service_details.ServiceDetailsDB",
        service_details_mock,
    ):
        result = service.delete_dispatcher_service_details(
            dispatcher_id=1,
            service_id=10,
        )

    assert result == {"message": "Serviço desvinculado com sucesso!"}

    assert relation.deleted_at is not None
    db_mock.session.commit.assert_called_once()


def test_delete_dispatcher_service_details_not_found(service):
    """Deve retornar erro ao remover vínculo inexistente."""
    service_details_mock = MagicMock()

    service_details_mock.query.filter.return_value.first.return_value = None

    with patch(
        "services.associate_service_details.ServiceDetailsDB",
        service_details_mock,
    ):
        with pytest.raises(HTTPException) as exc:
            service.delete_dispatcher_service_details(
                dispatcher_id=1,
                service_id=10,
            )

    assert exc.value.code == 404
