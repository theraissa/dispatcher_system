"""Script"""

from datetime import datetime

from werkzeug.security import generate_password_hash

from database import db
from database.tables import (
    AddressDB,
    DispatcherDB,
    ServiceDB,
    ServiceDetailsDB,
    UserDB,
)


def seed():
    """Script que roda manualmente e popula o banco."""

    if UserDB.query.first():
        print("Banco já possui dados. Seed ignorado.")
        return

    print("Iniciando seed...")
    # =========================
    # USERS
    # =========================
    new_password = generate_password_hash("1234")

    user1 = UserDB(
        name="Pedro Henrique",
        cpf="761.581.840-04",
        date_birth="2005-03-18",
        contact="55999999999",
        email="pedro@gmail.com",
        password=new_password,
        role="despachante",
        instagram="https://instagram.com/pedro",
        website="https://pedrodespachante.com",
    )

    user2 = UserDB(
        name="Maria Souza",
        cpf="425.055.810-02",
        date_birth="1998-07-10",
        contact="55888888888",
        email="maria@gmail.com",
        password=new_password,
        role="despachante",
        instagram="https://instagram.com/maria",
        website="https://mariadespachante.com",
    )

    user3 = UserDB(
        name="Despachante Teste",
        cpf="248.805.980-38",
        date_birth="1990-07-04",
        contact="55999999999",
        email="despachante@teste.com",
        password=new_password,
        role="despachante",
    )

    user4 = UserDB(
        name="Cliente Teste",
        cpf="662.388.620-68",
        date_birth="2000-07-04",
        contact="55999999999",
        email="cliente@teste.com",
        password=new_password,
        role="cliente",
    )

    admin = UserDB(
        name="Administrador",
        cpf="464.021.470-79",
        email="admin@teste.com",
        password=new_password,
        role="admin",
    )

    db.session.add_all([user1, user2, user3, admin])
    db.session.flush()

    # =========================
    # ADDRESS
    # =========================
    address1 = AddressDB(
        user_id=user1.id,
        contact="55999999999",
        address="Rua Central",
        number=123,
        neighborhood="Centro",
        zip_code="93800000",
        city="Sapiranga",
        state="RS",
    )

    address2 = AddressDB(
        user_id=user2.id,
        contact="55888888888",
        address="Av. Brasil",
        number=456,
        neighborhood="Centro",
        zip_code="90000000",
        city="Porto Alegre",
        state="RS",
    )

    address3 = AddressDB(
        user_id=user3.id,
        contact="55888888888",
        address="Endereço Teste",
        number=123,
        neighborhood="Bairro Teste",
        zip_code="95630000",
        city="Porto Alegre",
        state="RS",
    )

    address4 = AddressDB(
        user_id=user4.id,
        contact="55888888888",
        address="Endereço Teste",
        number=123,
        neighborhood="Bairro Teste",
        zip_code="95630000",
        city="Porto Alegre",
        state="RS",
    )

    db.session.add_all([address1, address2, address3, address4])
    db.session.flush()

    # =========================
    # DISPATCHERS
    # =========================
    dispatcher1 = DispatcherDB(
        user_id=user1.id,
        regis_crdd="CRDD123",
        date_exp_regis=datetime(2030, 7, 19),
    )

    dispatcher2 = DispatcherDB(
        user_id=user2.id,
        regis_crdd="CRDD456",
        date_exp_regis=datetime(2032, 5, 10),
    )

    dispatcher3 = DispatcherDB(
        user_id=user3.id,
        regis_crdd="CRDD789",
        date_exp_regis=datetime(2040, 4, 15),
    )

    db.session.add_all([dispatcher1, dispatcher2, dispatcher3])
    db.session.flush()

    # =========================
    # SERVICES
    # =========================
    services = [
        ServiceDB(name="Transferência de veículo", description="Transferência de propriedade"),
        ServiceDB(name="Licenciamento", description="Regularização anual do veículo"),
        ServiceDB(name="Emplacamento", description="Emissão de placa"),
        ServiceDB(name="2ª via de documento", description="Segunda via de documentos"),
        ServiceDB(name="Vistoria", description="Inspeção veicular"),
    ]

    db.session.add_all(services)
    db.session.flush()

    # =========================
    # SERVICE DETAILS
    # =========================
    service_details = [
        ServiceDetailsDB(
            service_id=services[0].id,
            dispatcher_id=dispatcher1.id,
            price=150.00,
        ),
        ServiceDetailsDB(
            service_id=services[1].id,
            dispatcher_id=dispatcher1.id,
            price=120.00,
        ),
        ServiceDetailsDB(
            service_id=services[2].id,
            dispatcher_id=dispatcher2.id,
            price=200.00,
        ),
        ServiceDetailsDB(
            service_id=services[3].id,
            dispatcher_id=dispatcher2.id,
            price=80.00,
        ),
        ServiceDetailsDB(
            service_id=services[4].id,
            dispatcher_id=dispatcher3.id,
            price=200.00,
        ),
        ServiceDetailsDB(
            service_id=services[1].id,
            dispatcher_id=dispatcher3.id,
            price=250.00,
        ),
    ]

    db.session.add_all(service_details)
    db.session.commit()

    print("✅ Seed executado com sucesso!")


if __name__ == "__main__":
    seed()
