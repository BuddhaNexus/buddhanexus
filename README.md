# buddhanexus
Backend for the Buddhanexus project.

Includes:
- API (using [fastapi](https://fastapi.tiangolo.com/))
- ArangoDB (in docker)
- Dataloader - loads texts into the database.

## Guide:

### 1. Setup:

#### 1.1: Install `docker` and `docker-compose`:
- install [docker](https://docs.docker.com/install/linux/docker-ce/debian/)
- (optional) run [post-installation steps](https://docs.docker.com/install/linux/linux-postinstall/):
- install [docker-compose](https://docs.docker.com/compose/install/)

#### 1.2 Obtain the project files:
Clone the project repository:

```shell
git clone ThisRepository && cd buddhanexus
```
(substitute ThisRepository with the corect filepath)

Also, in order to load the segment data, it is necessary to create the segment docker volume beforehand: 
```
git clone https://github.com/dharmamitra/dharmanexus-data ; cd dharmanexus-data; make build; make init
```
This will make sure that the database loads segment files that are valid and up to date.

The match data is a lot and cannot be stored on github. It should be placed in a folder outside of the backend repository. The following variable in the .env configuration needs to point to the local folder with the match data (bo, sa, zh, pa):
```
LOCAL_MATCHES_PATH=/patch/to/matches/
```

#### 1.3 Install our githooks:
This project uses `pre-commit` to maintain code style and format it using `black`.

- First, `pre-commit` needs to be installed on your machine. Follow the installation instructions listed [here](https://pre-commit.com/#install).
- You also need to have the Python version listed in the `.pre-commit-config.yaml` file installed (currently 3.7).
- Navigate to the project root folder and run `pre-commit install`.
- From now on, modified files will be formatted automatically.

### 2. Running:
- First, open the `.env.example` file, copy it and name the copy `.env`.
- Modify the variables in the `.env` file. If running online, **choose a strong password for arangodb**.
- Run `make run-dev`. This will download docker images and start all services.

The API should now be accessible on port 8000.

The API Documentation is also available in the `/docs` folder.
If running on a local machine, the address is [http://localhost:8000/docs].

### 3. Loading the segment data
So far the database is empty. To populate it, do the following:
- (One-time) To initialize the database and create collections, run `make create-db`.
- (Long running task) to load the data into arangodb, run `make load-data`.

###### Experimental feature:
There is also an additional command called `make load-data-async`,
which speeds up the data loading process by running it in parallel.
This might overload the database depending on system resources.
The number of threads can be modified in the `Makefile`.
