"""
Serviço responsável pelo gerenciamento de usuários no sistema.
"""

from datetime import datetime
from typing import Any

from flask import abort
from flask_sqlalchemy import SQLAlchemy

from database.tables import AddressDB, UserDB
from models.user import AddressResponse, CreateUserRequest, ListUserFullResponse, ListUserResponse, UpdateUserRequest, UserResponse


class UserService:
    """
    Serviço de domínio responsável pela gestão de usuários.

    Este serviço gerencia:
        - Dados básicos do usuário
        - Endereço associado (quando existente)
    Args:
        db (SQLAlchemy): Sessão do SQLAlchemy utilizada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_user(self) -> ListUserResponse:
        """
        Lista todos os usuários ativos no sistema.

        Considera apenas registros não deletados (soft delete).

        Returns:
            ListUserResponse: Lista de usuários cadastrados.

        Notes:
            - Retorna lista vazia caso não existam usuários.
        """
        list_users = UserDB.query.filter(UserDB.deleted_at.is_(None)).all()
        response = ListUserResponse(root=[UserResponse.model_validate(user) for user in list_users])
        return response.model_dump()

    def get_user_by_id(self, user_id: str) -> dict:
        """
        Recupera os dados completos de um usuário pelo ID.

        Inclui informações básicas e endereço associado (quando existir).

        Args:
            user_id (str): ID do usuário.

        Returns:
            dict: Estrutura contendo:
                - user
                - address (opcional)

        Raises:
            HTTPException:
                - 404: Caso o usuário não seja encontrado.
        """
        user = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
        if not user:
            abort(404, description=f"User with ID '{user_id}' not found.")

        address = AddressDB.query.filter(AddressDB.user_id == user_id, AddressDB.deleted_at.is_(None)).first()

        return ListUserFullResponse(
            user=UserResponse.model_validate(user),
            address=AddressResponse.model_validate(address) if address else None,
        ).model_dump()

    def create_user(self, user_data: CreateUserRequest) -> dict[str, Any]:
        """
        Cria um novo usuário no sistema.

        Args:
            user_data (CreateUserRequest): Dados validados para criação do usuário.

        Returns:
            dict[str, Any]: Representação serializada do usuário criado.

        Raises:
            Exception: Erros de persistência podem ser propagados.
        """
        new_user = UserDB(**user_data.model_dump(mode="json"))

        self.db.session.add(new_user)
        self.db.session.commit()

        return UserResponse.model_validate(new_user).model_dump()

    def update_user(self, user_id: str, user_data: UpdateUserRequest) -> dict[str, Any]:
        """
        Atualiza os dados de um usuário existente.

        Permite atualização parcial de:
            - Dados do usuário
            - Endereço (criação ou atualização)

        Comportamento:
            - Se endereço existir → atualiza
            - Se não existir → cria novo

        Args:
            user_id (str): ID do usuário.
            user_data (UpdateUserRequest): Dados atualizados.

        Returns:
            dict[str, Any]: Estrutura contendo:
                - user atualizado
                - address atualizado (ou None)

        Raises:
            HTTPException:
                - 404: Caso o usuário não seja encontrado.
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
                new_address = AddressDB(
                    user_id=user_id,
                    **user_data.address.model_dump(exclude_unset=True),
                )
                self.db.session.add(new_address)

        user_to_update.updated_at = datetime.now()
        self.db.session.commit()

        updated_address = AddressDB.query.filter(
            AddressDB.user_id == user_id,
            AddressDB.deleted_at.is_(None),
        ).first()

        return {
            "user": UserResponse.model_validate(user_to_update).model_dump(),
            "address": AddressResponse.model_validate(updated_address).model_dump() if updated_address else None,
        }

    def delete_user(self, user_id: str) -> dict[str, Any]:
        """
        Realiza a exclusão lógica (soft delete) de um usuário.

        O registro não é removido fisicamente, apenas marcado com timestamp.

        Args:
            user_id (str): ID do usuário.

        Returns:
            dict[str, Any]: Dados do usuário após marcação de exclusão.

        Raises:
            HTTPException:
                - 404: Caso o usuário não seja encontrado.
        """
        user_to_delete = UserDB.query.filter(
            UserDB.id == user_id,
            UserDB.deleted_at.is_(None),
        ).first()

        if not user_to_delete:
            abort(404, description=f"User with ID '{user_id}' not found.")

        user_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return UserResponse.model_validate(user_to_delete).model_dump()
