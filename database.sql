-- Movie Explorer Platform

-- =========================
-- Core entity tables
-- =========================

CREATE TABLE IF NOT EXISTS directors (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bio TEXT,
    birth_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actors (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bio TEXT,
    birth_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS genres (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT NOT NULL CHECK (release_year >= 1888), -- Motion picture introduced in 1888
    duration_minutes INT CHECK (duration_minutes > 0),
    synopsis TEXT,
    poster_url TEXT,
    director_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_movies_director
        FOREIGN KEY (director_id)
        REFERENCES directors (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =========================
-- Relationship tables
-- =========================

CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INT NOT NULL,
    actor_id INT NOT NULL,
    role_name VARCHAR(150),
    cast_order INT CHECK (cast_order > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (movie_id, actor_id),
    CONSTRAINT fk_movie_actors_movie
        FOREIGN KEY (movie_id)
        REFERENCES movies (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_movie_actors_actor
        FOREIGN KEY (actor_id)
        REFERENCES actors (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (movie_id, genre_id),
    CONSTRAINT fk_movie_genres_movie
        FOREIGN KEY (movie_id)
        REFERENCES movies (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_movie_genres_genre
        FOREIGN KEY (genre_id)
        REFERENCES genres (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================
-- Ratings / reviews
-- =========================

CREATE TABLE IF NOT EXISTS reviews (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    reviewer_name VARCHAR(120),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 10),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_movie
        FOREIGN KEY (movie_id)
        REFERENCES movies (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================
-- Indexes for filtering APIs
-- =========================

CREATE INDEX IF NOT EXISTS idx_movies_title ON movies (title);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies (release_year);
CREATE INDEX IF NOT EXISTS idx_movies_director_id ON movies (director_id);

CREATE INDEX IF NOT EXISTS idx_actors_name ON actors (name);
CREATE INDEX IF NOT EXISTS idx_directors_name ON directors (name);
CREATE INDEX IF NOT EXISTS idx_genres_name ON genres (name);

CREATE INDEX IF NOT EXISTS idx_movie_actors_actor_id ON movie_actors (actor_id);
CREATE INDEX IF NOT EXISTS idx_movie_actors_movie_id ON movie_actors (movie_id);

CREATE INDEX IF NOT EXISTS idx_movie_genres_genre_id ON movie_genres (genre_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_movie_id ON movie_genres (movie_id);

CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews (movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating);
