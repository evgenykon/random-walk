build-front:
	docker-compose build node
	docker-compose run --rm node bash -c "npm install && npm run build"

run-node-bash:
	docker-compose run --rm node bash

up-dev:
	docker compose down --remove-orphans
	docker compose up -d node
	#docker compose up -d --scale nginx-dev=0

up:
	docker compose down --remove-orphans
	docker compose up -d nginx

dev:
	docker compose down --remove-orphans
	#docker compose up -d --scale nginx-prod=0

clear:
	docker system prune -af && docker image prune -af