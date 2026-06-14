"""
Testes unitários do AuthService.

Cobre cenários de autenticação, validação de regras de negócio
e revogação de token JWT.
"""

from unittest.mock import MagicMock

import pytest
from werkzeug.exceptions import HTTPException

from models.auth import DispatcherStatusEnum, LoginUserRequest, UserRoleEnum
from services.auth import AuthService

# ===============================================================
# ========== FIXTURES ===========================================


@pytest.fixture
def mock_db():
    """
    Mock da sessão do SQLAlchemy.
    """
    db = MagicMock()
    db.session = MagicMock()
    return db


@pytest.fixture
def auth_service(mock_db):
    """
    Instância do AuthService com dependências mockadas.
    """
    return AuthService(mock_db)


@pytest.fixture
def login_request():
    """
    Request padrão de login.
    """
    return LoginUserRequest(email="test@test.com", password="123")


def build_query_mock(return_value):
    """Constrói um mock para a query do SQLAlchemy que retorna um valor específico."""
    query_mock = MagicMock()
    filter_mock = MagicMock()
    filter_mock.first.return_value = return_value
    query_mock.filter.return_value = filter_mock
    return query_mock


# ===============================================================
# ========== TESTES LOGIN =======================================


def test_login_user_not_found(auth_service, mock_db, login_request):
    """
    Deve retornar 404 quando usuário não existir.
    """
    mock_db.session.query.return_value = build_query_mock(None)

    with pytest.raises(HTTPException) as exc:
        auth_service.login(login_request)

    assert exc.value.code == 404


def test_login_invalid_password(auth_service, mock_db, mocker, login_request):
    """
    Deve retornar 401 quando senha estiver incorreta.
    """
    user = MagicMock()
    user.password = "hashed"

    mock_db.session.query.return_value = build_query_mock(user)
    mocker.patch("werkzeug.security.check_password_hash", return_value=False)

    with pytest.raises(HTTPException) as exc:
        auth_service.login(login_request)

    assert exc.value.code == 401


def test_login_dispatcher_not_found(auth_service, mock_db, login_request):
    """
    Deve retornar 401 quando despachante não existir para usuário do tipo DESPACHANTE.
    """
    user = MagicMock()
    user.id = 1
    user.role = UserRoleEnum.DESPACHANTE

    mock_db.session.query.return_value = build_query_mock(user)
    mock_db.session.query.side_effect = [
        build_query_mock(user),
        build_query_mock(None),
    ]

    with pytest.raises(HTTPException) as exc:
        auth_service.login(login_request)

    assert exc.value.code == 401


def test_login_dispatcher_pending(auth_service, mock_db, login_request):
    """
    Deve retornar 401 quando despachante estiver pendente.
    """
    user = MagicMock()
    user.id = 1
    user.role = UserRoleEnum.DESPACHANTE
    user.password = "hashed"

    dispatcher = MagicMock()
    dispatcher.status = DispatcherStatusEnum.PENDENTE

    mock_db.session.query.side_effect = [
        build_query_mock(user),
        build_query_mock(dispatcher),
    ]

    with pytest.raises(HTTPException) as exc:
        auth_service.login(login_request)

    assert exc.value.code == 401


def test_login_dispatcher_denied(auth_service, mock_db, login_request):
    """
    Deve retornar 401 quando despachante tiver sido negado.
    """
    user = MagicMock()
    user.id = 1
    user.role = UserRoleEnum.DESPACHANTE
    user.password = "hashed"

    dispatcher = MagicMock()
    dispatcher.status = DispatcherStatusEnum.NEGADO

    mock_db.session.query.return_value = build_query_mock(user)
    mock_db.session.query.side_effect = [
        build_query_mock(user),
        build_query_mock(dispatcher),
    ]

    with pytest.raises(HTTPException) as exc:
        auth_service.login(login_request)

    assert exc.value.code == 401


def test_login_success_user_without_dispatcher(auth_service, mock_db, mocker, login_request):
    """
    Deve autenticar usuário comum com sucesso.
    """
    user = MagicMock()
    user.id = 1
    user.role = UserRoleEnum.CLIENTE
    user.name = "Test"
    user.email = "test@test.com"
    user.password = "hashed"

    mock_db.session.query.return_value = build_query_mock(user)

    mocker.patch("services.auth.create_access_token", return_value="token")
    mocker.patch("services.auth.check_password_hash", return_value=True)

    result = auth_service.login(login_request)

    assert result.token == "token"
    assert result.email == "test@test.com"
    assert result.dispatcher_id is None


def test_login_success_dispatcher(auth_service, mock_db, mocker, login_request):
    """
    Deve autenticar despachante com sucesso.
    """

    user = MagicMock()
    user.id = 1
    user.role = UserRoleEnum.DESPACHANTE
    user.name = "Dispatcher"
    user.email = "disp@test.com"
    user.password = "hashed"

    dispatcher = MagicMock()
    dispatcher.id = 10
    dispatcher.status = "ATIVO"

    # mock query USER
    user_query = MagicMock()
    user_query.filter.return_value.first.return_value = user

    # mock query DISPATCHER
    dispatcher_query = MagicMock()
    dispatcher_query.filter.return_value.first.return_value = dispatcher

    # aqui é o ponto chave
    mock_db.session.query.side_effect = [user_query, dispatcher_query]

    mocker.patch("services.auth.create_access_token", return_value="token")
    mocker.patch("services.auth.check_password_hash", return_value=True)

    result = auth_service.login(login_request)

    assert result.token == "token"
    assert result.dispatcher_id == 10
    assert result.email == "disp@test.com"


# ===============================================================
# ========== TESTE LOGOUT =======================================


def test_logout_sets_redis_blacklist(auth_service, mocker):
    """
    Deve registrar o token JWT na blacklist do Redis.
    """

    mocker.patch("services.auth.get_jwt", return_value={"jti": "abc123"})

    redis_mock = MagicMock()
    mocker.patch("services.auth.redis_client", redis_mock)

    auth_service.logout()

    redis_mock.set.assert_called_once_with("blacklist:abc123", "true", ex=3600)
