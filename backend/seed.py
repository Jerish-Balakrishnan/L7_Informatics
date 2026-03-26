from app import create_app
from app.extensions import db
from app.models import Actor, Director, Genre, Movie, Review


def seed():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        directors = [
            Director(name="Christopher Nolan"),
            Director(name="Denis Villeneuve"),
            Director(name="Greta Gerwig"),
            Director(name="Quentin Tarantino"),
            Director(name="Martin Scorsese"),
            Director(name="Sofia Coppola"),
            Director(name="Jordan Peele"),
            Director(name="Patty Jenkins"),
            Director(name="David Fincher"),
            Director(name="Chloe Zhao"),
        ]

        genres = [
            Genre(name="Sci-Fi", description="Science fiction"),
            Genre(name="Drama", description="Drama films"),
            Genre(name="Action", description="Action films"),
            Genre(name="Thriller", description="Thriller films"),
            Genre(name="Comedy", description="Comedy films"),
            Genre(name="Romance", description="Romance films"),
            Genre(name="Adventure", description="Adventure films"),
            Genre(name="Mystery", description="Mystery films"),
        ]

        actors = [Actor(name=f"Actor {index}") for index in range(1, 41)]

        db.session.add_all([*directors, *genres, *actors])
        db.session.flush()

        movies: list[Movie] = []
        for index in range(1, 101):
            director = directors[(index - 1) % len(directors)]
            movie = Movie(
                title=f"Movie {index}",
                release_year=1985 + (index % 40),
                duration_minutes=90 + (index % 60),
                synopsis=f"Synopsis for Movie {index}.",
                poster_url=f"https://picsum.photos/seed/movie-{index}/400/600",
                director=director,
            )
            movie.actors = [
                actors[(index * 2) % len(actors)],
                actors[(index * 2 + 1) % len(actors)],
                actors[(index * 2 + 2) % len(actors)],
            ]
            movie.genres = [
                genres[index % len(genres)],
                genres[(index + 3) % len(genres)],
            ]
            movies.append(movie)

        db.session.add_all(movies)
        db.session.flush()

        reviews: list[Review] = []
        for index, movie in enumerate(movies, start=1):
            reviews.append(
                Review(
                    movie=movie,
                    reviewer_name=f"Reviewer {index}",
                    rating=6 + (index % 5),
                    comment=f"Review for {movie.title}",
                )
            )
        db.session.add_all(reviews)
        db.session.commit()


if __name__ == "__main__":
    seed()
