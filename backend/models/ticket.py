"""
Modelos Pydantic relacionados ao TicketService.
"""

from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, RootModel


class CreateTicketRequest(BaseModel):
    """Modelo de criação de chamado."""

    user_id: int
    dispatcher_id: int
    service_id: int

    model_config = ConfigDict(extra="ignore")


class TicketResponse(BaseModel):
    """Resposta básica do chamado."""

    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ServiceInfo(BaseModel):
    """Modelo com informações do Serviço."""

    id: int
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class DispatcherInfo(BaseModel):
    """Modelo com informações do Despachante."""

    name: str
    contact: str | None = None


class UserInfo(BaseModel):
    """Modelo com informações do Usuário."""

    name: str
    contact: str | None = None


class TicketUserResponse(BaseModel):
    """Modelo de resposta dos chamados do Usuário"""

    ticket_id: int
    status: str
    created_at: datetime
    service: ServiceInfo
    dispatcher: DispatcherInfo


class TicketDispatcherResponse(BaseModel):
    """Modelo de resposta dos chamados do Despachante"""

    ticket_id: int
    status: str
    created_at: datetime
    service: ServiceInfo
    user: UserInfo


class ListTicketUserResponse(RootModel):
    """Modelo de listagem para o TicketUserResponse."""

    root: List[TicketUserResponse]


class ListTicketDispatcherResponse(RootModel):
    """Modelo de listagem para o TicketDispatcherResponse."""

    root: List[TicketDispatcherResponse]
