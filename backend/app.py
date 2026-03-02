import os

from flask import Flask
from flask_cors import CORS
from database import db, migrate
import database.tables

def create_app():
    app = Flask(__name__)

    DATABASE_URL = "postgresql://admin:admin@database:5432/db-system"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    return app

app = create_app()

if __name__ == "__main__":
    # O host "0.0.0.0" é essencial no Docker para o app ser acessível fora do container
    app.run(host="0.0.0.0", port=5000, debug=True)
