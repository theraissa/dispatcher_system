"""
Módulo com as tabelas do banco de dados.

📌 Sobre os relacionamentos (SQLAlchemy ORM)

Este projeto utiliza o SQLAlchemy ORM para mapear tabelas do banco em classes Python.
Abaixo estão alguns conceitos importantes para entender este arquivo:

🔗 relationship(...)
Define um relacionamento entre duas tabelas (ex: User → Address).

🔄 back_populates
Cria um relacionamento bidirecional entre duas entidades.

Exemplo:
    User.address  <->  Address.user

Isso significa que:
    user.address acessa o endereço
    address.user acessa o usuário

⚠️ IMPORTANTE:
Ambos os lados do relacionamento devem declarar o mesmo "back_populates".

---

📦 uselist=False
Indica que o relacionamento é 1:1 (um-para-um), e não uma lista.

Exemplo:
    user.dispatcher → retorna um único objeto (não uma lista)

Sem isso:
    user.ticket → retorna uma lista (1:N)
"""

# pylint: disable=not-callable

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.sql import func

from database import db


class UserDB(db.Model):
    """Representa um Usuário"""

    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpf = Column(String, nullable=False)
    name = Column(String, nullable=False)
    date_birth = Column(String)
    contact = Column(String)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    photo = Column(String)
    instagram = Column(String)
    website = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    address = db.relationship("AddressDB", back_populates="user", uselist=False)
    dispatcher = db.relationship("DispatcherDB", back_populates="user", uselist=False)
    ticket = db.relationship("TicketDB", back_populates="user")
    messages = db.relationship("TicketMessageDB", back_populates="user")
    timeline = db.relationship("TicketTimelineDB", back_populates="user")


class AddressDB(db.Model):
    """Representa um Endereço"""

    __tablename__ = "address"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True)
    contact = Column(String, nullable=False)
    address = Column(String, nullable=False)
    number = Column(Integer, nullable=False)
    neighborhood = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    user = db.relationship("UserDB", back_populates="address")


class DispatcherDB(db.Model):
    """Representa um Despachante"""

    __tablename__ = "dispatcher"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    regis_crdd = Column(String, nullable=False)
    date_exp_regis = Column(DateTime, nullable=False)
    status = Column(String, default="pendente", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    user = db.relationship("UserDB", back_populates="dispatcher")
    service_details = db.relationship("ServiceDetailsDB", back_populates="dispatcher")
    ticket = db.relationship("TicketDB", back_populates="dispatcher")


class ServiceDB(db.Model):
    """Representa um Serviço"""

    __tablename__ = "service"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    service_details = db.relationship("ServiceDetailsDB", back_populates="service")


class ServiceDetailsDB(db.Model):
    """Representa um Serviço Detalhado que estará vinculado ao despachante"""

    __tablename__ = "service_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_id = Column(Integer, ForeignKey("service.id"), nullable=False)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    service = db.relationship("ServiceDB", back_populates="service_details")
    dispatcher = db.relationship("DispatcherDB", back_populates="service_details")
    ticket = db.relationship("TicketDB", back_populates="service_details")


class TicketDB(db.Model):
    """Representa um Chamado de serviço"""

    __tablename__ = "ticket"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    service_details_id = Column(Integer, ForeignKey("service_details.id"), nullable=False)
    status = Column(String, default="pendente", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    user = db.relationship("UserDB", back_populates="ticket")
    dispatcher = db.relationship("DispatcherDB", back_populates="ticket")
    service_details = db.relationship("ServiceDetailsDB", back_populates="ticket")
    timeline = db.relationship("TicketTimelineDB", back_populates="ticket")
    messages = db.relationship("TicketMessageDB", back_populates="ticket")
    review = db.relationship("TicketReviewDB", back_populates="ticket", uselist=False)


class TicketTimelineDB(db.Model):
    """Representa eventos de histórico do chamado"""

    __tablename__ = "ticket_timeline"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("ticket.id"), nullable=False)
    action_by = Column(Integer, ForeignKey("user.id"), nullable=False)
    description = Column(String)
    status = Column(String, default="pendente", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    ticket = db.relationship("TicketDB", back_populates="timeline")
    user = db.relationship("UserDB", back_populates="timeline")


class TicketMessageDB(db.Model):
    """Representa as mensagens trocadas dentro de um chamado (Chat)"""

    __tablename__ = "ticket_message"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("ticket.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    message = Column(String, nullable=False)
    is_system_message = Column(db.Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True))

    ticket = db.relationship("TicketDB", back_populates="messages")
    user = db.relationship("UserDB", back_populates="messages")


class TicketReviewDB(db.Model):
    """Representa a avaliação final do cliente para o despachante"""

    __tablename__ = "ticket_review"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("ticket.id"), nullable=False, unique=True)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    user_name = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    ticket = db.relationship("TicketDB", back_populates="review")
