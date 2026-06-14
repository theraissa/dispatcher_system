"""
Modelos Pydantic relacionados ao DispatcherService.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from models.service_catalog import AssociateServiceDetailsResponse
from models.user import (
    AddressResponse,
    CreateAddressRequest,
    CreateUserRequest,
    UpdateAddressRequest,
    UpdateUserRequest,
    UserResponse,
)


class CreateDispatcherRequest(BaseModel):
    """Dados para criação do despachante."""

    regis_crdd: Optional[str] = None
    date_exp_regis: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


class UpdateDispatcherRequest(BaseModel):
    """Dados para atualização do despachante."""

    regis_crdd: Optional[str] = None
    date_exp_regis: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


class DispatcherResponse(BaseModel):
    """Resposta de despachante."""

    id: int
    user_id: Optional[int]
    regis_crdd: Optional[str]
    date_exp_regis: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class CreateDispatcherFullRequest(BaseModel):
    """Dados completos para criação de despachante."""

    user: CreateUserRequest
    dispatcher: CreateDispatcherRequest
    address: CreateAddressRequest


class UpdateDispatcherFullRequest(BaseModel):
    """Dados para atualização parcial de despachante."""

    user: Optional[UpdateUserRequest] = None
    dispatcher: Optional[UpdateDispatcherRequest] = None
    address: Optional[UpdateAddressRequest] = None


class DispatcherFullResponse(BaseModel):
    """Resposta completa de despachante."""

    user: UserResponse
    dispatcher: DispatcherResponse
    address: AddressResponse
    service_details: list[AssociateServiceDetailsResponse] = []
