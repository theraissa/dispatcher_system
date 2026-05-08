"""
Modelos Pydantic relacionados ao TicketService.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, RootModel


class CreateTicketRequest(BaseModel):
    """Modelo de criação de chamado."""

    user_id: int
    dispatcher_id: int
    service_details_id: int

    model_config = ConfigDict(extra="ignore")


class TicketResponse(BaseModel):
    """Resposta básica do chamado."""

    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ServiceDetailsInfo(BaseModel):
    """Modelo com informações do Serviço."""

    id: int
    price: int
    service_id: int
    name: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DispatcherInfo(BaseModel):
    """Modelo com informações do Despachante."""

    name: str
    email: str
    contact: str
    address: str
    city: str
    state: str
    number: int
    neighborhood: str


class UserInfo(BaseModel):
    """Modelo com informações do usuário."""

    name: str
    email: str
    contact: str
    cpf: str
    address: str
    city: str
    state: str
    number: int
    neighborhood: str


class TicketUserResponse(BaseModel):
    """Modelo de resposta dos chamados do Usuário"""

    id: int
    status: str
    user: UserInfo
    dispatcher: DispatcherInfo
    service_details: ServiceDetailsInfo
    created_at: datetime
    deleted_at: Optional[datetime] = None


class ListTicketUser(BaseModel):
    """Modelo de resposta de listagem de chamados do usuário"""

    id: int
    status: str
    name_service: str
    name_dispatcher: Optional[str] = None
    name_client: Optional[str] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None


class ListTicketUserResponse(RootModel):
    """Modelo de listagem para o ListTicketUser."""

    root: List[ListTicketUser]
