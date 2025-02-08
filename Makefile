build-front:
	docker compose build frontend
	docker compose run --rm frontend bash -c "npm install && npm run build"

run-frontend-bash:
	docker compose run --rm frontend bash

build-back:
	docker compose build redis
	docker compose build backend
	docker compose run --rm backend bash -c "npm install"

run-backend-bash:
	docker compose run --rm backend bash

up-dev:
	docker compose down --remove-orphans
	docker compose create redis
	docker compose start redis
	docker compose create backend
	docker compose start backend
	docker compose create frontend
	docker compose start frontend

up:
	docker compose down --remove-orphans
	docker compose up -d nginx

clear:
	docker system prune -af && docker image prune -af