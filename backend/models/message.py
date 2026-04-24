"""
Modelos Pydantic relacionados ao TicketService.
"""

from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict, RootModel


class CreateMessageRequest(BaseModel):
    """Modelo de criação da mensagem"""

    user_id: int
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
