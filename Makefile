COMPOSE := docker-compose -f docker-compose.yml
#COMPOSEDEV := $(COMPOSE) -f docker-compose.dev.yml
#COMPOSEPROD := $(COMPOSE) -f docker-compose.prod.yml

SERVICES := dataloader arangodb fastapi

clean-all:
	$(COMPOSE) down --rmi local --volumes

run-dev:
	$(COMPOSE) up $(SERVICES)

rebuild:
	$(COMPOSE) up --build $(SERVICES)

create-db:
	@docker exec -t dataloader bash -c "invoke create-db create-collections"

load-data:
	@docker exec -t dataloader bash -c "invoke load-source-files"

load-data-async:
	@docker exec -t dataloader bash -c "invoke load-source-files --threads=10"
