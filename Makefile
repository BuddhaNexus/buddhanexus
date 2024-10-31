COMPOSE := docker compose -f docker-compose.yml
COMPOSEPROD := $(COMPOSE) -f docker-compose.prod.yml

SERVICES := dataloader arangodb fastapi frontend

run-dev:
	$(COMPOSE) up $(SERVICES)

run-dev-no-logs:
	$(COMPOSE) up -d $(SERVICES)

run-prod:
	@$(COMPOSEPROD) up $(SERVICES)

run-prod-no-logs:
	@$(COMPOSEPROD) up -d $(SERVICES)

stop:
	docker down

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
	@docker exec -t dataloader bash -c "invoke load-metadata"

load-metadata:
	@docker exec -t dataloader bash -c "invoke load-metadata"

add-sources:
	@docker exec -ti dataloader bash -c "invoke add-sources"

clean-db:
	@docker exec -t dataloader bash -c "invoke clean-all-collections"
	@docker exec -t dataloader bash -c "invoke create-db create-collections"

# these commands are for loading individual datasets asynchronously
# @Vladimir this is all you need for now, use 'make run-dev' to start the docker image and then run 'make load-tibetan-data'. If you want to remove data, run 'make clean-db'
load-tibetan-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-metadata"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=bo"
	#@docker exec -t dataloader bash -c "invoke load-parallels --lang=bo"
	#@docker exec -t dataloader bash -c "invoke load-global-stats --lang=bo"

load-pali-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-metadata"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=pa"
	#@docker exec -t dataloader bash -c "invoke load-parallels --lang=pa"
	#@docker exec -t dataloader bash -c "invoke load-global-stats --lang=pa"

load-chinese-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-metadata"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=zh"
	#@docker exec -t dataloader bash -c "invoke load-parallels --lang=zh"
	#@docker exec -t dataloader bash -c "invoke load-global-stats --lang=zh"

load-sanskrit-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-metadata"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=sa"
	#@docker exec -t dataloader bash -c "invoke load-parallels --lang=sa"
	#@docker exec -t dataloader bash -c "invoke load-global-stats --lang=sa"

clean-tibetan-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=bo"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=bo"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=bo"

clean-chinese-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=zh"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=zh"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=zh"

clean-pali-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=pa"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=pa"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=pa"

clean-sanskrit-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=sa"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=sa"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=sa"

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
