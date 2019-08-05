COMPOSE := docker-compose -f docker-compose.yml
#COMPOSEDEV := $(COMPOSE) -f docker-compose.dev.yml
#COMPOSEPROD := $(COMPOSE) -f docker-compose.prod.yml

clean-all:
	$(COMPOSE) down --rmi local --volumes

run-dev:
	@$(COMPOSE) up -d $(SERVICES)
