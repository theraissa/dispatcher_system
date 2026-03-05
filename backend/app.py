"""Módulo principal do backend"""

import os
import database.tables # para identificar onde está as tables

from flask import Flask
from flask_migrate import upgrade
from flask_cors import CORS
from database import db, migrate
from services.user_client import UserClientService
from routes.client import register_client_routes
from routes.dispatcher import register_dispatcher_routes
from services.user_dispatcher import UserDispatcherService

def create_app():
    """Cria a aplicação Flask."""

    app = Flask(__name__)

    # ========= Configurações do banco de dados ==========
    DATABASE_URL = "postgresql://admin:admin@database:5432/db-system"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
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
    user_client_service = UserClientService(db)
    user_dispatcher_service = UserDispatcherService(db)

    # ================= Rotas do sistema ====================
    register_client_routes(app, user_client_service)
    register_dispatcher_routes(app, user_dispatcher_service)

    return app

app = create_app()

if __name__ == "__main__":
    # O host "0.0.0.0" é essencial no Docker para o app ser acessível fora do container
    app.run(host="0.0.0.0", port=5000, debug=True)
