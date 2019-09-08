COMPOSE := docker-compose -f docker-compose.yml
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

# Load menu collections and categories based on local menu files
load-menu-data:
	@docker exec -t dataloader bash -c "invoke load-menu-files"

# Load segment & parallel data from remote url based on local menu files.
load-segment-data:
	@docker exec -t dataloader bash -c "invoke load-segment-files"

clean-db:
	@docker exec -t dataloader bash -c "invoke clean-all-collections"

clean-db-menu-data:
	@docker exec -t dataloader bash -c "invoke clean-menu-collections"

clean-db-segment-data:
	@docker exec -t dataloader bash -c "invoke clean-segment-collections"

# Load all (segment, parallel & menu) data
load-data:
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-segment-files"

# Load all data - asynchronously
load-data-async:
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-segment-files --threaded"

# List available commands for the dataloader
list-tasks:
	@docker exec -t dataloader bash -c "invoke --list"

# Enter the docker container
enter-dataloader:
	@docker exec -ti dataloader bash
