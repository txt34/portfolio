# Application Build

This project is a local Node.js + Express application that demonstrates secure transport, session-based CSRF protection, rate limiting, validation, and protected API behavior. It is intended to run on a developer machine without external infrastructure.

## What the application does

- Starts an Express API on HTTPS and redirects HTTP traffic to HTTPS
- Exposes example and protected routes for demonstration and testing
- Uses Helmet, CSRF middleware, session cookies, and input validation
- Tracks request metrics and exposes them on the `/metrics` endpoint
- Provides mock authentication and authorization flows for local demos

## Prerequisites

- Node.js 20+
- npm

## Run locally

From the project root:

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000
- https://localhost:3443

The app uses a self-signed certificate stored in the `certificates` folder for local HTTPS testing. If the certificate files are missing, the server generates them automatically during startup. If the default local ports are already in use, the app automatically picks the next available ones for you.

## Useful commands

```bash
npm run build
npm test
npm start
```

## Example requests

- `GET /` — welcome response
- `GET /api/csrf-token` — CSRF token for browser clients
- `GET /api/example?name=Alice` — validation example
- `GET /api/protected` — requires basic auth
- `GET /api/admin` — requires basic auth for an admin user
- `GET /metrics` — Prometheus metrics

## Mock credentials

Use these values for the protected endpoints while testing locally:

- Username: `user` / Password: `password`
- Username: `admin` / Password: `password`

## Environment configuration

Create a `.env` file if you want to override defaults:

```bash
SESSION_SECRET=change-this-for-local-development
PORT=3000
HTTPS_PORT=3443
```

## Notes

This is a local sample application, not a full production identity system. For real deployments, replace the mock auth flow with a managed identity provider and a valid certificate management process.
