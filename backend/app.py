"""Módulo principal do backend"""

import os

from flask import Flask, Response, g, jsonify, request
from flask_cors import CORS
from flask_migrate import upgrade
from werkzeug.exceptions import HTTPException

from admin.management import AdminService
from admin.service_catalog import ServiceCatalogService
from database import db, migrate
from models.auth import LoginUserRequest
from require_auth import require_auth
from routes.dispatcher import register_dispatcher_routes
from routes.management import register_admin_routes
from routes.ticket import register_ticket_routes
from routes.user import register_users_routes
from seed import seed
from services.associate_service_dispatcher import AssociateServiceDispatcherService
from services.auth import AuthService
from services.dispatcher import DispatcherService
from services.message import MessageService
from services.review import TicketReviewService
from services.ticket import TicketService
from services.timeline import TicketTimelineService
from services.user import UserService


def create_app():
    """Cria a aplicação Flask."""

    app = Flask(__name__)

    # ========= Configuração do banco ==========
    database_url = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ========= Inicialização das extensões ==========
    db.init_app(app)
    migrate.init_app(app, db)

    # ========= CORS ==========
    CORS(app)

    # ========= Migrações ==========
    with app.app_context():
        upgrade()
        seed()

    # ========= Serviços ==========
    admin_service = AdminService(db)
    user_service = UserService(db)
    dispatcher_service = DispatcherService(db)
    auth_service = AuthService(db)
    associate_service = AssociateServiceDispatcherService(db)
    timeline_service = TicketTimelineService(db)
    ticket_service = TicketService(db)
    message_service = MessageService(db)
    review_service = TicketReviewService(db)
    catalog_service = ServiceCatalogService(db)

    # ========= Rotas ==========
    register_admin_routes(app, admin_service, catalog_service)
    register_users_routes(app, user_service)
    register_dispatcher_routes(
        app,
        dispatcher_service,
        associate_service,
    )
    register_ticket_routes(
        app,
        ticket_service,
        message_service,
        timeline_service,
        review_service,
    )

    # ========= Healthcheck e Login==========
    @app.get("/")
    def is_alive():
        return "I'm alive!"

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return (
            jsonify(
                {
                    "error": e.name,
                    "description": e.description,
                }
            ),
            e.code,
        )

    @app.post("/api/dispatcher-system/login")
    def login() -> Response:
        """Logar"""
        body = LoginUserRequest.model_validate(request.get_json())
        user = auth_service.login(body)
        return jsonify(user.model_dump()), 200

    @app.post("/api/dispatcher-system/logout")
    @require_auth
    def logout():
        """Deslogar"""
        auth_header = request.headers.get("Authorization")
        token = auth_header.split(" ")[1]
        auth_service.logout(token)
        return jsonify({"message": "Logout realizado com sucesso"}), 200

    @app.get("/api/dispatcher-system/me")
    @require_auth
    def get_me():
        """Rota protegida para testar autenticação."""
        user_id = g.user_id
        return jsonify({"user_id": user_id}), 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
