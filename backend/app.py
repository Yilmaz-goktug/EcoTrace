from flask import Flask
from flask_jwt_extended import JWTManager
from config import Config
from database import db, migrate
from models import bcrypt
from routes import register_routes


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    JWTManager(app)

    register_routes(app)
    return app


app = create_app()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
