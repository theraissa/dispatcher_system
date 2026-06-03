"""Módulo com fixtures"""

import pytest
from flask_jwt_extended import create_access_token

from app import create_app


@pytest.fixture
def app():
    """Cria a aplicação Flask para testes."""
    app = create_app()
    app.config.update(TESTING=True)
    yield app


@pytest.fixture
def client(app):
    """Retorna o cliente HTTP de testes do Flask."""
    with app.test_client() as client:
        yield client


@pytest.fixture
def auth_headers(app, user):
    """Gera cabeçalhos JWT autenticados para um cliente."""

    with app.app_context():
        token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": "cliente",
            },
        )

    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def dispatcher_auth_headers(app, dispatcher_user):
    """Gera cabeçalhos JWT autenticados para um despachante."""
    with app.app_context():
        token = create_access_token(
            identity=str(dispatcher_user.id),
            additional_claims={
                "role": "despachante",
            },
        )

    return {"Authorization": f"Bearer {token}"}
