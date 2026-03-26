from marshmallow import Schema, fields, validate


class DirectorSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    bio = fields.Str(allow_none=True)
    birth_date = fields.Date(allow_none=True)


class GenreSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str(allow_none=True)


class ActorSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    bio = fields.Str(allow_none=True)
    birth_date = fields.Date(allow_none=True)


class ReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    movie_id = fields.Int(dump_only=True)
    reviewer_name = fields.Str(allow_none=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=10))
    comment = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)


class ReviewCreateSchema(Schema):
    reviewer_name = fields.Str(allow_none=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=10))
    comment = fields.Str(allow_none=True)


class MovieSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    release_year = fields.Int(required=True, validate=validate.Range(min=1888))
    duration_minutes = fields.Int(allow_none=True, validate=validate.Range(min=1))
    synopsis = fields.Str(allow_none=True)
    poster_url = fields.Str(allow_none=True)
    director = fields.Nested(DirectorSchema)
    actors = fields.List(fields.Nested(ActorSchema))
    genres = fields.List(fields.Nested(GenreSchema))
    average_rating = fields.Float(dump_only=True)


class MovieBriefSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    release_year = fields.Int(required=True)


class ActorDetailSchema(ActorSchema):
    movies = fields.List(fields.Nested(MovieBriefSchema))


class DirectorDetailSchema(DirectorSchema):
    movies = fields.List(fields.Nested(MovieBriefSchema))


class MovieListFilterSchema(Schema):
    genre_id = fields.Int(load_default=None)
    director_id = fields.Int(load_default=None)
    release_year = fields.Int(load_default=None)
    actor_id = fields.Int(load_default=None)
    search = fields.Str(load_default=None)
    page = fields.Int(load_default=1, validate=validate.Range(min=1))
    page_size = fields.Int(
        load_default=12, data_key="page_size", validate=validate.Range(min=1, max=50)
    )


class PaginatedMoviesSchema(Schema):
    items = fields.List(fields.Nested(MovieSchema))
    page = fields.Int()
    page_size = fields.Int(data_key="page_size")
    total = fields.Int()
    total_pages = fields.Int(data_key="total_pages")


class ActorListFilterSchema(Schema):
    movie_id = fields.Int(load_default=None)
    genre_id = fields.Int(load_default=None)
    search = fields.Str(load_default=None)
