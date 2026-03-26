def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_movies_list(client):
    response = client.get("/movies")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total"] == 2
    assert len(data["items"]) == 2


def test_movies_filter_by_release_year(client):
    response = client.get("/movies?release_year=2010")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Inception"


def test_movies_filter_by_director(client):
    response = client.get("/movies?director_id=2")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Dune"


def test_movies_filter_by_actor(client):
    response = client.get("/movies?actor_id=1")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Inception"


def test_movies_filter_by_genre(client):
    response = client.get("/movies?genre_id=2")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Dune"


def test_movies_pagination(client):
    response = client.get("/movies?page=2&page_size=1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["page"] == 2
    assert data["page_size"] == 1
    assert data["total"] == 2
    assert data["total_pages"] == 2
    assert len(data["items"]) == 1


def test_actors_filter_by_movie(client):
    response = client.get("/actors?movie_id=1")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]["name"] == "Leonardo DiCaprio"


def test_actors_filter_by_genre(client):
    response = client.get("/actors?genre_id=2")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]["name"] == "Timothee Chalamet"


def test_movie_not_found(client):
    response = client.get("/movies/999")
    assert response.status_code == 404


def test_invalid_filter_type(client):
    response = client.get("/movies?release_year=abc")
    assert response.status_code == 422


def test_create_review(client):
    payload = {"reviewer_name": "User", "rating": 8, "comment": "Good"}
    response = client.post("/movies/1/reviews", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data["rating"] == 8


def test_actor_profile_includes_movies(client):
    response = client.get("/actors/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["movies"][0]["title"] == "Inception"


def test_director_profile_includes_movies(client):
    response = client.get("/directors/2")
    assert response.status_code == 200
    data = response.get_json()
    assert data["movies"][0]["title"] == "Dune"
