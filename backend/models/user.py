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

    model_config = ConfigDict(extra="forbid")


class CreateUserRequest(BaseModel):
    """Modelo de criação do UserService."""

    cpf: Optional[str] = None
    rg: Optional[str] = None
    name: Optional[str] = None
    date_birth: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

    model_config = ConfigDict(extra="forbid")


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
