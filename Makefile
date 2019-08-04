COMPOSE     := docker-compose -f docker-compose.yml

clean-all:
	$(COMPOSE) down --rmi local --volumes
