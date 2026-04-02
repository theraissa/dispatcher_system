"""
Modelos Pydantic relacionados ao UserService.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, RootModel


class LoginUserRequest(BaseModel):
    """Modelo de login do UserService."""

    email: Optional[str]
    password: Optional[str]

    model_config = ConfigDict(extra="ignore")


class CreateUserRequest(BaseModel):
    """Modelo de criação do UserService."""

    cpf: Optional[str] = None
    rg: Optional[str] = None
    name: Optional[str] = None
    date_birth: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


# Modelos de resposta e criação do endereço do usuário
class CreateAddressRequest(BaseModel):
    """Modelo de criação do Address."""

    contact: Optional[str] = None
    number: Optional[int] = None
    neighborhood: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


class AddressResponse(BaseModel):
    """Modelo de resposta para o Address."""

    id: int
    user_id: Optional[int]
    contact: Optional[str]
    number: Optional[int]
    neighborhood: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class UpdateUserRequest(BaseModel):
    """Modelo de atualização do UserService."""

    user: Optional[CreateUserRequest] = None
    address: Optional[CreateAddressRequest] = None

    model_config = ConfigDict(extra="ignore")


class UserResponse(BaseModel):
    """Modelo de resposta para o UserService."""

    id: int
    cpf: Optional[str]
    rg: Optional[str]
    name: Optional[str]
    date_birth: Optional[str]
    contact: Optional[str]
    email: Optional[str]
    password: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class ListUserResponse(RootModel):
    """Modelo de listagem para o UserService."""

    root: List[UserResponse]


class ListUserFullResponse(BaseModel):
    """Responder múltiplas tabelas ao mesmo tempo"""

    user: UserResponse
    address: Optional[AddressResponse] = None
