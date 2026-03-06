"""
Modelos Pydantic relacionados ao serviço de User Client.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, RootModel


class CreateUserRequest(BaseModel):
    """Modelo de criação do serviço User Client."""

    cpf : Optional[str] = None
    rg : Optional[str] = None
    name : Optional[str] = None
    date_birth: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    
    model_config = ConfigDict(extra="forbid")


class UserResponse(BaseModel):
    """Modelo de resposta para o serviço User Client."""

    id: int
    cpf : Optional[str]
    rg : Optional[str]
    name : Optional[str]
    date_birth: Optional[str]
    contact: Optional[str]
    email: Optional[str]
    password: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)

class ListUserClientResponse(RootModel):
    """Modelo de listagem para o serviço User Client"""

    root: List[UserResponse]
