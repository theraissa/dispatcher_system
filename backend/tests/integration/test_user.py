"""
Testes de integração das rotas de usuários.
"""

import io
import json

import pytest

# ==========================================================
# USUÁRIOS
# ==========================================================


def test_list_users(client, auth_headers):
    """Deve listar os usuários cadastrados."""

    response = client.get(
        "/api/dispatcher-system/user",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert "items" in body


def test_get_user_by_id(client, auth_headers, user):
    """Deve retornar um usuário pelo ID."""

    response = client.get(
        f"/api/dispatcher-system/user/{user.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["user"]["id"] == user.id


def test_get_user_by_id_not_found(client, auth_headers):
    """Deve retornar erro ao buscar usuário inexistente."""

    response = client.get(
        "/api/dispatcher-system/user/999999",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_create_user(client):
    """Deve criar um novo usuário."""

    payload = {
        "cpf": "12345678901",
        "name": "Usuário Teste",
        "date_birth": "1995-01-01",
        "contact": "51999999999",
        "email": "usuario@email.com",
        "password": "123456",
    }
    response = client.post(
        "/api/dispatcher-system/user",
        json=payload,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert body["email"] == payload["email"]


def test_create_user_duplicate_cpf(client, user_payload):
    """Deve impedir cadastro com CPF já existente."""

    response = client.post(
        "/api/dispatcher-system/user",
        json=user_payload,
    )
    assert response.status_code == 400


def test_update_user(client, auth_headers, user):
    """Deve atualizar os dados de um usuário."""

    payload = {
        "user": {
            "name": "Nome Atualizado",
        }
    }
    response = client.put(
        f"/api/dispatcher-system/user/{user.id}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["user"]["name"] == "Nome Atualizado"


def test_update_user_with_address(client, auth_headers, user):
    """Deve atualizar os dados de endereço do usuário."""

    payload = {
        "address": {
            "address": "Rua Atualizada",
            "number": 123,
            "city": "Sapiranga",
            "state": "RS",
            "neighborhood": "Centro",
            "zip_code": "93800000",
        }
    }
    response = client.put(
        f"/api/dispatcher-system/user/{user.id}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200


def test_update_user_not_found(client, auth_headers):
    """Deve retornar erro ao atualizar usuário inexistente."""

    response = client.put(
        "/api/dispatcher-system/user/999999",
        json={"user": {"name": "Teste"}},
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_delete_user(client, auth_headers, user):
    """Deve remover logicamente um usuário."""

    response = client.delete(
        f"/api/dispatcher-system/user/{user.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["id"] == user.id


def test_delete_user_not_found(client, auth_headers):
    """Deve retornar erro ao remover usuário inexistente."""

    response = client.delete(
        "/api/dispatcher-system/user/999999",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# PERFIL PÚBLICO
# ==========================================================


def test_update_user_profile(client, auth_headers, user):
    """Deve atualizar os dados públicos do usuário."""

    payload = {
        "instagram": "@usuario",
        "website": "https://site.com",
    }
    response = client.put(
        f"/api/dispatcher-system/user/{user.id}/profile",
        data={"data": json.dumps(payload)},
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["instagram"] == "@usuario"


def test_update_user_profile_with_photo(client, auth_headers, user):
    """Deve atualizar o perfil com foto."""

    image = io.BytesIO(b"fake-image-content")

    response = client.put(
        f"/api/dispatcher-system/user/{user.id}/profile",
        data={
            "data": json.dumps(
                {
                    "instagram": "@usuario",
                }
            ),
            "photo": (image, "photo.jpg"),
        },
        headers=auth_headers,
        content_type="multipart/form-data",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["photo"] is not None


def test_update_user_profile_invalid_file(client, auth_headers, user):
    """Deve impedir upload de arquivo inválido."""

    invalid_file = io.BytesIO(b"arquivo")

    response = client.put(
        f"/api/dispatcher-system/user/{user.id}/profile",
        data={
            "data": json.dumps({}),
            "photo": (invalid_file, "arquivo.pdf"),
        },
        headers=auth_headers,
        content_type="multipart/form-data",
    )

    assert response.status_code == 400


def test_update_user_profile_not_found(client, auth_headers):
    """Deve retornar erro ao atualizar perfil inexistente."""

    response = client.put(
        "/api/dispatcher-system/user/999999/profile",
        data={"data": json.dumps({})},
        headers=auth_headers,
    )

    assert response.status_code == 404


# ==========================================================
# AUTENTICAÇÃO
# ==========================================================


@pytest.mark.parametrize(
    "method,url",
    [
        ("get", "/api/dispatcher-system/user"),
        ("get", "/api/dispatcher-system/user/1"),
        ("put", "/api/dispatcher-system/user/1"),
        ("put", "/api/dispatcher-system/user/1/profile"),
        ("delete", "/api/dispatcher-system/user/1"),
    ],
)
def test_protected_routes_require_authentication(client, method, url):
    """Deve exigir autenticação nas rotas protegidas."""

    response = getattr(client, method)(url)

    assert response.status_code == 401
