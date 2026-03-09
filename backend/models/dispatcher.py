"""
Modelos Pydantic relacionados ao DispatcherService.
"""

from datetime import datetime
from typing import List, Optional

from models.user import CreateUserRequest, UserResponse
from pydantic import BaseModel, ConfigDict, RootModel


# Modelos de resposta e criação do Despachante
class CreateDispatcherRequest(BaseModel):
    """Modelo de criação do DispatcherService."""

    regis_crdd: Optional[str] = None
    date_exp_regis: Optional[str] = None

    model_config = ConfigDict(extra="forbid")


class DispatcherResponse(BaseModel):
    """Modelo de resposta para o DispatcherService."""

    id: int
    user_id: Optional[int]
    regis_crdd: Optional[str]
    date_exp_regis: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# Modelos de resposta e criação do Escritório do Despachante
class CreateOfficeRequest(BaseModel):
    """Modelo de criação do Office."""

    contact: Optional[str] = None
    number: Optional[int] = None
    neighborhood: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[int] = None

    model_config = ConfigDict(extra="forbid")


class OfficeResponse(BaseModel):
    """Modelo de resposta para o Office."""

    id: int
    dispatcher_id: Optional[int]
    contact: Optional[str]
    number: Optional[int]
    neighborhood: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[int]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# Modelo final que vai criar usuário, despachante e o escritório
class CreateDispatcherFullRequest(BaseModel):
    user: CreateUserRequest
    dispatcher: CreateDispatcherRequest
    office: CreateOfficeRequest


class CreateDispatcherFullResponse(BaseModel):
    user: UserResponse
    dispatcher: DispatcherResponse
    office: OfficeResponse


class ListDispatcherResponse(RootModel):
    """Modelo de listagem para o DispatcherService."""

    root: List[CreateDispatcherFullResponse]
