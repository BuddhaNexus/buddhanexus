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

# Load & build the search-index

add-sources:
	@docker exec -ti dataloader bash -c "invoke add-sources"

clean-db:
	@docker exec -t dataloader bash -c "invoke clean-all-collections"
	@docker exec -t dataloader bash -c "invoke create-db create-collections"

# these commands are for loading individual datasets asynchronously
# @Vladimir this is all you need for now, use 'make run-dev' to start the docker image and then run 'make load-tibetan-data'. If you want to remove data, run 'make clean-db'
load-tibetan-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=tib"
	@docker exec -t dataloader bash -c "invoke load-parallels --lang=tib"
	@docker exec -t dataloader bash -c "invoke load-global-stats --lang=tib"

load-pali-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=pli"
	@docker exec -t dataloader bash -c "invoke load-parallels --lang=pli"
	@docker exec -t dataloader bash -c "invoke load-global-stats --lang=pli"

load-chinese-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=chn"
	@docker exec -t dataloader bash -c "invoke load-parallels --lang=chn"
	@docker exec -t dataloader bash -c "invoke load-global-stats --lang=chn"

load-sanskrit-data:
	@docker exec -t dataloader bash -c "invoke create-collections"
	@docker exec -t dataloader bash -c "invoke load-menu-files"
	@docker exec -t dataloader bash -c "invoke load-text-segments --lang=skt"
	@docker exec -t dataloader bash -c "invoke load-parallels --lang=skt"
	@docker exec -t dataloader bash -c "invoke load-global-stats --lang=skt"

clean-tibetan-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=tib"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=tib"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=tib"

clean-chinese-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=chn"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=chn"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=chn"

clean-pali-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=pli"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=pli"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=pli"

clean-sanskrit-data:
	@docker exec -t dataloader bash -c "invoke clean-text-segments --lang=skt"
	@docker exec -t dataloader bash -c "invoke clean-parallels --lang=skt"
	@docker exec -t dataloader bash -c "invoke clean-global-stats --lang=skt"

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
