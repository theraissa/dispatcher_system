"""
Modelos Pydantic relacionados ao serviço de User Dispatcher.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, RootModel


class CreateUserDispatcherRequest(BaseModel):
    """Modelo de criação do serviço User Dispatcher."""

    cpf_desp: Optional[str] = None
    rg_desp: Optional[str] = None
    nome_desp: Optional[str] = None
    nasc_desp: Optional[str] = None
    tele_pessoal_desp: Optional[str] = None
    email_desp: Optional[str] = None
    senha_desp: Optional[str] = None
    regis_crdd: Optional[datetime] = None
    data_exp_regis: Optional[str] = None

    model_config = ConfigDict(extra="forbid")


class UserDispatcherResponse(BaseModel):
    """Modelo de resposta para o serviço User Dispatcher.."""

    id: int
    cpf_desp: Optional[str] = None
    rg_desp: Optional[str] = None
    nome_desp: Optional[str] = None
    nasc_desp: Optional[str] = None
    tele_pessoal_desp: Optional[str] = None
    email_desp: Optional[str] = None
    senha_desp: Optional[str] = None
    regis_crdd: Optional[datetime] = None
    data_exp_regis: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)

class ListUserDispatcherResponse(RootModel):
    """Modelo de listagem para o serviço User Dispatcher."""

    root: List[UserDispatcherResponse]
