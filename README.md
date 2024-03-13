# Entangler

Entangler is the all-in-one platform for managing requests and item loans.

## Docker Quickstart

To start both the frontend and backend, run:
```sh
docker compose up -d --build
```

To stop them, run:
```sh
docker compose down
```

This starts both the frontend and backend together, but they would generally be run separately. For more information, see [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md).

## Local Quickstart

### Backend

To run the backend locally, first navigate to the `/backend` folder.

To start the backend using `npm`:
```sh
npm install
npm run init
npm start
```

To start the backend using `bun`:
```sh
bun install
bun run init.ts
bun run index.ts
```

For more details, visit [backend/README.md](backend/README.md).

### Frontend

To run the frontend locally, first navigate to the `/frontend` folder.

To start the frontend using `npm`:
```sh
npm install
npm start
```

To start the frontend using `bun`:
```sh
bun install
bun start
```

This will host the site at http://localhost:6131. Alternatively, you can run a development server using `npm run dev` or `bun run dev`.

To build the frontend for deployment to static hosting, run:
```sh
npm run build
```
Or `bun run build` if using bun.

The built site including html, javascript, css and other assets will be found in the `/build` folder.

For more details, visit [frontend/README.md](frontend/README.md).