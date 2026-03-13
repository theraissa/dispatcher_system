"""Módulo principal do backend"""

# pylint: disable=redefined-outer-name

from database import db, migrate
from flask import Flask
from flask_cors import CORS
from flask_migrate import upgrade
from routes.dispatcher import register_dispatcher_routes
from routes.user import register_users_routes
from services.dispatcher import DispatcherService
from services.user import UserService


def create_app():
    """Cria a aplicação Flask."""

    app = Flask(__name__)

    # ========= Configurações do banco de dados ==========
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://admin:admin@database:5432/db-system"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ========= Necessário para que as rotas possam usar db.session ==========
    db.init_app(app)
    migrate.init_app(app, db)

    # ========= Aplica as Migrações ==========
    with app.app_context():
        upgrade()

    # ========= Configurações de CORS ==========
    CORS(app)

    # ================= Rotas de healthcheck ====================
    @app.get("/")
    def is_alive() -> str:
        return "I'm alive!"

    # ========= Injeção de dependências ==========
    user_service = UserService(db)
    dispatcher_service = DispatcherService(db)

    # ================= Rotas do sistema ====================
    register_users_routes(app, user_service)
    register_dispatcher_routes(app, dispatcher_service)

    return app


app = create_app()

if __name__ == "__main__":
    # O host "0.0.0.0" é essencial no Docker para o app ser acessível fora do container
    app.run(host="0.0.0.0", port=5000, debug=True)
