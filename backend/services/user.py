"""
Módulo com implementação do serviço UserService.
"""

from typing import Any
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from database.tables import AddressDB, UserDB
from models.user import CreateUserRequest, UpdateUserRequest, UserResponse, ListUserResponse, AddressResponse, ListUserFullResponse
from flask import abort


class UserService:
    """
    Serviço para gerenciar usuários no banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_user(self) -> ListUserResponse:
        """
        Recupera todos os usuários ativos (não deletados).

        Returns:
            ListUserClientResponse: Lista de usuários.
            Retorna uma lista vazia quando nenhum usuário estiver cadastrado.
        """
        list_users = UserDB.query.filter(UserDB.deleted_at.is_(None)).all()
        response = ListUserResponse(root=[UserResponse.model_validate(user) for user in list_users])
        return response.model_dump()

    def get_user_by_cpf(self, user_cpf: str) -> dict[str, Any]:
        """
        Recupera um usuário a partir do CPF.

        Args:
            user_cpf (str): CPF do usuário.
        Returns:
            dict: Dados serializados do usuário encontrado.
        """
        user = UserDB.query.filter(UserDB.cpf == user_cpf, UserDB.deleted_at.is_(None))

        if not user:
            abort(404, description=f"User with CPF '{user_cpf}' not found.")

        return UserResponse.model_validate(user).model_dump()

    def get_user_by_id(self, user_id: str) -> dict:
        """
        Recupera um usuário a partir do ID.

        Args:
            user_id (str): ID do usuário.
        Returns:
            dict: Dados serializados do usuário encontrado.
        """
        user = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()

        if not user:
            abort(404, description=f"User with ID '{user_id}' not found.")

        address = self.db.session.query(AddressDB).filter(AddressDB.id == user_id, AddressDB.deleted_at.is_(None)).first()

        return ListUserFullResponse(
            user=UserResponse.model_validate(user),
            address=AddressResponse.model_validate(address) if address else None,
        ).model_dump()

    def create_user(self, user_data: CreateUserRequest) -> dict[str, Any]:
        """
        Cria um novo usuário.

        Args:
            user_data (CreateUserRequest): O modelo Pydantic com os dados do novo usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto recém-criado.
        """
        new_user = UserDB(**user_data.model_dump(mode="json"))

        self.db.session.add(new_user)
        self.db.session.commit()

        return UserResponse.model_validate(new_user).model_dump()

    def update_user(self, user_id: str, user_data: UpdateUserRequest) -> dict[str, Any]:
        """
        Atualiza usuário existente por seu ID.

        Args:
            client_id: O ID do usuário a ser atualizado.
            user_data: O modelo Pydantic com os dados atualizados do usuário.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto  atualizado.
        """
        user_to_update = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
        if not user_to_update:
            abort(404, description=f"User with ID '{user_id}' not found.")

        # Atualizar dados do usuário
        if user_data.user:
            for key, value in user_data.user.model_dump(exclude_unset=True).items():
                setattr(user_to_update, key, value)

        # Atualizar ou criar endereço
        address = AddressDB.query.filter(AddressDB.user_id == user_id, AddressDB.deleted_at.is_(None)).first()
        if user_data.address:
            if address:
                # UPDATE
                for key, value in user_data.address.model_dump(exclude_unset=True).items():
                    setattr(address, key, value)
                address.updated_at = datetime.now()
            else:
                # CREATE
                new_address = AddressDB(user_id=user_id, **user_data.address.model_dump(exclude_unset=True))
                self.db.session.add(new_address)

        user_to_update.updated_at = datetime.now()
        self.db.session.commit()

        # Buscar address atualizado
        updated_address = AddressDB.query.filter(AddressDB.user_id == user_id, AddressDB.deleted_at.is_(None)).first()

        return {
            "user": UserResponse.model_validate(user_to_update).model_dump(),
            "address": AddressResponse.model_validate(updated_address).model_dump() if updated_address else None,
        }

    def delete_user(self, user_id: str) -> dict[str, Any]:
        """
        Deleta logicamente (soft delete) um usuário ativo por seu ID.

        Args:
            user_id: O ID do usuário a ser marcado como deletada.
        Returns:
            dict[str, Any]: Um dicionário serializado contendo o objeto marcado como deletado.
        """
        user_to_delete = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
        if not user_to_delete:
            abort(404, description=f"User with ID '{user_id}' not found.")

        user_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return UserResponse.model_validate(user_to_delete).model_dump()
