# Pine Opti — Windows Gaming Optimization Suite

## Overview
A full-stack gaming optimization suite with a dark neon-green (#14ff72) glassmorphic UI. Built to help gamers optimize their Windows PC for maximum FPS, minimum input lag, and competitive performance.

## Architecture
- **Frontend**: React 19 + craco + Tailwind CSS, runs on port 5000
- **Backend**: FastAPI (Python 3.11) + Motor/MongoDB, runs on port 8000
- **Router**: HashRouter (Electron-compatible)
- **Auth**: JWT via backend; current mode uses a simulated local user
- **Dev proxy**: `/api` requests from frontend proxy to `localhost:8000` via craco devServer config

## Running the app
Both workflows must be running:
1. **Backend API** — `cd backend && python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload`
2. **Start application** — `cd frontend && PORT=5000 npm start`

## Key features
- **Optimización**: 60+ system tweaks across 14 categories with presets and toggle-all
- **Fix AI**: Fully offline AI assistant with 25+ gaming topics (LoL, PUBG, R6, Valorant, CS2, FreeF ire, COD, Roblox, input lag, monitor Hz, etc.)
- **Perfiles de Juego**: 13 game profiles with anti-cheat whitelists
- **DNS Optimizer**: 10 DNS servers with benchmark
- **Modo Torneo**: One-click tournament mode with all optimizations
- **Monitor**: Real-time CPU/GPU/RAM/disk/network graphs (simulated in browser)
- **Mi PC**: WebGL GPU detection with hardware tier classification
- **Historial**: Full optimization history log
- **Copia Seguridad**: System restore point manager

## Important notes
- The app uses `localStorage` extensively for persistence (tweak states, presets, history)
- Anti-cheat services are always protected — never modified by any tweak
- The backend has static/fallback data for all endpoints — no live MongoDB needed for basic use
- `window.electronAPI` is detected at runtime; browser mode shows fallback UI

## User preferences
- Spanish-language UI throughout
- Neon green (#14ff72) as primary accent color
- JetBrains Mono for monospace text
- Glassmorphic card style with dark backgrounds
