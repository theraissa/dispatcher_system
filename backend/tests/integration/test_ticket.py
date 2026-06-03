"""
Testes de integração das rotas de chamados.
"""

# ==========================================================
# TICKETS
# ==========================================================


def test_get_ticket(client, auth_headers, ticket):
    """Deve retornar um chamado pelo ID."""

    response = client.get(
        f"/api/dispatcher-system/ticket/{ticket.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["id"] == ticket.id


def test_get_ticket_not_found(client, auth_headers):
    """Deve retornar erro ao buscar chamado inexistente."""

    response = client.get(
        "/api/dispatcher-system/ticket/999999",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_list_user_tickets(client, auth_headers, user):
    """Deve listar os chamados do usuário."""

    response = client.get(
        f"/api/dispatcher-system/ticket/user/{user.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body


def test_list_user_tickets_user_not_found(client, auth_headers):
    """Deve retornar erro ao listar chamados de usuário inexistente."""

    response = client.get(
        "/api/dispatcher-system/ticket/user/999999",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_ticket(client, auth_headers, dispatcher, service_details):
    """Deve criar um novo chamado."""

    payload = {
        "dispatcher_id": dispatcher.id,
        "service_details_id": service_details.id,
    }
    response = client.post(
        "/api/dispatcher-system/ticket",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 201


def test_create_ticket_dispatcher_not_found(client, auth_headers, service_details):
    """Deve retornar erro ao informar despachante inexistente."""

    payload = {
        "dispatcher_id": 999999,
        "service_details_id": service_details.id,
    }
    response = client.post(
        "/api/dispatcher-system/ticket",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_ticket_service_not_found(client, auth_headers, dispatcher):
    """Deve retornar erro ao informar serviço inexistente."""

    payload = {
        "dispatcher_id": dispatcher.id,
        "service_details_id": 999999,
    }
    response = client.post(
        "/api/dispatcher-system/ticket",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# ESTATÍSTICAS
# ==========================================================


def test_get_dispatcher_ticket_statistics(client, auth_headers, dispatcher_user):
    """Deve retornar estatísticas do despachante."""

    response = client.get(
        f"/api/dispatcher-system/ticket/{dispatcher_user.id}/statistics",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "pending" in body
    assert "in_progress" in body
    assert "finished_month" in body
    assert "monthly_revenue" in body


def test_get_dispatcher_ticket_statistics_not_found(client, auth_headers):
    """Deve retornar erro para despachante inexistente."""

    response = client.get(
        "/api/dispatcher-system/ticket/999999/statistics",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# MENSAGENS
# ==========================================================


def test_list_messages(client, auth_headers, ticket):
    """Deve listar mensagens do chamado."""

    response = client.get(
        f"/api/dispatcher-system/ticket/{ticket.id}/messages",
        headers=auth_headers,
    )
    assert response.status_code == 200


def test_list_messages_ticket_not_found(client, auth_headers):
    """Deve retornar erro ao listar mensagens de chamado inexistente."""

    response = client.get(
        "/api/dispatcher-system/ticket/999999/messages",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_message(client, auth_headers, ticket):
    """Deve criar uma nova mensagem."""

    payload = {"message": "Mensagem de teste"}
    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket.id}/messages",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 201


def test_create_message_empty(client, auth_headers, ticket):
    """Deve impedir mensagem vazia."""

    payload = {"message": ""}
    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket.id}/messages",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 400


# ==========================================================
# REVIEWS
# ==========================================================


def test_list_dispatcher_reviews(client, auth_headers, dispatcher_user):
    """Deve listar avaliações do despachante."""

    response = client.get(
        f"/api/dispatcher-system/ticket/{dispatcher_user.id}/review",
        headers=auth_headers,
    )
    assert response.status_code == 200


def test_get_dispatcher_review_summary(client, auth_headers, dispatcher_user):
    """Deve retornar resumo das avaliações."""

    response = client.get(
        f"/api/dispatcher-system/ticket/{dispatcher_user.id}/review/summary",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "average_rating" in body
    assert "total_reviews" in body


def test_create_review(client, auth_headers, finished_ticket):
    """Deve criar uma avaliação."""

    payload = {
        "rating": 5,
        "comment": "Excelente atendimento",
    }
    response = client.post(
        f"/api/dispatcher-system/ticket/{finished_ticket.id}/review",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 201


def test_create_review_invalid_rating(client, auth_headers, finished_ticket):
    """Deve impedir avaliação fora do intervalo permitido."""

    payload = {
        "rating": 10,
        "comment": "Inválido",
    }
    response = client.post(
        f"/api/dispatcher-system/ticket/{finished_ticket.id}/review",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 400


def test_update_review(client, auth_headers, review):
    """Deve atualizar uma avaliação."""

    payload = {
        "rating": 4,
        "comment": "Atualizada",
    }
    response = client.put(
        f"/api/dispatcher-system/ticket/{review.ticket_id}/review/{review.id}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200


# ==========================================================
# TIMELINE
# ==========================================================


def test_list_timeline(client, auth_headers, ticket):
    """Deve listar a timeline do chamado."""

    response = client.get(
        f"/api/dispatcher-system/ticket/{ticket.id}/timeline",
        headers=auth_headers,
    )
    assert response.status_code == 200


def test_list_timeline_not_found(client, auth_headers):
    """Deve retornar erro para chamado inexistente."""
    response = client.get(
        "/api/dispatcher-system/ticket/999999/timeline",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_timeline(client, dispatcher_auth_headers, ticket):
    """Deve criar um evento na timeline."""

    payload = {
        "status": "em_andamento",
        "description": "Chamado aceito",
    }
    response = client.post(
        f"/api/dispatcher-system/ticket/{ticket.id}/timeline",
        json=payload,
        headers=dispatcher_auth_headers,
    )
    assert response.status_code == 201
