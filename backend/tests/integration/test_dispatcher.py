"""
Testes de integração das rotas de despachantes.
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


@pytest.fixture
def created_dispatcher(client):
    """
    Cria despachante via rota HTTP.
    """
    payload = build_dispatcher_payload()

    response = client.post(
        "/api/dispatcher-system/dispatcher",
        json=payload,
    )

    assert response.status_code == 201

    body = response.get_json()

    return {
        "payload": payload,
        "response": body,
    }


# ==========================================================
# LIST DISPATCHERS
# ==========================================================


def test_list_dispatchers(client, created_dispatcher):
    """
    Deve listar despachantes cadastrados.
    """
    response = client.get(
        "/api/dispatcher-system/dispatcher",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body
    assert len(body["items"]) >= 1


# ==========================================================
# GET DISPATCHER
# ==========================================================


def test_get_dispatcher_by_id(client, auth_headers, created_dispatcher):
    """
    Deve retornar despachante pelo ID.
    """
    dispatcher_id = created_dispatcher["response"]["dispatcher_id"]

    response = client.get(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["dispatcher"]["id"] == dispatcher_id


def test_get_dispatcher_by_id_not_found(client, auth_headers):
    """
    Deve retornar 404 para despachante inexistente.
    """
    fake_id = uuid.uuid4().int % 100000
    response = client.get(
        f"/api/dispatcher-system/dispatcher/{fake_id}",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# CREATE DISPATCHER
# ==========================================================


def test_create_dispatcher(client):
    """
    Deve criar despachante com sucesso.
    """
    payload = build_dispatcher_payload()

    response = client.post(
        "/api/dispatcher-system/dispatcher",
        json=payload,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert "dispatcher_id" in body
    assert "user_id" in body
    assert "address_id" in body


def test_create_dispatcher_duplicate_email(client, created_dispatcher):
    """
    Deve impedir criação com email duplicado.
    """
    payload = build_dispatcher_payload()

    payload["user"]["email"] = created_dispatcher["payload"]["user"]["email"]

    response = client.post(
        "/api/dispatcher-system/dispatcher",
        json=payload,
    )
    assert response.status_code == 400


# ==========================================================
# UPDATE DISPATCHER
# ==========================================================


def test_update_dispatcher(client, auth_headers, created_dispatcher):
    """
    Deve atualizar dados do despachante.
    """
    user_id = created_dispatcher["response"]["user_id"]
    payload = {
        "user": {
            "name": "Novo Nome Dispatcher",
        },
        "dispatcher": {
            "regis_crdd": f"CRDD-UPDATED-{uuid.uuid4()}",
        },
        "address": {
            "city": "Novo Hamburgo",
        },
    }
    response = client.put(
        f"/api/dispatcher-system/dispatcher/{user_id}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["message"] == "Perfil do despachante atualizado com sucesso!"


# ==========================================================
# DELETE DISPATCHER
# ==========================================================


def test_delete_dispatcher(client, auth_headers, created_dispatcher):
    """
    Deve realizar soft delete do despachante.
    """
    dispatcher_id = created_dispatcher["response"]["dispatcher_id"]

    response = client.delete(
        f"/api/dispatcher-system/dispatcher/{dispatcher_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["id"] == dispatcher_id
    assert body["deleted_at"] is not None


# ==========================================================
# SEARCH DISPATCHERS
# ==========================================================


def test_search_dispatchers_by_city(client, auth_headers, created_dispatcher):
    """
    Deve buscar despachantes por cidade.
    """
    response = client.get(
        "/api/dispatcher-system/dispatcher/search?city=Sapiranga",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body
    assert len(body["items"]) >= 1


# ==========================================================
# AUTH
# ==========================================================


@pytest.mark.parametrize(
    "method, url",
    [
        ("get", "/api/dispatcher-system/dispatcher/1"),
        ("put", "/api/dispatcher-system/dispatcher/1"),
        ("delete", "/api/dispatcher-system/dispatcher/1"),
        ("get", "/api/dispatcher-system/dispatcher/search"),
    ],
)
def test_dispatcher_routes_require_authentication(client, method, url):
    """
    Deve exigir autenticação JWT.
    """
    response = getattr(client, method)(url)
    assert response.status_code in [401, 422]
