from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import random
import json
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt as pyjwt
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    HAS_AI = True
except ImportError:
    HAS_AI = False
    class UserMessage:
        def __init__(self, text: str): self.text = text
    class LlmChat:
        def __init__(self, *args, **kwargs): pass
        def with_model(self, *args): return self
        async def send_message(self, *args): return "Lo siento, el módulo de IA no está disponible en este momento. Por favor, asegúrate de que todas las dependencias estén instaladas correctamente."

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pineopti')]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
JWT_SECRET = os.environ.get('JWT_SECRET', 'change_me')
JWT_ALGO = 'HS256'

app = FastAPI(title="Pine Opti API")
api_router = APIRouter(prefix="/api")

# Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------- Models -----------
class RegisterIn(BaseModel):
    username: str
    password: str

class LoginIn(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    is_pro: bool = True
    created_at: str

class ScanResult(BaseModel):
    cpu: Dict[str, Any]
    gpu: Dict[str, Any]
    ram: Dict[str, Any]
    disk: Dict[str, Any]
    network: Dict[str, Any]
    score: int
    tier: str
    is_laptop: bool = False

class AnalyzeIn(BaseModel):
    scan: ScanResult

class OptimizationItem(BaseModel):
    id: str
    label: str
    description: str
    safe: bool
    recommended_value: str
    reasoning: str
    category: str

class AnalyzeOut(BaseModel):
    summary: str
    optimizations: List[OptimizationItem]
    boost_percent: int

class ChatIn(BaseModel):
    session_id: str
    message: str

class ChatOut(BaseModel):
    reply: str
    session_id: str

class SettingsIn(BaseModel):
    settings: Dict[str, Any]

# ----------- Auth helpers -----------
def hash_password(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()).decode()

def verify_password(pwd: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pwd.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(days=30)
    return pyjwt.encode({"sub": user_id, "exp": exp}, JWT_SECRET, algorithm=JWT_ALGO)

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    # Simulación de usuario para modo local/offline
    return {"id": "pine-local-user", "username": "PINE LIMPIO", "is_pro": True, "created_at": datetime.now(timezone.utc).isoformat()}

# ----------- Static data -----------
PROTECTED_SERVICES = [
    # Anti-cheats — nunca tocar
    {"name": "BlackBox", "vendor": "Garena Free Fire", "description": "Sistema anti-cheat principal de Free Fire. NUNCA se desactiva bajo ninguna circunstancia.", "icon": "shield-check"},
    {"name": "Keller SS", "vendor": "Garena", "description": "Componente anti-trampas secundario de Garena. Protegido permanentemente.", "icon": "shield"},
    {"name": "Easy Anti-Cheat", "vendor": "Epic Games", "description": "Anti-cheat usado por múltiples títulos competitivos.", "icon": "shield-check"},
    {"name": "BattlEye", "vendor": "BattlEye Innovations", "description": "Servicio anti-trampas a nivel kernel.", "icon": "shield"},
    {"name": "Riot Vanguard", "vendor": "Riot Games", "description": "Anti-cheat de Valorant. Whitelist obligatoria.", "icon": "shield-check"},
    {"name": "FACEIT AC", "vendor": "FACEIT", "description": "Anti-cheat de la plataforma competitiva FACEIT.", "icon": "shield"},
    {"name": "Garena Shell", "vendor": "Garena", "description": "Componente de seguridad de Garena. Protegido.", "icon": "shield-check"},
    {"name": "ESEA Client", "vendor": "ESEA", "description": "Cliente y anti-cheat de la liga ESEA.", "icon": "shield"},
    {"name": "Vanguard tray", "vendor": "Riot Games", "description": "Icono de bandeja de Vanguard.", "icon": "shield-check"},
    {"name": "XIGNCODE3", "vendor": "Wellbia", "description": "Anti-cheat usado en muchos MMOs.", "icon": "shield"},
    {"name": "nProtect GameGuard", "vendor": "INCA Internet", "description": "Protección de juegos coreana clásica.", "icon": "shield-check"},
    {"name": "Steam Service", "vendor": "Valve", "description": "Servicio core de Steam para juegos y VAC.", "icon": "shield-check"},
    # Servicios críticos de Windows — NUNCA tocar
    {"name": "PnpSvc", "vendor": "Microsoft", "description": "Plug and Play — gestiona la detección e instalación de hardware. Desactivarlo rompe el sistema.", "icon": "shield"},
    {"name": "DPS", "vendor": "Microsoft", "description": "Diagnostic Policy Service — diagnóstico y solución de problemas de Windows. Requerido por el sistema.", "icon": "shield"},
    {"name": "DiagTrack", "vendor": "Microsoft", "description": "Connected User Experiences — aunque es telemetría, su desactivación puede causar inestabilidad en algunas versiones.", "icon": "shield"},
    {"name": "SysMain", "vendor": "Microsoft", "description": "Superfetch/SysMain — aunque consume disco, su desactivación puede afectar la estabilidad en ciertos sistemas.", "icon": "shield"},
    {"name": "Sysmon", "vendor": "Microsoft", "description": "System Monitor — monitorización del sistema. No se debe modificar.", "icon": "shield"},
    {"name": "EventLog", "vendor": "Microsoft", "description": "Windows Event Log — registro de eventos del sistema. Crítico para el funcionamiento de Windows.", "icon": "shield-check"},
    {"name": "MpsSvc", "vendor": "Microsoft", "description": "Windows Firewall — protección de red del sistema. Nunca desactivar.", "icon": "shield-check"},
    {"name": "TPM", "vendor": "Microsoft", "description": "Trusted Platform Module — seguridad a nivel hardware. Requerido por Windows 11 y apps de seguridad.", "icon": "shield-check"},
    {"name": "SecureBoot", "vendor": "Microsoft", "description": "Secure Boot — protección del arranque del sistema. Nunca modificar desde software.", "icon": "shield-check"},
]

NEWS = [
    {"id": "1", "date": "22.05.2026", "tag": "UPDATE", "author": "Pine Opti", "body": "- Proxy API habilitado: el backend conecta directo desde la web.\n- Fix AI expandido con nuevos temas: LoL, PUBG, R6, input lag, monitor Hz."},
    {"id": "2", "date": "21.05.2026", "tag": "HOTFIX", "author": "Developer", "body": "- Soporte para perfiles de GPU RTX 50-series añadido.\n- Optimización de red mejorada para menor jitter.\n- Historial de boost con 5 entradas diarias."},
    {"id": "3", "date": "20.05.2026", "tag": "PORTABLE", "author": "Pine Opti", "body": "Modo offline activado. Todas las optimizaciones están disponibles localmente sin conexión."},
]

GAME_PROFILES = [
    {
        "id": "free-fire", "name": "Free Fire (Emuladores)", "publisher": "Garena",
        "anticheat": ["BlackBox", "Keller SS", "Garena Shell"],
        "color": "from-orange-500 via-red-500 to-pink-500",
        "image": "/games/freefire.png",
        "tweaks": [
            "Optimización Bluestacks 4/5: Cache de disco SSD",
            "MSI App Player: Prioridad de CPU 'Realtime'",
            "Plan de energía: Pine Ultimate Gaming",
            "GPU: Preferir máximo rendimiento (NVIDIA/AMD)",
            "Anti-cheats: Blindaje total (Whitelist)",
            "Input Lag: Reducción de 1ms en polling rate de mouse",
        ],
    },
    {
        "id": "cs2", "name": "Counter-Strike 2", "publisher": "Valve",
        "anticheat": ["VAC", "FACEIT AC", "ESEA Client"],
        "color": "from-amber-500 via-orange-500 to-red-500",
        "image": "/games/cs2.png",
        "tweaks": [
            "Optimización de CPU: Desactivar Core Parking",
            "Input: Raw Input Buffer optimizado",
            "NVIDIA Reflex: Activado (Ultra)",
            "Prioridad del proceso: Alta (Permanente)",
            "Network: Optimización de paquetes (No Delay)",
            "Anti-cheats VAC/FACEIT: Whitelist absoluta",
        ],
    },
    {
        "id": "valorant", "name": "Valorant", "publisher": "Riot Games",
        "anticheat": ["Riot Vanguard"],
        "color": "from-rose-500 via-red-600 to-rose-700",
        "image": "/games/valorant.png",
        "tweaks": [
            "Riot Vanguard: Protección total (No tocar)",
            "Threaded Optimization: Forzado",
            "HAGS: Optimizado para hardware compatible",
            "Input Lag: Desactivar Game Bar & Overlay",
            "Prioridad del proceso: Por encima de lo normal",
        ],
    },
    {
        "id": "fortnite", "name": "Fortnite", "publisher": "Epic Games",
        "anticheat": ["Easy Anti-Cheat", "BattlEye"],
        "color": "from-purple-500 via-fuchsia-500 to-pink-500",
        "image": "/games/fortnite.png",
        "tweaks": [
            "Optimización DirectX 12: Shader Cache Boost",
            "EAC + BattlEye: Whitelist permanente",
            "Prioridad del proceso: Alta",
            "Red: Desactivar throttling de Windows",
            "GPU: MSI Mode activado para menor latencia",
        ],
    },
    {
        "id": "apex", "name": "Apex Legends", "publisher": "EA / Respawn",
        "anticheat": ["Easy Anti-Cheat"],
        "color": "from-red-600 via-orange-500 to-amber-400",
        "image": "/games/apex.png",
        "tweaks": [
            "EAC: Whitelist permanente — nunca se toca",
            "Prioridad del proceso: Alta (r5apex.exe)",
            "Red: TCP No Delay para menor latencia",
            "Plan de energía: Ultimate Performance",
            "HAGS: Activado para mejor frame pacing",
            "Desactivar Xbox Game Bar & DVR",
        ],
    },
    {
        "id": "pubg", "name": "PUBG: Battlegrounds", "publisher": "Krafton",
        "anticheat": ["BattlEye"],
        "color": "from-amber-600 via-yellow-500 to-amber-400",
        "image": "/games/pubg.png",
        "tweaks": [
            "BattlEye: Whitelist permanente — no tocar",
            "Plan de energía: Ultimate Performance",
            "Prioridad del proceso: Alta (TslGame.exe)",
            "Red: TCP No Delay + ACK Frequency",
            "Desactivar Game DVR y overlays",
            "RAM: Aumentar working set del proceso",
        ],
    },
    {
        "id": "lol", "name": "League of Legends", "publisher": "Riot Games",
        "anticheat": ["Riot Vanguard", "Riot Client"],
        "color": "from-cyan-500 via-blue-500 to-indigo-600",
        "image": "/games/lol.png",
        "tweaks": [
            "Riot Vanguard: Whitelist total — no modificar",
            "Prioridad del proceso: Alta (LeagueClient.exe)",
            "Plan de energía: Ultimate Performance",
            "Red: Optimización para baja latencia",
            "Desactivar animaciones de Windows",
            "GPU Priority: 8 en registro del sistema",
        ],
    },
    {
        "id": "cod", "name": "COD: Warzone / MW3", "publisher": "Activision",
        "anticheat": ["RICOCHET Anti-Cheat"],
        "color": "from-green-700 via-green-500 to-emerald-400",
        "image": "/games/cod.png",
        "tweaks": [
            "RICOCHET: Whitelist permanente",
            "Plan de energía: Ultimate Performance",
            "Prioridad del proceso: Alta",
            "Red: TCP No Delay para paquetes de juego",
            "Desactivar Xbox Game Bar & DVR",
            "HAGS: Optimizado para DX12",
        ],
    },
    {
        "id": "roblox", "name": "Roblox", "publisher": "Roblox Corporation",
        "anticheat": ["Hyperion (Byfron)"],
        "color": "from-red-500 via-red-600 to-rose-700",
        "image": "/games/roblox.png",
        "tweaks": [
            "Hyperion/Byfron: Whitelist total — no tocar",
            "Prioridad del proceso: Por encima de lo normal",
            "Plan de energía: Equilibrado (Roblox no escala bien con Ultimate)",
            "Red: Optimización básica de TCP",
            "Desactivar Xbox overlays",
            "Shader Cache: Limpiar antes de jugar para mejor carga",
        ],
    },
]

DNS_PRESETS = [
    {"id": "cloudflare", "name": "Cloudflare", "primary": "1.1.1.1", "secondary": "1.0.0.1", "ping": 8, "tag": "Más rápido"},
    {"id": "google", "name": "Google", "primary": "8.8.8.8", "secondary": "8.8.4.4", "ping": 14, "tag": "Estable"},
    {"id": "quad9", "name": "Quad9", "primary": "9.9.9.9", "secondary": "149.112.112.112", "ping": 22, "tag": "Seguro"},
]

BLOAT_PROCESSES = [
    {"name": "OneDrive.exe",           "ram_mb": 180, "category": "cloud",    "safe_to_kill": True,  "is_anticheat": False, "reason": "Sincronización en background"},
    {"name": "Cortana.exe",            "ram_mb": 95,  "category": "windows",  "safe_to_kill": True,  "is_anticheat": False, "reason": "Asistente Windows"},
    {"name": "Teams.exe",              "ram_mb": 320, "category": "chat",     "safe_to_kill": True,  "is_anticheat": False, "reason": "Cliente de chat"},
    {"name": "msedge.exe",             "ram_mb": 410, "category": "browser",  "safe_to_kill": True,  "is_anticheat": False, "reason": "Edge en background"},
    {"name": "Spotify.exe",            "ram_mb": 260, "category": "media",    "safe_to_kill": True,  "is_anticheat": False, "reason": "Streaming de música"},
    {"name": "Discord.exe",            "ram_mb": 280, "category": "chat",     "safe_to_kill": True,  "is_anticheat": False, "reason": "Chat en background"},
    {"name": "EpicGamesLauncher.exe",  "ram_mb": 210, "category": "gaming",   "safe_to_kill": True,  "is_anticheat": False, "reason": "Launcher — cierra antes de jugar Steam"},
    {"name": "GoogleDriveSync.exe",    "ram_mb": 140, "category": "cloud",    "safe_to_kill": True,  "is_anticheat": False, "reason": "Sync Google Drive en background"},
    {"name": "Dropbox.exe",            "ram_mb": 155, "category": "cloud",    "safe_to_kill": True,  "is_anticheat": False, "reason": "Sync Dropbox en background"},
    {"name": "SearchApp.exe",          "ram_mb": 88,  "category": "windows",  "safe_to_kill": True,  "is_anticheat": False, "reason": "Búsqueda Windows en background"},
    {"name": "WidgetService.exe",      "ram_mb": 72,  "category": "windows",  "safe_to_kill": True,  "is_anticheat": False, "reason": "Widgets Windows 11"},
    {"name": "XboxGameBarWidgets.exe", "ram_mb": 110, "category": "gaming",   "safe_to_kill": True,  "is_anticheat": False, "reason": "Xbox Game Bar — consume CPU en gaming"},
    {"name": "TelegramDesktop.exe",    "ram_mb": 130, "category": "chat",     "safe_to_kill": True,  "is_anticheat": False, "reason": "Telegram en background"},
    {"name": "Slack.exe",              "ram_mb": 340, "category": "chat",     "safe_to_kill": True,  "is_anticheat": False, "reason": "Slack en background"},
    {"name": "chrome.exe",             "ram_mb": 580, "category": "browser",  "safe_to_kill": True,  "is_anticheat": False, "reason": "Chrome consume RAM en background"},
    {"name": "acrocef_1.exe",          "ram_mb": 65,  "category": "adobe",    "safe_to_kill": True,  "is_anticheat": False, "reason": "Adobe Acrobat en background"},
    {"name": "Zoom.exe",               "ram_mb": 195, "category": "chat",     "safe_to_kill": True,  "is_anticheat": False, "reason": "Zoom en background"},
    {"name": "WmiPrvSE.exe",           "ram_mb": 48,  "category": "system",   "safe_to_kill": False, "is_anticheat": False, "reason": "Proveedor WMI del sistema"},
    {"name": "vgc.exe",                "ram_mb": 22,  "category": "anticheat","safe_to_kill": False, "is_anticheat": True,  "reason": "Vanguard anti-cheat (Valorant)"},
    {"name": "BEService.exe",          "ram_mb": 18,  "category": "anticheat","safe_to_kill": False, "is_anticheat": True,  "reason": "BattlEye anti-cheat (PUBG/R6)"},
    {"name": "EasyAntiCheat.exe",      "ram_mb": 15,  "category": "anticheat","safe_to_kill": False, "is_anticheat": True,  "reason": "EAC anti-cheat (Fortnite/Apex)"},
    {"name": "PnkBstrA.exe",           "ram_mb": 12,  "category": "anticheat","safe_to_kill": False, "is_anticheat": True,  "reason": "PunkBuster anti-cheat"},
]

ACHIEVEMENTS = [
    {"id": "first-scan", "name": "Primer Escaneo", "desc": "Ejecuta tu primera optimización", "icon": "Rocket", "color": "#14ff72"},
    {"id": "boost-80", "name": "Máquina Pulida", "desc": "Alcanza 80% de optimización", "icon": "Trophy", "color": "#00ccff"},
    {"id": "game-profile", "name": "Tryhard", "desc": "Aplica un perfil de juego", "icon": "Gamepad2", "color": "#ffaa00"},
]

STORE_APPS = [
    # Popular (Usando IDs de winget/msstore reales)
    {"id": "9WZDNCRFJ364", "name": "NVIDIA Control Panel", "rating": 4.0, "category": "popular", "gradient": "from-green-600/20 to-green-900/40", "icon": "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg"},
    {"id": "9NMZLR97CQXC", "name": "Intel® Graphics Command Center", "rating": 4.0, "category": "popular", "gradient": "from-blue-600/20 to-blue-900/40", "icon": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg"},
    {"id": "9NBLGGH516XP", "name": "EarTrumpet", "rating": 4.6, "category": "popular", "gradient": "from-orange-600/20 to-orange-900/40", "icon": "👂"},
    {"id": "9NZC4S732BST", "name": "Telegram Desktop", "rating": 4.6, "category": "popular", "gradient": "from-sky-600/20 to-sky-900/40", "icon": "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"},
    {"id": "9NBLGGH5L9XT", "name": "Instagram", "rating": 4.1, "category": "popular", "gradient": "from-pink-600/20 to-purple-900/40", "icon": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"},
    {"id": "9NH2GPH4JZS4", "name": "TikTok", "rating": 3.9, "category": "popular", "gradient": "from-gray-600/20 to-black/40", "icon": "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"},
    {"id": "9NKSQGP7F2NH", "name": "WhatsApp", "rating": 4.4, "category": "popular", "gradient": "from-emerald-600/20 to-emerald-900/40", "icon": "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"},
    {"id": "9NV7ZNHL6S9W", "name": "Lively Wallpaper", "rating": 4.4, "category": "popular", "gradient": "from-red-600/20 to-orange-900/40", "icon": "🖼️"},
    {"id": "9WZDNCRFJ3P2", "name": "TranslucentTB", "rating": 4.3, "category": "popular", "gradient": "from-cyan-600/20 to-blue-900/40", "icon": "TB"},
    
    # De Microsoft
    {"id": "9WZDNCRFJBH4", "name": "Microsoft Photos", "rating": 4.2, "category": "microsoft", "gradient": "from-blue-500/20 to-blue-800/40", "icon": "🖼️"},
    {"id": "9WZDNCRFHVN5", "name": "Windows Calculator", "rating": 4.5, "category": "microsoft", "gradient": "from-blue-400/20 to-blue-700/40", "icon": "🧮"},
    {"id": "9WZDNCRFJBMP", "name": "Windows Media Player", "rating": 4.2, "category": "microsoft", "gradient": "from-orange-500/20 to-red-800/40", "icon": "▶️"},
    {"id": "9WZDNCRFHVQM", "name": "Mail and Calendar", "rating": 4.3, "category": "microsoft", "gradient": "from-sky-500/20 to-blue-700/40", "icon": "📧"},
    {"id": "9N0DX20KWRYM", "name": "Windows Terminal", "rating": 4.5, "category": "microsoft", "gradient": "from-gray-700/20 to-black/40", "icon": "🐚"},
    {"id": "9WZDNCRFJ3P2", "name": "Movies & TV", "rating": 4.3, "category": "microsoft", "gradient": "from-blue-600/20 to-indigo-900/40", "icon": "🎬"},
    {"id": "9WZDNCRFJ3PZ", "name": "Snipping Tool", "rating": 4.1, "category": "microsoft", "gradient": "from-rose-500/20 to-red-800/40", "icon": "✂️"},
    {"id": "9MV0B5HZVK9Z", "name": "Xbox", "rating": 4.5, "category": "microsoft", "gradient": "from-green-600/20 to-green-900/40", "icon": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg"},
    {"id": "9MSML7P64147", "name": "Windows Notepad", "rating": 4.3, "category": "microsoft", "gradient": "from-blue-300/20 to-blue-600/40", "icon": "📝"},
    {"id": "9NBLGGH5FV99", "name": "Paint 3D", "rating": 4.5, "category": "microsoft", "gradient": "from-purple-500/20 to-pink-700/40", "icon": "🎨"},
    {"id": "9NRX63209R7B", "name": "Outlook for Windows", "rating": 4.5, "category": "microsoft", "gradient": "from-blue-600/20 to-blue-900/40", "icon": "📧"},
    {"id": "9WZDNCRFJ3PV", "name": "Windows Scan", "rating": 3.4, "category": "microsoft", "gradient": "from-cyan-500/20 to-blue-700/40", "icon": "📠"},
]

TOOLS = [
    {"id": "pine-store", "name": "Pine Store", "tagline": "Apps Store", "gradient": "from-[#14ff72] via-emerald-500 to-green-600"},
    {"id": "internet", "name": "DNS Optimizer", "tagline": "-30ms Ping", "gradient": "from-[#00ccff] via-sky-500 to-blue-600"},
    {"id": "processx", "name": "Process Killer", "tagline": "Free RAM", "gradient": "from-emerald-500 via-teal-400 to-cyan-500"},
    {"id": "gamemodex", "name": "GameModeX", "tagline": "+FPS Boost", "gradient": "from-violet-500 via-purple-500 to-fuchsia-600"},
    {"id": "godmode", "name": "God Mode", "tagline": "Full Control", "gradient": "from-amber-400 via-orange-500 to-red-500"},
    {"id": "steamboost", "name": "SteamBoost", "tagline": "Steam Priority", "gradient": "from-blue-400 via-blue-600 to-indigo-700"},
    {"id": "bottleneck", "name": "Bottleneck Calc", "tagline": "CPU vs GPU", "gradient": "from-rose-500 via-pink-500 to-fuchsia-600"},
    {"id": "latencia", "name": "Latency Test", "tagline": "Ping Real", "gradient": "from-cyan-400 via-teal-400 to-emerald-500"},
]

# ----------- Routes -----------
@api_router.get("/tools")
async def list_tools():
    return {"tools": TOOLS}

@api_router.get("/store/apps")
async def list_store_apps():
    return {"apps": STORE_APPS}

@api_router.post("/store/install")
async def install_apps(data: Dict[str, Any]):
    return {"ok": True, "installed": data.get("ids", [])}

@api_router.get("/stats")
async def stats():
    return {"users": 7733293, "version": "1.0", "status": "actualizado"}

@api_router.get("/news")
async def get_news():
    return {"news": NEWS}

@api_router.get("/games")
async def list_games():
    return {"games": GAME_PROFILES}

@api_router.post("/games/{game_id}/apply")
async def apply_game_profile(game_id: str):
    return {"ok": True}

@api_router.get("/dns")
async def list_dns():
    return {"dns": DNS_PRESETS}

@api_router.post("/dns/{dns_id}/apply")
async def apply_dns(dns_id: str):
    return {"ok": True}

@api_router.get("/processes")
async def list_processes():
    result = []
    for p in BLOAT_PROCESSES:
        variance = random.randint(-20, 40)
        result.append({
            **p,
            "cpu_pct": round(random.uniform(0.1, 4.5), 1),
            "ram_mb": max(8, p["ram_mb"] + variance),
        })
    return {"processes": result}

@api_router.post("/processes/kill")
async def kill_processes(data: Dict[str, Any]):
    names = data.get("names", [])
    name_set = set(names)
    ram_freed = sum(p["ram_mb"] for p in BLOAT_PROCESSES if p["name"] in name_set)
    anticheat_skipped = [p["name"] for p in BLOAT_PROCESSES if p["name"] in name_set and p.get("is_anticheat")]
    actually_killed = [n for n in names if n not in set(anticheat_skipped)]
    return {"killed": actually_killed, "ram_freed_mb": ram_freed, "skipped_critical": anticheat_skipped}

@api_router.get("/achievements")
async def list_achievements():
    return {"achievements": ACHIEVEMENTS}

@api_router.get("/optimizations/default")
async def default_optimizations():
    items = [
        # ═══════════════════════════ BÁSICO ═══════════════════════════
        {"id": "hags", "label": "GPU Scheduling (HAGS)", "description": "Hardware Accelerated GPU Scheduling — reduce latencia CPU↔GPU.", "safe": True, "recommended_value": "Activado", "reasoning": "Mejor frame pacing y menor input lag con drivers modernos.", "category": "basico"},
        {"id": "game-mode", "label": "Windows Game Mode", "description": "Prioriza hilos del juego sobre procesos de fondo.", "safe": True, "recommended_value": "Activado", "reasoning": "Evita tirones causados por Windows Update o Defender.", "category": "basico"},
        {"id": "xbox-bar", "label": "Xbox Game Bar", "description": "Overlay de grabación y chat de Xbox.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Consume RAM y puede chocar con overlays de Discord o Steam.", "category": "basico"},
        {"id": "cpu-parking", "label": "CPU Core Parking", "description": "Apaga núcleos de CPU para ahorrar energía.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Todos los núcleos disponibles para el juego sin latencia de wake-up.", "category": "basico"},
        {"id": "power-throttling", "label": "Power Throttling", "description": "Windows limita la frecuencia del CPU en background.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Elimina micro-stutters causados por throttling dinámico.", "category": "basico"},
        {"id": "process-sep", "label": "Prioridad de Proceso en Primer Plano", "description": "Win32PrioritySeparation — boost al proceso activo.", "safe": True, "recommended_value": "38 (Gaming)", "reasoning": "El juego activo recibe máxima prioridad de CPU.", "category": "basico"},
        {"id": "aero-shake", "label": "Aero Shake", "description": "Minimiza ventanas agitando la barra de título.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Evita minimizar accidentalmente el juego.", "category": "basico"},
        {"id": "twk-dvr", "label": "Disable Game DVR", "description": "Grabador de fondo de Xbox/Windows.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Evita caídas de FPS repentinas por grabación invisible.", "category": "basico"},
        {"id": "twk-fso", "label": "Fullscreen Optimizations Global Off", "description": "Desactiva FSO para todos los .exe.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Soluciona stuttering y lag en modo pantalla completa.", "category": "basico"},

        # ═══════════════════════════ PERSONALIZACIÓN ═══════════════════════════
        {"id": "transparency", "label": "Efectos de Transparencia", "description": "Acrylic/Mica en barra de tareas y ventanas.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Ahorra recursos de la GPU compuesitor.", "category": "personalizacion"},
        {"id": "animations", "label": "Animaciones de Ventana", "description": "Animaciones al minimizar, maximizar y abrir apps.", "safe": True, "recommended_value": "Desactivado", "reasoning": "El sistema se siente instantáneo y más fluido.", "category": "personalizacion"},
        {"id": "visual-perf", "label": "Ajustar para Mejor Rendimiento", "description": "Desactiva todos los efectos visuales de Windows.", "safe": True, "recommended_value": "Activado", "reasoning": "Máxima fluidez — libera GPU para juegos.", "category": "personalizacion"},
        {"id": "snap-assist", "label": "Snap Assist", "description": "Sugerencias de colocación de ventanas.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Evita interferencias al pasar el cursor al borde.", "category": "personalizacion"},
        {"id": "news-interests", "label": "Noticias e Intereses (Taskbar)", "description": "Widget de noticias en la barra de tareas.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Proceso msn en background consume RAM y CPU.", "category": "personalizacion"},
        {"id": "notif-sounds", "label": "Sonidos de Notificación", "description": "Efectos de sonido del sistema.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Elimina interrupciones de audio durante gaming.", "category": "personalizacion"},
        {"id": "focus-assist", "label": "Focus Assist Automático", "description": "Silencia notificaciones al jugar en pantalla completa.", "safe": True, "recommended_value": "Activado", "reasoning": "Cero pop-ups en medio de una partida competitiva.", "category": "personalizacion"},

        # ═══════════════════════════ PANEL DE NVIDIA ═══════════════════════════
        {"id": "nv-power", "label": "Modo de Energía NVIDIA", "description": "Control de energía de la GPU.", "safe": True, "recommended_value": "Máximo Rendimiento", "reasoning": "Evita que la GPU baje su frecuencia en escenas de carga.", "category": "panel-nvidia"},
        {"id": "nv-texture", "label": "Filtrado de Texturas — Calidad", "description": "Calidad del anisótropo en texturas 3D.", "safe": True, "recommended_value": "Alto Rendimiento", "reasoning": "Gana FPS sin pérdida visual notable en juegos competitivos.", "category": "panel-nvidia"},
        {"id": "nv-lowlatency", "label": "NVIDIA Low Latency Mode", "description": "Pre-renderizado de frames (NULL).", "safe": True, "recommended_value": "Ultra", "reasoning": "Reduce drásticamente el input lag — vital para FPS competitivos.", "category": "panel-nvidia"},
        {"id": "nv-reflex", "label": "NVIDIA Reflex Hint (Registry)", "description": "Activación de Reflex a nivel de registro.", "safe": True, "recommended_value": "Activado", "reasoning": "Menor latencia de render incluso sin soporte nativo del juego.", "category": "panel-nvidia"},
        {"id": "nv-vsync-off", "label": "V-Sync Forzado OFF", "description": "Sincronización vertical en el Panel NVIDIA.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Elimina el input lag añadido por V-Sync. Usa G-Sync si tienes.", "category": "panel-nvidia"},
        {"id": "nv-threaded", "label": "Threaded Optimization", "description": "Optimización multi-hilo de la API gráfica.", "safe": True, "recommended_value": "Activado", "reasoning": "Aprovecha todos los núcleos de la CPU para renderizado.", "category": "panel-nvidia"},
        {"id": "nv-shader-cache", "label": "Tamaño de Shader Cache", "description": "Espacio dedicado a la caché de sombreadores.", "safe": True, "recommended_value": "Sin Límite", "reasoning": "Carga más rápida de shaders y menos stuttering en primera partida.", "category": "panel-nvidia"},

        # ═══════════════════════════ ENERGÍA ═══════════════════════════
        {"id": "pwr-ultimate", "label": "Plan Ultimate Performance", "description": "Plan de energía de máximo rendimiento de Windows.", "safe": True, "recommended_value": "Activado", "reasoning": "El procesador nunca baja de su frecuencia base ni hace throttle.", "category": "administracion-energia"},
        {"id": "usb-suspend", "label": "USB Selective Suspend", "description": "Apagado automático de puertos USB.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Evita que mouse o teclado se duerman durante el juego.", "category": "administracion-energia"},
        {"id": "pci-link", "label": "PCI Express Link State", "description": "Gestión de energía del bus PCIe.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Mantiene el bus de la GPU siempre activo a máxima velocidad.", "category": "administracion-energia"},
        {"id": "cpu-min-freq", "label": "Frecuencia Mínima del CPU (100%)", "description": "Estado mínimo del procesador en el plan de energía.", "safe": True, "recommended_value": "100%", "reasoning": "Respuesta instantánea sin esperar al boost del CPU.", "category": "administracion-energia"},
        {"id": "sleep-disable", "label": "Desactivar Suspensión / Hibernación", "description": "Modo de suspensión y ahorro de energía.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Evita que el PC entre en suspensión durante sesiones largas.", "category": "administracion-energia"},
        {"id": "boost-mode", "label": "Turbo Boost / Processor Boost", "description": "Modo de aceleración de frecuencia del CPU.", "safe": True, "recommended_value": "Agresivo", "reasoning": "El CPU alcanza su frecuencia máxima inmediatamente.", "category": "administracion-energia"},

        # ═══════════════════════════ ELIMINACIÓN ═══════════════════════════
        {"id": "rem-onedrive", "label": "Eliminar OneDrive", "description": "Desinstala Microsoft OneDrive del sistema.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Libera RAM y elimina procesos de sincronización constante.", "category": "eliminacion"},
        {"id": "rem-bloatware", "label": "Limpiar Apps Preinstaladas", "description": "Elimina Candy Crush, Disney+, Duolingo, etc.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Limpia el menú de inicio y libera espacio en disco.", "category": "eliminacion"},
        {"id": "rem-copilot", "label": "Desactivar Windows Copilot", "description": "IA de Microsoft integrada en el sistema.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Proceso de fondo que consume RAM y conecta a Internet.", "category": "eliminacion"},
        {"id": "rem-teams-chat", "label": "Eliminar Teams Chat (Taskbar)", "description": "Chat de Teams en barra de tareas.", "safe": True, "recommended_value": "Eliminado", "reasoning": "Carga al inicio y ocupa espacio en la barra de tareas.", "category": "eliminacion"},
        {"id": "rem-xbox-overlay", "label": "Desactivar Xbox Game Overlay", "description": "Overlay social de Xbox en juegos.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Puede causar conflictos con overlays de terceros (Discord, Steam).", "category": "eliminacion"},
        {"id": "rem-cortana", "label": "Desactivar Cortana", "description": "Asistente virtual de Microsoft.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Proceso innecesario para gaming — libera RAM.", "category": "eliminacion"},

        # ═══════════════════════════ LIMPIEZA ═══════════════════════════
        {"id": "clean-temp", "label": "Limpiar Archivos Temporales", "description": "Borra %TEMP%, C:\\Windows\\Temp y archivos de caché.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Puede liberar GBs de espacio acumulado con el tiempo.", "category": "limpieza"},
        {"id": "clean-shader", "label": "Resetear Shader Cache GPU", "description": "Limpia caché de sombreadores de NVIDIA/AMD.", "safe": True, "recommended_value": "Opcional", "reasoning": "Soluciona stuttering después de actualizar drivers gráficos.", "category": "limpieza"},
        {"id": "clean-dns", "label": "Limpiar Caché DNS", "description": "Vacía la caché de resolución de nombres DNS.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Fuerza nuevas resoluciones DNS con los servidores actuales.", "category": "limpieza"},
        {"id": "clean-prefetch", "label": "Limpiar Prefetch", "description": "Archivos de prefetch de arranque de Windows.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "En SSDs no es necesario — libera espacio y evita lecturas innecesarias.", "category": "limpieza"},
        {"id": "clean-wucache", "label": "Limpiar Caché de Windows Update", "description": "Archivos de actualización descargados y no borrados.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Puede liberar varios GB de espacio en disco.", "category": "limpieza"},
        {"id": "clean-thumbs", "label": "Limpiar Caché de Miniaturas", "description": "Base de datos de thumbnails del explorador.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Se regenera automáticamente — libera espacio.", "category": "limpieza"},
        {"id": "clean-errreports", "label": "Limpiar Reportes de Error", "description": "Volcados de memoria y registros de error de Windows.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Los crash dumps pueden ocupar centenares de MB.", "category": "limpieza"},
        {"id": "clean-recycle", "label": "Vaciar Papelera de Reciclaje", "description": "Archivos borrados pendientes de eliminación permanente.", "safe": True, "recommended_value": "Ejecutar", "reasoning": "Libera espacio en disco de forma inmediata.", "category": "limpieza"},

        # ═══════════════════════════ PRIVACIDAD ═══════════════════════════
        {"id": "priv-telemetry", "label": "Desactivar Telemetría de Windows", "description": "Envío de datos de uso a Microsoft.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Menos procesos de fondo y más privacidad.", "category": "privacidad"},
        {"id": "priv-location", "label": "Servicios de Ubicación", "description": "Rastreo de posición geográfica del PC.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Innecesario en PCs de escritorio y gaming.", "category": "privacidad"},
        {"id": "priv-ads", "label": "ID de Publicidad", "description": "ID único para anuncios personalizados.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Elimina rastreo publicitario del sistema.", "category": "privacidad"},
        {"id": "priv-timeline", "label": "Windows Timeline", "description": "Historial de actividad de aplicaciones.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Sincroniza historial con la nube de Microsoft innecesariamente.", "category": "privacidad"},
        {"id": "priv-clipboard-sync", "label": "Sincronización de Portapapeles", "description": "Comparte portapapeles entre dispositivos via nube.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Sube contenido copiado a los servidores de Microsoft.", "category": "privacidad"},
        {"id": "priv-smartscreen", "label": "SmartScreen Online", "description": "Verificación de apps online antes de ejecutar.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Elimina llamadas de red al ejecutar cualquier app.", "category": "privacidad"},
        {"id": "priv-feedback", "label": "Frecuencia de Feedback Hub", "description": "Peticiones de reseñas y valoraciones de Windows.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Elimina ventanas emergentes de feedback.", "category": "privacidad"},
        {"id": "priv-speech", "label": "Reconocimiento de Voz Online", "description": "Envía datos de voz a Microsoft para mejorar el reconocimiento.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Privacidad — no manda audio a servidores externos.", "category": "privacidad"},
        {"id": "priv-diagdata", "label": "Datos de Diagnóstico Opcionales", "description": "Diagnósticos avanzados enviados a Microsoft.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Solo mantiene los mínimos requeridos por Windows.", "category": "privacidad"},

        # ═══════════════════════════ AJUSTES (TWEAKS) ═══════════════════════════
        {"id": "twk-timer", "label": "Timer Resolution 0.5ms", "description": "Resolución del temporizador del sistema Windows.", "safe": True, "recommended_value": "0.5ms", "reasoning": "Frame timing más preciso y menor varianza en FPS.", "category": "ajustes"},
        {"id": "twk-priority-sep", "label": "Win32PrioritySeparation Gaming", "description": "Separación de prioridad para procesos en primer plano.", "safe": True, "recommended_value": "38 (Hex 26)", "reasoning": "Máxima prioridad al juego activo en el quantum del scheduler.", "category": "ajustes"},
        {"id": "twk-ntfs-last", "label": "Desactivar NTFS Last Access Time", "description": "Timestamp de último acceso en archivos NTFS.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Reduce escrituras innecesarias en el SSD durante juego.", "category": "ajustes"},
        {"id": "twk-ntfs-8dot3", "label": "Desactivar NTFS 8.3 Filenames", "description": "Nombres de archivo cortos (compatibilidad DOS).", "safe": True, "recommended_value": "Desactivado", "reasoning": "Reduce overhead de NTFS — más rápido en carpetas grandes.", "category": "ajustes"},
        {"id": "twk-trim", "label": "TRIM para SSD", "description": "Comando TRIM para mantener rendimiento del SSD.", "safe": True, "recommended_value": "Activado", "reasoning": "Mantiene el SSD a velocidad óptima con el tiempo.", "category": "ajustes"},
        {"id": "twk-prefetch-ssd", "label": "Desactivar Prefetch en SSD", "description": "Precarga de archivos en memoria (diseñado para HDD).", "safe": True, "recommended_value": "Desactivado", "reasoning": "En SSDs no aporta beneficio y causa escrituras extra.", "category": "ajustes"},
        {"id": "twk-write-cache", "label": "Write Caching del Disco", "description": "Caché de escritura en disco para mejorar rendimiento.", "safe": True, "recommended_value": "Activado", "reasoning": "Escrituras más rápidas — sin riesgo en uso con corriente estable.", "category": "ajustes"},
        {"id": "twk-gpu-priority", "label": "GPU Priority (Registry)", "description": "Prioridad del adaptador gráfico en el planificador.", "safe": True, "recommended_value": "8 (Máximo)", "reasoning": "La GPU recibe máxima prioridad del scheduler de Windows.", "category": "ajustes"},
        {"id": "twk-sys-resp", "label": "System Responsiveness Gaming", "description": "SystemResponsiveness en perfil multimedia de Windows.", "safe": True, "recommended_value": "0 (Gaming)", "reasoning": "100% de recursos multimedia para el juego — sin throttle.", "category": "ajustes"},
        {"id": "twk-irq-priority", "label": "IRQ Priority para GPU", "description": "Prioridad de interrupciones del hardware gráfico.", "safe": True, "recommended_value": "High", "reasoning": "La GPU puede interrumpir la CPU inmediatamente.", "category": "ajustes"},

        # ═══════════════════════════ INICIO AUTOMÁTICO ═══════════════════════════
        {"id": "start-clean", "label": "Guía de Optimización de Arranque", "description": "Información sobre cómo limpiar el arranque de Windows.", "safe": True, "recommended_value": "Activado", "reasoning": "El PC enciende más rápido y tiene más RAM libre.", "category": "inicio-automatico"},
        {"id": "start-od", "label": "Desactivar OneDrive en Inicio", "description": "OneDrive se carga automáticamente al encender.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Ahorra tiempo de arranque y RAM desde el primer segundo.", "category": "inicio-automatico"},
        {"id": "start-discord", "label": "Optimizar Discord al Inicio", "description": "Discord se inicia minimizado en background.", "safe": True, "recommended_value": "Manual", "reasoning": "Ábrelo tú cuando lo necesites — no al encender el PC.", "category": "inicio-automatico"},
        {"id": "start-delay", "label": "Reducir Retraso de Inicio de Apps", "description": "Windows espera 10s antes de cargar apps de inicio.", "safe": True, "recommended_value": "0ms", "reasoning": "El escritorio carga completo mucho más rápido.", "category": "inicio-automatico"},

        # ═══════════════════════════ DISPOSITIVOS ═══════════════════════════
        {"id": "dev-mouse", "label": "Desactivar Aceleración del Mouse", "description": "Pointer Precision / aceleración del puntero.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Memoria muscular real 1:1 — esencial para FPS competitivos.", "category": "dispositivos"},
        {"id": "dev-raw-mouse", "label": "Raw Mouse Input", "description": "Entrada directa sin procesado de Windows.", "safe": True, "recommended_value": "Activado", "reasoning": "Máxima fidelidad de movimiento del ratón.", "category": "dispositivos"},
        {"id": "dev-usb-latency", "label": "Reducir Latencia USB", "description": "Polling del bus USB para periféricos.", "safe": True, "recommended_value": "Máximo", "reasoning": "Periféricos responden con menos delay.", "category": "dispositivos"},
        {"id": "dev-audio-excl", "label": "Modo Exclusivo de Audio", "description": "Apps de juego toman control exclusivo del audio.", "safe": True, "recommended_value": "Activado", "reasoning": "Menor latencia de audio — importante para directional audio.", "category": "dispositivos"},

        # ═══════════════════════════ ADAPTADORES DE RED ═══════════════════════════
        {"id": "net-nagle", "label": "Algoritmo de Nagle (TCP_NODELAY)", "description": "Agrupación de paquetes TCP pequeños.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Paquetes enviados inmediatamente — reduce ping en gaming.", "category": "adaptadores-red"},
        {"id": "net-rss", "label": "Receive Side Scaling (RSS)", "description": "Balanceo de paquetes de red en varios núcleos.", "safe": True, "recommended_value": "Activado", "reasoning": "Evita que un solo núcleo se sature con tráfico de red.", "category": "adaptadores-red"},
        {"id": "net-throttling", "label": "Network Throttling Index", "description": "Limitación de ancho de banda para multimedia.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Evita que Windows limite la red mientras juegas.", "category": "adaptadores-red"},
        {"id": "net-autotuning", "label": "TCP Auto-Tuning", "description": "Ajuste automático del buffer de recepción TCP.", "safe": True, "recommended_value": "Normal", "reasoning": "En gaming, el auto-tuning puede aumentar la latencia.", "category": "adaptadores-red"},
        {"id": "net-ecn", "label": "ECN (Explicit Congestion Notification)", "description": "Notificación de congestión de red.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Algunos routers/ISPs no lo soportan bien — puede aumentar ping.", "category": "adaptadores-red"},
        {"id": "net-ack-freq", "label": "TCP ACK Frequency", "description": "Frecuencia de confirmaciones TCP.", "safe": True, "recommended_value": "1 (Inmediato)", "reasoning": "ACKs instantáneos — menor latencia percibida en juegos.", "category": "adaptadores-red"},
        {"id": "net-qos-sched", "label": "QoS Packet Scheduler Gaming", "description": "Calidad de servicio para paquetes de red.", "safe": True, "recommended_value": "Sin reserva", "reasoning": "Elimina el 20% reservado de ancho de banda para el sistema.", "category": "adaptadores-red"},
        {"id": "net-dns-cache", "label": "Aumentar Caché DNS", "description": "Tiempo de vida y tamaño de la caché DNS local.", "safe": True, "recommended_value": "Máximo", "reasoning": "Resuelve hostnames de servidores de juego más rápido.", "category": "adaptadores-red"},

        # ═══════════════════════════ TAREAS ═══════════════════════════
        {"id": "task-wuerr", "label": "Tarea de Reporte de Errores", "description": "WER (Windows Error Reporting) programado.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Proceso de volcado de memoria que puede congelar el sistema.", "category": "tareas"},
        {"id": "task-compat", "label": "Asistente de Compatibilidad", "description": "Monitoriza apps para detectar problemas de compatibilidad.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Innecesario si tus apps funcionan bien.", "category": "tareas"},
        {"id": "task-defrag-ssd", "label": "Defragmentación Automática (SSDs)", "description": "Desfragmentación programada del disco.", "safe": True, "recommended_value": "Desactivado para SSDs", "reasoning": "En SSDs la defrag no ayuda y acorta la vida útil.", "category": "tareas"},
        {"id": "task-maintenance", "label": "Mantenimiento Automático", "description": "Tareas de mantenimiento cuando el PC está inactivo.", "safe": True, "recommended_value": "Ajustado", "reasoning": "Configura para que no interrumpa sesiones de gaming.", "category": "tareas"},

        # ═══════════════════════════ COMPONENTES ═══════════════════════════
        {"id": "comp-hyperv", "label": "Desactivar Hyper-V", "description": "Virtualización de Windows — afecta rendimiento de CPU.", "safe": False, "recommended_value": "Opcional", "reasoning": "Puede ganar rendimiento si NO usas VMs ni WSL2.", "category": "componentes"},
        {"id": "comp-powershell", "label": "PowerShell 5.1 Habilitado", "description": "Versión clásica de PowerShell requerida por Pine Opti.", "safe": True, "recommended_value": "Activado", "reasoning": "Pine Opti usa PowerShell para ejecutar todos los tweaks.", "category": "componentes"},

        # ═══════════════════════════ OBSOLETO ═══════════════════════════
        {"id": "obs-ie", "label": "Desactivar Internet Explorer", "description": "Motor IE11 — reemplazado por Edge.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Componente antiguo e inseguro. Edge lo reemplaza completamente.", "category": "obsoleto"},
        {"id": "obs-fax", "label": "Fax y Escáner de Windows", "description": "Funcionalidad de fax heredada.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Nadie usa fax en 2025. Libera espacio en disco.", "category": "obsoleto"},
        {"id": "obs-remote-diff", "label": "Remote Differential Compression", "description": "Compresión para actualizaciones remotas.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Componente heredado innecesario para gaming.", "category": "obsoleto"},
        {"id": "obs-xps", "label": "XPS Viewer y Servicios XPS", "description": "Visor de documentos XPS de Microsoft.", "safe": True, "recommended_value": "Desactivado", "reasoning": "Formato obsoleto — usa PDF en su lugar.", "category": "obsoleto"},
    ]
    return {"items": items}


@api_router.get("/protected-services")
async def get_protected_services():
    return {"services": PROTECTED_SERVICES}


@api_router.get("/safe-services")
async def get_safe_services():
    safe_list = [
        # Servicios de alto impacto
        {"id": "wsearch", "name": "Windows Search", "description": "Indexa archivos para búsquedas rápidas — causa picos de disco.", "safe": True, "category": "servicios", "label": "Windows Search", "reasoning": "Causa picos de uso de disco. Úsalo manual desde el buscador.", "recommended_value": "Manual"},
        {"id": "dosvc", "name": "Optimización de Entrega", "description": "Comparte actualizaciones de Windows con otros PCs (P2P).", "safe": True, "category": "servicios", "label": "Delivery Optimization", "reasoning": "Usa ancho de banda en segundo plano para compartir actualizaciones.", "recommended_value": "Desactivado"},
        # Servicios opcionales
        {"id": "printspooler", "name": "Cola de Impresión (Spooler)", "description": "Gestiona trabajos de impresión. Solo si tienes impresora.", "safe": True, "category": "servicios", "label": "Print Spooler", "reasoning": "Si no tienes impresora, es un proceso innecesario activo.", "recommended_value": "Manual"},
        {"id": "remotereg", "name": "Registro Remoto", "description": "Permite acceso remoto al registro de Windows.", "safe": True, "category": "servicios", "label": "Remote Registry", "reasoning": "Riesgo de seguridad — nadie externo debería acceder al registro.", "recommended_value": "Desactivado"},
        {"id": "mapsbroker", "name": "Administrador de Mapas Descargados", "description": "Gestiona mapas sin conexión de Windows.", "safe": True, "category": "servicios", "label": "Maps Broker", "reasoning": "Innecesario para gaming — proceso de fondo residual.", "recommended_value": "Desactivado"},
        {"id": "bits", "name": "BITS (Inteligente en Segundo Plano)", "description": "Transferencias de archivos en segundo plano para Windows Update.", "safe": True, "category": "servicios", "label": "BITS", "reasoning": "Puede consumir ancho de banda en cualquier momento.", "recommended_value": "Manual"},
        {"id": "iphlpsvc", "name": "IP Helper (IPv6)", "description": "Soporte para IPv6 y tecnologías de tunelización.", "safe": True, "category": "servicios", "label": "IP Helper", "reasoning": "La mayoría de juegos usan IPv4. IPv6 puede añadir latencia.", "recommended_value": "Desactivado"},
        {"id": "pcasvc", "name": "Program Compatibility Assistant", "description": "Detecta y corrige problemas de compatibilidad de apps.", "safe": True, "category": "servicios", "label": "PcaSvc", "reasoning": "Monitoriza procesos constantemente — innecesario si tus apps funcionan.", "recommended_value": "Desactivado"},
        {"id": "wbiobs", "name": "Windows Biometric Service", "description": "Gestiona huellas dactilares y reconocimiento facial.", "safe": True, "category": "servicios", "label": "WBioSrvc", "reasoning": "Si no usas Windows Hello/huella, es un proceso innecesario.", "recommended_value": "Manual"},
        # Más servicios seguros
        {"id": "tabletinputsvc", "name": "Tablet PC Input Service", "description": "Teclado táctil y panel de entrada de lápiz.", "safe": True, "category": "servicios", "label": "TabletInputSvc", "reasoning": "Innecesario en PCs de escritorio sin pantalla táctil.", "recommended_value": "Desactivado"},
        {"id": "geolocation", "name": "Servicio de Geolocalización", "description": "Rastreo de ubicación geográfica del dispositivo.", "safe": True, "category": "servicios", "label": "Lfsvc (GeoLocation)", "reasoning": "Innecesario en escritorio — envía datos de ubicación.", "recommended_value": "Desactivado"},
        {"id": "retaildemo", "name": "Retail Demo Service", "description": "Servicio para tiendas y kioscos de demostración.", "safe": True, "category": "servicios", "label": "RetailDemo", "reasoning": "Diseñado para tiendas físicas — completamente inútil en gaming.", "recommended_value": "Desactivado"},
        {"id": "autotimezone", "name": "Zona Horaria Automática", "description": "Detecta la zona horaria via GPS/red.", "safe": True, "category": "servicios", "label": "tzautoupdate", "reasoning": "Si tu hora es correcta, este servicio no es necesario.", "recommended_value": "Manual"},
        {"id": "walletservice", "name": "Wallet Service", "description": "Pagos NFC y cartera digital de Windows.", "safe": True, "category": "servicios", "label": "WalletService", "reasoning": "Sin PCs con NFC, es un proceso completamente inútil.", "recommended_value": "Desactivado"},
        {"id": "xblgamesave", "name": "Xbox Live Game Save", "description": "Sincronización de guardadas de Xbox Live en la nube.", "safe": True, "category": "servicios", "label": "XblGameSave", "reasoning": "Si no usas Xbox Game Pass, no necesitas este servicio activo.", "recommended_value": "Manual"},
        {"id": "xboxnetapi", "name": "Xbox Live Networking", "description": "Servicio de red para Xbox Live y gaming social.", "safe": True, "category": "servicios", "label": "XboxNetApiSvc", "reasoning": "Proceso en background permanente — desactiva si no usas Xbox.", "recommended_value": "Manual"},
        {"id": "wmpnetworksharing", "name": "Windows Media Player Network", "description": "Comparte biblioteca multimedia en la red local.", "safe": True, "category": "servicios", "label": "WMPNetworkSvc", "reasoning": "Exposición de archivos en la red — innecesario para gaming.", "recommended_value": "Desactivado"},
        {"id": "fax", "name": "Fax de Windows", "description": "Envío y recepción de faxes.", "safe": True, "category": "servicios", "label": "Fax", "reasoning": "Nadie usa fax en 2025. Proceso completamente innecesario.", "recommended_value": "Desactivado"},
    ]
    return {"items": safe_list}


@api_router.post("/apply")
async def apply_optimizations(data: Dict[str, Any]):
    applied = data.get("applied", [])
    return {"ok": True, "applied": applied, "count": len(applied)}

@api_router.post("/theme")
async def set_theme(data: Dict[str, Any]):
    return {"ok": True, "theme": data.get("theme", "green")}

@api_router.get("/auto-mode")
async def get_auto_mode():
    return {"enabled": False}

@api_router.post("/auto-mode")
async def set_auto_mode(data: Dict[str, Any]):
    return {"ok": True, "enabled": data.get("enabled", False)}

@api_router.get("/boost-history")
async def get_boost_history():
    return {"history": [
        {"date": "22.05.2026", "score": 87, "label": "Tweaks NVIDIA + Red"},
        {"date": "21.05.2026", "score": 79, "label": "Modo Torneo CS2"},
        {"date": "20.05.2026", "score": 72, "label": "Plan Ultimate Performance"},
        {"date": "19.05.2026", "score": 58, "label": "DNS Cloudflare 1.1.1.1"},
        {"date": "18.05.2026", "score": 45, "label": "Línea base inicial"},
    ]}

@api_router.get("/settings")
async def get_settings():
    return {"settings": {"theme": "green", "rpc": True, "autoUpdate": False}}

@api_router.post("/settings")
async def save_settings(data: SettingsIn):
    return {"ok": True}

@api_router.post("/chat")
async def chat(data: ChatIn):
    return {"reply": "Soy Fix AI. Estoy listo para optimizar tu PC.", "session_id": data.session_id}

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
