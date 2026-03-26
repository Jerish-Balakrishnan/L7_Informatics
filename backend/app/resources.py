from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy import func

from .extensions import db
from .models import Actor, Director, Genre, Movie, Review
from .schemas import (
    ActorDetailSchema,
    ActorListFilterSchema,
    ActorSchema,
    DirectorDetailSchema,
    DirectorSchema,
    GenreSchema,
    MovieListFilterSchema,
    MovieSchema,
    PaginatedMoviesSchema,
    ReviewCreateSchema,
    ReviewSchema,
)

movies_blp = Blueprint(
    "Movies", __name__, url_prefix="/movies", description="Movie APIs"
)
actors_blp = Blueprint(
    "Actors", __name__, url_prefix="/actors", description="Actor APIs"
)
directors_blp = Blueprint(
    "Directors", __name__, url_prefix="/directors", description="Director APIs"
)
genres_blp = Blueprint(
    "Genres", __name__, url_prefix="/genres", description="Genre APIs"
)
reviews_blp = Blueprint("Reviews", __name__, description="Movie review APIs")


def movie_with_avg_rating_query():
    return (
        db.session.query(
            Movie,
            func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
        )
        .outerjoin(Review, Review.movie_id == Movie.id)
        .group_by(Movie.id)
    )


@movies_blp.route("")
class MovieListResource(MethodView):
    @movies_blp.arguments(MovieListFilterSchema, location="query")
    @movies_blp.response(200, PaginatedMoviesSchema)
    def get(self, filters):
        query = movie_with_avg_rating_query()

        if filters.get("genre_id"):
            query = query.join(Movie.genres).filter(Genre.id == filters["genre_id"])
        if filters.get("director_id"):
            query = query.filter(Movie.director_id == filters["director_id"])
        if filters.get("release_year"):
            query = query.filter(Movie.release_year == filters["release_year"])
        if filters.get("actor_id"):
            query = query.join(Movie.actors).filter(Actor.id == filters["actor_id"])
        if filters.get("search"):
            query = query.filter(Movie.title.ilike(f"%{filters['search']}%"))

        page = filters["page"]
        page_size = filters["page_size"]
        total = query.count()
        total_pages = (total + page_size - 1) // page_size if total else 0
        rows = query.offset((page - 1) * page_size).limit(page_size).all()

        items = []
        for movie, average_rating in rows:
            movie.average_rating = float(round(average_rating, 2))
            items.append(movie)

        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
        }


@movies_blp.route("/<int:movie_id>")
class MovieDetailResource(MethodView):
    @movies_blp.response(200, MovieSchema)
    def get(self, movie_id):
        row = movie_with_avg_rating_query().filter(Movie.id == movie_id).first()
        if not row:
            abort(404, message="Movie not found.")
        movie, average_rating = row
        movie.average_rating = float(round(average_rating, 2))
        return movie


@actors_blp.route("")
class ActorListResource(MethodView):
    @actors_blp.arguments(ActorListFilterSchema, location="query")
    @actors_blp.response(200, ActorSchema(many=True))
    def get(self, filters):
        query = Actor.query
        if filters.get("movie_id"):
            query = query.join(Actor.movies).filter(Movie.id == filters["movie_id"])
        if filters.get("genre_id"):
            query = query.join(Actor.movies).join(Movie.genres).filter(
                Genre.id == filters["genre_id"]
            )
        if filters.get("search"):
            query = query.filter(Actor.name.ilike(f"%{filters['search']}%"))

        return query.distinct().all()


@actors_blp.route("/<int:actor_id>")
class ActorDetailResource(MethodView):
    @actors_blp.response(200, ActorDetailSchema)
    def get(self, actor_id):
        actor = db.session.get(Actor, actor_id)
        if not actor:
            abort(404, message="Actor not found.")
        return actor


@directors_blp.route("")
class DirectorListResource(MethodView):
    @directors_blp.response(200, DirectorSchema(many=True))
    def get(self):
        return Director.query.order_by(Director.name.asc()).all()


@directors_blp.route("/<int:director_id>")
class DirectorDetailResource(MethodView):
    @directors_blp.response(200, DirectorDetailSchema)
    def get(self, director_id):
        director = db.session.get(Director, director_id)
        if not director:
            abort(404, message="Director not found.")
        return director


@genres_blp.route("")
class GenreListResource(MethodView):
    @genres_blp.response(200, GenreSchema(many=True))
    def get(self):
        return Genre.query.order_by(Genre.name.asc()).all()


@genres_blp.route("/<int:genre_id>")
class GenreDetailResource(MethodView):
    @genres_blp.response(200, GenreSchema)
    def get(self, genre_id):
        genre = db.session.get(Genre, genre_id)
        if not genre:
            abort(404, message="Genre not found.")
        return genre


@reviews_blp.route("/movies/<int:movie_id>/reviews")
class MovieReviewResource(MethodView):
    @reviews_blp.response(200, ReviewSchema(many=True))
    def get(self, movie_id):
        movie = db.session.get(Movie, movie_id)
        if not movie:
            abort(404, message="Movie not found.")
        return (
            Review.query.filter_by(movie_id=movie_id)
            .order_by(Review.id.desc())
            .all()
        )

    @reviews_blp.arguments(ReviewCreateSchema)
    @reviews_blp.response(201, ReviewSchema)
    def post(self, payload, movie_id):
        movie = db.session.get(Movie, movie_id)
        if not movie:
            abort(404, message="Movie not found.")
        review = Review(movie_id=movie_id, **payload)
        db.session.add(review)
        db.session.commit()
        return review
