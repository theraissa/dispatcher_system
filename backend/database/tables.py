"""
Módulo com as tabelas do banco de dados
"""

# pylint: disable=not-callable

from database import db
from sqlalchemy import Column, DateTime, Integer, Numeric
from sqlalchemy import String, ForeignKey
from sqlalchemy.sql import func


class UserDB(db.Model):
    """Representa um Usuário"""

    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpf = Column(String)
    name = Column(String)
    date_birth = Column(String)
    contact = Column(String)
    email = Column(String)
    password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    # Um UserDB tem um relacionamento com AddressDB, acessível pelo atributo address
    address = db.relationship("AddressDB", back_populates="user", uselist=False)

    # Um UserDB tem um relacionamento com DispatcherDB, acessível pelo atributo dispatcher
    dispatcher = db.relationship("DispatcherDB", back_populates="user", uselist=False)

    # Um UserDB tem um relacionamento com TicketDB, acessível pelo atributo ticket
    ticket = db.relationship("TicketDB", back_populates="user")

    # Um UserDB tem um relacionamento com TicketMessageDB, acessível pelo atributo messages
    messages = db.relationship("TicketMessageDB", back_populates="user")


class AddressDB(db.Model):
    """Representa um Endereço"""

    __tablename__ = "address"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True)
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

    # Um AddressDB tem um relacionamento com UserDB, acessível pelo atributo user
    user = db.relationship("UserDB", back_populates="address")


class DispatcherDB(db.Model):
    """Representa um Despachante"""

    __tablename__ = "dispatcher"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    regis_crdd = Column(String)
    date_exp_regis = Column(DateTime)
    status = Column(String, default="pendente")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    # Um DispatcherDB tem um relacionamento com UserDB, acessível pelo atributo user
    user = db.relationship("UserDB", back_populates="dispatcher")

    # Um DispatcherDB tem um relacionamento com ProfileDB, acessível pelo atributo profile
    profile = db.relationship("ProfileDB", back_populates="dispatcher", uselist=False)

    # Um DispatcherDB tem um relacionamento com OfficeDB, acessível pelo atributo office
    office = db.relationship("OfficeDB", back_populates="dispatcher", uselist=False)

    # Um DispatcherDB tem um relacionamento com ServiceDetailsDB, acessível pelo atributo service_details
    service_details = db.relationship("ServiceDetailsDB", back_populates="dispatcher")

    # Um DispatcherDB tem um relacionamento com TicketDB, acessível pelo atributo ticket
    ticket = db.relationship("TicketDB", back_populates="dispatcher")


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

    # Um ProfileDB tem um relacionamento com DispatcherDB, acessível pelo atributo dispatcher
    dispatcher = db.relationship("DispatcherDB", back_populates="profile")


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

    # Um OfficeDB tem um relacionamento com DispatcherDB, acessível pelo atributo dispatcher
    dispatcher = db.relationship("DispatcherDB", back_populates="office")


class ServiceDB(db.Model):
    """Representa um Serviço"""

    __tablename__ = "service"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    # Um ServiceDB tem um relacionamento com ServiceDetailsDB, acessível pelo atributo service_details
    service_details = db.relationship("ServiceDetailsDB", back_populates="service")


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

    # Um ServiceDetailsDB tem um relacionamento com ServiceDB, acessível pelo atributo service
    service = db.relationship("ServiceDB", back_populates="service_details")

    # Um ServiceDetailsDB tem um relacionamento com DispatcherDB, acessível pelo atributo dispatcher
    dispatcher = db.relationship("DispatcherDB", back_populates="service_details")

    # Um ServiceDetailsDB tem um relacionamento com TicketDB, acessível pelo atributo ticket
    ticket = db.relationship("TicketDB", back_populates="service_details")


class TicketDB(db.Model):
    """Representa um Chamado de serviço"""

    __tablename__ = "ticket"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    service_details_id = Column(Integer, ForeignKey("service_details.id"), nullable=False)
    status = Column(String, default="pendente")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    # Um TicketDB tem um relacionamento com UserDB, acessível pelo atributo user
    user = db.relationship("UserDB", back_populates="ticket")

    # Um TicketDB tem um relacionamento com DispatcherDB, acessível pelo atributo dispatcher
    dispatcher = db.relationship("DispatcherDB", back_populates="ticket")

    # Um TicketDB tem um relacionamento com ServiceDetailsDB, acessível pelo atributo service_details
    service_details = db.relationship("ServiceDetailsDB", back_populates="ticket")

    # Um TicketDB tem um relacionamento com TicketTimelineDB, acessível pelo atributo timeline
    timeline = db.relationship("TicketTimelineDB", back_populates="ticket")

    # Um TicketDB tem um relacionamento com TicketMessageDB, acessível pelo atributo messages
    messages = db.relationship("TicketMessageDB", back_populates="ticket")

    # Um TicketDB tem um relacionamento com TicketReviewDB, acessível pelo atributo review
    review = db.relationship("TicketReviewDB", back_populates="ticket", uselist=False)


class TicketTimelineDB(db.Model):
    """Representa eventos de histórico do chamado (Ex: 'Status alterado para em andamento')"""

    __tablename__ = "ticket_timeline"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("ticket.id"), nullable=False)
    description = Column(String, nullable=False)
    action_by = Column(Integer, ForeignKey("user.id"))
    status = Column(String, default="pendente")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Um TicketTimelineDB tem um relacionamento com TicketDB, acessível pelo atributo ticket
    ticket = db.relationship("TicketDB", back_populates="timeline")


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

    # Um TicketMessageDB tem um relacionamento com TicketDB, acessível pelo atributo ticket
    ticket = db.relationship("TicketDB", back_populates="messages")

    # Um TicketMessageDB tem um relacionamento com UserDB, acessível pelo atributo user
    user = db.relationship("UserDB", back_populates="messages")


class TicketReviewDB(db.Model):
    """Representa a avaliação final do cliente para o despachante"""

    __tablename__ = "ticket_review"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("ticket.id"), nullable=False, unique=True)
    dispatcher_id = Column(Integer, ForeignKey("dispatcher.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Um TicketReviewDB tem um relacionamento com TicketDB, acessível pelo atributo ticket
    ticket = db.relationship("TicketDB", back_populates="review")
