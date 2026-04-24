"""
Serviço responsável pela associação entre despachantes e serviços.
"""

from datetime import datetime

from flask import abort
from flask_sqlalchemy import SQLAlchemy

from database.tables import ServiceDB, ServiceDetailsDB


class AssociateServiceDispatcherService:
    """
    Serviço de domínio responsável pelo gerenciamento de vínculos entre
    despachantes e serviços.


    Attributes:
        db (SQLAlchemy): Instância de acesso ao banco de dados.
    """

    def __init__(self, db: SQLAlchemy):
        """
        Inicializa o serviço com a instância do banco de dados.

        Args:
            db (SQLAlchemy): Sessão do SQLAlchemy utilizada para persistência.
        """
        self.db = db

    def get_services_from_dispatcher(self, dispatcher_id: int) -> list[dict]:
        """
        Lista todos os serviços vinculados a um despachante.

        Args:
            dispatcher_id (int): ID do despachante.

        Returns:
            list[dict]: Lista de serviços contendo:
                - id (int): ID do vínculo
                - service_id (int): ID do serviço
                - name (str): Nome do serviço
                - price (float): Valor definido pelo despachante
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
            abort(400, description="Serviço já vinculado ao despachante.")

        new = ServiceDetailsDB(
            dispatcher_id=dispatcher_id,
            service_id=service_id,
            price=0,
        )

        self.db.session.add(new)
        self.db.session.commit()

        return {"message": "Serviço vinculado com sucesso."}

    def update_dispatcher_service(
        self,
        dispatcher_id: int,
        service_id: int,
        data: dict,
    ) -> dict:
        """
        Atualiza os dados do vínculo entre despachante e serviço.

        Atualmente permite:
            - Atualização do preço do serviço para o despachante

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço.
            data (dict): Dados a serem atualizados (ex: {"price": float}).

        Returns:
            dict: Mensagem de sucesso da operação.
        """
        service = ServiceDetailsDB.query.filter_by(
            dispatcher_id=dispatcher_id,
            service_id=service_id,
            deleted_at=None,
        ).first()

        if not service:
            abort(404, description="Vínculo entre serviço e despachante não encontrado.")

        if "price" in data:
            service.price = data["price"]

        service.updated_at = datetime.now()
        self.db.session.commit()

        return {"message": "Vínculo atualizado com sucesso."}

    def remove_dispatcher_service(self, dispatcher_id: int, service_id: int) -> dict:
        """
        Remove (soft delete) o vínculo entre um serviço e um despachante.

        Args:
            dispatcher_id (int): ID do despachante.
            service_id (int): ID do serviço.

        Returns:
            dict: Mensagem de sucesso da operação.
        """
        service = ServiceDetailsDB.query.filter_by(
            dispatcher_id=dispatcher_id,
            service_id=service_id,
            deleted_at=None,
        ).first()

        if not service:
            abort(404, description="Vínculo entre serviço e despachante não encontrado.")

        service.deleted_at = datetime.now()
        self.db.session.commit()

        return {"message": "Serviço desvinculado com sucesso."}
