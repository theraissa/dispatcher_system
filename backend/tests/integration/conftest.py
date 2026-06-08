"""Módulo com fixtures para testes de integração"""

import uuid

import pytest
from flask_jwt_extended import create_access_token

from app import create_app
from database import db
from database.tables import AddressDB, TicketDB, UserDB
from models.ticket import TicketTimeline


@pytest.fixture(scope="session")
def app():
    """Cria a aplicação Flask para testes."""
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY="test-secret-key-must-be-long-enough-32-chars",
    )

    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    """Retorna o cliente HTTP de testes do Flask."""
    return app.test_client()


@pytest.fixture
def db_session(app):
    """
    Retorna uma sessão de banco de dados com transação isolada.
    Cada teste roda em uma transação que é revertida ao final.
    """
    with app.app_context():
        # Inicia uma transação
        connection = db.engine.connect()
        transaction = connection.begin()

        # Vincula a sessão à conexão da transação
        session = db.session
        session.configure(bind=connection)

        yield session

        # Reverte a transação - isso desfaz TODAS as mudanças do teste
        transaction.rollback()
        connection.close()
        session.remove()


@pytest.fixture
def user(db_session):
    """Cria um usuário comum para autenticação."""
    user = UserDB(
        cpf=str(uuid.uuid4().int)[:11],
        name="Usuário Teste",
        date_birth="1995-01-01",
        contact="51999999999",
        email=f"{uuid.uuid4().hex}@email.com",
        password="senha_hash_aqui",
    )
    db_session.add(user)
    db_session.flush()

    address = AddressDB(
        user_id=user.id,
        contact="51999999999",
        address="Rua Teste",
        number=123,
        neighborhood="Bairro Teste",
        city="Cidade Teste",
        state="Estado Teste",
        zip_code="99999-999",
    )

    db_session.add(address)
    db_session.commit()
    return user


@pytest.fixture
def dispatcher_user(db_session):
    """Cria um usuário despachante para autenticação."""
    user = UserDB(
        cpf=str(uuid.uuid4().int)[:11],
        name="Despachante Teste",
        date_birth="1990-01-01",
        contact="51888888888",
        email=f"dispatcher_{uuid.uuid4().hex}@email.com",
        password="senha_hash_aqui",
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


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


@pytest.fixture
def user_payload():
    """Retorna um payload válido para criação de usuário."""
    unique = uuid.uuid4().hex[:8]
    return {
        "cpf": f"1234567{unique[:4]}",
        "name": "Usuário Teste",
        "date_birth": "1995-01-01",
        "contact": "51999999999",
        "email": f"usuario_{unique}@email.com",
        "password": "123456",
    }


# ==========================================================
# HELPERS
# ==========================================================


def build_ticket_payload(dispatcher_id, service_details_id):
    """
    Gera payload para criação de chamado.
    """
    return {
        "dispatcher_id": dispatcher_id,
        "service_details_id": service_details_id,
    }


def build_dispatcher_payload():
    """
    Gera payload único para criação de despachante.
    """
    suffix = uuid.uuid4().hex[:6]

    return {
        "user": {
            "cpf": uuid.uuid4().hex[:11],
            "name": f"Dispatcher {suffix}",
            "email": f"dispatcher+{suffix}@gmail.com",
            "password": "123456",
            "contact": "51999999999",
            "date_birth": "1990-01-01",
        },
        "dispatcher": {
            "regis_crdd": f"CRDD-{suffix}",
            "date_exp_regis": "2030-01-01",
        },
        "address": {
            "contact": "51999999999",
            "address": "Rua Dispatcher",
            "number": 100,
            "neighborhood": "Centro",
            "city": "Sapiranga",
            "state": "RS",
            "zip_code": "93800-000",
        },
    }


@pytest.fixture
def created_dispatcher(client):
    """
    Cria despachante via HTTP.
    """
    payload = build_dispatcher_payload()

    response = client.post(
        "/api/dispatcher-system/dispatcher",
        json=payload,
    )
    assert response.status_code == 201
    return response.get_json()


def build_service_payload():
    """
    Gera payload de serviço.
    """
    suffix = uuid.uuid4().hex[:6]
    return {
        "name": f"Transferência {suffix}",
        "description": "Serviço de transferência",
    }


@pytest.fixture
def created_service(client, auth_headers):
    """
    Cria serviço via HTTP.
    """
    payload = build_service_payload()
    response = client.post(
        "/api/dispatcher-system/admin/service",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 201
    return response.get_json()


@pytest.fixture
def associated_service(client, auth_headers, created_dispatcher, created_service):
    """
    Associa serviço ao despachante.
    """
    dispatcher_id = created_dispatcher["dispatcher_id"]
    service_id = created_service["id"]

    response = client.post(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}/service/{service_id}",
        headers=auth_headers,
    )
    assert response.status_code == 201

    return {
        "dispatcher_id": dispatcher_id,
        "service_id": service_id,
    }


def get_service_details_id(client, auth_headers, dispatcher_id):
    """
    Busca os serviços detalhados do despachante.
    """
    response = client.get(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}/services",
        headers=auth_headers,
    )
    assert response.status_code == 200
    services_body = response.get_json()

    assert "items" in services_body
    assert len(services_body["items"]) >= 1

    return services_body["items"][0]["id"]


@pytest.fixture
def created_ticket(
    client,
    auth_headers,
    created_dispatcher,
    created_service,
    associated_service,
):
    """
    Cria um chamado via rota HTTP.
    """
    dispatcher_id = created_dispatcher["dispatcher_id"]
    service_details_id = get_service_details_id(client, auth_headers, dispatcher_id)

    payload = build_ticket_payload(
        dispatcher_id=dispatcher_id,
        service_details_id=service_details_id,
    )
    response = client.post(
        "/api/dispatcher-system/ticket",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 201

    body = response.get_json()
    return {
        "payload": payload,
        "response": body,
    }


@pytest.fixture
def finalized_ticket(
    client,
    auth_headers,
    created_ticket,
    db_session,
):
    """
    Finaliza um chamado para permitir avaliação.
    """
    ticket_id = created_ticket["response"]["id"]
    ticket = db_session.get(TicketDB, ticket_id)
    ticket.status = TicketTimeline.FINALIZADO.value

    db_session.commit()

    return created_ticket
