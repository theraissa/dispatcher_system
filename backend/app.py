"""Módulo principal do backend"""

from flask import Flask, Response, jsonify, request, g
from flask_cors import CORS
from flask_migrate import upgrade

from database import db, migrate
from routes.management import register_admin_routes
from routes.dispatcher import register_dispatcher_routes
from routes.user import register_users_routes
from routes.service import register_service_routes
from routes.ticket import register_ticket_routes
from services.dispatcher import DispatcherService
from services.user import UserService
from services.auth import AuthService
from services.service import Service
from services.ticket import TicketService
from seed import seed
from admin.management import AdminService
from werkzeug.exceptions import HTTPException
from require_auth import require_auth
from models.auth import LoginUserRequest


def create_app():
    """Cria a aplicação Flask."""

    app = Flask(__name__)

    # ========= Configuração do banco ==========
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://admin:admin@database:5432/db-system"
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
    service = Service(db)
    ticket_service = TicketService(db)

    # ========= Rotas ==========
    register_admin_routes(app, admin_service)
    register_users_routes(app, user_service)
    register_dispatcher_routes(app, dispatcher_service)
    register_service_routes(app, service)
    register_ticket_routes(app, ticket_service)

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
