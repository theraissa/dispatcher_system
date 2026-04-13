"""
Módulo com implementação do serviço Service.
"""

from typing import Any
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from database.tables import ServiceDB, ServiceDetailsDB
from models.service import CreateServiceRequest, ServiceResponse, ListServiceResponse
from flask import abort


class Service:
    """
    Serviço para gerenciar serviços e vínculos com despachantes no banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_service(self) -> ListServiceResponse:
        """
        Recupera todos os serviços ativos (não deletados).

        Returns:
            ListServiceResponse: Lista de serviços disponíveis no sistema.
            Retorna uma lista vazia quando nenhum serviço estiver cadastrado.
        """
        services = ServiceDB.query.filter(ServiceDB.deleted_at.is_(None)).all()

        response = ListServiceResponse(root=[ServiceResponse.model_validate(s) for s in services])

        return response.model_dump()

    def create_service(self, service_data: CreateServiceRequest) -> dict[str, Any]:
        """
        Cria um novo serviço no sistema.

        Args:
            service_data (CreateServiceRequest): Dados do serviço a ser criado.

        Returns:
            dict[str, Any]: Objeto serializado do serviço recém-criado.
        """
        new_service = ServiceDB(**service_data.model_dump(mode="json"))

        self.db.session.add(new_service)
        self.db.session.commit()

        return ServiceResponse.model_validate(new_service).model_dump()

    def update_service(self, service_id: str, service_data: CreateServiceRequest) -> dict[str, Any]:
        """
        Atualiza um serviço existente pelo seu ID.

        Args:
            service_id (str): ID do serviço a ser atualizado.
            service_data (CreateServiceRequest): Dados atualizados do serviço.

        Returns:
            dict[str, Any]: Objeto serializado do serviço atualizado.
        """
        service_to_update = ServiceDB.query.filter(ServiceDB.id == service_id, ServiceDB.deleted_at.is_(None)).first()

        if not service_to_update:
            abort(404, description=f"Service with ID '{service_id}' not found.")

        for key, value in service_data.model_dump(mode="json").items():
            setattr(service_to_update, key, value)

        service_to_update.updated_at = datetime.now()
        self.db.session.commit()

        return ServiceResponse.model_validate(service_to_update).model_dump()

    def delete_service(self, service_id: str) -> dict[str, Any]:
        """
        Realiza a exclusão lógica (soft delete) de um serviço.

        Args:
            service_id (str): ID do serviço a ser removido.

        Returns:
            dict[str, Any]: Objeto serializado do serviço após remoção.
        """
        service_to_delete = ServiceDB.query.filter(ServiceDB.id == service_id, ServiceDB.deleted_at.is_(None)).first()

        if not service_to_delete:
            abort(404, description=f"Service with ID '{service_id}' not found.")

        service_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return ServiceResponse.model_validate(service_to_delete).model_dump()

    # ======================== Métodos de Vinculo ============================================

    def get_services_from_dispatcher(self, dispatcher_id: int) -> list[dict]:
        """
        Recupera todos os serviços vinculados a um despachante específico.

        Args:
            dispatcher_id (int): ID do despachante.

        Returns:
            list[dict]: Lista de serviços vinculados contendo:
                - service_id (int): ID do serviço
                - name (str): Nome do serviço
                - price (Decimal | None): Valor definido pelo despachante

            Retorna uma lista vazia caso o despachante não possua serviços vinculados.
        """
        results = (
            self.db.session.query(ServiceDB, ServiceDetailsDB)
            .join(ServiceDetailsDB, ServiceDB.id == ServiceDetailsDB.service_id)
            .filter(ServiceDetailsDB.dispatcher_id == dispatcher_id)
            .filter(ServiceDetailsDB.deleted_at.is_(None))
            .all()
        )

        return [
            {
                "id": detail.id,
                "service_id": service.id,
                "name": service.name,
                "price": detail.price,
            }
            for service, detail in results
        ]

    def add_service_for_dispatcher(self, dispatcher_id: int, service_id: int) -> dict:
        """
        Vincula um serviço existente a um despachante.

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço a ser vinculado.
        Returns:
            dict: Mensagem indicando sucesso na operação.
        """
        existing = ServiceDetailsDB.query.filter_by(dispatcher_id=dispatcher_id, service_id=service_id, deleted_at=None).first()

        if existing:
            abort(400, description="Serviço já vinculado")

        new = ServiceDetailsDB(dispatcher_id=dispatcher_id, service_id=service_id, price=0)

        self.db.session.add(new)
        self.db.session.commit()

        return {"message": "Serviço vinculado com sucesso"}

    def update_dispatcher_service(self, dispatcher_id: int, service_id: int, data: dict) -> dict:
        """
        Atualiza um serviço existente a um despachante.

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço a ser vinculado.
        Returns:
            dict: Mensagem indicando sucesso na operação.
        """
        service = ServiceDetailsDB.query.filter_by(dispatcher_id=dispatcher_id, service_id=service_id, deleted_at=None).first()

        if not service:
            abort(404, description="Serviço não encontrado")

        if "price" in data:
            service.price = data["price"]

        service.updated_at = datetime.now()
        self.db.session.commit()

        return {"message": "Atualizado com sucesso"}

    def remove_dispatcher_service(self, dispatcher_id: int, service_id: int) -> dict:
        """
        Remove (soft delete) o vínculo de um serviço com um despachante.

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço.

        Returns:
            dict: Mensagem indicando sucesso na remoção.
        """
        service = ServiceDetailsDB.query.filter_by(dispatcher_id=dispatcher_id, service_id=service_id, deleted_at=None).first()

        if not service:
            abort(404, description="Serviço não encontrado")

        service.deleted_at = datetime.now()
        self.db.session.commit()

        return {"message": "Serviço removido com sucesso"}
