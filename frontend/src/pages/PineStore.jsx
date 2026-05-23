import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Search, ShoppingBag, Star, Download, X, Plus, CheckCircle2, Package, Wifi, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const APPS = [
  /* ── GAMING ─────────────────────────────────────────────── */
  { id: "steam",          name: "Steam",              rating: 5.0, category: "gaming",    color: "#1B2838", desc: "Tienda y biblioteca de juegos PC" },
  { id: "discord",        name: "Discord",            rating: 4.9, category: "gaming",    color: "#5865F2", desc: "Chat de voz y texto para gamers" },
  { id: "obs",            name: "OBS Studio",         rating: 4.9, category: "gaming",    color: "#7B68EE", desc: "Streaming y grabación gratuito" },
  { id: "msi-afterburner",name: "MSI Afterburner",    rating: 4.9, category: "gaming",    color: "#EF4444", desc: "Overclocking y monitoreo de GPU" },
  { id: "hwinfo",         name: "HWiNFO64",           rating: 4.8, category: "gaming",    color: "#FF8C00", desc: "Monitoreo completo de hardware real" },
  { id: "cpu-z",          name: "CPU-Z",              rating: 4.7, category: "gaming",    color: "#3B82F6", desc: "Info detallada del procesador" },
  { id: "gpu-z",          name: "GPU-Z",              rating: 4.7, category: "gaming",    color: "#10B981", desc: "Info detallada de la tarjeta gráfica" },
  { id: "crystaldiskinfo",name: "CrystalDiskInfo",    rating: 4.6, category: "gaming",    color: "#8B5CF6", desc: "Salud y temperatura de discos" },
  { id: "speccy",         name: "Speccy",             rating: 4.6, category: "gaming",    color: "#00B4D8", desc: "Resumen de hardware en segundos" },
  { id: "furmark",        name: "FurMark",            rating: 4.5, category: "gaming",    color: "#EF4444", desc: "Stress test de GPU — benchmark gratis" },
  { id: "epic",           name: "Epic Games Launcher",rating: 4.4, category: "gaming",    color: "#2F2F2F", desc: "Launcher de Epic Games y Fortnite" },
  { id: "geforce-now",    name: "GeForce NOW",        rating: 4.5, category: "gaming",    color: "#76B900", desc: "Cloud gaming NVIDIA — juega en cualquier PC" },
  { id: "playnite",       name: "Playnite",           rating: 4.9, category: "gaming",    color: "#F59E0B", desc: "Gestiona todas tus bibliotecas de juegos" },
  { id: "rtss",           name: "RTSS (RivaTuner)",   rating: 4.8, category: "gaming",    color: "#EF4444", desc: "Limita FPS y muestra overlay de hardware" },
  { id: "cpuid-hwmonitor",name: "HWMonitor",          rating: 4.7, category: "gaming",    color: "#3B82F6", desc: "Temperaturas, voltajes y RPM de fans" },
  { id: "occt",           name: "OCCT",               rating: 4.6, category: "gaming",    color: "#FF6B35", desc: "Stress test completo de PC — CPU+GPU+PSU" },
  { id: "aida64",         name: "AIDA64 Extreme",     rating: 4.6, category: "gaming",    color: "#00ccff", desc: "Benchmark y diagnóstico de hardware" },
  { id: "process-lasso",  name: "Process Lasso",      rating: 4.7, category: "gaming",    color: "#14ff72", desc: "Optimizador de prioridad de procesos en tiempo real" },
  /* ── POPULAR ─────────────────────────────────────────────── */
  { id: "telegram",       name: "Telegram Desktop",   rating: 4.7, category: "popular",   color: "#24A1DE", desc: "Mensajería rápida y ligera" },
  { id: "whatsapp",       name: "WhatsApp",           rating: 4.6, category: "popular",   color: "#25D366", desc: "Mensajería y llamadas" },
  { id: "spotify",        name: "Spotify",            rating: 4.6, category: "popular",   color: "#1DB954", desc: "Música y podcasts" },
  { id: "tiktok",         name: "TikTok",             rating: 4.4, category: "popular",   color: "#ff2d55", desc: "Videos cortos y entretenimiento" },
  { id: "eartrumpet",     name: "EarTrumpet",         rating: 4.9, category: "popular",   color: "#FF8C00", desc: "Control de volumen avanzado por app" },
  { id: "lively",         name: "Lively Wallpaper",   rating: 4.8, category: "popular",   color: "#30CFD0", desc: "Fondos de escritorio animados HD" },
  { id: "translucenttb",  name: "TranslucentTB",      rating: 4.7, category: "popular",   color: "#008080", desc: "Taskbar translúcida personalizable" },
  { id: "rainmeter",      name: "Rainmeter",          rating: 4.8, category: "popular",   color: "#00C8FF", desc: "Widgets y skins para el escritorio" },
  { id: "sharex",         name: "ShareX",             rating: 4.9, category: "popular",   color: "#14ff72", desc: "Screenshots y grabación de pantalla" },
  { id: "terminal",       name: "Windows Terminal",   rating: 4.8, category: "popular",   color: "#5C2D91", desc: "Terminal moderna para Windows" },
  { id: "windhawk",       name: "Windhawk",           rating: 4.8, category: "popular",   color: "#d926ff", desc: "Mods para personalizar Windows al máximo" },
  { id: "powertoys",      name: "PowerToys",          rating: 4.9, category: "popular",   color: "#0078D4", desc: "Herramientas de productividad de Microsoft" },
  { id: "taskbarx",       name: "TaskbarX",           rating: 4.6, category: "popular",   color: "#FF8C00", desc: "Centra y personaliza la barra de tareas" },
  { id: "glasswire",      name: "GlassWire",          rating: 4.6, category: "popular",   color: "#00ccff", desc: "Monitor de red con alertas en tiempo real" },
  /* ── UTILITIES ────────────────────────────────────────────── */
  { id: "vlc",            name: "VLC Media Player",   rating: 4.9, category: "utilities", color: "#FF8C00", desc: "Reproductor multimedia universal" },
  { id: "7zip",           name: "7-Zip",              rating: 4.9, category: "utilities", color: "#14ff72", desc: "Compresor de archivos gratuito" },
  { id: "notepadpp",      name: "Notepad++",          rating: 4.8, category: "utilities", color: "#00A550", desc: "Editor de texto avanzado" },
  { id: "potplayer",      name: "PotPlayer",          rating: 4.8, category: "utilities", color: "#1565C0", desc: "Reproductor multimedia avanzado" },
  { id: "everything",     name: "Everything",         rating: 5.0, category: "utilities", color: "#9333EA", desc: "Búsqueda instantánea de archivos" },
  { id: "qbittorrent",    name: "qBittorrent",        rating: 4.8, category: "utilities", color: "#3399FF", desc: "Cliente BitTorrent libre y ligero" },
  { id: "chrome",         name: "Google Chrome",      rating: 4.5, category: "utilities", color: "#4285F4", desc: "El navegador más usado del mundo" },
  { id: "firefox",        name: "Mozilla Firefox",    rating: 4.7, category: "utilities", color: "#FF7139", desc: "Navegador libre, rápido y privado" },
  { id: "winrar",         name: "WinRAR",             rating: 4.5, category: "utilities", color: "#8B0000", desc: "Compresor y gestor de archivos RAR" },
  { id: "ddu",            name: "DDU",                rating: 4.9, category: "utilities", color: "#F59E0B", desc: "Desinstala drivers GPU completamente" },
  { id: "brave",          name: "Brave Browser",      rating: 4.7, category: "utilities", color: "#FB542B", desc: "Navegador rápido con bloqueador de ads" },
  { id: "malwarebytes",   name: "Malwarebytes",       rating: 4.7, category: "utilities", color: "#00A5E0", desc: "Antimalware ligero — escaneo gratuito" },
  { id: "wingetui",       name: "WingetUI",           rating: 4.8, category: "utilities", color: "#d926ff", desc: "GUI visual para winget — instala todo fácil" },
  { id: "revo-uninstaller",name:"Revo Uninstaller",   rating: 4.7, category: "utilities", color: "#FF6B35", desc: "Desinstala apps + limpia restos del registro" },
  { id: "authy",          name: "Authy",              rating: 4.7, category: "utilities", color: "#EF4444", desc: "Autenticador 2FA — más seguro que SMS" },
  { id: "protonvpn",      name: "ProtonVPN",          rating: 4.6, category: "utilities", color: "#6D4AFF", desc: "VPN gratuita y segura — sin logs" },
  /* ── GPU ──────────────────────────────────────────────────── */
  { id: "nvidia-geforce", name: "GeForce Experience", rating: 4.5, category: "gpu",       color: "#76B900", desc: "Drivers y optimización NVIDIA" },
  { id: "nvidia-studio",  name: "NVIDIA App",         rating: 4.6, category: "gpu",       color: "#76B900", desc: "Nueva app NVIDIA — drivers + overlay" },
  { id: "amd-software",   name: "AMD Software Adrenalin", rating: 4.5, category: "gpu",   color: "#EF4444", desc: "Panel de control AMD — drivers + tuning" },
  { id: "intel-graphics", name: "Intel Graphics Cmd", rating: 4.5, category: "gpu",       color: "#0071C5", desc: "Panel de control gráficos Intel" },
  { id: "nvcleaninstall", name: "NVCleanstall",       rating: 4.9, category: "gpu",       color: "#76B900", desc: "Instala drivers NVIDIA sin bloatware" },
  { id: "radeon-chill",   name: "AMD Radeon Chill",   rating: 4.4, category: "gpu",       color: "#EF4444", desc: "Ahorra temperatura GPU sin perder FPS" },
  { id: "gpucheck",       name: "GPU Benchmark ZM",   rating: 4.5, category: "gpu",       color: "#d926ff", desc: "Benchmark rápido de GPU — compara con otros" },
  /* ── STREAMING ───────────────────────────────────────────── */
  { id: "streamlabs",     name: "Streamlabs Desktop", rating: 4.8, category: "streaming", color: "#80F5D2", desc: "OBS + widgets + alertas en un solo click para Twitch/YT" },
  { id: "twitch-studio",  name: "Twitch Studio",      rating: 4.5, category: "streaming", color: "#9147FF", desc: "App oficial de Twitch para streaming fácil y guiado" },
  { id: "voicemod",       name: "Voicemod",            rating: 4.6, category: "streaming", color: "#00C8FF", desc: "Cambiador de voz en tiempo real para streams y gaming" },
  { id: "nvidia-broadcast",name:"NVIDIA Broadcast",   rating: 4.7, category: "streaming", color: "#76B900", desc: "IA para eliminar ruido de fondo, virtual cam y eco" },
  { id: "xsplit",         name: "XSplit Broadcaster",  rating: 4.4, category: "streaming", color: "#FF6B35", desc: "Streaming y grabación profesional con escenas avanzadas" },
  { id: "elgato-4k",      name: "4K Capture Utility",  rating: 4.6, category: "streaming", color: "#000000", desc: "Software oficial de Elgato para tarjetas capturadoras" },
  { id: "capframex",      name: "CapFrameX",            rating: 4.9, category: "streaming", color: "#14ff72", desc: "Captura frametimes, 1% low y 0.1% low — análisis real" },
  { id: "vb-cable",       name: "VB-Audio Cable",      rating: 4.8, category: "streaming", color: "#FF8C00", desc: "Cable de audio virtual — mezcla fuentes para OBS" },
  /* ── HARDWARE TOOLS ──────────────────────────────────────── */
  { id: "openrgb",        name: "OpenRGB",             rating: 4.9, category: "gaming",    color: "#FF2D78", desc: "Controla TODA la iluminación RGB desde una sola app" },
  { id: "fancontrol",     name: "Fan Control",         rating: 4.9, category: "gaming",    color: "#00ccff", desc: "Curvas de ventiladores avanzadas — reduce ruido" },
  { id: "nzxt-cam",       name: "NZXT CAM",            rating: 4.5, category: "gaming",    color: "#FA5A00", desc: "Monitoreo y control de refrigeración NZXT" },
  { id: "throttlestop",   name: "ThrottleStop",        rating: 4.8, category: "gaming",    color: "#ffd166", desc: "Undervolting de CPU Intel — menos calor, mismos FPS" },
  { id: "hwmonitor-pro",  name: "Open Hardware Monitor",rating:4.8, category: "gaming",    color: "#3B82F6", desc: "Monitor open source de CPU/GPU/RAM/Disk sin instalar" },
  { id: "libre-hw",       name: "LibreHardwareMonitor",rating: 4.9, category: "gaming",    color: "#14ff72", desc: "Fork de OpenHardwareMonitor con más sensores soportados" },
  /* ── UTILIDADES EXTRA ────────────────────────────────────── */
  { id: "windirstat",     name: "WinDirStat",          rating: 4.8, category: "utilities", color: "#F59E0B", desc: "Mapa visual de uso de disco — borra lo que ocupa más" },
  { id: "wiztree",        name: "WizTree",             rating: 5.0, category: "utilities", color: "#00B4D8", desc: "Análisis de disco ultra rápido (instantáneo con NTFS)" },
  { id: "bcuninstaller",  name: "Bulk Crap Uninstaller",rating:4.9, category: "utilities", color: "#9333EA", desc: "Desinstala masivamente apps con limpieza profunda" },
  { id: "processhacker",  name: "Process Hacker 2",    rating: 4.9, category: "utilities", color: "#FF4444", desc: "Task Manager avanzado: prioridades, DLL, network, heap" },
  { id: "autoruns",       name: "Autoruns",            rating: 4.9, category: "utilities", color: "#0078D4", desc: "Microsoft Sysinternals — ve TODO lo que arranca en Windows" },
  { id: "crystaldiskmark",name: "CrystalDiskMark",    rating: 4.9, category: "utilities", color: "#8B5CF6", desc: "Benchmark de velocidad de SSD/HDD — lectura y escritura" },
  { id: "bulk-rename",    name: "Bulk Rename Utility", rating: 4.7, category: "utilities", color: "#FF8C00", desc: "Renombra miles de archivos con reglas avanzadas" },
  { id: "spacesniffer",   name: "SpaceSniffer",        rating: 4.7, category: "utilities", color: "#F59E0B", desc: "Visualiza el espacio en disco como un mapa de calor" },
  /* ── DE MICROSOFT ────────────────────────────────────────── */
  { id: "ms-photos",      name: "Microsoft Photos",    rating: 4.2, category: "microsoft", color: "#0078D4", desc: "Galería de fotos y editor básico de Microsoft",           noStore: true },
  { id: "ms-movies-tv",   name: "Movies & TV",         rating: 4.3, category: "microsoft", color: "#5C2D91", desc: "Reproduce películas, series y vídeos de tu colección",   noStore: true },
  { id: "ms-snipping",    name: "Snipping Tool",       rating: 4.1, category: "microsoft", color: "#0F6CBD", desc: "Captura de pantalla y anotaciones integradas en Windows", noStore: true },
];

function getStoredInstalled() {
  try { const v = localStorage.getItem("pine_store_installed"); return v ? JSON.parse(v) : {}; } catch { return {}; }
}
function saveInstalled(obj) {
  try { localStorage.setItem("pine_store_installed", JSON.stringify(obj)); } catch {}
}

export default function PineStore() {
  const [apps, setApps] = useState(APPS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("popular");
  const [cart, setCart] = useState([]);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(getStoredInstalled);

  useEffect(() => {
    api.get("/store/apps").then(r => setApps(r.data.apps)).catch(() => {});
  }, []);

  const filtered = apps.filter(a =>
    a.category === category &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCart = (app) => {
    if (installed[app.id]) return;
    if (cart.find(i => i.id === app.id)) {
      setCart(cart.filter(i => i.id !== app.id));
    } else {
      setCart([...cart, app]);
    }
  };

  const METHOD_LABELS = {
    'winget':           '✅ winget',
    'chocolatey':       '✅ Chocolatey',
    'chocolatey-fresh': '✅ Chocolatey (instalado)',
    'store-uri':        '🏪 Microsoft Store',
    'browser':          '🌐 Descarga directa',
    'browser-search':   '🔍 Búsqueda abierta',
  };

  const handleInstall = async () => {
    if (cart.length === 0) return;
    const isElectron = !!(window.electronAPI?.installStoreApp);
    if (!isElectron) {
      toast.info('Instalar apps requiere la versión de escritorio (.exe) de Pine Opti.');
      return;
    }
    setInstalling(true);
    let successCount = 0, failCount = 0;
    for (const app of cart) {
      try {
        toast.info(`Buscando método para ${app.name}...`);
        const result = await window.electronAPI.installStoreApp(app.id, app.name);
        if (result.ok) {
          successCount++;
          toast.success(`${app.name} — ${METHOD_LABELS[result.method] || result.method}`);
          if (result.method === 'store-uri') toast.info('Completa la instalación en Microsoft Store.');
          else if (result.method === 'browser') toast.info('Página de descarga abierta en el navegador.');
          setInstalled(p => { const next = { ...p, [app.id]: true }; saveInstalled(next); return next; });
        } else {
          failCount++;
          toast.error(`No se pudo instalar ${app.name}.`);
        }
      } catch (e) {
        failCount++;
        toast.error(`Error: ${e?.message || 'desconocido'}`);
      }
    }
    if (successCount > 0) toast.success(`${successCount} app${successCount > 1 ? 's' : ''} procesada${successCount > 1 ? 's' : ''}.`);
    if (failCount > 0) toast.warning(`${failCount} app${failCount > 1 ? 's' : ''} no pudieron instalarse.`);
    setCart([]);
    setInstalling(false);
  };

  const inCart = (id) => !!cart.find(i => i.id === id);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '12px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        background: 'rgba(6,8,15,0.95)',
        backdropFilter: 'blur(12px)',
        flexShrink: 0, zIndex: 10,
      }}>
        <Link to="/herramientas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', flexShrink: 0 }}>
          <ArrowLeft size={14} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #14ff72, #00d45e)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(20,255,114,0.25)' }}>
            <ShoppingBag size={15} color="#000" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.03em', color: '#fff' }}>Pine Store</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: -1 }}>Apps · Instala sin Microsoft Store</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, position: 'relative', maxWidth: 400, margin: '0 16px' }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input
            placeholder="Buscar app..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 34, borderRadius: 9, paddingRight: 12, height: 34, fontSize: 12 }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {[
            { id: 'popular',   label: '🔥 Popular' },
            { id: 'gaming',    label: '🎮 Gaming' },
            { id: 'utilities', label: '🛠️ Utils' },
            { id: 'gpu',       label: '🖥️ GPU' },
            { id: 'streaming', label: '📡 Stream' },
            { id: 'microsoft', label: '🪟 Microsoft' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              style={{
                padding: '6px 14px', borderRadius: 8,
                fontSize: 11, fontWeight: 700,
                border: category === c.id ? '1px solid rgba(20,255,114,0.4)' : '1px solid rgba(255,255,255,0.08)',
                background: category === c.id ? 'rgba(20,255,114,0.1)' : 'rgba(255,255,255,0.04)',
                color: category === c.id ? '#14ff72' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Apps grid */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 2 }}>
                {{ popular: '🔥 Apps Populares', gaming: '🎮 Gaming & Herramientas', utilities: '🛠️ Utilidades', gpu: '🖥️ GPU & Drivers', streaming: '📡 Streaming & Contenido', microsoft: '🪟 De Microsoft' }[category] || '🔥 Apps'}
              </h2>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {category === 'microsoft'
                  ? `${filtered.length} apps · winget CDN · descarga sin abrir la Microsoft Store · LTSC Compatible`
                  : `${filtered.length} apps · Instala via winget · Compatible con Windows sin Store`
                }
              </p>
            </div>
            {cart.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#14ff72', fontWeight: 600 }}>
                <Package size={13} />
                {cart.length} en cola
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}
            className="stagger">
            {filtered.map((app) => {
              const selected = inCart(app.id);
              const done = installed[app.id];
              return (
                <div
                  key={app.id}
                  onClick={() => toggleCart(app)}
                  style={{
                    borderRadius: 14,
                    border: done
                      ? '1px solid rgba(20,255,114,0.35)'
                      : selected
                        ? '1px solid rgba(20,255,114,0.3)'
                        : '1px solid rgba(255,255,255,0.06)',
                    background: done
                      ? 'rgba(20,255,114,0.06)'
                      : selected
                        ? 'rgba(20,255,114,0.05)'
                        : 'var(--surface)',
                    cursor: done ? 'default' : 'pointer',
                    padding: '16px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    position: 'relative', overflow: 'hidden',
                    transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: selected ? 'scale(0.97)' : 'scale(1)',
                  }}
                  onMouseEnter={e => {
                    if (!selected && !done) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!selected && !done) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {/* App color glow */}
                  <div style={{
                    position: 'absolute', top: -15, right: -15,
                    width: 80, height: 80,
                    background: `radial-gradient(circle, ${app.color}25, transparent 65%)`,
                    pointerEvents: 'none',
                  }} />

                  {/* Sin Store badge for Microsoft apps */}
                  {app.noStore && !selected && !done && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      padding: '2px 6px', borderRadius: 5,
                      background: 'rgba(0,120,212,0.18)',
                      border: '1px solid rgba(0,120,212,0.35)',
                      fontSize: 7.5, fontWeight: 800,
                      color: '#4da6ff', letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      Sin Store
                    </div>
                  )}

                  {/* Selected / done badge */}
                  {(selected || done) && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 22, height: 22,
                      borderRadius: 7,
                      background: done ? 'rgba(20,255,114,0.2)' : 'rgba(20,255,114,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'bounce-in 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                      {done
                        ? <CheckCircle2 size={13} style={{ color: '#14ff72' }} />
                        : <X size={12} style={{ color: '#14ff72', transform: 'rotate(45deg)' }} />
                      }
                    </div>
                  )}

                  {/* Icon */}
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${app.color}22, ${app.color}08)`,
                    border: `1px solid ${app.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', fontSize: 20, fontWeight: 900, color: app.color, opacity: 0.6, userSelect: 'none' }}>
                      {app.name[0]}
                    </span>
                    <img
                      src={app.icon}
                      alt={app.name}
                      style={{ width: 36, height: 36, objectFit: 'contain', position: 'relative', zIndex: 1 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', marginBottom: 3, lineHeight: 1.2 }}>
                      {app.name}
                    </div>
                    {app.desc && (
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                        {app.desc}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                      <Star size={9} style={{ color: '#ffd166', fill: '#ffd166' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{app.rating}</span>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', marginLeft: 2 }} />
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Oficial</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Microsoft section info banner */}
          {category === 'microsoft' && (
            <div style={{
              marginBottom: 16, padding: '14px 16px', borderRadius: 12,
              background: 'rgba(0,120,212,0.07)',
              border: '1px solid rgba(0,120,212,0.2)',
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,120,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>🪟</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>Apps oficiales de Microsoft — Sin necesitar la Store</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  Pine Store descarga estas apps directamente desde la <strong style={{ color: 'rgba(255,255,255,0.6)' }}>CDN oficial de Microsoft</strong> usando <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: 4 }}>winget --source msstore</code>. No se abre la tienda, no se requiere cuenta Microsoft. Compatible con Windows LTSC, N y versiones modificadas.
                </div>
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="card" style={{ marginTop: 24, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Wifi size={13} style={{ color: '#14ff72' }} />
              <span className="section-label">Cómo funciona la instalación</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {[
                { step: '1', label: 'winget',           desc: 'Gestor oficial de Windows — sin Store', color: '#14ff72' },
                { step: '2', label: 'winget + CDN MS',  desc: 'Descarga MSIX directo desde Microsoft',  color: '#4da6ff' },
                { step: '3', label: 'Chocolatey',       desc: 'Repositorio alternativo de paquetes',    color: '#00ccff' },
                { step: '4', label: 'Descarga directa', desc: 'Abre la web oficial del instalador',     color: '#d926ff' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '10px' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 800, color: s.color }}>{s.step}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 7, background: 'rgba(20,255,114,0.04)', border: '1px solid rgba(20,255,114,0.1)', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
              🛡️ <strong style={{ color: 'rgba(20,255,114,0.7)' }}>Microsoft Store no es requerida</strong> — todos los métodos descargan desde repositorios oficiales o CDN directa. Los anti-cheats (Vanguard, EAC, BattlEye) nunca son modificados.
            </div>
          </div>
        </main>

        {/* ── Cart sidebar ── */}
        <aside style={{
          width: 280, flexShrink: 0,
          borderLeft: '1px solid rgba(255,255,255,0.055)',
          background: 'rgba(8,11,18,0.95)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.01em' }}>Cola de instalación</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
              {cart.length === 0 ? 'Vacía' : `${cart.length} app${cart.length > 1 ? 's' : ''} seleccionada${cart.length > 1 ? 's' : ''}`}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {cart.length === 0 ? (
              <div style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.15)', textAlign: 'center', padding: 24,
              }}>
                <ShoppingBag size={36} style={{ marginBottom: 10, opacity: 0.4 }} />
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Vacío</div>
                <div style={{ fontSize: 10, marginTop: 4, lineHeight: 1.5 }}>Haz clic en una app para agregarla</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cart.map(app => (
                  <div key={app.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px', borderRadius: 9,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    animation: 'slide-in-right 0.25s cubic-bezier(0.16,1,0.3,1)',
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, overflow: 'hidden', background: `${app.color}15`, border: `1px solid ${app.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                      <span style={{ position: 'absolute', fontSize: 12, fontWeight: 900, color: app.color, opacity: 0.6, userSelect: 'none' }}>{app.name[0]}</span>
                      <img src={app.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain', position: 'relative', zIndex: 1 }} onError={e => { e.target.style.display = 'none'; }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.name}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>En cola</div>
                    </div>
                    <button onClick={() => toggleCart(app)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', borderRadius: 5, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'none'; }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.055)' }}>
            <button
              onClick={handleInstall}
              disabled={cart.length === 0 || installing}
              className={cart.length > 0 ? 'btn-primary neon-pulse' : ''}
              style={{
                width: '100%', padding: '11px',
                borderRadius: 10, fontSize: 12,
                background: cart.length === 0 ? 'rgba(255,255,255,0.05)' : undefined,
                color: cart.length === 0 ? 'rgba(255,255,255,0.2)' : undefined,
                border: cart.length === 0 ? '1px solid rgba(255,255,255,0.07)' : undefined,
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontWeight: 800,
              }}
            >
              {installing ? (
                <><span style={{ animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>⟳</span> Instalando...</>
              ) : (
                <><Download size={14} /> Instalar {cart.length > 0 ? `(${cart.length})` : ''}</>
              )}
            </button>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
              Requiere versión .exe de Pine Opti
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
