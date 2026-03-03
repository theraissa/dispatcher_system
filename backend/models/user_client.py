"""
Modelos Pydantic relacionados ao serviço de User Client.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, RootModel


class CreateUserClientRequest(BaseModel):
    """Modelo de criação do serviço User Client."""

    cpf_cliente: Optional[str] = None
    rg_cliente: Optional[str] = None
    nome_cliente: Optional[str] = None
    nasc_cliente: Optional[str] = None
    tele_pessoal_cliente: Optional[str] = None
    email_cliente: Optional[str] = None
    senha_cliente: Optional[str] = None
    
    model_config = ConfigDict(extra="forbid")


class UserClientResponse(BaseModel):
    """Modelo de resposta para o serviço User Client."""

    id: int
    cpf_cliente: Optional[str]
    rg_cliente: Optional[str]
    nome_cliente: Optional[str]
    nasc_cliente: Optional[str]
    tele_pessoal_cliente: Optional[str]
    email_cliente: Optional[str]
    senha_cliente: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

class ListUserClientResponse(RootModel):
    """Modelo de listagem para o serviço User Client"""

    root: List[UserClientResponse]
