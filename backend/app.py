"""Módulo principal do backend"""

import os
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, Response, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity, jwt_required
from flask_migrate import upgrade
from werkzeug.exceptions import HTTPException

from admin.management import AdminService
from admin.service_catalog import ServiceCatalogService
from database import db, migrate
from database.tables import DispatcherDB
from models.auth import DispatcherStatusEnum, LoginUserRequest
from routes.dispatcher import register_dispatcher_routes
from routes.management import register_admin_routes
from routes.ticket import register_ticket_routes
from routes.user import register_users_routes
from services.associate_service_details import AssociateServiceDetailsDispatcherService
from services.auth import AuthService
from services.dispatcher import DispatcherService
from services.message import MessageService
from services.review import TicketReviewService
from services.ticket import TicketService
from services.timeline import TicketTimelineService
from services.user import UserService
from storage import redis_client


def create_app():
    """Cria a aplicação Flask."""

    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    jwt = JWTManager(app)

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

    # ========= Serviços ==========
    admin_service = AdminService(db)
    user_service = UserService(db)
    dispatcher_service = DispatcherService(db)
    auth_service = AuthService(db)
    associate_service = AssociateServiceDetailsDispatcherService(db)
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

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        """
        Verifica se o token JWT foi revogado.

        Este callback é executado automaticamente pelo Flask-JWT-Extended
        sempre que uma rota protegida com @jwt_required() é acessada.

        A verificação utiliza o identificador único do token (JTI),
        armazenado em uma blacklist no Redis durante o logout.

        Returns:
            bool:
                True  -> token revogado/inválido
                False -> token válido
        """
        jti = jwt_payload["jti"]

        if redis_client:
            return bool(redis_client.exists(f"blacklist:{jti}"))

        return False

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
    @jwt_required()
    def logout():
        """Deslogar"""
        auth_service.logout()
        return jsonify({"message": "Logout realizado com sucesso"}), 200

    @app.get("/api/dispatcher-system/me")
    @jwt_required()
    def get_me():
        """Retorna dados do usuário autenticado."""
        user_id = int(get_jwt_identity())
        return jsonify({"user_id": user_id}), 200

    @app.get("/api/dispatcher-system/uploads/profile/<path:filename>")
    def uploaded_files(filename):
        """Serve imagens de perfil dos usuários."""
        return send_from_directory("uploads/profile", filename)

    # ========= Job ==========

    def verify_expired_dispatchers():
        """
        Verifica diariamente se o registro CRDD do despachante de trânsito
        não está expirado, se sim, o seu cadastro dá como pendente novamente.
        """

        with app.app_context():
            now = datetime.now()

            dispatchers = DispatcherDB.query.filter(
                DispatcherDB.deleted_at.is_(None),
                DispatcherDB.date_exp_regis < now,
                DispatcherDB.status != DispatcherStatusEnum.PENDENTE,
            ).all()

            for dispatcher in dispatchers:
                dispatcher.status = DispatcherStatusEnum.PENDENTE

            if dispatchers:
                db.session.commit()

            return len(dispatchers)

    scheduler = BackgroundScheduler()

    scheduler.add_job(
        func=verify_expired_dispatchers,
        trigger="cron",
        hour=0,
        minute=0,
        id="verify_expired_dispatchers",
        replace_existing=True,
    )

    scheduler.start()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
