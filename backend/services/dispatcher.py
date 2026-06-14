"""
Serviço responsável pelo gerenciamento de despachantes no sistema.
"""

from datetime import datetime
from typing import Any

from flask import abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from werkzeug.security import generate_password_hash

from database.tables import AddressDB, DispatcherDB, ServiceDB, ServiceDetailsDB, UserDB
from models.auth import DispatcherStatusEnum, UserRoleEnum
from models.dispatcher import (
    CreateDispatcherFullRequest,
    DispatcherFullResponse,
    DispatcherResponse,
    UpdateDispatcherFullRequest,
)
from models.pagination import PaginatedResponse
from models.service_catalog import AssociateServiceDetailsResponse
from models.user import AddressResponse, UserResponse


class DispatcherService:
    """
    Serviço de domínio responsável pela gestão de despachantes.
    """

    def __init__(self, db: SQLAlchemy):
        self.db = db

    def list_dispatcher(self, page: int = 1, per_page: int = 10) -> PaginatedResponse[DispatcherFullResponse]:
        """
        Lista todos os despachantes ativos no sistema.
        Considera apenas registros não deletados (soft delete).

        Args:
            page (int): Página atual da paginação.
            per_page (int): Quantidade de itens por página.
        Returns:
            PaginatedResponse[DispatcherFullResponse]: Lista paginada de despachantes.
            Retorna lista vazia caso não existam registros.
        """
        paginated = (
            self.db.session.query(DispatcherDB)
            .options(joinedload(DispatcherDB.user).joinedload(UserDB.address))
            .filter(DispatcherDB.deleted_at.is_(None))
            .paginate(page=page, per_page=per_page, error_out=False)
        )
        response = [
            DispatcherFullResponse(
                user=UserResponse.model_validate(d.user),
                dispatcher=DispatcherResponse.model_validate(d),
                address=(AddressResponse.model_validate(d.user.address) if d.user.address else None),
            )
            for d in paginated.items
        ]
        return PaginatedResponse[DispatcherFullResponse].from_pagination(paginated, response)

    def get_dispatcher_by_id(self, dispatcher_id: int) -> DispatcherFullResponse:
        """
        Recupera os dados completos de um despachante pelo ID do despachante.

        Args:
            dispatcher_id (int): ID do despachante.
        Returns:
            DispatcherFullResponse: Lista os dados completos de um despachante.
        """
        dispatcher = (
            self.db.session.query(DispatcherDB)
            .options(
                joinedload(DispatcherDB.user),
                joinedload(DispatcherDB.user).joinedload(UserDB.address),
            )
            .filter(
                DispatcherDB.id == dispatcher_id,
                DispatcherDB.deleted_at.is_(None),
            )
            .first()
        )
        if not dispatcher:
            abort(404, description=f"Despachante com o ID {dispatcher_id} não foi encontrado.")

        return DispatcherFullResponse(
            user=UserResponse.model_validate(dispatcher.user),
            dispatcher=DispatcherResponse.model_validate(dispatcher),
            address=AddressResponse.model_validate(dispatcher.user.address) if dispatcher.user.address else None,
        )

    def create_dispatcher(self, data: CreateDispatcherFullRequest) -> dict[str, Any]:
        """
        Cria um novo despachante com todas as entidades relacionadas.

        Este processo inclui:
            - Criação do usuário
            - Criação do endereço
            - Criação do despachante
        Args:
            data (CreateDispatcherFullRequest): Dados completos para criação.
        Returns:
            dict[str, Any]: Retorna os identificadores das tabelas criadas.
        """
        existing_user = UserDB.query.filter_by(cpf=data.user.cpf).first()
        if existing_user:
            abort(400, description=f"Usuário com o CPF {data.user.cpf} já existe!")

        existing_email = UserDB.query.filter_by(email=data.user.email).first()
        if existing_email:
            abort(400, description=f"Usuário com o email {data.user.email} já existe!")

        existing_dispatcher = DispatcherDB.query.filter_by(regis_crdd=data.dispatcher.regis_crdd).first()
        if existing_dispatcher:
            abort(400, description="O registro CRDD já existe!")

        new_password = generate_password_hash(data.user.password)

        try:
            new_user = UserDB(
                cpf=data.user.cpf,
                name=data.user.name,
                date_birth=data.user.date_birth,
                contact=data.user.contact,
                email=data.user.email,
                password=new_password,
                role=UserRoleEnum.DESPACHANTE,
            )

            self.db.session.add(new_user)
            self.db.session.flush()

            new_address = AddressDB(
                user_id=new_user.id,
                contact=data.address.contact,
                number=int(data.address.number),
                neighborhood=data.address.neighborhood,
                address=data.address.address,
                city=data.address.city,
                state=data.address.state,
                zip_code=data.address.zip_code,
            )

            self.db.session.add(new_address)
            self.db.session.flush()

            new_dispatcher = DispatcherDB(
                user_id=new_user.id,
                regis_crdd=data.dispatcher.regis_crdd,
                date_exp_regis=data.dispatcher.date_exp_regis,
            )

            self.db.session.add(new_dispatcher)
            self.db.session.commit()

            return {
                "user_id": new_user.id,
                "dispatcher_id": new_dispatcher.id,
                "address_id": new_address.id,
            }

        except Exception as e:
            self.db.session.rollback()
            raise e

    def update_dispatcher_full(self, user_id: int, data: UpdateDispatcherFullRequest) -> dict:
        """
        Atualiza os dados completos de um despachante.

        Permite atualização parcial das seguintes entidades:
            - Usuário
            - Despachante
            - Escritório

        Apenas campos informados são atualizados.

        Args:
            user_id (int): ID do usuário associado ao despachante.
            data (UpdateDispatcherFullRequest): Dados atualizados.
        Returns:
            dict: Mensagem de sucesso da operação.
        """
        try:
            update_to_user = UserDB.query.filter(UserDB.id == user_id, UserDB.deleted_at.is_(None)).first()
            if not update_to_user:
                abort(404, description="Usuário com o ID {user_Id} não foi encontrado.")

            for key, value in data.user.model_dump(exclude_unset=True).items():
                setattr(update_to_user, key, value)

            update_to_dispatcher = DispatcherDB.query.filter_by(user_id=user_id).first()
            if update_to_dispatcher:
                for key, value in data.dispatcher.model_dump(exclude_unset=True).items():
                    setattr(update_to_dispatcher, key, value)

            update_to_address = AddressDB.query.filter_by(user_id=user_id).first()
            if update_to_address:
                for key, value in data.address.model_dump(exclude_unset=True).items():
                    setattr(update_to_address, key, value)

            self.db.session.commit()

            return {"message": "Perfil do despachante atualizado com sucesso!"}

        except Exception as e:
            self.db.session.rollback()
            raise e

    def delete_dispatcher(self, dispatcher_id: str) -> DispatcherResponse:
        """
        Realiza a exclusão lógica (soft delete) de um despachante.

        O registro não é removido fisicamente, apenas marcado com timestamp.

        Args:
            dispatcher_id (str): ID do despachante.
        Returns:
            DispatcherResponse: Dados do despachante após marcação de exclusão.
        """
        dispatcher_to_delete = DispatcherDB.query.filter(
            DispatcherDB.id == dispatcher_id,
            DispatcherDB.deleted_at.is_(None),
        ).first()
        if not dispatcher_to_delete:
            abort(404, description=f"Despachante com o ID '{dispatcher_id}' não foi encontrado.")

        dispatcher_to_delete.deleted_at = datetime.now()
        self.db.session.commit()

        return DispatcherResponse.model_validate(dispatcher_to_delete)

    def search_dispatchers(
        self,
        filters: str | None = None,
        page: int = 1,
        per_page: int = 10,
    ) -> PaginatedResponse[DispatcherFullResponse]:
        """
        Busca despachantes com filtros opcionais.
        Os filtros podem ser aplicados sobre: nome do usuário, cidade e nome do serviço

        Args:
            filters (str | None): Filtros utilizados na busca.
            page (int): Página atual da paginação.
            per_page (int): Quantidade de itens por página.
        Returns:
            PaginatedResponse[DispatcherFullResponse]: Lista paginada de despachantes.
        """
        # Se não houver termo ou for apenas espaços, retorna vazio direto
        if not filters or not filters.strip():
            return PaginatedResponse[DispatcherFullResponse](items=[], total=0, page=page, per_page=per_page, pages=0)

        # Query base carregando os relacionamentos necessários
        base_query = (
            self.db.session.query(DispatcherDB)
            .options(
                joinedload(DispatcherDB.user).joinedload(UserDB.address),
                joinedload(DispatcherDB.service_details).joinedload(ServiceDetailsDB.service),
            )
            .filter(DispatcherDB.deleted_at.is_(None))
            .filter(DispatcherDB.status == DispatcherStatusEnum.APROVADO)
        )

        # Montagem inteligente dos filtros usando a mesma string para os três cenários
        search_term = f"%{filters.strip()}%"

        search_filters = [
            # 1. Busca pelo nome do usuário usando .has() a partir do Dispatcher
            DispatcherDB.user.has(UserDB.name.ilike(search_term)),
            # 2. Busca pela cidade encadeando .has() (Dispatcher -> User -> Address)
            DispatcherDB.user.has(UserDB.address.has(AddressDB.city.ilike(search_term))),
            # 3. Busca cirúrgica na lista de serviços usando .any() (Dispatcher -> Lista de Serviços)
            DispatcherDB.service_details.any(ServiceDetailsDB.service.has(ServiceDB.name.ilike(search_term))),
        ]

        # Aplica o OR com segurança isolando a lógica
        base_query = base_query.filter(or_(*search_filters))

        # Paginação e montagem do response continuam exatamente iguais abaixo...
        paginated = base_query.distinct().paginate(
            page=page,
            per_page=per_page,
            error_out=False,
        )

        response = [
            DispatcherFullResponse(
                user=UserResponse.model_validate(dispatcher.user),
                dispatcher=DispatcherResponse.model_validate(dispatcher),
                address=(AddressResponse.model_validate(dispatcher.user.address) if dispatcher.user.address else None),
                service_details=[
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
                    for detail in dispatcher.service_details
                    if detail.deleted_at is None
                ],
            )
            for dispatcher in paginated.items
        ]
        return PaginatedResponse[DispatcherFullResponse].from_pagination(paginated, response)
