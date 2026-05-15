"""
Modelos Pydantic relacionados ao DispatcherService.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, RootModel

from models.user import CreateUserRequest, UserResponse


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


class CreateProfileRequest(BaseModel):
    """Modelo de criação do Profile."""

    photo: Optional[str] = None
    instagram: Optional[str] = None
    whatsapp: Optional[str] = None
    website: Optional[str] = None

    model_config = ConfigDict(extra="forbid")


class ProfileResponse(BaseModel):
    """Modelo de resposta para o Profile."""

    id: int
    dispatcher_id: Optional[int]
    photo: Optional[str]
    instagram: Optional[str]
    whatsapp: Optional[str]
    website: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class CreateDispatcherFullRequest(BaseModel):
    """Criar múltiplas tabelas ao mesmo tempo"""

    user: CreateUserRequest
    dispatcher: CreateDispatcherRequest
    office: CreateOfficeRequest
    profile: CreateProfileRequest


class CreateDispatcherFullResponse(BaseModel):
    """Responder múltiplas tabelas ao mesmo tempo"""

    user: UserResponse
    dispatcher: DispatcherResponse
    office: OfficeResponse
    profile: ProfileResponse


class ListDispatcherResponse(RootModel):
    """Modelo de listagem para o DispatcherService."""

    root: List[CreateDispatcherFullResponse]


class UpdateDispatcherRequest(BaseModel):
    """Modelo de atualização parcial do Dispatcher."""

    regis_crdd: Optional[str] = None
    date_exp_regis: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


class UpdateOfficeRequest(BaseModel):
    """Modelo de atualização parcial do Office."""

    contact: Optional[str] = None
    number: Optional[int] = None
    neighborhood: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[int] = None

    model_config = ConfigDict(extra="ignore")


class UpdateProfileRequest(BaseModel):
    """Modelo de atualização parcial do Profile."""

    photo: Optional[str] = None
    instagram: Optional[str] = None
    whatsapp: Optional[str] = None
    website: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


class UpdateDispatcherFullRequest(BaseModel):
    """Modelo de atualização parcial de múltiplas tabelas."""

    user: Optional[CreateUserRequest] = None
    dispatcher: Optional[UpdateDispatcherRequest] = None
    office: Optional[UpdateOfficeRequest] = None
    profile: Optional[UpdateProfileRequest] = None

    model_config = ConfigDict(extra="ignore")
