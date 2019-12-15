# buddhanexus
Backend for the Buddhanexus project

## I. Deployment guide:

#### 1. Docker setup:
- install [docker](https://docs.docker.com/install/linux/docker-ce/debian/)
- (optional) run [post-installation steps](https://docs.docker.com/install/linux/linux-postinstall/):
- install [docker-compose](https://docs.docker.com/compose/install/)

#### 2. Getting project files:
- navigate to the folder where you'd like to store the project
- clone the project repository:

```shell
    git clone https://github.com/ayya-vimala/buddhanexus.git && cd buddhanexus
```

#### 3. Running the project
- First, open the `.env.example` file, copy it and name the copy `.env`.
- Modify the variables in the `.env` file. If running online, **choose a strong password for arangodb**.
- Run `make run-dev`. This will download docker images and start all services.

The API should now be accessible on port 8000.

The API Documentation is also available in the `/docs` folder.
If running on a local machine, the address is [http://localhost:8000/docs].

#### 4. Loading the segment data
So far the database is empty. To populate it, do the following:
- (One-time) To initialize the database and create collections, run `make create-db`.
- (Long running task) to load the data into arangodb, run `make load-data`.

###### Experimental feature:
There is also an additional command called `make load-data-async`,
which speeds up the data loading process by running it in parallel.
This might overload the database depending on system resources.
The number of threads can be modified in the `Makefile`.
