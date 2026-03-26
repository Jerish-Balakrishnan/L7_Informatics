from flask import Flask
from flask_cors import CORS
from flask_smorest import Api

from .extensions import db
from .resources import actors_blp, directors_blp, genres_blp, movies_blp, reviews_blp


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.update(
        API_TITLE="Movie Explorer API",
        API_VERSION="v1",
        OPENAPI_VERSION="3.0.3",
        OPENAPI_URL_PREFIX="/",
        OPENAPI_SWAGGER_UI_PATH="/swagger-ui",
        OPENAPI_SWAGGER_UI_URL="https://cdn.jsdelivr.net/npm/swagger-ui-dist/",
        SQLALCHEMY_DATABASE_URI="sqlite:///movie_explorer.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    CORS(app)

    api = Api(app)
    api.register_blueprint(movies_blp)
    api.register_blueprint(actors_blp)
    api.register_blueprint(directors_blp)
    api.register_blueprint(genres_blp)
    api.register_blueprint(reviews_blp)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    with app.app_context():
        db.create_all()

    return app
