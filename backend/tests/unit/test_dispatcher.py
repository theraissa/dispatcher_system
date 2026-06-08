"""
Testes unitários do serviço DispatcherService.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from werkzeug.exceptions import HTTPException

from services.dispatcher import DispatcherService

# ==========================================================
# FIXTURES
# ==========================================================


@pytest.fixture
def db():
    """Mock da instância do SQLAlchemy."""
    db = MagicMock()
    db.session = MagicMock()
    return db


@pytest.fixture
def service(db):
    """Instância do serviço testado."""
    return DispatcherService(db)


@pytest.fixture
def user():
    """Mock de usuário."""
    user = MagicMock()
    user.id = 1
    user.cpf = "12345678901"
    user.name = "João"
    user.email = "joao@email.com"
    user.password = "123456"
    user.date_birth = "1990-01-01"
    user.contact = "51999999999"
    user.photo = None
    user.instagram = None
    user.website = None
    user.deleted_at = None
    return user


@pytest.fixture
def address(user):
    """Mock de endereço."""
    address = MagicMock()
    address.id = 10
    address.user_id = user.id
    address.contact = "51999999999"
    address.number = 123
    address.neighborhood = "Bairro Teste"
    address.address = "Rua Teste"
    address.city = "Cidade Teste"
    address.state = "Estado Teste"
    address.zip_code = "99999-999"
    address.created_at = datetime.now()
    address.updated_at = datetime.now()
    address.deleted_at = None
    return address


@pytest.fixture
def dispatcher(user, address):
    """Mock de despachante."""
    dispatcher = MagicMock()
    dispatcher.id = 5
    dispatcher.user_id = user.id
    dispatcher.user = user
    dispatcher.deleted_at = None
    dispatcher.regis_crdd = "CRDD123"

    user.address = address

    return dispatcher


@pytest.fixture
def create_dispatcher_request():
    """Mock de CreateDispatcherFullRequest."""

    request = MagicMock()

    request.user.cpf = "12345678901"
    request.user.name = "João"
    request.user.email = "joao@email.com"
    request.user.password = "123456"
    request.user.contact = "51999999999"
    request.user.date_birth = "1990-01-01"

    request.address.contact = "51999999999"
    request.address.number = 100
    request.address.neighborhood = "Centro"
    request.address.address = "Rua A"
    request.address.city = "Sapiranga"
    request.address.state = "RS"
    request.address.zip_code = "93800000"

    request.dispatcher.regis_crdd = "CRDD123"
    request.dispatcher.date_exp_regis = "2030-01-01"

    return request


@pytest.fixture
def update_dispatcher_request():
    """Mock de UpdateDispatcherFullRequest."""

    request = MagicMock()

    request.user.model_dump.return_value = {
        "name": "Novo Nome",
    }

    request.dispatcher.model_dump.return_value = {
        "regis_crdd": "NOVO123",
    }

    request.address.model_dump.return_value = {
        "city": "Porto Alegre",
    }

    return request


# ==========================================================
# LIST
# ==========================================================


@patch("services.dispatcher.PaginatedResponse")
def test_list_dispatcher_success(
    paginated_response_mock,
    service,
    db,
    dispatcher,
):
    """Deve listar despachantes."""

    pagination = MagicMock()
    pagination.items = [dispatcher]

    db.session.query.return_value.options.return_value.filter.return_value.paginate.return_value = pagination

    paginated_response_mock.__getitem__.return_value.from_pagination.return_value = "resultado"

    result = service.list_dispatcher()

    assert result == "resultado"


# ==========================================================
# GET BY ID
# ==========================================================


def test_get_dispatcher_by_id_success(service, db, dispatcher):
    """Deve retornar despachante pelo ID."""

    db.session.query.return_value.options.return_value.filter.return_value.first.return_value = dispatcher

    result = service.get_dispatcher_by_id(1)

    assert result.user.id == dispatcher.user.id


def test_get_dispatcher_by_id_not_found(service, db):
    """Deve retornar erro quando despachante não existir."""

    db.session.query.return_value.options.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.get_dispatcher_by_id(1)

    assert exc.value.code == 404


# ==========================================================
# CREATE
# ==========================================================


@patch("services.dispatcher.generate_password_hash")
@patch("services.dispatcher.DispatcherDB")
@patch("services.dispatcher.AddressDB")
@patch("services.dispatcher.UserDB")
def test_create_dispatcher_success(
    user_db_mock,
    address_db_mock,
    dispatcher_db_mock,
    hash_mock,
    service,
    db,
    create_dispatcher_request,
):
    """Deve criar despachante."""

    hash_mock.return_value = "hashed"

    user_db_mock.query.filter_by.return_value.first.return_value = None
    dispatcher_db_mock.query.filter_by.return_value.first.return_value = None

    created_user = MagicMock(id=1)
    created_address = MagicMock(id=2)
    created_dispatcher = MagicMock(id=3)

    user_db_mock.return_value = created_user
    address_db_mock.return_value = created_address
    dispatcher_db_mock.return_value = created_dispatcher

    result = service.create_dispatcher(create_dispatcher_request)

    assert result == {
        "user_id": 1,
        "dispatcher_id": 3,
        "address_id": 2,
    }

    db.session.commit.assert_called_once()


@patch("services.dispatcher.UserDB")
def test_create_dispatcher_duplicate_cpf(user_db_mock, service, create_dispatcher_request):
    """Deve impedir CPF duplicado."""

    user_db_mock.query.filter_by.return_value.first.return_value = MagicMock()

    with pytest.raises(HTTPException) as exc:
        service.create_dispatcher(create_dispatcher_request)

    assert exc.value.code == 400


@patch("services.dispatcher.UserDB")
@patch("services.dispatcher.DispatcherDB")
def test_create_dispatcher_duplicate_crdd(dispatcher_db_mock, user_db_mock, service, create_dispatcher_request):
    """Deve impedir CRDD duplicado."""

    user_db_mock.query.filter_by.return_value.first.return_value = None

    dispatcher_db_mock.query.filter_by.return_value.first.return_value = MagicMock()

    with pytest.raises(HTTPException) as exc:
        service.create_dispatcher(create_dispatcher_request)

    assert exc.value.code == 400


def test_create_dispatcher_rollback_on_error(service, db, create_dispatcher_request):
    """Deve executar rollback quando ocorrer erro."""

    with patch("services.dispatcher.UserDB") as user_db_mock:
        with patch("services.dispatcher.DispatcherDB") as dispatcher_db_mock:

            user_db_mock.query.filter_by.return_value.first.return_value = None
            dispatcher_db_mock.query.filter_by.return_value.first.return_value = None

            db.session.add.side_effect = Exception("erro")

            with pytest.raises(Exception):
                service.create_dispatcher(create_dispatcher_request)

            db.session.rollback.assert_called_once()


# ==========================================================
# UPDATE
# ==========================================================


@patch("services.dispatcher.AddressDB")
@patch("services.dispatcher.DispatcherDB")
@patch("services.dispatcher.UserDB")
def test_update_dispatcher_success(
    user_db_mock,
    dispatcher_db_mock,
    address_db_mock,
    service,
    db,
    update_dispatcher_request,
):
    """Deve atualizar despachante."""

    user = MagicMock()
    dispatcher = MagicMock()
    address = MagicMock()

    user_db_mock.query.filter.return_value.first.return_value = user
    dispatcher_db_mock.query.filter_by.return_value.first.return_value = dispatcher
    address_db_mock.query.filter_by.return_value.first.return_value = address

    result = service.update_dispatcher_full(
        1,
        update_dispatcher_request,
    )

    assert result["message"] == "Perfil do despachante atualizado com sucesso!"

    assert user.name == "Novo Nome"
    assert dispatcher.regis_crdd == "NOVO123"
    assert address.city == "Porto Alegre"

    db.session.commit.assert_called_once()


@patch("services.dispatcher.UserDB")
def test_update_dispatcher_not_found(user_db_mock, service, update_dispatcher_request):
    """Deve retornar erro quando usuário não existir."""

    user_db_mock.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.update_dispatcher_full(
            1,
            update_dispatcher_request,
        )

    assert exc.value.code == 404


def test_update_dispatcher_rollback_on_error(service, db, update_dispatcher_request):
    """Deve executar rollback em caso de erro."""

    with patch("services.dispatcher.UserDB") as user_db_mock:

        user_db_mock.query.filter.return_value.first.side_effect = Exception("erro")

        with pytest.raises(Exception):
            service.update_dispatcher_full(
                1,
                update_dispatcher_request,
            )

        db.session.rollback.assert_called_once()


# ==========================================================
# DELETE
# ==========================================================


@patch("services.dispatcher.DispatcherResponse")
@patch("services.dispatcher.DispatcherDB")
def test_delete_dispatcher_success(dispatcher_db_mock, response_mock, service, db):
    """Deve remover despachante logicamente."""

    dispatcher = MagicMock()

    dispatcher_db_mock.query.filter.return_value.first.return_value = dispatcher

    response_mock.model_validate.return_value = "response"

    result = service.delete_dispatcher(1)

    assert result == "response"
    assert dispatcher.deleted_at is not None

    db.session.commit.assert_called_once()


@patch("services.dispatcher.DispatcherDB")
def test_delete_dispatcher_not_found(dispatcher_db_mock, service):
    """Deve retornar erro quando despachante não existir."""

    dispatcher_db_mock.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.delete_dispatcher(1)

    assert exc.value.code == 404


# ==========================================================
# SEARCH
# ==========================================================


@patch("services.dispatcher.PaginatedResponse")
def test_search_dispatchers_without_filters(paginated_response_mock, service, db, dispatcher):
    """Deve buscar despachantes sem filtros."""

    pagination = MagicMock()
    pagination.items = [dispatcher]

    query = db.session.query.return_value.options.return_value.filter.return_value

    query.distinct.return_value.paginate.return_value = pagination

    paginated_response_mock.__getitem__.return_value.from_pagination.return_value = "resultado"

    result = service.search_dispatchers()

    assert result == "resultado"


@patch("services.dispatcher.PaginatedResponse")
def test_search_dispatchers_with_filters(paginated_response_mock, service, db, dispatcher):
    """Deve buscar despachantes utilizando filtros."""

    filters = MagicMock()
    filters.name = "João"
    filters.city = None
    filters.service_name = None

    pagination = MagicMock()
    pagination.items = [dispatcher]

    query = db.session.query.return_value.options.return_value.filter.return_value

    query.join.return_value.filter.return_value.distinct.return_value.paginate.return_value = pagination

    paginated_response_mock.__getitem__.return_value.from_pagination.return_value = "resultado"

    result = service.search_dispatchers(filters)

    assert result == "resultado"
