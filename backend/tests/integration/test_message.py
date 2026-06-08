"""
Testes de integração das rotas de mensagens dos chamados.
"""

import uuid

import pytest

# ==========================================================
# HELPERS
# ==========================================================


def build_message_payload(message="Mensagem de teste"):
    """
    Gera payload de mensagem.
    """
    return {"message": message}


# ==========================================================
# CREATE MESSAGE
# ==========================================================


def test_create_message(client, auth_headers, created_ticket):
    """
    Deve criar uma mensagem para o chamado.
    """
    ticket_id = created_ticket["response"]["id"]

    payload = build_message_payload()

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/messages",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 201

    body = response.get_json()

    assert "id" in body
    assert body["message"] == payload["message"]


def test_create_message_ticket_not_found(client, auth_headers):
    """
    Deve retornar 404 para chamado inexistente.
    """
    fake_id = uuid.uuid4().int % 100000

    payload = build_message_payload()

    response = client.post(
        f"/api/dispatcher-system/ticket/{fake_id}/messages",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_create_message_empty_message(client, auth_headers, created_ticket):
    """
    Deve retornar 400 para mensagem vazia.
    """
    ticket_id = created_ticket["response"]["id"]

    payload = build_message_payload(message=" ")

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/messages",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 400


# ==========================================================
# LIST MESSAGES
# ==========================================================


def test_list_messages_by_ticket_id(client, auth_headers, created_ticket):
    """
    Deve listar mensagens do chamado.
    """
    ticket_id = created_ticket["response"]["id"]

    # cria uma mensagem antes
    client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/messages",
        json=build_message_payload(),
        headers=auth_headers,
    )

    response = client.get(
        f"/api/dispatcher-system/ticket/{ticket_id}/messages",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.get_json()

    assert isinstance(body, list)
    assert len(body) >= 1
    assert "message" in body[0]


def test_list_messages_ticket_not_found(client, auth_headers):
    """
    Deve retornar 404 para chamado inexistente.
    """
    fake_id = uuid.uuid4().int % 100000

    response = client.get(
        f"/api/dispatcher-system/ticket/{fake_id}/messages",
        headers=auth_headers,
    )

    assert response.status_code == 404


# ==========================================================
# AUTH
# ==========================================================


@pytest.mark.parametrize(
    "method, url",
    [
        ("get", "/api/dispatcher-system/ticket/1/messages"),
        ("post", "/api/dispatcher-system/ticket/1/messages"),
    ],
)
def test_message_routes_require_authentication(client, method, url):
    """
    Deve exigir autenticação JWT.
    """
    response = getattr(client, method)(
        url,
        json=build_message_payload(),
    )

    assert response.status_code in [401, 422]
