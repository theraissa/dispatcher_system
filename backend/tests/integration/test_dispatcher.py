"""
Testes de integração das rotas de despachantes.
"""

import pytest

# ==========================================================
# DESPACHANTES
# ==========================================================


def test_list_dispatchers(client):
    """Deve listar os despachantes cadastrados."""

    response = client.get("/api/dispatcher-system/dispatcher")
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body


def test_get_dispatcher_by_id(client, auth_headers, dispatcher):
    """Deve retornar um despachante pelo ID."""

    response = client.get(
        f"/api/dispatcher-system/dispatcher/{dispatcher.user_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["user"]["id"] == dispatcher.user_id


def test_get_dispatcher_by_id_not_found(client, auth_headers):
    """Deve retornar erro ao buscar despachante inexistente."""
    response = client.get(
        "/api/dispatcher-system/dispatcher/999999",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_dispatcher(client):
    """Deve criar um novo despachante."""
    payload = {
        "user": {
            "cpf": "12345678901",
            "name": "João Silva",
            "date_birth": "1990-01-01",
            "contact": "51999999999",
            "email": "joao@email.com",
            "password": "123456",
        },
        "address": {
            "contact": "51999999999",
            "number": 100,
            "neighborhood": "Centro",
            "address": "Rua Principal",
            "city": "Sapiranga",
            "state": "RS",
            "zip_code": "93800000",
        },
        "dispatcher": {
            "regis_crdd": "CRDD123",
            "date_exp_regis": "2030-01-01",
        },
    }
    response = client.post(
        "/api/dispatcher-system/dispatcher",
        json=payload,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert "user_id" in body
    assert "dispatcher_id" in body
    assert "address_id" in body


def test_create_dispatcher_duplicate_cpf(client, dispatcher_full_payload):
    """Deve retornar erro ao cadastrar CPF já existente."""
    response = client.post(
        "/api/dispatcher-system/dispatcher",
        json=dispatcher_full_payload,
    )
    assert response.status_code == 400


def test_update_dispatcher(client, auth_headers, dispatcher):
    """Deve atualizar os dados de um despachante."""
    payload = {"user": {"name": "Nome Atualizado"}}
    response = client.put(
        f"/api/dispatcher-system/dispatcher/{dispatcher.user_id}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["message"] == "Perfil do despachante atualizado com sucesso!"


def test_delete_dispatcher(client, auth_headers, dispatcher):
    """Deve remover logicamente um despachante."""

    response = client.delete(
        f"/api/dispatcher-system/dispatcher/{dispatcher.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["id"] == dispatcher.id


# ==========================================================
# BUSCA
# ==========================================================


def test_search_dispatchers(client, auth_headers):
    """Deve realizar busca de despachantes."""

    response = client.get(
        "/api/dispatcher-system/dispatcher/search?name=João",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body


# ==========================================================
# SERVIÇOS DO DESPACHANTE
# ==========================================================


def test_get_services_from_dispatcher(client, auth_headers, dispatcher_service_relation):
    """Deve listar os serviços vinculados ao despachante."""

    response = client.get(
        f"/api/dispatcher-system/dispatcher/{dispatcher_service_relation.dispatcher_id}/services",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body


def test_add_service_for_dispatcher(client, auth_headers, dispatcher, service):
    """Deve vincular um serviço ao despachante."""

    response = client.post(
        f"/api/dispatcher-system/dispatcher/{dispatcher.id}/service/{service.id}",
        headers=auth_headers,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert body["message"] == "Serviço vinculado com sucesso!"


def test_add_service_for_dispatcher_duplicate(client, auth_headers, dispatcher_service_relation):
    """Deve impedir vínculo duplicado de serviço."""

    response = client.post(
        (
            f"/api/dispatcher-system/dispatcher/"
            f"{dispatcher_service_relation.dispatcher_id}/service/"
            f"{dispatcher_service_relation.service_id}"
        ),
        headers=auth_headers,
    )
    assert response.status_code == 400


def test_update_dispatcher_service_details(client, auth_headers, dispatcher_service_relation):
    """Deve atualizar os dados do serviço vinculado."""

    payload = {
        "price": 150.0,
    }
    response = client.put(
        (
            f"/api/dispatcher-system/dispatcher/"
            f"{dispatcher_service_relation.dispatcher_id}/service/"
            f"{dispatcher_service_relation.service_id}"
        ),
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["message"] == "Serviço detalhado atualizado com sucesso!"


def test_update_dispatcher_service_details_not_found(client, auth_headers):
    """Deve retornar erro ao atualizar vínculo inexistente."""

    response = client.put(
        "/api/dispatcher-system/dispatcher/999999/service/999999",
        json={"price": 100},
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_delete_dispatcher_service_details(client, auth_headers, dispatcher_service_relation):
    """Deve remover o vínculo entre serviço e despachante."""

    response = client.delete(
        (
            f"/api/dispatcher-system/dispatcher/"
            f"{dispatcher_service_relation.dispatcher_id}/service/"
            f"{dispatcher_service_relation.service_id}"
        ),
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["message"] == "Serviço desvinculado com sucesso!"


def test_delete_dispatcher_service_details_not_found(client, auth_headers):
    """Deve retornar erro ao remover vínculo inexistente."""

    response = client.delete(
        "/api/dispatcher-system/dispatcher/999999/service/999999",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# AUTENTICAÇÃO
# ==========================================================


@pytest.mark.parametrize(
    "method,url",
    [
        ("get", "/api/dispatcher-system/dispatcher/1"),
        ("put", "/api/dispatcher-system/dispatcher/1"),
        ("delete", "/api/dispatcher-system/dispatcher/1"),
        ("get", "/api/dispatcher-system/dispatcher/search"),
        ("get", "/api/dispatcher-system/dispatcher/1/services"),
        ("post", "/api/dispatcher-system/dispatcher/1/service/1"),
        ("put", "/api/dispatcher-system/dispatcher/1/service/1"),
        ("delete", "/api/dispatcher-system/dispatcher/1/service/1"),
    ],
)
def test_protected_routes_require_authentication(client, method, url):
    """Deve exigir autenticação nas rotas protegidas."""

    response = getattr(client, method)(url)
    assert response.status_code == 401
