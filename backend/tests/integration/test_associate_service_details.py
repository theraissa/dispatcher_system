"""
Testes de integração das rotas de associação entre despachantes e serviços.
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
    Gera payload de serviço.
    """
    suffix = uuid.uuid4().hex[:6]
    return {
        "name": f"Transferência {suffix}",
        "description": "Serviço de transferência",
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


# ==========================================================
# GET SERVICES FROM DISPATCHER
# ==========================================================


def test_get_services_from_dispatcher(client, auth_headers, associated_service):
    """
    Deve listar serviços do despachante.
    """
    dispatcher_id = associated_service["dispatcher_id"]

    response = client.get(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}/services",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body
    assert len(body["items"]) >= 1


# ==========================================================
# ADD SERVICE FOR DISPATCHER
# ==========================================================


def test_add_service_for_dispatcher(client, auth_headers, created_dispatcher, created_service):
    """
    Deve vincular serviço ao despachante.
    """
    dispatcher_id = created_dispatcher["dispatcher_id"]
    service_id = created_service["id"]

    response = client.post(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}/service/{service_id}",
        headers=auth_headers,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert body["message"] == "Serviço vinculado com sucesso!"


def test_add_service_for_dispatcher_duplicate(client, auth_headers, associated_service):
    """
    Deve impedir vínculo duplicado.
    """
    dispatcher_id = associated_service["dispatcher_id"]
    service_id = associated_service["service_id"]

    response = client.post(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}/service/{service_id}",
        headers=auth_headers,
    )
    assert response.status_code == 400


# ==========================================================
# UPDATE SERVICE DETAILS
# ==========================================================


def test_update_dispatcher_service(client, auth_headers, associated_service):
    """
    Deve atualizar preço do serviço associado.
    """
    dispatcher_id = associated_service["dispatcher_id"]
    service_id = associated_service["service_id"]

    payload = {
        "price": 350,
    }

    response = client.put(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}/service/{service_id}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["message"] == "Serviço detalhado atualizado com sucesso!"


def test_update_dispatcher_service_not_found(client, auth_headers):
    """
    Deve retornar 404 para vínculo inexistente.
    """
    payload = {
        "price": 100,
    }
    response = client.put(
        "/api/dispatcher-system/dispatcher/99999/service/99999",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# DELETE SERVICE DETAILS
# ==========================================================


def test_delete_dispatcher_service(client, auth_headers, associated_service):
    """
    Deve remover vínculo entre despachante e serviço.
    """
    dispatcher_id = associated_service["dispatcher_id"]
    service_id = associated_service["service_id"]

    response = client.delete(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}/service/{service_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["message"] == "Serviço desvinculado com sucesso!"


def test_delete_dispatcher_service_not_found(client, auth_headers):
    """
    Deve retornar 404 para vínculo inexistente.
    """
    response = client.delete(
        "/api/dispatcher-system/dispatcher/99999/service/99999",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# AUTH
# ==========================================================


@pytest.mark.parametrize(
    "method, url",
    [
        ("get", "/api/dispatcher-system/dispatcher/1/services"),
        ("post", "/api/dispatcher-system/dispatcher/1/service/1"),
        ("put", "/api/dispatcher-system/dispatcher/1/service/1"),
        ("delete", "/api/dispatcher-system/dispatcher/1/service/1"),
    ],
)
def test_dispatcher_service_routes_require_authentication(
    client,
    method,
    url,
):
    """
    Deve exigir autenticação JWT.
    """
    response = getattr(client, method)(url)

    assert response.status_code in [401, 422]
