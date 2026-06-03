"""
Testes unitários do serviço de usuários.
"""

from unittest.mock import MagicMock, patch

import pytest
from werkzeug.exceptions import HTTPException

from models.user import (
    CreateUserRequest,
    UpdateUserProfileRequest,
    UpdateUserRequest,
)
from services.user import UserService

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
    return UserService(db)


@pytest.fixture
def user():
    """Mock de usuário."""
    user = MagicMock()
    user.id = 1
    user.name = "João"
    user.email = "joao@email.com"
    user.cpf = "12345678901"
    user.address = None
    user.photo = None
    return user


@pytest.fixture
def address():
    """Mock de endereço."""
    address = MagicMock()
    address.id = 1
    address.city = "Sapiranga"
    return address


@pytest.fixture
def photo():
    """Mock de imagem."""
    photo = MagicMock()
    photo.filename = "foto.jpg"
    photo.mimetype = "image/jpeg"
    return photo


# ==========================================================
# LIST USER
# ==========================================================


@patch("services.user.PaginatedResponse")
@patch("services.user.UserResponse")
@patch("services.user.UserDB")
def test_list_user_success(
    mock_user_db,
    mock_response,
    mock_paginated,
    service,
    user,
):
    """Deve listar usuários."""

    pagination = MagicMock()
    pagination.items = [user]

    mock_user_db.query.filter.return_value.paginate.return_value = pagination

    response_item = MagicMock()
    mock_response.model_validate.return_value = response_item

    expected = MagicMock()
    mock_paginated.__getitem__.return_value.from_pagination.return_value = expected

    result = service.list_user()
    assert result == expected


# ==========================================================
# GET USER
# ==========================================================


@patch("services.user.joinedload")
@patch("services.user.ListUserFullResponse")
@patch("services.user.UserResponse")
@patch("services.user.UserDB")
def test_get_user_by_id_success(
    mock_user_db,
    mock_user_response,
    mock_full_response,
    mock_joinedload,
    service,
    user,
):
    """Deve buscar usuário por id."""
    mock_joinedload.return_value = MagicMock()
    mock_user_db.query.options.return_value.filter.return_value.first.return_value = user

    expected = MagicMock()
    mock_full_response.return_value = expected

    result = service.get_user_by_id(1)
    assert result == expected


@patch("services.user.joinedload")
@patch("services.user.UserDB")
def test_get_user_by_id_not_found(mock_user_db, mock_joinedload, service):
    """Deve retornar erro para usuário inexistente."""

    mock_joinedload.return_value = MagicMock()
    mock_user_db.query.options.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.get_user_by_id(1)

    assert exc.value.code == 404


# ==========================================================
# CREATE USER
# ==========================================================


@patch("services.user.generate_password_hash")
@patch("services.user.UserResponse")
@patch("services.user.UserDB")
def test_create_user_success(
    mock_user_db,
    mock_response,
    mock_hash,
    service,
):
    """Deve criar usuário."""

    mock_user_db.query.filter_by.return_value.first.return_value = None

    mock_hash.return_value = "hashed"

    created_user = MagicMock()
    mock_user_db.return_value = created_user

    expected = MagicMock()

    mock_response.model_validate.return_value = expected

    data = CreateUserRequest(
        cpf="12345678901",
        name="João",
        date_birth="1990-01-01",
        contact="51999999999",
        email="teste@email.com",
        password="123456",
    )

    result = service.create_user(data)

    db = service.db

    db.session.add.assert_called_once()
    db.session.commit.assert_called_once()

    assert result == expected


@patch("services.user.UserDB")
def test_create_user_duplicate_cpf(
    mock_user_db,
    service,
    user,
):
    """Deve impedir CPF duplicado."""

    mock_user_db.query.filter_by.return_value.first.return_value = user

    data = MagicMock()

    with pytest.raises(HTTPException) as exc:
        service.create_user(data)

    assert exc.value.code == 400


@patch("services.user.UserDB")
def test_create_user_duplicate_email(
    mock_user_db,
    service,
):
    """Deve impedir e-mail duplicado."""

    cpf_query = MagicMock()
    email_query = MagicMock()

    cpf_query.first.return_value = None
    email_query.first.return_value = MagicMock()

    mock_user_db.query.filter_by.side_effect = [
        cpf_query,
        email_query,
    ]

    data = MagicMock()
    data.cpf = "123"
    data.email = "teste@email.com"

    with pytest.raises(HTTPException) as exc:
        service.create_user(data)

    assert exc.value.code == 400


# ==========================================================
# UPDATE USER
# ==========================================================


@patch("services.user.joinedload")
@patch("services.user.ListUserFullResponse")
@patch("services.user.UserResponse")
@patch("services.user.UserDB")
def test_update_user_success(
    mock_user_db,
    mock_user_response,
    mock_full_response,
    mock_joinedload,
    service,
    user,
):
    """Deve atualizar usuário."""

    mock_joinedload.return_value = MagicMock()
    mock_user_db.query.options.return_value.filter.return_value.first.return_value = user

    update = MagicMock(spec=UpdateUserRequest)
    update.user = MagicMock()
    update.address = None

    update.user.model_dump.return_value = {
        "name": "Novo Nome",
    }

    expected = MagicMock()

    mock_full_response.return_value = expected

    result = service.update_user(1, update)

    assert user.name == "Novo Nome"

    service.db.session.commit.assert_called_once()

    assert result == expected


@patch("services.user.joinedload")
@patch("services.user.UserDB")
def test_update_user_not_found(
    mock_user_db,
    mock_joinedload,
    service,
):
    """Deve retornar erro para usuário inexistente."""

    mock_joinedload.return_value = MagicMock()
    mock_user_db.query.options.return_value.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.update_user(1, MagicMock())

    assert exc.value.code == 404


# ==========================================================
# UPDATE PROFILE
# ==========================================================


@patch("services.user.UserProfileResponse")
@patch("services.user.UserDB")
def test_update_profile_success(
    mock_user_db,
    mock_response,
    service,
    user,
):
    """Deve atualizar perfil sem foto."""

    mock_user_db.query.filter.return_value.first.return_value = user

    expected = MagicMock()
    mock_response.model_validate.return_value = expected

    data = UpdateUserProfileRequest(
        instagram="@joao",
        website="https://site.com",
    )

    result = service.update_user_profile_public(
        1,
        data,
    )

    service.db.session.commit.assert_called_once()

    assert result == expected


@patch("services.user.uuid.uuid4")
@patch("services.user.os.makedirs")
@patch("services.user.UserProfileResponse")
@patch("services.user.UserDB")
def test_update_profile_with_photo(
    mock_user_db,
    mock_response,
    mock_makedirs,
    mock_uuid,
    service,
    user,
    photo,
):
    """Deve atualizar perfil com foto."""

    mock_user_db.query.filter.return_value.first.return_value = user

    mock_uuid.return_value = "abc123"

    expected = MagicMock()
    mock_response.model_validate.return_value = expected

    service.update_user_profile_public(
        1,
        UpdateUserProfileRequest(),
        photo,
    )

    photo.save.assert_called_once()

    assert "/uploads/profile/" in user.photo


@patch("services.user.UserDB")
def test_update_profile_user_not_found(
    mock_user_db,
    service,
):
    """Deve retornar erro para usuário inexistente."""

    mock_user_db.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.update_user_profile_public(
            1,
            UpdateUserProfileRequest(),
        )

    assert exc.value.code == 404


@patch("services.user.UserDB")
def test_update_profile_invalid_mimetype(
    mock_user_db,
    service,
    user,
    photo,
):
    """Deve impedir arquivo inválido."""

    mock_user_db.query.filter.return_value.first.return_value = user

    photo.mimetype = "application/pdf"

    with pytest.raises(HTTPException) as exc:
        service.update_user_profile_public(
            1,
            UpdateUserProfileRequest(),
            photo,
        )

    assert exc.value.code == 400


@patch("services.user.UserDB")
def test_update_profile_invalid_extension(
    mock_user_db,
    service,
    user,
    photo,
):
    """Deve impedir extensão inválida."""

    mock_user_db.query.filter.return_value.first.return_value = user

    photo.filename = "arquivo.pdf"

    with pytest.raises(HTTPException) as exc:
        service.update_user_profile_public(
            1,
            UpdateUserProfileRequest(),
            photo,
        )

    assert exc.value.code == 400


def test_update_profile_rollback_on_exception(service):
    """Deve executar rollback em caso de erro."""

    with patch("services.user.UserDB") as mock_user_db:
        mock_user_db.query.filter.side_effect = Exception("erro")

        with pytest.raises(Exception):
            service.update_user_profile_public(
                1,
                UpdateUserProfileRequest(),
            )

    service.db.session.rollback.assert_called_once()


# ==========================================================
# DELETE USER
# ==========================================================


@patch("services.user.UserResponse")
@patch("services.user.UserDB")
def test_delete_user_success(
    mock_user_db,
    mock_response,
    service,
    user,
):
    """Deve remover usuário logicamente."""

    mock_user_db.query.filter.return_value.first.return_value = user

    expected = MagicMock()

    mock_response.model_validate.return_value = expected

    result = service.delete_user(1)

    service.db.session.commit.assert_called_once()

    assert user.deleted_at is not None
    assert result == expected


@patch("services.user.UserDB")
def test_delete_user_not_found(
    mock_user_db,
    service,
):
    """Deve retornar erro para usuário inexistente."""

    mock_user_db.query.filter.return_value.first.return_value = None

    with pytest.raises(HTTPException) as exc:
        service.delete_user(1)

    assert exc.value.code == 404
