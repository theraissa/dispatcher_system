"""
Modelos Pydantic relacionados ao Service.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, RootModel


class CreateServiceRequest(BaseModel):
    """Modelo de criação do Service."""

    name: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(extra="forbid")


class ServiceResponse(BaseModel):
    """Modelo de resposta para o Service."""

    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class ListServiceResponse(RootModel):
    """Modelo de listagem para o Service."""

    root: List[ServiceResponse]
