from datetime import datetime

from .extensions import db

movie_actors = db.Table(
    "movie_actors",
    db.Column("movie_id", db.Integer, db.ForeignKey("movies.id"), primary_key=True),
    db.Column("actor_id", db.Integer, db.ForeignKey("actors.id"), primary_key=True),
    db.Column("cast_order", db.Integer, nullable=True),
)

movie_genres = db.Table(
    "movie_genres",
    db.Column("movie_id", db.Integer, db.ForeignKey("movies.id"), primary_key=True),
    db.Column("genre_id", db.Integer, db.ForeignKey("genres.id"), primary_key=True),
)


class Director(db.Model):
    __tablename__ = "directors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    bio = db.Column(db.Text, nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    movies = db.relationship("Movie", back_populates="director", lazy="selectin")


class Actor(db.Model):
    __tablename__ = "actors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    bio = db.Column(db.Text, nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    movies = db.relationship(
        "Movie",
        secondary=movie_actors,
        back_populates="actors",
        lazy="selectin",
    )


class Genre(db.Model):
    __tablename__ = "genres"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    movies = db.relationship(
        "Movie",
        secondary=movie_genres,
        back_populates="genres",
        lazy="selectin",
    )


class Movie(db.Model):
    __tablename__ = "movies"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False, index=True)
    release_year = db.Column(db.Integer, nullable=False, index=True)
    duration_minutes = db.Column(db.Integer, nullable=True)
    synopsis = db.Column(db.Text, nullable=True)
    poster_url = db.Column(db.Text, nullable=True)
    director_id = db.Column(db.Integer, db.ForeignKey("directors.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    director = db.relationship("Director", back_populates="movies", lazy="joined")
    actors = db.relationship(
        "Actor",
        secondary=movie_actors,
        back_populates="movies",
        lazy="selectin",
    )
    genres = db.relationship(
        "Genre",
        secondary=movie_genres,
        back_populates="movies",
        lazy="selectin",
    )
    reviews = db.relationship(
        "Review", back_populates="movie", cascade="all, delete-orphan", lazy="selectin"
    )


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(
        db.Integer, db.ForeignKey("movies.id"), nullable=False, index=True
    )
    reviewer_name = db.Column(db.String(120), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    movie = db.relationship("Movie", back_populates="reviews", lazy="joined")
