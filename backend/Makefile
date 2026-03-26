.PHONY: install lint test build run seed

install:
	python3 -m pip install -r requirements.txt

lint:
	python3 -m ruff check .

test:
	python3 -m pytest -q

build: lint test

run:
	python3 run.py

seed:
	python3 seed.py
