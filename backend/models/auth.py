"""
Modelos de dados para autenticação e autorização.
"""

from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict

RoleType = Literal["client", "dispatcher"]


class LoginUserRequest(BaseModel):
    """Modelo de login do UserService."""

    email: Optional[str]
    password: Optional[str]

    model_config = ConfigDict(extra="ignore")


class LoginUserResponse(BaseModel):
    """Modelo de login do UserService."""

    id: int
    name: str
    email: str
    role: RoleType
    token: str

    model_config = ConfigDict(extra="ignore")
