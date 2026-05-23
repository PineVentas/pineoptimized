---
name: API proxy setup
description: How the frontend reaches the FastAPI backend in Replit's browser preview environment.
---

## Rule
The frontend must proxy `/api` requests through the craco webpack devServer config. The browser preview runs in a proxied iframe, so `http://localhost:8000` from the browser means the user's local machine — not the Replit container.

## Fix applied
- `frontend/craco.config.js`: Added `devServerConfig.proxy = [{ context: ['/api'], target: 'http://localhost:8000', changeOrigin: true }]`
- `frontend/src/lib/api.js`: Changed `baseURL` from `http://localhost:8000/api` to `process.env.REACT_APP_API_URL || "/api"` (relative URL)
- Also added `devServerConfig.allowedHosts = 'all'` to allow the Replit proxy domain

**Why:** In Replit, the browser loads pages through an HTTPS proxy domain. `localhost` in the browser context resolves to the user's own machine, not the server container. Using a relative `/api` path causes the request to go to the same origin (port 5000), which the webpack devServer then proxies to port 8000.

**How to apply:** Any new API base URL config must use relative paths (`/api`) or the `REACT_APP_API_URL` env var. Never hardcode `http://localhost:8000` in frontend code.
