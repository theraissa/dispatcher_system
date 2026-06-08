"""
Testes de integração das rotas de avaliações (reviews).
"""

import pytest

# ==========================================================
# HELPERS
# ==========================================================


def build_review_payload(rating=5, comment="Excelente atendimento"):
    """
    Gera payload de avaliação.
    """
    return {
        "rating": rating,
        "comment": comment,
    }


@pytest.fixture
def created_review(client, auth_headers, finalized_ticket):
    """
    Cria uma avaliação.
    """
    ticket_id = finalized_ticket["response"]["id"]
    payload = build_review_payload()

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/review",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 201
    return response.get_json()


# ==========================================================
# TESTES
# ==========================================================


def test_create_review(client, auth_headers, finalized_ticket):
    """
    Deve criar avaliação com sucesso.
    """
    ticket_id = finalized_ticket["response"]["id"]
    payload = build_review_payload()

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/review",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert body["rating"] == 5
    assert body["comment"] == "Excelente atendimento"


def test_create_review_ticket_not_found(client, auth_headers):
    """
    Deve retornar 404 para chamado inexistente.
    """
    payload = build_review_payload()
    response = client.post(
        "/api/dispatcher-system/ticket/999999/review",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_review_ticket_not_finalized(client, auth_headers, created_ticket):
    """
    Deve impedir avaliação de chamado não finalizado.
    """
    ticket_id = created_ticket["response"]["id"]
    payload = build_review_payload()

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/review",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 400


@pytest.mark.parametrize("rating", [0, 6])
def test_create_review_invalid_rating(
    client,
    auth_headers,
    finalized_ticket,
    rating,
):
    """
    Deve impedir notas inválidas.
    """
    ticket_id = finalized_ticket["response"]["id"]
    payload = build_review_payload(rating=rating)

    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket_id}/review",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 400


def test_list_dispatcher_reviews(
    client,
    auth_headers,
    created_dispatcher,
    created_review,
):
    """
    Deve listar avaliações do despachante.
    """
    user_id = created_dispatcher["user_id"]

    response = client.get(
        f"/api/dispatcher-system/ticket/{user_id}/review",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert isinstance(body, list)
    assert len(body) >= 1


def test_get_dispatcher_review_summary(
    client,
    auth_headers,
    created_dispatcher,
    created_review,
):
    """
    Deve retornar resumo das avaliações.
    """
    user_id = created_dispatcher["user_id"]

    response = client.get(
        f"/api/dispatcher-system/ticket/{user_id}/review/summary",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "average_rating" in body
    assert "total_reviews" in body


def test_update_review(
    client,
    auth_headers,
    finalized_ticket,
    created_review,
):
    """
    Deve atualizar avaliação.
    """
    ticket_id = finalized_ticket["response"]["id"]
    review_id = created_review["id"]

    payload = {
        "rating": 4,
        "comment": "Bom atendimento",
    }
    response = client.put(
        f"/api/dispatcher-system/ticket/{ticket_id}/review/{review_id}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["rating"] == 4
    assert body["comment"] == "Bom atendimento"


def test_update_review_not_found(
    client,
    auth_headers,
    finalized_ticket,
):
    """
    Deve retornar 404 para avaliação inexistente.
    """
    ticket_id = finalized_ticket["response"]["id"]

    payload = {
        "rating": 4,
        "comment": "Atualizado",
    }

    response = client.put(
        f"/api/dispatcher-system/ticket/{ticket_id}/review/999999",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 404


# ==========================================================
# AUTH
# ==========================================================


@pytest.mark.parametrize(
    "method, url",
    [
        ("get", "/api/dispatcher-system/ticket/1/review"),
        ("get", "/api/dispatcher-system/ticket/1/review/summary"),
        ("post", "/api/dispatcher-system/ticket/1/review"),
    ],
)
def test_review_routes_require_authentication(client, method, url):
    """
    Deve exigir autenticação JWT.
    """
    response = getattr(client, method)(url)
    assert response.status_code in [401, 422]
