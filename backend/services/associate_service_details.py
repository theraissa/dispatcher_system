"""
Serviço responsável pela associação entre despachantes e serviços.
"""

from datetime import datetime

from flask import abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload

from database.tables import ServiceDetailsDB
from models.pagination import PaginatedResponse
from models.service_catalog import AssociateServiceDetailsResponse, UpdateAssociateServiceDetailsRequest


class AssociateServiceDetailsDispatcherService:
    """
    Serviço de domínio responsável pelo gerenciamento de vínculos entre
    despachantes e serviços.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def get_services_details_from_dispatcher(
        self,
        dispatcher_id: int,
        page: int = 1,
        per_page: int = 10,
    ) -> PaginatedResponse[AssociateServiceDetailsResponse]:
        """
        Lista os serviços detalhados vinculados a um despachante.

        Args:
            dispatcher_id (int): ID do despachante.
            page (int): Página atual da paginação.
            per_page (int): Quantidade de itens por página.
        Returns:
            PaginatedResponse[AssociateServiceDetailsResponse]:
                Lista paginada de serviços detalhados.
        """
        paginated = (
            ServiceDetailsDB.query.options(joinedload(ServiceDetailsDB.service))
            .filter(
                ServiceDetailsDB.dispatcher_id == dispatcher_id,
                ServiceDetailsDB.deleted_at.is_(None),
            )
            .paginate(
                page=page,
                per_page=per_page,
                error_out=False,
            )
        )
        response = [
            AssociateServiceDetailsResponse(
                id=detail.id,
                dispatcher_id=detail.dispatcher_id,
                service_id=detail.service.id,
                service_name=detail.service.name,
                price=detail.price,
                created_at=detail.created_at,
                updated_at=detail.updated_at,
                deleted_at=detail.deleted_at,
            )
            for detail in paginated.items
        ]
        return PaginatedResponse[AssociateServiceDetailsResponse].from_pagination(paginated, response)

    def add_service_for_dispatcher(self, dispatcher_id: int, service_id: int) -> dict:
        """
        Cria um vínculo entre um serviço e um despachante.

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço.

        Returns:
            dict: Mensagem de sucesso da operação.
        """
        existing = ServiceDetailsDB.query.filter_by(
            dispatcher_id=dispatcher_id,
            service_id=service_id,
            deleted_at=None,
        ).first()

        if existing:
            abort(400, description="Serviço já está vinculado ao despachante.")

        new_service = ServiceDetailsDB(
            dispatcher_id=dispatcher_id,
            service_id=service_id,
            price=0,
        )

        self.db.session.add(new_service)
        self.db.session.commit()

        return {"message": "Serviço vinculado com sucesso!"}

    def update_dispatcher_service_details(
        self,
        dispatcher_id: int,
        service_id: int,
        data: UpdateAssociateServiceDetailsRequest,
    ) -> dict:
        """
        Atualiza o serviço detalhado vínculo entre despachante e serviço.

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço.
            data (dict): Dados a serem atualizados.
        Returns:
            dict: Mensagem de sucesso da operação.
        """
        service_to_update = ServiceDetailsDB.query.filter(
            ServiceDetailsDB.dispatcher_id == dispatcher_id,
            ServiceDetailsDB.service_id == service_id,
            ServiceDetailsDB.deleted_at.is_(None),
        ).first()

        if not service_to_update:
            abort(404, description="Vínculo entre serviço e despachante não encontrado.")

        if "price" in data:
            service_to_update.price = data["price"]

        service_to_update.updated_at = datetime.now()
        self.db.session.commit()

        return {"message": "Serviço detalhado atualizado com sucesso!"}

    def delete_dispatcher_service_details(self, dispatcher_id: int, service_id: int) -> dict:
        """
        Remove (soft delete) o vínculo entre um serviço e um despachante.

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço.
        Returns:
            dict: Mensagem de sucesso da operação.
        """
        service_to_delete = ServiceDetailsDB.query.filter(
            ServiceDetailsDB.dispatcher_id == dispatcher_id,
            ServiceDetailsDB.service_id == service_id,
            ServiceDetailsDB.deleted_at.is_(None),
        ).first()

        if not service_to_delete:
            abort(404, description="Vínculo entre serviço e despachante não encontrado.")

        service_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return {"message": "Serviço desvinculado com sucesso!"}
