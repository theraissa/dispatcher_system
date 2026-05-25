"""
Modelos de dados para autenticação e autorização.
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserRoleEnum(str, Enum):
    """O tipo de papel do usuário"""

    CLIENTE = "cliente"
    DESPACHANTE = "despachante"
    ADMIN = "admin"


class DispatcherStatusEnum(str, Enum):
    """Status do perfil do despachante"""

    APROVADO = "aprovado"
    NEGADO = "negado"
    PENDENTE = "pendente"
    EXPIRADO = "expirado"


class LoginUserRequest(BaseModel):
    """Modelo de login do UserService."""

    email: str
    password: str

    model_config = ConfigDict(extra="ignore")


class LoginUserResponse(BaseModel):
    """Modelo de login do UserService."""

    id: int
    dispatcher_id: Optional[int]
    name: str
    email: str
    role: UserRoleEnum
    token: str

    model_config = ConfigDict(from_attributes=True)
