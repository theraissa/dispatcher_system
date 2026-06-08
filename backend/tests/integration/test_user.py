"""
Testes de integração das rotas de usuários.
"""

import io
import json
import uuid

import pytest


def test_list_users(client, auth_headers):
    """
    Deve listar usuários ativos cadastrados no sistema.
    """
    response = client.get(
        "/api/dispatcher-system/user",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()

    assert "items" in body
    assert len(body["items"]) >= 1


# ==========================================================
# BUSCA POR ID
# ==========================================================


def test_get_user_by_id(client, auth_headers, created_user):
    """
    Deve retornar os dados completos de um usuário pelo ID.
    """
    response = client.get(
        f"/api/dispatcher-system/user/{created_user["id"]}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["user"]["id"] == created_user["id"]
    assert body["user"]["email"] == created_user["email"]


def test_get_user_by_id_not_found(client, auth_headers):
    """
    Deve retornar 404 ao buscar usuário inexistente.
    """
    fake_id = uuid.uuid4().int % 100000
    response = client.get(
        f"/api/dispatcher-system/user/{fake_id}",
        headers=auth_headers,
    )
    assert response.status_code == 404


# ==========================================================
# CRIAÇÃO
# ==========================================================


def test_create_user(client):
    """
    Deve criar um novo usuário com sucesso.
    """
    sufix = uuid.uuid4().hex[:6]
    payload = {
        "cpf": uuid.uuid4().hex[:11],
        "name": f"Test User {sufix}",
        "email": f"test+{sufix}@gmail.com",
        "password": "123456",
    }
    response = client.post(
        "/api/dispatcher-system/user",
        json=payload,
    )
    assert response.status_code == 201

    body = response.get_json()
    assert body["email"] == payload["email"]
    assert body["cpf"] == payload["cpf"]


def test_create_user_duplicate_cpf(client, created_user):
    """
    Deve retornar 400 ao tentar criar usuário com CPF já existente.
    """
    payload = {
        "cpf": created_user["cpf"],
        "name": "Outro Usuário",
        "email": "outro@email.com",
        "password": "123456",
    }
    response = client.post(
        "/api/dispatcher-system/user",
        json=payload,
    )
    assert response.status_code == 400


def test_create_user_duplicate_email(client, created_user):
    """
    Deve retornar 400 ao tentar criar usuário com e-mail já existente.
    """
    sufix = uuid.uuid4().hex[:6]
    payload = {
        "cpf": uuid.uuid4().hex[:11],
        "name": f"Test User {sufix}",
        "email": created_user["email"],
        "password": "123456",
    }
    response = client.post(
        "/api/dispatcher-system/user",
        json=payload,
    )
    assert response.status_code == 400


# ==========================================================
# ATUALIZAÇÃO
# ==========================================================


def test_update_user(client, auth_headers, created_user):
    """
    Deve atualizar os dados básicos do usuário.
    """
    new_name = f"Novo Nome {uuid.uuid4().hex[:6]}"
    payload = {
        "user": {
            "cpf": created_user["cpf"],
            "name": new_name,
            "email": created_user["email"],
            "password": "123456",
        }
    }
    response = client.put(
        f"/api/dispatcher-system/user/{created_user["id"]}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["user"]["name"] == new_name


def test_update_user_with_address(client, auth_headers, created_user):
    """
    Deve atualizar os dados do usuário e criar endereço.
    """
    payload = {
        "user": {
            "cpf": created_user["cpf"],
            "name": created_user["name"],
            "email": created_user["email"],
            "password": "123456",
        },
        "address": {
            "contact": "51999999999",
            "city": "Sapiranga",
            "state": "RS",
            "zip_code": "93800-000",
            "address": "Rua Teste",
            "number": 123,
            "neighborhood": "Centro",
        },
    }
    response = client.put(
        f"/api/dispatcher-system/user/{created_user["id"]}",
        json=payload,
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["address"]["city"] == "Sapiranga"
    assert body["address"]["state"] == "RS"


def test_update_user_not_found(client, auth_headers):
    """
    Deve retornar 404 ao tentar atualizar usuário inexistente.
    """
    fake_id = uuid.uuid4().int % 100000
    payload = {
        "user": {
            "cpf": "12345678900",
            "name": "Novo Nome",
            "email": "teste@email.com",
            "password": "123456",
        }
    }
    response = client.put(
        f"/api/dispatcher-system/user/{fake_id}",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 404


# ==========================================================
# PERFIL PÚBLICO
# ==========================================================


def test_update_user_profile_public(client, auth_headers, created_user):
    """
    Deve atualizar os dados públicos do perfil do usuário.
    """
    data = {
        "data": json.dumps(
            {
                "instagram": "@raissa",
                "website": "https://site.com",
            }
        )
    }
    response = client.put(
        f"/api/dispatcher-system/user/{created_user['id']}/profile",
        data=data,
        headers=auth_headers,
        content_type="multipart/form-data",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["instagram"] == "@raissa"
    assert body["website"] == "https://site.com"


def test_update_user_profile_public_with_photo(client, auth_headers, created_user):
    """
    Deve atualizar perfil público e realizar upload de imagem.
    """
    data = {
        "data": json.dumps(
            {
                "instagram": "@raissa",
            }
        ),
        "photo": (
            io.BytesIO(b"fake-image-content"),
            "photo.jpg",
            "image/jpeg",
        ),
    }
    response = client.put(
        f"/api/dispatcher-system/user/{created_user['id']}/profile",
        data=data,
        headers=auth_headers,
        content_type="multipart/form-data",
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["instagram"] == "@raissa"
    assert body["photo"] is not None
    assert "/uploads/profile/" in body["photo"]


def test_update_user_profile_invalid_file(client, auth_headers, created_user):
    """
    Deve retornar 400 ao enviar arquivo inválido.
    """
    data = {
        "data": json.dumps({}),
        "photo": (
            io.BytesIO(b"fake-file"),
            "document.pdf",
            "application/pdf",
        ),
    }
    response = client.put(
        f"/api/dispatcher-system/user/{created_user['id']}/profile",
        data=data,
        headers=auth_headers,
        content_type="multipart/form-data",
    )
    assert response.status_code == 400


def test_update_user_profile_user_not_found(client, auth_headers):
    """
    Deve retornar 404 ao atualizar perfil de usuário inexistente.
    """
    fake_id = uuid.uuid4().int % 100000
    data = {"data": json.dumps({"instagram": "@teste"})}
    response = client.put(
        f"/api/dispatcher-system/user/{fake_id}/profile",
        data=data,
        headers=auth_headers,
        content_type="multipart/form-data",
    )
    assert response.status_code == 404


# ==========================================================
# DELETE
# ==========================================================


def test_delete_user(client, auth_headers, created_user):
    """
    Deve realizar exclusão lógica do usuário.
    """
    response = client.delete(
        f"/api/dispatcher-system/user/{created_user['id']}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    assert body["deleted_at"] is not None


def test_delete_user_not_found(client, auth_headers):
    """
    Deve retornar 404 ao deletar usuário inexistente.
    """
    fake_id = uuid.uuid4().int % 100000
    response = client.delete(
        f"/api/dispatcher-system/user/{fake_id}",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_deleted_user_not_listed(client, auth_headers, created_user):
    """
    Usuários deletados logicamente não devem aparecer na listagem.
    """
    delete_response = client.delete(
        f"/api/dispatcher-system/user/{created_user['id']}",
        headers=auth_headers,
    )
    assert delete_response.status_code == 200

    response = client.get(
        "/api/dispatcher-system/user",
        headers=auth_headers,
    )
    assert response.status_code == 200

    body = response.get_json()
    ids = [user["id"] for user in body["items"]]
    assert created_user["id"] not in ids


# ==========================================================
# AUTENTICAÇÃO
# ==========================================================


@pytest.mark.parametrize(
    "method, url",
    [
        ("get", "/api/dispatcher-system/user"),
        ("get", "/api/dispatcher-system/user/1"),
        ("put", "/api/dispatcher-system/user/1"),
        ("delete", "/api/dispatcher-system/user/1"),
    ],
)
def test_routes_require_authentication(client, method, url):
    """
    Deve exigir autenticação JWT nas rotas protegidas.
    """
    response = getattr(client, method)(url)
    assert response.status_code in [401, 422]


@pytest.fixture
def created_user(client):
    """
    Cria um usuário para utilização nos testes.
    """
    sufix = uuid.uuid4().hex[:6]
    payload = {
        "cpf": uuid.uuid4().hex[:11],
        "name": f"Test User {sufix}",
        "email": f"test+{sufix}@gmail.com",
        "password": "123456",
    }
    response = client.post(
        "/api/dispatcher-system/user",
        json=payload,
    )
    assert response.status_code == 201

    body = response.get_json()
    return body
