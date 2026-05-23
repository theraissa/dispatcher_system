"""
Modelos Pydantic relacionados ao UserService.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# =========== Modelos base ===========
class UserBase(BaseModel):
    """Campos do tabela User"""

    cpf: Optional[str] = None
    name: Optional[str] = None
    date_birth: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class AdressBase(BaseModel):
    """Campos do tabela endereço"""

    contact: Optional[str] = None
    number: Optional[int] = None
    neighborhood: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None


class ProfileBase(BaseModel):
    """Campos da tabela user - perfil público"""

    instagram: Optional[str] = None
    website: Optional[str] = None


# =========== Modelos Address ===========


class CreateAddressRequest(AdressBase):
    """Modelo de criação do Address."""

    model_config = ConfigDict(extra="ignore")


class UpdateAddressRequest(AdressBase):
    """Modelo de atualização do Address."""

    model_config = ConfigDict(extra="ignore")


class AddressResponse(AdressBase):
    """Modelo de resposta para o Address."""

    id: int
    user_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# =========== Modelos User ===========


class CreateUserRequest(UserBase):
    """Modelo de criação do UserService."""

    model_config = ConfigDict(extra="ignore")


class UpdateUserRequest(BaseModel):
    """Modelo de atualização do UserService."""

    user: Optional[CreateUserRequest] = None
    address: Optional[CreateAddressRequest] = None

    model_config = ConfigDict(extra="ignore")


class UserResponse(UserBase):
    """Modelo de resposta para o UserService."""

    id: int
    photo: Optional[str]
    instagram: Optional[str]
    website: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class ListUserFullResponse(BaseModel):
    """Responder múltiplas tabelas ao mesmo tempo"""

    user: UserResponse
    address: Optional[AddressResponse] = None


# =========== Modelos User Profile ===========


class UpdateUserProfileRequest(ProfileBase):
    """Modelo de atualização parcial do Profile."""

    model_config = ConfigDict(extra="ignore")


class UserProfileResponse(ProfileBase):
    """Modelo de atualização parcial do Profile."""

    photo: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
