"""
Módulo com as tabelas do banco de dados
"""

from database import db
from sqlalchemy import Column, DateTime, Integer, Numeric
from sqlalchemy import String, ForeignKey
from sqlalchemy.sql import func


class UserDB(db.Model):
    """Representa um Usuário"""

    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpf = Column(String)
    rg = Column(String)
    name = Column(String)
    date_birth = Column(String)
    contact = Column(String)
    email = Column(String)
    password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class AddressDB(db.Model):
    """Representa um Endereço"""

    __tablename__ = "address"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    contact = Column(String)
    address = Column(String)
    number = Column(Integer)
    neighborhood = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class DispatcherDB(db.Model):
    """Representa um Despachante"""

    __tablename__ = "dispatcher"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    regis_crdd = Column(String)
    date_exp_regis = Column(DateTime)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class ProfileDB(db.Model):
    """Perfil público do despachante"""

    __tablename__ = "dispatcher_profile"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    photo = Column(String)
    instagram = Column(String)
    whatsapp = Column(String)
    website = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class OfficeDB(db.Model):
    """Representa um Estabelecimento"""

    __tablename__ = "office"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    contact = Column(String)
    number = Column(Integer)
    neighborhood = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class ServiceDB(db.Model):
    """Representa um Serviço"""

    __tablename__ = "service"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class ServiceDetailsDB(db.Model):
    """Representa um Serviço Detalhado que estará vinculado ao despachante"""

    __tablename__ = "service_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_id = Column(Integer, ForeignKey("service.id"), nullable=False)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    price = Column(Numeric(10, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class TicketDB(db.Model):
    """Representa um Chamado de serviço"""

    __tablename__ = "ticket"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("service.id"), nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))
