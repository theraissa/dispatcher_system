"""
Módulo principal do Administrador
"""

from datetime import datetime

from flask import abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload

from database.tables import DispatcherDB
from models.auth import StatusType


class AdminService:
    """
    Serviço para gerenciar despachantes e serviços do banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatchers_by_status(self) -> list[dict]:
        """
        Lista os despachantes com o status pendente.

        Returns:
            list[dict]: Lista de despachantes
        """
        dispatchers = (
            self.db.session.query(DispatcherDB)
            .options(joinedload(DispatcherDB.user))
            .filter(
                DispatcherDB.status == "pendente",
                DispatcherDB.deleted_at.is_(None),
            )
            .all()
        )

        return [
            {
                "id": dispatcher.id,
                "name": dispatcher.user.name,
                "email": dispatcher.user.email,
            }
            for dispatcher in dispatchers
        ]

    def update_dispatcher_status(self, dispatcher_id: int, status: StatusType) -> dict:
        """
        Atualizar o status do cadastro do despachante no sistema.

        Args:
            dispatcher_id (int): ID do despachante
            status (str): O novo status do cadastro do despachante.
        Returns:
            dict: Mensagem de sucesso
        """
        dispatcher = self.db.session.get(DispatcherDB, dispatcher_id)

        if not dispatcher:
            abort(404, description="Despachante com o ID {dispatcher_id} não encontrado")

        dispatcher.status = status
        dispatcher.updated_at = datetime.now()

        self.db.session.commit()

        return {"message": f"Despachante {status} com sucesso"}
