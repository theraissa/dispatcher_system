"""
Serviço responsável pelo gerenciamento de usuários no sistema.
"""

import os
import uuid
from datetime import datetime, timezone

from flask import abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload
from werkzeug.datastructures import FileStorage
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename

from database.tables import AddressDB, UserDB
from models.pagination import PaginatedResponse
from models.user import (
    AddressResponse,
    CreateUserRequest,
    ListUserFullResponse,
    UpdateUserProfileRequest,
    UpdateUserRequest,
    UserProfileResponse,
    UserResponse,
)


class UserService:
    """
    Serviço de domínio responsável pela gestão de usuários.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_user(self, page: int = 1, per_page: int = 10) -> PaginatedResponse[UserResponse]:
        """
        Lista todos os usuários ativos no sistema.

        Args:
            page (int): Página atual da paginação.
            per_page (int): Quantidade de itens por página.
        Returns:
            PaginatedResponse[UserResponse]: Lista paginada de usuários.
        """
        paginated = UserDB.query.filter(UserDB.deleted_at.is_(None)).paginate(
            page=page,
            per_page=per_page,
            error_out=False,
        )
        response = [UserResponse.model_validate(user) for user in paginated.items]

        return PaginatedResponse[UserResponse].from_pagination(paginated, response)

    def get_user_by_id(self, user_id: int) -> ListUserFullResponse:
        """
        Recupera os dados completos de um usuário pelo ID.

        Args:
            user_id (int): ID do usuário.
        Returns:
            ListUserFullResponse: Dados completos do usuário cadastrado.
        """
        user = (
            UserDB.query.options(joinedload(UserDB.address))
            .filter(
                UserDB.id == user_id,
                UserDB.deleted_at.is_(None),
            )
            .first()
        )
        if not user:
            abort(404, description=f"Usuário com o ID '{user_id}' não foi encontrado.")

        return ListUserFullResponse(
            user=UserResponse.model_validate(user),
            address=(AddressResponse.model_validate(user.address) if user.address else None),
        )

    def create_user(self, user_data: CreateUserRequest) -> UserResponse:
        """
        Cria um novo usuário no sistema.

        Args:
            user_data (CreateUserRequest): Dados validados para criação do usuário.
        Returns:
            UserResponse: Representação serializada do usuário criado.
        """
        existing_user = UserDB.query.filter_by(cpf=user_data.cpf).first()
        if existing_user:
            abort(400, description=f"Usuário com o CPF {user_data.cpf} já existe!")

        existing_email = UserDB.query.filter_by(email=user_data.email).first()
        if existing_email:
            abort(400, description=f"Usuário com o email {user_data.email} já existe!")

        user_data_dict = user_data.model_dump(mode="json")
        user_data_dict["password"] = generate_password_hash(user_data.password)

        new_user = UserDB(**user_data_dict)

        self.db.session.add(new_user)
        self.db.session.commit()

        return UserResponse.model_validate(new_user)

    def update_user(self, user_id: int, user_data: UpdateUserRequest) -> ListUserFullResponse:
        """
        Atualiza os dados de um usuário existente.

        Permite atualização parcial de:
            - Dados do usuário
            - Endereço (criação ou atualização)

        Comportamento:
            - Se endereço existir → atualiza
            - Se não existir → cria novo

        Args:
            user_id (int): ID do usuário.
            user_data (UpdateUserRequest): Dados atualizados.
        Returns:
            ListUserFullResponse: Estrutura contendo:
                - user atualizado
                - address atualizado (ou None)
        """
        user_to_update = (
            UserDB.query.options(joinedload(UserDB.address))
            .filter(
                UserDB.id == user_id,
                UserDB.deleted_at.is_(None),
            )
            .first()
        )

        if not user_to_update:
            abort(404, description=f"Usuário com o ID '{user_id}' não foi encontrado.")

        if user_data.user:
            for key, value in user_data.user.model_dump(exclude_unset=True).items():
                setattr(user_to_update, key, value)

        address = user_to_update.address

        if user_data.address:
            if address:
                for key, value in user_data.address.model_dump(exclude_unset=True).items():
                    setattr(address, key, value)
            else:
                new_address = AddressDB(user_id=user_id, **user_data.address.model_dump(exclude_unset=True))
                self.db.session.add(new_address)

        self.db.session.commit()

        return ListUserFullResponse(
            user=UserResponse.model_validate(user_to_update),
            address=(AddressResponse.model_validate(user_to_update.address) if user_to_update.address else None),
        )

    def update_user_profile_public(
        self,
        user_id: int,
        data: UpdateUserProfileRequest,
        photo: FileStorage | None = None,
    ) -> UserProfileResponse:
        """
        Atualiza o perfil público (instagram, website, foto de perfil) do usuário.

        Args:
            user_id (int): ID do usuário.
            data (UpdateUserProfileRequest): Dados do perfil.
            photo: Arquivo da imagem enviado via multipart/form-data.
        Returns:
            UserProfileResponse: Dados atualizados do perfil público.
        """
        try:
            user = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
            if not user:
                abort(404, description=f"Usuário com o ID '{user_id}' não foi encontrado.")

            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(user, key, value)

            if photo:
                if not photo.mimetype.startswith("image/"):
                    abort(400, description="Arquivo de imagem inválido!")

                # Sanitiza o nome do arquivo enviado pelo usuário,
                filename = secure_filename(photo.filename)

                # Extrai a extensão do arquivo.
                _, extension = os.path.splitext(filename)
                extension = extension.lstrip(".").lower()

                allowed_extensions = {"png", "jpg", "jpeg"}

                if extension.lower() not in allowed_extensions:
                    abort(400, description="Formato de imagem inválido!")

                # Gera um nome único para evitar conflitos entre uploads.
                unique_filename = f"{uuid.uuid4()}.{extension}"

                # Define a pasta onde as imagens serão armazenadas.
                upload_folder = "uploads/profile"

                # Garante que a pasta exista.
                os.makedirs(upload_folder, exist_ok=True)

                # Monta o caminho completo do arquivo no sistema operacional.
                filepath = os.path.join(upload_folder, unique_filename)

                # Salva fisicamente o arquivo enviado no diretório definido.
                photo.save(filepath)

                # Salva no banco o caminho público da imagem.
                user.photo = f"/uploads/profile/{unique_filename}"

            self.db.session.commit()

            return UserProfileResponse.model_validate(user)

        except Exception:
            self.db.session.rollback()
            raise

    def delete_user(self, user_id: int) -> UserResponse:
        """
        Realiza a exclusão lógica (soft delete) de um usuário.

        Args:
            user_id (int): ID do usuário.
        Returns:
            UserResponse: Dados do usuário após marcação de exclusão.
        """
        user_to_delete = UserDB.query.filter(
            UserDB.id == user_id,
            UserDB.deleted_at.is_(None),
        ).first()

        if not user_to_delete:
            abort(404, description=f"Usuário com o ID '{user_id}' não foi encontrado.")

        user_to_delete.deleted_at = datetime.now(timezone.utc)
        self.db.session.commit()

        return UserResponse.model_validate(user_to_delete)
