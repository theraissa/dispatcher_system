"""
Modelos Pydantic relacionados ao TicketReviewService.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class CreateReviewRequest(BaseModel):
    """Modelo de criação do review"""

    user_id: int
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
