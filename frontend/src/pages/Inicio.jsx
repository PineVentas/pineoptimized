import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import { useRealFPS } from "../hooks/useRealFPS";
import { Cpu, Microchip, MemoryStick, HardDrive, Rocket, Zap, Sparkles, X, ShoppingBag, ChevronRight, Trash2, Target, Power, Activity, Skull, Globe, Trophy, TrendingUp } from "lucide-react";

function readLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; }
}

function calcGamingScore() {
  const tweaks = readLS("pine_tweaks", {});
  const enabledTweaks = Object.values(tweaks).filter(v => v === "on").length;
  const dns = readLS("pine_dns_choice", null);
  const torneo = readLS("pine_torneo_history", []);
  const powerPlan = localStorage.getItem("pine_power_plan");
  const profiles = readLS("pine_game_profiles", {});
  const activeProfiles = Object.values(profiles).filter(Boolean).length;
  const killHistory = readLS("pine_applied_tweaks", []);

  let score = 0;
  score += Math.min(40, Math.round((enabledTweaks / 60) * 40));
  if (dns) score += 15;
  if (powerPlan === "performance" || powerPlan === "ultimate") score += 15;
  score += Math.min(15, torneo.length * 3);
  score += Math.min(10, activeProfiles * 2);
  score += Math.min(5, killHistory.length);
  return Math.min(100, score);
}
import HardwareWidget from "../components/HardwareWidget";
import ScanModal from "../components/ScanModal";
import LanguageSelector from "../components/ui/LanguageSelector";
import Achievements from "../components/Achievements";
import BoostChart from "../components/BoostChart";
import { Link, useNavigate } from "react-router-dom";

function SessionStat({ icon: Icon, color, label, value, sub, to, nav }) {
  return (
    <div
      onClick={to ? () => nav(to) : undefined}
      style={{
        flex: 1, minWidth: 0, padding: '14px 16px', borderRadius: 12,
        background: 'var(--surface)', border: `1px solid rgba(255,255,255,0.07)`,
        cursor: to ? 'pointer' : 'default',
        transition: 'all 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={to ? e => { e.currentTarget.style.background = `${color}0C`; e.currentTarget.style.borderColor = `${color}25`; } : undefined}
      onMouseLeave={to ? e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; } : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${color}15`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={12} style={{ color }} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 3, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

const LOGO = "https://customer-assets.emergentagent.com/job_firewall-pro-2/artifacts/yp9jj9mp_logo.ico";

const QUICK_TOOLS = [
  { icon: Trash2,  label: "Limpiar",    sub: "~1GB",      to: "/limpieza",              color: "#ff6b6b" },
  { icon: Target,  label: "Sens",       sub: "Converter",  to: "/sensibilidad",          color: "#d926ff" },
  { icon: Power,   label: "Energía",    sub: "+12% FPS",   to: "/power-plan",            color: "#ffd166" },
  { icon: Activity, label: "AC Shield", sub: "Servicios",  to: "/servicios-protegidos",  color: "#14ff72" },
  { icon: ShoppingBag, label: "Store",  sub: "Apps",       to: "/pine-store",            color: "#00ccff" },
  { icon: Zap,     label: "Fix AI",     sub: "Offline AI", to: "/fix-ai",                color: "#d926ff" },
];

const AI_TIPS = [
  "Para Free Fire, desactiva Vsync y limita FPS a 90. Reduce el input lag notablemente.",
  "En CS2, ajusta cl_interp a 0 y cl_interp_ratio a 1 para conexiones estables.",
  "En Valorant, usa Máximo Rendimiento en el plan de energía para reducir micro-stutters.",
  "Activa Game Mode en Windows (Win + G) para priorizar CPU en tu juego actual.",
  "Cierra Discord overlay en juegos; consume hasta 3% de GPU adicional innecesariamente.",
  "Usa Cloudflare DNS (1.1.1.1) para reducir ping DNS hasta 30ms vs el DNS de tu ISP.",
  "Limpia el caché de shaders GPU antes de una sesión competitiva — evita stutters al cargar mapas.",
  "Desactiva Xbox Game Bar (Win+G) en apps > ajustes para liberar hasta 200MB de RAM.",
  "En Free Fire, ajusta antialiasing a 2x MSAA, no FXAA — más FPS con mejor calidad visual.",
  "La suspensión selectiva USB puede causar micro-cortes en mouse. Desactívala en Plan de Energía.",
  "Para CS2, ejecuta con -nod3d9ex -high en propiedades del exe para prioridad de CPU alta.",
  "Vacía la papelera y limpia %temp% antes de cada sesión — libera caché del sistema operativo.",
];

export default function Inicio() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { t } = useLanguage();
  const fps = useRealFPS();
  const [stats, setStats]           = useState({ status: "actualizado" });
  const [news, setNews]             = useState([]);
  const [scan, setScan]             = useState(null);
  const [scanOpen, setScanOpen]     = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [history, setHistory]       = useState([]);
  const [aboutOpen, setAboutOpen]   = useState(false);
  const [pcName, setPcName]         = useState(null);
  const [optPct, setOptPct] = useState(() => {
    try { const v = localStorage.getItem("pine_opt_pct"); return v ? Number(v) : 0; } catch { return 0; }
  });
  const [tipIdx, setTipIdx]         = useState(0);
  const [gamingScore, setGamingScore] = useState(0);

  const sessionStats = useMemo(() => {
    const tweaks = readLS("pine_tweaks", {});
    const enabledCount = Object.values(tweaks).filter(v => v === "on").length;
    const dns = readLS("pine_dns_choice", null);
    const torneo = readLS("pine_torneo_history", []);
    const killSessions = readLS("pine_applied_tweaks", []);
    const installed = readLS("pine_store_installed", {});
    return {
      tweaks: enabledCount,
      dns: dns?.name || null,
      torneos: torneo.length,
      sessions: killSessions.length,
      installedApps: Object.values(installed).filter(Boolean).length,
    };
  }, []);

  useEffect(() => {
    if (window.electronAPI?.getComputerName) {
      try { setPcName(window.electronAPI.getComputerName()); } catch {}
    }
  }, []);

  useEffect(() => {
    const pct = user?.optimization_pct ?? 10;
    const timer = setTimeout(() => {
      setOptPct(pct);
      try { localStorage.setItem("pine_opt_pct", String(pct)); } catch {}
    }, 350);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setGamingScore(calcGamingScore()), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Rotate AI tips every 8s
    const id = setInterval(() => setTipIdx(i => (i + 1) % AI_TIPS.length), 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    api.get("/stats").then(r => setStats(r.data)).catch(() => setStats({ status: "actualizado" }));
    api.get("/news").then(r => setNews(r.data.news)).catch(() => {
      setNews([
        { id: "1", date: "22.05.2026", tag: "STORE", body: "Pine Store — Sección 🪟 De Microsoft: Photos, Movies & TV y Snipping Tool sin necesidad de abrir la Microsoft Store. Descarga directa via winget CDN." },
        { id: "2", date: "22.05.2026", tag: "UPDATE", body: "v1.2 — Modo Torneo ampliado a 15 juegos: +Dota 2, Rainbow Six, GTA V, Minecraft, Overwatch 2 y Palworld. Barra de progreso e historial de sesiones." },
        { id: "3", date: "22.05.2026", tag: "MONITOR", body: "Monitor: valores pico de sesión (CPU/GPU/RAM/Temp), contador de uptime y carga promedio en tiempo real." },
        { id: "4", date: "22.05.2026", tag: "NAV", body: "Sidebar actualizado: DNS Optimizer y Process Killer ahora accesibles directamente desde la barra lateral." },
        { id: "5", date: "20.05.2026", tag: "AC", body: "Servicios Protegidos: monitor en tiempo real de servicios críticos para el anticheat de Free Fire, Valorant y EAC." },
      ]);
    });
    if (window.electronAPI?.getHardwareInfo) {
      setTimeout(() => {
        window.electronAPI.getHardwareInfo().then(hw => {
          if (hw) {
            const threads = hw.cpu.threads || (hw.cpu.cores * 2) || 4;
            setScan({ ...hw, cpu: { ...hw.cpu, threads } });
          }
        });
      }, 100);
    } else {
      import("../lib/hardwareDetect").then(({ detectHardware }) => {
        detectHardware().then(hw => {
          setScan({
            cpu:  { model: `CPU ${hw.cpu_threads} Threads`, cores: Math.round(hw.cpu_threads / 2), threads: hw.cpu_threads, clock_ghz: 3.5, usage_pct: 15 },
            gpu:  { model: hw.gpu_renderer.split("DirectX")[0] || "GPU", vram_gb: 8, arch: "Detectada", usage_pct: 10 },
            ram:  { total_gb: hw.ram_gb, used_gb: Math.round(hw.ram_gb * 0.4), speed_mhz: 3200 },
            disk: { type: "SSD", used_gb: 120, total_gb: 512 },
            network: { down_mbps: 300, up_mbps: 150, ping_ms: 20 }
          });
        });
      });
    }
    api.get("/achievements").then(r => setAchievements(r.data.achievements)).catch(() => setAchievements([]));
    api.get("/boost-history").then(r => {
      const raw = r.data.history || [];
      setHistory(raw.map(h => {
        const rawDay = h.day ?? h.date ?? "—";
        const m = typeof rawDay === "string" && rawDay.match(/^(\d{1,2})[./](\d{1,2})[./]\d{4}$/);
        const shortDay = m ? `${parseInt(m[1])}/${parseInt(m[2])}` : rawDay;
        return { day: shortDay, value: h.value ?? h.score ?? 0, label: h.label ?? "" };
      }));
    }).catch(() => {
      setHistory([
        { day: "Lun", value: 45 }, { day: "Mar", value: 52 }, { day: "Mié", value: 48 },
        { day: "Jue", value: 61 }, { day: "Vie", value: 55 }, { day: "Sáb", value: 70 }, { day: "Dom", value: 85 }
      ]);
    });
  }, []);

  return (
    <div className="h-full overflow-y-auto" style={{ padding: '28px 32px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}
        className="fade-up">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#fff' }}>
            Hola, <span style={{ color: '#14ff72' }}>{pcName || user?.username || 'Gamer'}</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <div className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: '#14ff72', boxShadow: '0 0 8px #14ff72' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Sistema {stats.status} · v1.2
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Live FPS badge */}
          {fps !== null && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 11px', borderRadius: 8,
              background: fps >= 55 ? 'rgba(20,255,114,0.08)' : fps >= 30 ? 'rgba(255,170,0,0.08)' : 'rgba(255,107,107,0.08)',
              border: `1px solid ${fps >= 55 ? 'rgba(20,255,114,0.2)' : fps >= 30 ? 'rgba(255,170,0,0.2)' : 'rgba(255,107,107,0.2)'}`,
              animation: 'fade-in 0.3s ease',
            }}>
              <Activity size={11} style={{ color: fps >= 55 ? '#14ff72' : fps >= 30 ? '#ffaa00' : '#ff6b6b' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: fps >= 55 ? '#14ff72' : fps >= 30 ? '#ffaa00' : '#ff6b6b', letterSpacing: '-0.02em' }}>{fps}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>FPS</span>
            </div>
          )}
          <LanguageSelector />
          <button onClick={() => setAboutOpen(true)} className="btn-ghost" style={{ fontSize: 11, padding: '6px 14px' }}>
            Acerca de
          </button>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, marginBottom: 16 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Gaming Score ring */}
          <div className="glass hover-lift" style={{ padding: '20px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'radial-gradient(circle, rgba(20,255,114,0.08), transparent 70%)' }} />
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none"
                  stroke={gamingScore >= 80 ? '#14ff72' : gamingScore >= 50 ? '#ffd166' : '#ff6b6b'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(gamingScore / 100) * (2 * Math.PI * 42)} ${2 * Math.PI * 42}`}
                  transform="rotate(-90 50 50)"
                  style={{ filter: `drop-shadow(0 0 7px ${gamingScore >= 80 ? 'rgba(20,255,114,0.7)' : gamingScore >= 50 ? 'rgba(255,209,102,0.7)' : 'rgba(255,107,107,0.7)'})`, transition: 'stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1), stroke 0.4s' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: gamingScore >= 80 ? '#14ff72' : gamingScore >= 50 ? '#ffd166' : '#ff6b6b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1, filter: `drop-shadow(0 0 8px ${gamingScore >= 80 ? 'rgba(20,255,114,0.6)' : 'rgba(255,209,102,0.5)'})`, transition: 'color 0.4s' }}>
                  {gamingScore}
                </span>
                <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>SCORE</span>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Optimización
            </div>
          </div>

          {/* PRO badge */}
          <div className="glass hover-lift" style={{
            padding: '14px 16px', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(20,255,114,0.1) 0%, rgba(0,204,255,0.04) 100%)',
            borderColor: 'rgba(20,255,114,0.18)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(20,255,114,0.12), transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Activo</span>
              <span className="pro-badge">PRO</span>
            </div>
            <div style={{ marginTop: 2, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Versión avanzada</div>
          </div>

          {/* Quick tools */}
          <div className="glass" style={{ padding: '14px 12px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
              Accesos rápidos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {QUICK_TOOLS.map(qt => {
                const Icon = qt.icon;
                return (
                  <button
                    key={qt.to}
                    onClick={() => nav(qt.to)}
                    style={{
                      padding: '9px 8px', borderRadius: 9,
                      background: `${qt.color}0C`,
                      border: `1px solid ${qt.color}20`,
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${qt.color}18`; e.currentTarget.style.borderColor = `${qt.color}35`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${qt.color}0C`; e.currentTarget.style.borderColor = `${qt.color}20`; }}
                  >
                    <Icon size={13} style={{ color: qt.color, marginBottom: 5 }} />
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{qt.label}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{qt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hardware widgets 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <HardwareWidget testid="hw-cpu" label="CPU"
            value={scan?.cpu?.model}
            sub={scan ? `${scan.cpu.cores}C/${scan.cpu.threads}T · ${scan.cpu.clock_ghz ? scan.cpu.clock_ghz + 'GHz' : 'Auto'}` : ""}
            percent={scan?.cpu?.usage_pct} icon={Cpu} />
          <HardwareWidget testid="hw-gpu" label="GPU"
            value={scan?.gpu?.model}
            sub={scan ? `${scan.gpu.vram_gb}GB · ${scan.gpu.arch}` : ""}
            percent={scan?.gpu?.usage_pct} icon={Microchip} />
          <HardwareWidget testid="hw-ram" label="RAM"
            value={scan ? `${scan.ram.total_gb}GB ${scan.ram.speed_mhz}MHz` : ""}
            sub={scan ? `Uso: ${scan.ram.used_gb}GB` : ""}
            percent={scan ? Math.round((scan.ram.used_gb / scan.ram.total_gb) * 100) : 0}
            icon={MemoryStick} />
          <HardwareWidget testid="hw-disk" label="DISCO"
            value={scan ? scan.disk.type : ""}
            sub={scan ? `${scan.disk.used_gb}/${scan.disk.total_gb}GB` : ""}
            percent={scan ? Math.round((scan.disk.used_gb / scan.disk.total_gb) * 100) : 0}
            icon={HardDrive} />
        </div>
      </div>

      {/* ── Session Stats Panel ── */}
      <div className="fade-up" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <SessionStat
          icon={Zap} color="#14ff72" label="Tweaks activos" nav={nav} to="/optimizacion"
          value={sessionStats.tweaks || 0}
          sub={sessionStats.tweaks > 0 ? "optimizaciones on" : "sin configurar"}
        />
        <SessionStat
          icon={Globe} color="#00ccff" label="DNS activo" nav={nav} to="/dns"
          value={sessionStats.dns ? sessionStats.dns.split(" ")[0] : "—"}
          sub={sessionStats.dns ? "configurado" : "sin cambiar"}
        />
        <SessionStat
          icon={Trophy} color="#ffd166" label="Torneos" nav={nav} to="/torneo"
          value={sessionStats.torneos}
          sub={sessionStats.torneos > 0 ? `sesión${sessionStats.torneos > 1 ? "es" : ""} activa${sessionStats.torneos > 1 ? "s" : ""}` : "sin sesiones"}
        />
        <SessionStat
          icon={TrendingUp} color="#d926ff" label="Gaming Score"
          value={gamingScore}
          sub={gamingScore >= 80 ? "Excelente 🔥" : gamingScore >= 50 ? "Bueno 👍" : "Mejorable"}
        />
      </div>

      {/* ── Second row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16, marginBottom: 16 }}>

        {/* Hero CTA */}
        <div className="glass hover-lift" style={{
          padding: '28px 32px',
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(10,13,22,0.9) 0%, rgba(8,20,12,0.7) 100%)',
          borderColor: 'rgba(20,255,114,0.14)',
        }}>
          <div style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', width: 280, height: 280, background: 'radial-gradient(circle, rgba(20,255,114,0.08), transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'linear-gradient(rgba(20,255,114,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20,255,114,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
          <img src={LOGO} alt="" style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', width: 120, height: 120, opacity: 0.06, pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#14ff72', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
              Pine Engine
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1, marginBottom: 10 }}>
              Más FPS.<br />
              <span style={{ color: '#14ff72' }}>Sin ban.</span>
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: 380, marginBottom: 20 }}>
              Pine Opti optimiza tu PC en tiempo real — solo tweaks seguros basados en tu hardware real.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={() => setScanOpen(true)}
                className="btn-primary neon-pulse"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}
                data-testid="start-optimization-btn"
              >
                <Zap size={14} /> Optimizar ahora
              </button>
              <Link to="/fix-ai" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, textDecoration: 'none' }}>
                <Sparkles size={13} /> Fix AI
              </Link>
            </div>
          </div>
        </div>

        {/* News panel */}
        <div className="glass" style={{ padding: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            Noticias
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {news.length === 0 ? (
              <>
                <div className="shimmer" style={{ height: 60, borderRadius: 8 }} />
                <div className="shimmer" style={{ height: 60, borderRadius: 8 }} />
              </>
            ) : news.map(n => (
              <div key={n.id} style={{ paddingLeft: 10, borderLeft: '2px solid rgba(20,255,114,0.25)' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: '#14ff72', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{n.date}</span>
                  <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: 'rgba(20,255,114,0.1)', border: '1px solid rgba(20,255,114,0.2)', color: '#14ff72', fontWeight: 700, letterSpacing: '0.06em' }}>{n.tag}</span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Third row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16, marginBottom: 16 }}>

        {/* Boost chart */}
        <BoostChart data={history} />

        {/* Right col: Store + AI tip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Pine Store card */}
          <div
            onClick={() => nav("/pine-store")}
            style={{
              borderRadius: 12, padding: '16px',
              background: 'linear-gradient(135deg, #14ff72 0%, #00c853 100%)',
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(20,255,114,0.2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(20,255,114,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(20,255,114,0.2)'; }}
          >
            <ShoppingBag style={{ position: 'absolute', right: -8, bottom: -8, opacity: 0.15 }} size={64} color="#000" />
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Apps Store</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#000', letterSpacing: '-0.04em', marginTop: 8 }}>Pine Store</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>
              Explorar apps <ChevronRight size={12} />
            </div>
          </div>

          {/* Fix AI tip — rotating */}
          <div className="glass" style={{ padding: '14px 16px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, rgba(20,255,114,0.2), rgba(0,204,255,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={11} style={{ color: '#14ff72' }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Consejo AI
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                {AI_TIPS.map((_, i) => (
                  <div key={i} style={{ width: i === tipIdx ? 12 : 4, height: 4, borderRadius: 99, background: i === tipIdx ? '#14ff72' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }} />
                ))}
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, minHeight: 52, transition: 'opacity 0.3s ease' }}>
              {AI_TIPS[tipIdx]}
            </p>
            <Link to="/fix-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 11, color: '#14ff72', fontWeight: 600, textDecoration: 'none' }}>
              Hablar con Fix AI <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Achievements ── */}
      <Achievements items={achievements} />

      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} onComplete={(res) => {
        setScan(res);
        api.get("/achievements").then(r => setAchievements(r.data.achievements));
      }} />

      {/* About modal */}
      {aboutOpen && (
        <div onClick={() => setAboutOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', animation: 'fade-in 0.2s ease forwards' }}>
          <div onClick={e => e.stopPropagation()} className="glass" style={{ maxWidth: 420, width: '100%', padding: '36px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(20,255,114,0.2)', boxShadow: '0 0 80px rgba(20,255,114,0.06), 0 32px 64px rgba(0,0,0,0.5)', animation: 'page-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
            <button onClick={() => setAboutOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
              <X size={16} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #14ff72, #00ccff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 32px rgba(20,255,114,0.3)' }}>
                <Rocket size={28} color="#000" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 4 }}>Pine Opti</h2>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#14ff72', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>
                Neon Edition · v1.2.0
              </div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
                <p>Pine Opti está diseñado para jugadores de <strong style={{ color: '#fff' }}>Free Fire, Valorant y CS2</strong>.</p>
                <p>Aplica <strong style={{ color: '#14ff72' }}>tweaks de kernel y registro permanentes</strong> sin activar anti-cheats.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                  {[
                    { label: 'Seguridad', text: '100% Anti-Ban', color: '#14ff72' },
                    { label: 'Performance', text: 'Basado en tu hardware', color: '#00ccff' },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: item.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <span>Desarrollado por Pineda</span>
                <span>2026 © Pine Opti</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
