"""
Modelos Pydantic relacionados ao TimelineService.
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, RootModel


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


class ListTimelineResponse(RootModel):
    """Modelo de listagem do Timeline"""

    root: List[TimelineResponse]


class CreateTimelineRequest(BaseModel):
    """Modelo de criação do Timeline"""

    description: str
    status: Optional[TicketTimeline]
