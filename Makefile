build-front:
	docker compose build frontend
	docker compose run --rm frontend bash -c "npm install && npm run build"

run-frontend-bash:
	docker compose run --rm frontend bash

build-back:
	docker compose build backend
	docker compose run --rm backend bash -c "npm install && npm run build"

run-backend-bash:
	docker compose run --rm backend bash

up-dev:
	docker compose down --remove-orphans
	docker compose up -d node
	#docker compose up -d --scale nginx-dev=0

up:
	docker compose down --remove-orphans
	docker compose up -d nginx

clear:
	docker system prune -af && docker image prune -af