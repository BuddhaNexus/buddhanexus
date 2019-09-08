COMPOSE := docker-compose -f docker-compose.yml
#COMPOSEDEV := $(COMPOSE) -f docker-compose.dev.yml
COMPOSEPROD := $(COMPOSE) -f docker-compose.prod.yml

SERVICES := dataloader arangodb fastapi

run-dev:
	$(COMPOSE) up $(SERVICES)

run-dev-no-logs:
	$(COMPOSE) up $(SERVICES) -d

run-prod:
	@$(COMPOSEPROD) up $(SERVICES)

run-prod-no-logs:
	@$(COMPOSEPROD) up -d $(SERVICES)

show-logs:
	$(COMPOSE) logs

rebuild:
	$(COMPOSE) up --build $(SERVICES)

create-db:
	@docker exec -t dataloader bash -c "invoke create-db create-collections"

load-data:
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-segment-files"

load-data-async:
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-segment-files --threads=10"

load-menu-data:
	@docker exec -t dataloader bash -c "invoke load-menu-files"

# List available commands for the dataloader
list-tasks:
	@docker exec -t dataloader bash -c "invoke --list"

clean-all:
	$(COMPOSE) down --rmi local --volumes

# Enter the docker container
enter-dataloader:
	@docker exec -ti dataloader bash
