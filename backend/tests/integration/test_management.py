"""
Testes de integração das rotas administrativas.
"""

# ==========================================================
# GESTÃO DE DESPACHANTES
# ==========================================================


def test_list_dispatchers_pending(client):
    """Deve listar despachantes pendentes de aprovação."""

    response = client.get(
        "/api/dispatcher-system/admin/dispatchers",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert isinstance(body, list)


def test_update_dispatcher_status(client, dispatcher):
    """Deve atualizar o status de um despachante."""

    payload = {
        "status": "APROVADO",
    }
    response = client.put(
        f"/api/dispatcher-system/admin/dispatcher/{dispatcher.id}/status",
        json=payload,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "message" in body


def test_update_dispatcher_status_not_found(client):
    """Deve retornar erro ao atualizar despachante inexistente."""

    payload = {
        "status": "APROVADO",
    }
    response = client.put(
        "/api/dispatcher-system/admin/dispatcher/999999/status",
        json=payload,
    )
    assert response.status_code == 404


# ==========================================================
# CATÁLOGO DE SERVIÇOS
# ==========================================================


def test_list_services(client):
    """Deve listar os serviços cadastrados."""

    response = client.get(
        "/api/dispatcher-system/admin/service",
    )
    assert response.status_code == 200

    body = response.get_json()
    # ListServiceCatalogResponse.model_dump()
    assert isinstance(body, list)


def test_create_service(client):
    """Deve criar um novo serviço."""

    payload = {
        "name": "Transferência de Veículo",
        "description": "Serviço de transferência",
    }
    response = client.post(
        "/api/dispatcher-system/admin/service",
        json=payload,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert body["name"] == payload["name"]


def test_update_service(client, service):
    """Deve atualizar um serviço existente."""

    payload = {
        "name": "Serviço Atualizado",
        "description": "Descrição Atualizada",
    }
    response = client.put(
        f"/api/dispatcher-system/admin/service/{service.id}",
        json=payload,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["name"] == payload["name"]


def test_update_service_not_found(client):
    """Deve retornar erro ao atualizar serviço inexistente."""

    payload = {
        "name": "Serviço Atualizado",
        "description": "Descrição Atualizada",
    }
    response = client.put(
        "/api/dispatcher-system/admin/service/999999",
        json=payload,
    )
    assert response.status_code == 404


def test_delete_service(client, service):
    """Deve remover logicamente um serviço."""

    response = client.delete(
        f"/api/dispatcher-system/admin/service/{service.id}",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["id"] == service.id


def test_delete_service_not_found(client):
    """Deve retornar erro ao remover serviço inexistente."""

    response = client.delete(
        "/api/dispatcher-system/admin/service/999999",
    )
    assert response.status_code == 404
