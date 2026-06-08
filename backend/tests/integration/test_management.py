"""
Testes de integração das rotas administrativas.
"""

import uuid

import pytest

# ==========================================================
# HELPERS
# ==========================================================


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


def build_service_payload():
    """
    Gera payload único para serviço.
    """
    suffix = uuid.uuid4().hex[:6]
    return {
        "name": f"Serviço {suffix}",
        "description": "Descrição do serviço",
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


@pytest.fixture
def created_service(client):
    """
    Cria serviço via HTTP.
    """
    payload = build_service_payload()
    response = client.post(
        "/api/dispatcher-system/admin/service",
        json=payload,
    )
    assert response.status_code == 201

    return {
        "payload": payload,
        "response": response.get_json(),
    }


# ==========================================================
# ADMIN - DISPATCHERS
# ==========================================================


def test_list_dispatchers(client, created_dispatcher):
    """
    Deve listar despachantes pendentes.
    """
    response = client.get(
        "/api/dispatcher-system/admin/dispatchers",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert isinstance(body, list)
    assert len(body) >= 1


def test_update_dispatcher_status(client, created_dispatcher):
    """
    Deve atualizar status do despachante.
    """
    dispatcher_id = created_dispatcher["dispatcher_id"]

    payload = {
        "status": "APROVADO",
    }
    response = client.put(
        f"/api/dispatcher-system/admin/dispatcher/{dispatcher_id}/status",
        json=payload,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["message"] == "Despachante APROVADO com sucesso"


def test_update_dispatcher_status_not_found(client):
    """
    Deve retornar 404 para despachante inexistente.
    """
    payload = {
        "status": "APROVADO",
    }
    response = client.put(
        "/api/dispatcher-system/admin/dispatcher/99999/status",
        json=payload,
    )
    assert response.status_code == 404


# ==========================================================
# ADMIN - SERVICE CATALOG
# ==========================================================


def test_list_services(client, created_service):
    """
    Deve listar serviços cadastrados.
    """
    response = client.get(
        "/api/dispatcher-system/admin/service",
    )
    assert response.status_code == 200

    body = response.get_json()

    assert isinstance(body, list)
    assert len(body) >= 1


def test_create_service(client):
    """
    Deve criar serviço com sucesso.
    """
    payload = build_service_payload()

    response = client.post(
        "/api/dispatcher-system/admin/service",
        json=payload,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert body["name"] == payload["name"]
    assert body["description"] == payload["description"]
    assert "id" in body


def test_update_service(client, created_service):
    """
    Deve atualizar serviço.
    """
    service_id = created_service["response"]["id"]

    payload = {
        "name": "Novo Serviço",
        "description": "Nova descrição",
    }
    response = client.put(
        f"/api/dispatcher-system/admin/service/{service_id}",
        json=payload,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["name"] == payload["name"]
    assert body["description"] == payload["description"]


def test_update_service_not_found(client):
    """
    Deve retornar 404 para serviço inexistente.
    """
    payload = {
        "name": "Novo Serviço",
        "description": "Nova descrição",
    }
    response = client.put(
        "/api/dispatcher-system/admin/service/99999",
        json=payload,
    )
    assert response.status_code == 404


def test_delete_service(client, created_service):
    """
    Deve realizar soft delete do serviço.
    """
    service_id = created_service["response"]["id"]

    response = client.delete(
        f"/api/dispatcher-system/admin/service/{service_id}",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["id"] == service_id
    assert body["deleted_at"] is not None


def test_delete_service_not_found(client):
    """
    Deve retornar 404 para serviço inexistente.
    """
    response = client.delete(
        "/api/dispatcher-system/admin/service/99999",
    )
    assert response.status_code == 404
