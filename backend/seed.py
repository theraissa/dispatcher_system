"""Script"""

from datetime import datetime

from database import db
from database.tables import (
    UserDB,
    DispatcherDB,
    ProfileDB,
    OfficeDB,
    ServiceDB,
    ServiceDetailsDB,
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
    user1 = UserDB(
        name="Pedro Henrique",
        cpf="12345678900",
        rg="123456789",
        date_birth="2005-03-18",
        contact="55999999999",
        email="pedro@gmail.com",
        password="1234",
    )

    user2 = UserDB(
        name="Maria Souza",
        cpf="98765432100",
        rg="987654321",
        date_birth="1998-07-10",
        contact="55888888888",
        email="maria@gmail.com",
        password="1234",
    )

    db.session.add_all([user1, user2])
    db.session.flush()

    # =========================
    # DISPATCHERS
    # =========================
    dispatcher1 = DispatcherDB(
        user_id=user1.id,
        regis_crdd="CRDD123",
        date_exp_regis=datetime(2030, 7, 19),
        status="pending",
    )

    dispatcher2 = DispatcherDB(
        user_id=user2.id,
        regis_crdd="CRDD456",
        date_exp_regis=datetime(2032, 5, 10),
        status="pending",
    )

    db.session.add_all([dispatcher1, dispatcher2])
    db.session.flush()

    # =========================
    # DISPATCHER PROFILE (NOVO)
    # =========================
    profile1 = ProfileDB(
        dispatcher_id=dispatcher1.id,
        photo="https://i.pravatar.cc/200?img=1",
        instagram="https://instagram.com/pedro",
        whatsapp="55999999999",
        website="https://pedrodespachante.com",
    )

    profile2 = ProfileDB(
        dispatcher_id=dispatcher2.id,
        photo="https://i.pravatar.cc/200?img=2",
        instagram="https://instagram.com/maria",
        whatsapp="55888888888",
        website="https://mariadespachante.com",
    )

    db.session.add_all([profile1, profile2])
    db.session.flush()

    # =========================
    # OFFICES
    # =========================
    office1 = OfficeDB(
        dispatcher_id=dispatcher1.id,
        contact="55999999999",
        address="Rua Central",
        number=123,
        neighborhood="Centro",
        zip_code="93800000",
        city="Sapiranga",
        state="RS",
    )

    office2 = OfficeDB(
        dispatcher_id=dispatcher2.id,
        contact="55888888888",
        address="Av. Brasil",
        number=456,
        neighborhood="Centro",
        zip_code="90000000",
        city="Porto Alegre",
        state="RS",
    )

    db.session.add_all([office1, office2])
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
    ]

    db.session.add_all(service_details)

    db.session.commit()

    print("✅ Seed executado com sucesso!")


if __name__ == "__main__":
    seed()
