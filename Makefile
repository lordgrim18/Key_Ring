
start:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

deploy:
	docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml keyring