"""
Testes de integração das rotas de timeline.
"""

import pytest

from models.ticket import TicketTimeline

# ==========================================================
# HELPERS
# ==========================================================


def build_timeline_payload(status, description="Atualização do chamado"):
    """
    Gera payload de timeline.
    """
    return {
        "status": status,
        "description": description,
    }


@pytest.fixture
def created_timeline(client, dispatcher_auth_headers, created_ticket):
    """
    Cria evento de timeline.
    """
    ticket_id = created_ticket["response"]["id"]

    payload = build_timeline_payload(
        status=TicketTimeline.EM_ANDAMENTO,
        description="Chamado iniciado",
    )
    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/timeline",
        json=payload,
        headers=dispatcher_auth_headers,
    )
    assert response.status_code == 201
    return response.get_json()


# ==========================================================
# TESTES
# ==========================================================


def test_list_timeline(client, auth_headers, created_ticket, created_timeline):
    """
    Deve listar eventos da timeline.
    """
    ticket_id = created_ticket["response"]["id"]

    response = client.get(
        f"/api/dispatcher-system/ticket/{ticket_id}/timeline",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert isinstance(body, list)
    assert len(body) >= 1


def test_list_timeline_not_found(client, auth_headers):
    """
    Deve retornar 404 para chamado inexistente.
    """
    response = client.get(
        "/api/dispatcher-system/ticket/999999/timeline",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_create_timeline(client, dispatcher_auth_headers, created_ticket):
    """
    Deve criar evento de timeline.
    """
    ticket_id = created_ticket["response"]["id"]

    payload = build_timeline_payload(
        status=TicketTimeline.EM_ANDAMENTO,
        description="Despachante iniciou atendimento",
    )

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/timeline",
        json=payload,
        headers=dispatcher_auth_headers,
    )

    assert response.status_code == 201

    body = response.get_json()

    assert body["ticket_id"] == ticket_id
    assert body["status"] == TicketTimeline.EM_ANDAMENTO


def test_create_timeline_requires_dispatcher(
    client,
    auth_headers,
    created_ticket,
):
    """
    Apenas despachantes podem criar timeline.
    """
    ticket_id = created_ticket["response"]["id"]

    payload = build_timeline_payload(
        status=TicketTimeline.EM_ANDAMENTO,
    )

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/timeline",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 403


def test_create_timeline_ticket_not_found(
    client,
    dispatcher_auth_headers,
):
    """
    Deve retornar 404 para chamado inexistente.
    """
    payload = build_timeline_payload(
        status=TicketTimeline.EM_ANDAMENTO,
    )

    response = client.post(
        "/api/dispatcher-system/ticket/999999/timeline",
        json=payload,
        headers=dispatcher_auth_headers,
    )

    assert response.status_code == 404


def test_create_timeline_same_status(
    client,
    dispatcher_auth_headers,
    created_ticket,
    created_timeline,
):
    """
    Não deve permitir mesmo status atual.
    """
    ticket_id = created_ticket["response"]["id"]

    payload = build_timeline_payload(
        status=TicketTimeline.EM_ANDAMENTO,
    )

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/timeline",
        json=payload,
        headers=dispatcher_auth_headers,
    )

    assert response.status_code == 400


def test_create_timeline_invalid_transition(
    client,
    dispatcher_auth_headers,
    created_ticket,
):
    """
    Deve impedir transição inválida.
    """
    ticket_id = created_ticket["response"]["id"]

    payload = build_timeline_payload(
        status=TicketTimeline.FINALIZADO,
    )

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/timeline",
        json=payload,
        headers=dispatcher_auth_headers,
    )

    assert response.status_code == 400


def test_create_timeline_full_flow(
    client,
    dispatcher_auth_headers,
    created_ticket,
):
    """
    Deve permitir fluxo completo do chamado.
    """
    ticket_id = created_ticket["response"]["id"]

    transitions = [
        TicketTimeline.EM_ANDAMENTO,
        TicketTimeline.FINALIZADO,
    ]

    for status in transitions:
        response = client.post(
            f"/api/dispatcher-system/ticket/{ticket_id}/timeline",
            json=build_timeline_payload(status=status),
            headers=dispatcher_auth_headers,
        )

        assert response.status_code == 201


# ==========================================================
# AUTH
# ==========================================================


@pytest.mark.parametrize(
    "method, url",
    [
        ("get", "/api/dispatcher-system/ticket/1/timeline"),
        ("post", "/api/dispatcher-system/ticket/1/timeline"),
    ],
)
def test_timeline_routes_require_authentication(
    client,
    method,
    url,
):
    """
    Deve exigir autenticação JWT.
    """
    response = getattr(client, method)(url)

    assert response.status_code in [401, 422]
