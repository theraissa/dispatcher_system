"""
Módulo com as tabelas do banco de dados
"""

from instances import db
from sqlalchemy import Column, DateTime, Integer
from sqlalchemy import String
from sqlalchemy.sql import func


class UserClient(db.Model): 
    """Representa um cliente"""

    __tablename__ = "user_client"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpf_cliente = Column(String, nullable=False)
    rg_cliente = Column(String, nullable=False)
    nome_cliente = Column(String, nullable=False)
    nasc_cliente = Column(String)
    tele_pessoal_cliente = Column(String)
    email_cliente = Column(String, nullable=False)
    senha_cliente = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))


class UserDispatcher(db.Model): 
    """Representa um despachante"""

    __tablename__ = "user_dispatcher"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpf_desp = Column(String, nullable=False)
    rg_desp = Column(String, nullable=False)
    nome_desp = Column(String, nullable=False)
    nasc_desp = Column(String)
    tele_pessoal_desp = Column(String)
    email_desp = Column(String, nullable=False)
    senha_desp = Column(String, nullable=False)
    regis_crdd = Column(String, nullable=False)
    data_exp_regis = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))
