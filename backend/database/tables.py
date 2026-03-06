"""
Módulo com as tabelas do banco de dados
"""

from database import db
from sqlalchemy import Column, DateTime, Integer
from sqlalchemy import String, ForeignKey
from sqlalchemy.sql import func


class UserDB(db.Model): 
    """Representa um cliente"""

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


class DispatcherDB(db.Model): 
    """Representa um despachante"""

    __tablename__ = "dispatcher"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    regis_crdd = Column(String)
    date_exp_regis = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class OfficeDB(db.Model): 
    """Representa um despachante"""

    __tablename__ = "office"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    regis_crdd = Column(String)
    data_exp_regis = Column(DateTime)
    contact = Column(String)
    number = Column(Integer) 
    neighborhood = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))
