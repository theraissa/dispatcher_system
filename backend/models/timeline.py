"""
Modelos Pydantic relacionados ao TimelineService.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, RootModel


class TimelineResponse(BaseModel):
    """Modelo de resposta do Timeline"""

    id: int
    description: str
    status: str
    action_by: Optional[int]
    created_at: datetime


class ListTimelineResponse(RootModel):
    """Modelo de listagem do Timeline"""

    root: List[TimelineResponse]


class CreateTimelineRequest(BaseModel):
    """Modelo de criação do Timeline"""

    description: str
    action_by: Optional[int]
    status: Optional[str]
