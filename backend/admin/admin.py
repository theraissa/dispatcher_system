"""
Módulo principal do Administrador
"""

from datetime import datetime
from database.tables import DispatcherDB, UserDB
from flask_sqlalchemy import SQLAlchemy
from flask import abort


class AdminService:
    """
    Serviço para gerenciar despachantes e serviços do banco de dados.

    Args:
        db (SQLAlchemy): Sessão de banco de dados usada para persistência.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatchers_by_status(self, status: str) -> list[dict]:
        """
        Lista despachantes filtrando por status.

        Args:
            status (str): pending | approved | rejected

        Returns:
            list[dict]: Lista de despachantes
        """
        dispatchers = (
            self.db.session.query(DispatcherDB, UserDB)
            .join(UserDB, DispatcherDB.user_id == UserDB.id)
            .filter(DispatcherDB.status == status)
            .filter(DispatcherDB.deleted_at.is_(None))
            .all()
        )
        return [
            {
                "id": dispatcher.id,
                "name": user.name,
                "email": user.email,
            }
            for dispatcher, user in dispatchers
        ]

    def approve_dispatcher(self, dispatcher_id: int) -> dict:
        """
        Aprova um despachante.

        Args:
            dispatcher_id (int): ID do despachante

        Returns:
            dict: Mensagem de sucesso
        """
        dispatcher = DispatcherDB.query.get(dispatcher_id)

        if not dispatcher:
            abort(404, description="Despachante não encontrado")

        dispatcher.status = "approved"
        dispatcher.updated_at = datetime.now()

        self.db.session.commit()

        return {"message": "Despachante aprovado com sucesso"}

    def reject_dispatcher(self, dispatcher_id: int) -> dict:
        """
        Reprova um despachante.

        Args:
            dispatcher_id (int): ID do despachante

        Returns:
            dict: Mensagem de sucesso
        """
        dispatcher = DispatcherDB.query.get(dispatcher_id)

        if not dispatcher:
            abort(404, description="Despachante não encontrado")

        dispatcher.status = "rejected"
        dispatcher.updated_at = datetime.now()

        self.db.session.commit()

        return {"message": "Despachante reprovado com sucesso"}
