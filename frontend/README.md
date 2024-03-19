# Entangler Frontend

Entangler frontend for interacting with the API and database.

The frontend is designed to be hosted as a static site (no server-side rendering) with elements of a Single Page Application (SPA) and Static Site Generation (SSG).

The live site is available at https://entang.ler.sg.

The site can also be hosted locally using npm (or bun) or Docker.

## Running with Docker

To run the site with docker:
```sh
docker compose up -d
```

To stop it, run:
```sh
docker compose down
```

This will run the site at http://localhost:6131, and call the API at http://localhost:6231. Changing the API location is currently not supported.

If you are developing the site, it is easier to run it locally without Docker. The backend can still be run in Docker even if the frontend is not (and vice versa).

## Viewing the site

Both `npm` and `bun` can be used to run the frontend, and can essentially be used interchangably. The site will be available at http://localhost:6131.

### Installing dependencies

Install dependencies with:
```sh
npm install
```
Or, using bun:
```sh
bun install
```

To start the site, run:
```sh
npm start
```
Or, using bun:
```sh
bun start
```

This will build and run the site locally at http://localhost:6131. This will call the live API (https://quantum-entang.ler.sg). Alternative, if you are also running the backend locally, run the site using a development server as described below.

To view the site using a development server, run:
```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
Or, using bun:
```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

> When using the development server, any updates to the source files will automatically update the hosted site.

This will also run the site locally at http://localhost:6131, but will instead call the API locally at http://localhost:6231.

For more information on running the backend, refer to [backend/README.md](../backend/README.md).

## Building

To build the site into static files for deployment:
```sh
npm run build
```
Or, using bun:
```sh
bun run build
```

The resultant build, which is located in the `/build` directory, can be deployed to static hosting services.

You can preview the production build with `npm run preview` or `bun run preview`.