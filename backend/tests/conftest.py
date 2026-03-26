import pytest

from app import create_app
from app.extensions import db
from app.models import Actor, Director, Genre, Movie, Review


@pytest.fixture()
def app():
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        }
    )
    with app.app_context():
        db.create_all()

        nolan = Director(name="Christopher Nolan")
        villeneuve = Director(name="Denis Villeneuve")

        sci_fi = Genre(name="Sci-Fi")
        drama = Genre(name="Drama")

        dicaprio = Actor(name="Leonardo DiCaprio")
        chalamet = Actor(name="Timothee Chalamet")

        inception = Movie(
            title="Inception",
            release_year=2010,
            director=nolan,
            actors=[dicaprio],
            genres=[sci_fi],
        )
        dune = Movie(
            title="Dune",
            release_year=2021,
            director=villeneuve,
            actors=[chalamet],
            genres=[sci_fi, drama],
        )

        db.session.add_all(
            [
                nolan,
                villeneuve,
                sci_fi,
                drama,
                dicaprio,
                chalamet,
                inception,
                dune,
                Review(movie=inception, rating=9, reviewer_name="A"),
            ]
        )
        db.session.commit()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()
