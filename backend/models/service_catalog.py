"""
Modelos Pydantic relacionados ao Service.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, RootModel

# ===============================================================
# ========== Modelos relacionado ao Service ==========


class CreateServiceCatologRequest(BaseModel):
    """Modelo de criação do Service."""

    name: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(extra="forbid")


class ServiceCatalogResponse(BaseModel):
    """Modelo de resposta para o Service."""

    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class ListServiceCatalogResponse(RootModel):
    """Modelo de listagem para o Service."""

    root: List[ServiceCatalogResponse]


# ===============================================================
# ========== Modelos relacionado ao Service Details ==========


class AssociateServiceDetailsResponse(BaseModel):
    """Resposta do vínculo entre despachante e serviço."""

    id: int
    service_id: int
    dispatcher_id: int
    price: float
    service_name: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UpdateAssociateServiceDetailsRequest(BaseModel):
    """Dados para atualização do vínculo."""

    price: float
