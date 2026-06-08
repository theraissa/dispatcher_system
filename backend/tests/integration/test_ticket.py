"""
Testes de integração das rotas de chamados (tickets).
"""

import uuid

import pytest

from tests.integration.conftest import build_ticket_payload, get_service_details_id

# ==========================================================
# GET TICKET
# ==========================================================


def test_get_ticket_by_id(client, auth_headers, created_ticket):
    """
    Deve retornar um chamado pelo ID.
    """
    ticket_id = created_ticket["response"]["id"]

    response = client.get(
        f"/api/dispatcher-system/ticket/{ticket_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["id"] == ticket_id
    assert "user" in body
    assert "dispatcher" in body
    assert "service_details" in body


def test_get_ticket_by_id_not_found(client, auth_headers):
    """
    Deve retornar 404 para chamado inexistente.
    """
    fake_id = uuid.uuid4().int % 100000
    response = client.get(
        f"/api/dispatcher-system/ticket/{fake_id}",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# LIST USER TICKETS
# ==========================================================


def test_list_user_tickets(client, auth_headers, created_ticket, user):
    """
    Deve listar chamados do usuário autenticado.
    """
    response = client.get(
        f"/api/dispatcher-system/ticket/user/{user.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body
    assert len(body["items"]) >= 1


def test_list_user_tickets_user_not_found(client, auth_headers):
    """
    Deve retornar 404 para usuário inexistente.
    """
    fake_id = uuid.uuid4().int % 100000
    response = client.get(
        f"/api/dispatcher-system/ticket/user/{fake_id}",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# CREATE TICKET
# ==========================================================


def test_create_ticket(client, auth_headers, created_dispatcher, associated_service):
    """
    Deve criar chamado com sucesso.
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
    assert "id" in body


def test_create_ticket_dispatcher_not_found(client, auth_headers, created_dispatcher, associated_service):
    """
    Deve retornar 404 para despachante inexistente.
    """
    dispatcher_id = created_dispatcher["dispatcher_id"]
    service_details_id = get_service_details_id(client, auth_headers, dispatcher_id)

    fake_dispatcher_id = uuid.uuid4().int % 100000
    payload = build_ticket_payload(
        dispatcher_id=fake_dispatcher_id,
        service_details_id=service_details_id,
    )
    response = client.post(
        "/api/dispatcher-system/ticket",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_ticket_service_not_found(client, auth_headers, created_dispatcher):
    """
    Deve retornar 404 para serviço inexistente.
    """
    payload = build_ticket_payload(
        dispatcher_id=created_dispatcher["dispatcher_id"],
        service_details_id=999999,
    )
    response = client.post(
        "/api/dispatcher-system/ticket",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# STATISTICS
# ==========================================================


def test_get_dispatcher_ticket_statistics(client, auth_headers, created_dispatcher):
    """
    Deve retornar estatísticas do despachante.
    """
    user_id = created_dispatcher["user_id"]

    response = client.get(
        f"/api/dispatcher-system/ticket/{user_id}/statistics",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "pending" in body
    assert "in_progress" in body
    assert "finished_month" in body
    assert "monthly_revenue" in body


def test_get_dispatcher_ticket_statistics_not_found(client, auth_headers):
    """
    Deve retornar 404 para despachante inexistente.
    """
    fake_id = uuid.uuid4().int % 100000

    response = client.get(
        f"/api/dispatcher-system/ticket/{fake_id}/statistics",
        headers=auth_headers,
    )

    assert response.status_code == 404


# ==========================================================
# AUTH
# ==========================================================


@pytest.mark.parametrize(
    "method, url",
    [
        ("get", "/api/dispatcher-system/ticket/1"),
        ("get", "/api/dispatcher-system/ticket/user/1"),
        ("post", "/api/dispatcher-system/ticket"),
        ("get", "/api/dispatcher-system/ticket/1/statistics"),
    ],
)
def test_ticket_routes_require_authentication(client, method, url):
    """
    Deve exigir autenticação JWT.
    """
    response = getattr(client, method)(url)

    assert response.status_code in [401, 422]
