# Entangler Backend

Entangler backend consisting of an API and a MySQL database.

The backend can be run locally (using npm or bun), or using Docker.

## Running with Docker

To run the API and MySQL server, run:
```sh
docker compose up -d --build
```

To stop the backend, run:
```sh
docker compose down
```

By default, the data in the MySQL server is persisted even after stopping the server. To remove the data, run:
```sh
docker compose down --volumes
```

## Running locally

The API can be run locally using either npm or bun. Note that you will need to separately install and setup the MySQL server.

### Using npm

If you do not have Node.js and npm installed, it is recommended to install and use `bun` directly as the actual runtime used is still bun even when running using npm. This method just serves as wrapper around bun if you have npm and do not wish to install bun.

Firstly, install the dependencies:
```sh
npm install
```

If this is your first time starting the API, you will need to initialize the database:
```sh
npm run init
```

Then, start the API:
```sh
npm start
```

### Using bun

Alternatively, you can also directly use bun to run the API.

To install bun, refer to https://bun.sh/docs/installation.

Then, install the dependencies:
```sh
bun install
```

If you only intend to run the API without editing or inspecting the code, you can install just the production dependencies:
```sh
bun install --production
```

If this is your first time starting the API, you will need to initialize the database:
```sh
bun run init.ts
```

To run the API, just run:
```sh
bun run index.ts
```

## Environment variables
| Name | Description | Default (local) |
| ---- | ----------- | --------------- |
| `API_PORT` | The port to host the API at. | `6231` |
| `MYSQL_HOST` | The hostname of the MySQL database. | `localhost` |
| `MYSQL_DATABASE` | The MySQL database to use. | `entangler` |

For more details, you may refer to [config.ts](./config.ts) and [compose.yaml](./compose.yaml) (for Docker). Note that not all environment variables can be modified for both local and Docker running.

## MySQL password

Create a folder `.secret` and within it a file called `MYSQL_ROOT_PASSWORD`. Enter the root password of the MySQL server into that file.

If you are using Docker, this will be used to set the root password of the MySQL database.

If you are running locally, this should be the root password of the MySQL database you are using.