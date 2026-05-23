# Pine Opti — PRD

## Original Problem Statement
Usuario quiere una app tipo BoosterX, con su marca (nombre "Pine Opti"), color verde neón, optimizaciones reales hechas por IA, escaneo de PC que sólo activa lo seguro para su hardware, y una **lista blanca de servicios anti-cheat (BlackBox, Keller SS, etc.) que el optimizador NUNCA toca para evitar bans en Free Fire**. Quería un `.exe` real para Windows.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent Universal Key (Claude Sonnet 4.5)
- **Frontend**: React 19 + React Router + Tailwind + sonner toasts
- **Auth**: JWT (HS256), 30-day token
- **AI**: emergentintegrations LlmChat → Claude Sonnet 4.5

## Implementation (2026-02)
- Auth (register/login/me)
- Mock PC scan (CPU/GPU/RAM/Disk/Net + score + tier)
- AI optimization analyzer (Claude returns JSON: optimizations with safe/unsafe + reasoning per hardware tier)
- AI chat (TweaX) with session persistence in Mongo
- Settings CRUD per user
- Protected anti-cheat services list (BlackBox, Keller SS, EAC, BattlEye, Vanguard, FACEIT, Garena Shell, ESEA)
- News/changelog endpoint
- 9 tool tiles (StoreX, GameModeX, ProcessX, GodMode, Latency, Internet, GameReadyX, SteamBoost, Bottleneck)
- Frontend pages: Login, Inicio, Optimización, Herramientas, TweaX AI, Copia Seguridad, Correcciones, Configuración
- Neon green theme (#14ff72) + magenta PRO (#d926ff), Rajdhani + JetBrains Mono fonts, glassmorphic cards
- Window chrome bar (Electron-ready)
- Electron README at `/app/ELECTRON_README.md` with step-by-step build to `.exe`

## Protected Anti-Cheat Whitelist
BlackBox · Keller SS · Easy Anti-Cheat · BattlEye · Riot Vanguard · FACEIT AC · Garena Shell · ESEA Client — never touched by the optimizer.

## Backlog (P1/P2)
- P1: Real PC hardware detection (Electron native modules: `systeminformation` npm)
- P1: Actual Windows tweak execution via PowerShell child_process (Electron only)
- P1: Backup/restore real registry snapshot
- P2: Bottleneck calculator graph
- P2: PC Latency Test with real measurement
- P2: Internet test with real WebRTC throughput
- P2: PIN unlock for PRO settings (currently UI placeholder)
- P2: Discord RPC integration
