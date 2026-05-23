"""
Modelos de dados para autenticação e autorização.
"""

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

RoleType = Literal["cliente", "despachante", "admin"]

StatusType = Literal["aprovado", "negado", "pendente"]


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
    role: RoleType
    token: str

    model_config = ConfigDict(from_attributes=True)
