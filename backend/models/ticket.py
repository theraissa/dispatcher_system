"""
Modelos Pydantic relacionados ao TicketService.
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, RootModel

# ===============================================================
# ========== Modelos relacionado ao Ticket ==========


class CreateTicketRequest(BaseModel):
    """Modelo de criação de chamado."""

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

    model_config = ConfigDict(from_attributes=True)


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
    model_config = ConfigDict(from_attributes=True)


class TicketUserResponse(BaseModel):
    """Modelo de resposta dos chamados do Usuário"""

    id: int
    status: str
    user: UserInfo
    dispatcher: DispatcherInfo
    service_details: ServiceDetailsInfo
    created_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ListTicketUser(BaseModel):
    """Modelo de resposta de listagem de chamados do usuário"""

    id: int
    status: str
    name_service: str
    name_dispatcher: Optional[str] = None
    name_client: Optional[str] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DispatcherTicketStatisticsResponse(BaseModel):
    """Modelo de resposta das estastiscas de chamados do despachante"""

    pending: int
    in_progress: int
    finished_month: int
    monthly_revenue: float


# ===============================================================
# ========== Modelos relacionado ao Timeline do Ticket ==========


class TicketTimeline(str, Enum):
    """Enum para representar os status possíveis de um evento de timeline."""

    PENDENTE = "pendente"
    EM_ANDAMENTO = "em Andamento"
    FINALIZADO = "finalizado"
    ENCERRADO = "encerrado"


# Dicionário que define as transições válidas entre os status de um ticket.
VALID_TRANSITIONS = {
    TicketTimeline.PENDENTE: [TicketTimeline.EM_ANDAMENTO, TicketTimeline.ENCERRADO],
    TicketTimeline.EM_ANDAMENTO: [TicketTimeline.FINALIZADO, TicketTimeline.ENCERRADO],
    TicketTimeline.FINALIZADO: [],
    TicketTimeline.ENCERRADO: [],
}


class TimelineResponse(BaseModel):
    """Modelo de resposta do Timeline"""

    id: int
    description: str
    status: TicketTimeline
    action_by: Optional[int]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreateTimelineRequest(BaseModel):
    """Modelo de criação do Timeline"""

    description: str
    status: TicketTimeline


# ===============================================================
# ========== Modelos relacionado as Mensagens do Ticket ==========


class CreateMessageRequest(BaseModel):
    """Modelo de criação da mensagem"""

    message: str

    model_config = ConfigDict(extra="ignore")


class TicketMessageResponse(BaseModel):
    """Modelo de resposta da mensagem"""

    id: int
    user_id: int
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ListTicketMessageResponse(RootModel):
    """Modelo de listagem para o TicketMessageResponse."""

    root: List[TicketMessageResponse]


# ===============================================================
# ========== Modelos relacionado as Reviews do Ticket ==========


class CreateReviewRequest(BaseModel):
    """Modelo de criação do review"""

    rating: int
    comment: Optional[str] = None

    model_config = ConfigDict(extra="ignore")


class ReviewResponse(BaseModel):
    """Modelo de resposta do review"""

    id: int
    ticket_id: int
    name_user: str
    rating: int
    comment: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewSummaryResponse(BaseModel):
    """Modelo de resposta do review summary"""

    average_rating: float
    total_reviews: int

    model_config = ConfigDict(from_attributes=True)
