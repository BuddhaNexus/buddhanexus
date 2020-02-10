COMPOSE := docker-compose -f docker-compose.yml
COMPOSEPROD := $(COMPOSE) -f docker-compose.prod.yml

SERVICES := dataloader arangodb fastapi

run-dev:
	$(COMPOSE) up $(SERVICES)

run-dev-no-logs:
	$(COMPOSE) up -d $(SERVICES)

run-prod:
	@$(COMPOSEPROD) up $(SERVICES)

run-prod-no-logs:
	@$(COMPOSEPROD) up -d $(SERVICES)

stop:
	docker-compose down

# Display recent logs from all docker containers.
show-logs:
	$(COMPOSE) logs

# Build docker containers again without removing database data
rebuild:
	$(COMPOSE) up --build $(SERVICES)

# Destroy containers and images, including database data
clean-all:
	$(COMPOSE) down --rmi local --volumes

# Initialize database and create empty collections
create-db:
	@docker exec -t dataloader bash -c "invoke create-db create-collections"

create-collections:
	@docker exec -t dataloader bash -c "invoke create-collections"

# Load menu collections and categories based on local menu files
load-menu-data:
	@docker exec -t dataloader bash -c "invoke load-menu-files"

# Load segment & parallel data from remote url based on local menu files.
load-segment-data:
	@docker exec -t dataloader bash -c "invoke load-segment-files"

# Load all (segment, parallel & menu) data
load-data:
	@docker exec -ti dataloader bash -c "invoke load-menu-files"
	@docker exec -ti dataloader bash -c "invoke load-segment-files"
	@docker exec -ti dataloader bash -c "invoke clean-totals-collection"
	@docker exec -ti dataloader bash -c "invoke calculate-collection-totals"

# Load all data - asynchronously
load-data-async:
	@docker exec -ti dataloader bash -c "invoke load-menu-files"
	@docker exec -ti dataloader bash -c "invoke load-segment-files --threaded"
	@docker exec -ti dataloader bash -c "invoke clean-totals-collection"
	@docker exec -ti dataloader bash -c "invoke calculate-collection-totals"
	@docker exec -ti dataloader bash -c "invoke create-indices"

clean-db:
	@docker exec -t dataloader bash -c "invoke clean-all-collections"

clean-totals:
	@docker exec -t dataloader bash -c "invoke clean-totals-collection"
	@docker exec -t dataloader bash -c "invoke calculate-collection-totals"

clean-menu-data:
	@docker exec -t dataloader bash -c "invoke clean-menu-collections"

clean-segments:
	@docker exec -t dataloader bash -c "invoke clean-segment-collections"

# List available commands for the dataloader
list-tasks:
	@docker exec -t dataloader bash -c "invoke --list"

enter-dataloader:
	@docker exec -ti dataloader bash

enter-api:
	@docker exec -ti fastapi bash

lint-dataloader:
	@docker exec -t dataloader bash -c 'pylint ./*.py'

lint-api:
	@docker exec -t fastapi bash -c 'pylint ./api/*.py'
