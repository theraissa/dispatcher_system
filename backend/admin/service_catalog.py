"""
Serviço responsável pelo gerenciamento do catálogo de serviços.
"""

from datetime import datetime
from typing import Any

from flask import abort
from flask_sqlalchemy import SQLAlchemy

from database.tables import ServiceDB
from models.service_catalog import CreateServiceCatologRequest, ListServiceCatalogResponse, ServiceCatalogResponse


class ServiceCatalogService:
    """
    Serviço de domínio responsável pela gestão do catálogo de serviços.

    Args:
        db (SQLAlchemy): Sessão do SQLAlchemy utilizada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_service(self) -> ListServiceCatalogResponse:
        """
        Lista todos os serviços ativos no sistema.

        Apenas serviços não deletados (soft delete) são retornados.

        Returns:
            ListServiceCatalogResponse: Lista de serviços serializados.
        """
        services = ServiceDB.query.filter(
            ServiceDB.deleted_at.is_(None),
        ).all()

        response = ListServiceCatalogResponse(root=[ServiceCatalogResponse.model_validate(service) for service in services])

        return response.model_dump()

    def create_service(self, service_data: CreateServiceCatologRequest) -> dict[str, Any]:
        """
        Cria um novo serviço no catálogo.

        Args:
            service_data (CreateServiceCatologRequest): Dados validados do serviço.

        Returns:
            dict[str, Any]: Representação serializada do serviço criado.
        """
        new_service = ServiceDB(**service_data.model_dump(mode="json"))

        self.db.session.add(new_service)
        self.db.session.commit()

        return ServiceCatalogResponse.model_validate(new_service).model_dump()

    def update_service(self, service_id: str, service_data: CreateServiceCatologRequest) -> dict[str, Any]:
        """
        Atualiza os dados de um serviço existente.

        Args:
            service_id (str): Identificador do serviço.
            service_data (CreateServiceCatologRequest): Novos dados do serviço.

        Returns:
            dict[str, Any]: Serviço atualizado serializado.
        """
        service = ServiceDB.query.filter(
            ServiceDB.id == service_id,
            ServiceDB.deleted_at.is_(None),
        ).first()

        if not service:
            abort(404, description=f"Service with ID '{service_id}' not found.")

        for key, value in service_data.model_dump(mode="json").items():
            setattr(service, key, value)

        service.updated_at = datetime.now()
        self.db.session.commit()

        return ServiceCatalogResponse.model_validate(service).model_dump()

    def delete_service(self, service_id: str) -> dict[str, Any]:
        """
        Realiza a exclusão lógica (soft delete) de um serviço.

        Args:
            service_id (str): Identificador do serviço.

        Returns:
            dict[str, Any]: Dados do serviço após marcação de exclusão.
        """
        service = ServiceDB.query.filter(
            ServiceDB.id == service_id,
            ServiceDB.deleted_at.is_(None),
        ).first()

        if not service:
            abort(404, description=f"Service with ID '{service_id}' not found.")

        service.deleted_at = datetime.now()
        self.db.session.commit()

        return ServiceCatalogResponse.model_validate(service).model_dump()
