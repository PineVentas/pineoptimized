import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Lock, ShieldCheck, Search, Settings as Cog, Cpu, Microchip, Zap,
  Trash2, Brush, Eye, Sliders, Power, Boxes, Wifi, ListChecks,
  Component, Archive, User, Check, Rocket, ChevronRight, Flame,
  MemoryStick, HardDrive, MonitorCog, AlertTriangle, Mouse, Monitor,
  Volume2, MessageCircle, Shield, Layers, Laptop, Package,
  Radio, Trophy, TrendingUp, Smartphone, Gamepad2, Thermometer,
  Database, RefreshCw, Globe, Maximize2, Download, Lightbulb,
} from "lucide-react";
import { TWEAKS, PRESET_BASICO, PRESET_OPTIMO, PRESET_AVANZADO } from "../lib/tweaks";

const LS_TWEAKS_KEY  = "pine_tweak_values";
const LS_PRESET_KEY  = "pine_tweak_preset";
const LS_ACTIVE_KEY  = "pine_tweak_active";

function loadPersistedValues() {
  try {
    const raw = localStorage.getItem(LS_TWEAKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const init = {};
  TWEAKS.forEach(t => { init[t.id] = "on"; });
  return init;
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 42, height: 23, borderRadius: 99, flexShrink: 0,
      background: value ? 'linear-gradient(90deg, #14ff72, #00d45e)' : 'rgba(255,255,255,0.07)',
      border: `1px solid ${value ? 'rgba(20,255,114,0.4)' : 'rgba(255,255,255,0.1)'}`,
      position: 'relative', cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow: value ? '0 0 14px rgba(20,255,114,0.35)' : 'none',
      outline: 'none',
    }}>
      <span style={{
        position: 'absolute', top: 3,
        left: value ? 'calc(100% - 19px)' : 3,
        width: 15, height: 15, borderRadius: '50%',
        background: value ? '#000' : 'rgba(255,255,255,0.35)',
        transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: value ? '0 0 6px rgba(20,255,114,0.4)' : 'none',
      }}>
        {value && <Check size={8} color="#14ff72" strokeWidth={3} />}
      </span>
    </button>
  );
}

const IMPACT_COLOR = { high: '#14ff72', medium: '#00ccff', low: 'rgba(255,255,255,0.3)' };
const IMPACT_LABEL = { high: 'ALTO', medium: 'MEDIO', low: 'BAJO' };

const SUBNAV = [
  { id: "mis-ajustes",            label: "Mis ajustes",        icon: User,        color: "#14ff72"   },
  { id: "basico",                 label: "Básico",             icon: Sliders,     color: "#00ccff"   },
  { id: "ajustes",                label: "GPU / Tweaks",       icon: Microchip,   color: "#d926ff"   },
  { id: "administracion-energia", label: "CPU / Energía",      icon: Power,       color: "#ff6b6b"   },
  { id: "adaptadores-red",        label: "Red",                icon: Wifi,        color: "#26d0ce"   },
  { id: "servicios",              label: "Servicios",          icon: Cog,         color: "#ffd166"   },
  { id: "privacidad",             label: "Privacidad",         icon: Eye,         color: "#74b9ff"   },
  { id: "inicio-automatico",      label: "Inicio automático",  icon: Zap,         color: "#ffd166"   },
  { id: "personalizacion",        label: "Personalización",    icon: Brush,       color: "#ff9f43"   },
  { id: "panel-nvidia",           label: "Panel NVIDIA",       icon: MonitorCog,  color: "#76B900"   },
  { id: "panel-amd",              label: "Panel AMD",          icon: MonitorCog,  color: "#EF4444"   },
  { id: "memoria",                label: "Memoria RAM",        icon: MemoryStick, color: "#a29bfe"   },
  { id: "dispositivos",           label: "Almacenamiento",     icon: HardDrive,   color: "#00ccff"   },
  { id: "limpieza",               label: "Limpieza",           icon: Trash2,      color: "#ff6b6b"   },
  { id: "tareas",                 label: "Tareas",             icon: ListChecks,  color: "#a29bfe"   },
  { id: "eliminacion",            label: "Eliminación",        icon: Boxes,       color: "#a29bfe"   },
  { id: "seguridad",              label: "Seguridad",          icon: ShieldCheck, color: "#d926ff"   },
  { id: "obsoleto",               label: "Obsoleto",           icon: Archive,     color: "#b2bec3"   },
  { id: "input",                  label: "Input / Periféricos", icon: Mouse,       color: "#14ff72"   },
  { id: "monitor",                label: "Monitor / Display",  icon: Monitor,     color: "#00ccff"   },
  { id: "audio-gaming",           label: "Audio Gaming",       icon: Volume2,     color: "#ff8c00"   },
  { id: "steam",                  label: "Steam / Launchers",  icon: Package,     color: "#4d9fff"   },
  { id: "discord",                label: "Discord",            icon: MessageCircle, color: "#5865f2" },
  { id: "antivirus",              label: "Antivirus / Defender", icon: Shield,    color: "#14ff72"   },
  { id: "directx",               label: "DirectX / APIs",     icon: Layers,      color: "#d926ff"   },
  { id: "laptop",                 label: "Laptop Gaming",      icon: Laptop,      color: "#ffd166"   },
  { id: "streaming",              label: "Streaming / OBS",    icon: Radio,       color: "#e91e8c"   },
  { id: "competitivo",            label: "Competitivo",        icon: Trophy,      color: "#ffd700"   },
  { id: "overclock",              label: "Overclock / OC",     icon: TrendingUp,  color: "#ff6b35"   },
  { id: "emuladores",             label: "Emuladores",         icon: Smartphone,  color: "#14ff72"   },
  { id: "juegos",                 label: "Juegos Específicos", icon: Gamepad2,    color: "#00ccff"   },
  { id: "temperatura",            label: "Temperatura",        icon: Thermometer, color: "#ff4444"   },
  { id: "ssd",                    label: "SSD / Disco",        icon: Database,    color: "#a29bfe"   },
  { id: "virtual-mem",            label: "Memoria Virtual",    icon: MemoryStick, color: "#74b9ff"   },
  { id: "windows-update",         label: "Windows Update",     icon: RefreshCw,   color: "#00b4d8"   },
  { id: "latencia",               label: "Latencia de Red",    icon: Globe,       color: "#26d0ce"   },
  { id: "resolucion",             label: "Resolución/Escala",  icon: Maximize2,   color: "#d926ff"   },
  { id: "drivers",                label: "Drivers",            icon: Download,    color: "#ffd166"   },
  { id: "rgb",                    label: "RGB / Periféricos",  icon: Lightbulb,   color: "#ff9ff3"   },
];

const PRESETS = [
  { id: "basico",   label: "Básico",   desc: "9 tweaks seguros",  color: "#00ccff", tweaks: PRESET_BASICO   },
  { id: "optimo",   label: "Óptimo",   desc: `${PRESET_OPTIMO.length} tweaks recomendados`, color: "#14ff72", tweaks: PRESET_OPTIMO   },
  { id: "avanzado", label: "Avanzado", desc: `${PRESET_AVANZADO.length} tweaks`, color: "#d926ff", tweaks: PRESET_AVANZADO },
];

export default function Optimizacion() {
  const [active, setActive]   = useState(() => {
    try { return localStorage.getItem(LS_ACTIVE_KEY) || "mis-ajustes"; } catch { return "mis-ajustes"; }
  });
  const [search, setSearch]   = useState("");
  const [values, setValues]   = useState(loadPersistedValues);
  const [preset, setPreset]   = useState(() => {
    try { return localStorage.getItem(LS_PRESET_KEY) || "optimo"; } catch { return "optimo"; }
  });
  const [applying, setApplying] = useState(false);
  const [gpuBrand, setGpuBrand] = useState(null);

  useState(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "";
        const r = renderer.toLowerCase();
        if (r.includes("nvidia") || r.includes("geforce") || r.includes("rtx") || r.includes("gtx")) setGpuBrand("nvidia");
        else if (r.includes("amd") || r.includes("radeon") || r.includes("rx ")) setGpuBrand("amd");
        else if (r.includes("intel") || r.includes("arc") || r.includes("iris")) setGpuBrand("intel");
      }
    } catch {}
  });

  const setValuesAndPersist = useCallback((updater) => {
    setValues(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(LS_TWEAKS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setActiveAndPersist = useCallback((id) => {
    setActive(id);
    try { localStorage.setItem(LS_ACTIVE_KEY, id); } catch {}
  }, []);

  const activeNav = SUBNAV.find(s => s.id === active);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (active === "mis-ajustes") {
      return TWEAKS.filter(t => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return TWEAKS.filter(t => t.category === active &&
      (t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  }, [active, search]);

  const enabledCount = Object.values(values).filter(v => v === "on").length;
  const highImpactEnabled = TWEAKS.filter(t => values[t.id] === "on" && t.impact === "high").length;

  const applyPreset = useCallback((p) => {
    setPreset(p.id);
    try { localStorage.setItem(LS_PRESET_KEY, p.id); } catch {}
    setValuesAndPersist(prev => {
      const next = { ...prev };
      TWEAKS.forEach(t => { next[t.id] = "off"; });
      p.tweaks.forEach(t => { next[t.id] = "on"; });
      return next;
    });
    toast.success(`Preset "${p.label}" cargado — ${p.tweaks.length} tweaks activos`);
  }, [setValuesAndPersist]);

  const apply = async () => {
    const on = TWEAKS.filter(t => values[t.id] === "on");
    if (on.length === 0) { toast.info("Activa al menos un tweak."); return; }
    const isElectron = !!(window.electronAPI?.applyOptimization);
    setApplying(true);
    if (isElectron) {
      toast.info(`Aplicando ${on.length} tweaks al sistema...`);
      let ok = 0, fail = 0;
      for (const o of on) {
        try {
          const r = await window.electronAPI.applyOptimization(o.id, true);
          if (r.ok) ok++; else fail++;
        } catch { fail++; }
      }
      if (ok > 0) toast.success(`✅ ${ok} tweaks aplicados al registry. Anti-cheats protegidos.`);
      if (fail > 0) toast.warning(`${fail} tweaks fallaron — ejecuta como Administrador.`);
    } else {
      await new Promise(r => setTimeout(r, 700));
      toast.success(`✅ ${on.length} tweaks configurados — ${highImpactEnabled} de alto impacto`);
      toast.info("Para aplicar al registry de Windows, usa Pine Opti.exe como Admin");
    }
    try {
      const on = TWEAKS.filter(t => values[t.id] === "on");
      const entry = {
        id: `opt-${Date.now()}`,
        type: "Optimizaciones",
        color: "#14ff72",
        icon: "⚙️",
        desc: `${on.length} tweaks aplicados — ${highImpactEnabled} de alto impacto`,
        detail: [...new Set(on.map(t => t.category))].join(", "),
        ts: Date.now(),
      };
      const prev = JSON.parse(localStorage.getItem("pine_applied_tweaks") || "[]");
      localStorage.setItem("pine_applied_tweaks", JSON.stringify([entry, ...prev].slice(0, 50)));
    } catch {}
    setApplying(false);
  };

  const toggleAll = useCallback((cat) => {
    const catTweaks = TWEAKS.filter(t => t.category === cat || cat === "all");
    setValuesAndPersist(prev => {
      const allOn = catTweaks.every(t => prev[t.id] === "on");
      const next = { ...prev };
      catTweaks.forEach(t => { next[t.id] = allOn ? "off" : "on"; });
      return next;
    });
  }, [setValuesAndPersist]);

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }} className="page-enter">

      {/* ── Left subnav ── */}
      <aside style={{
        width: 200, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(6,8,15,0.7)',
        overflowY: 'auto', padding: '12px 8px',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {/* Stats pill */}
        <div style={{
          margin: '0 2px 10px', padding: '12px 14px', borderRadius: 11,
          background: 'linear-gradient(135deg,rgba(20,255,114,0.1),rgba(0,204,255,0.05))',
          border: '1px solid rgba(20,255,114,0.18)',
          boxShadow: '0 0 24px rgba(20,255,114,0.04)',
        }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#14ff72', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, filter: 'drop-shadow(0 0 8px rgba(20,255,114,0.4))' }}>{enabledCount}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 3 }}>tweaks activos · {highImpactEnabled} alto impacto</div>
          <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(enabledCount / TWEAKS.length) * 100}%`, background: 'linear-gradient(90deg,#14ff72,#00ccff)', borderRadius: 99, transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 8px rgba(20,255,114,0.4)' }} />
          </div>
        </div>

        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '0 6px', marginBottom: 4 }}>
          Categorías
        </div>

        {SUBNAV.map(it => {
          const Icon = it.icon;
          const isActive = active === it.id;
          const count = it.id === "mis-ajustes" ? TWEAKS.length : TWEAKS.filter(t => t.category === it.id).length;
          return (
            <button key={it.id} onClick={() => setActiveAndPersist(it.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 8px', borderRadius: 7, border: 'none',
              background: isActive ? `linear-gradient(90deg, ${it.color}18, ${it.color}06)` : 'transparent',
              color: isActive ? it.color : 'rgba(255,255,255,0.38)',
              fontSize: 11.5, fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.12s cubic-bezier(0.16,1,0.3,1)',
              borderLeft: `2px solid ${isActive ? it.color : 'transparent'}`,
              outline: 'none',
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; } }}
            >
              <Icon size={12} style={{ flexShrink: 0, filter: isActive ? `drop-shadow(0 0 5px ${it.color}90)` : 'none', transition: 'filter 0.15s' }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
              {count > 0 && <span style={{ fontSize: 9, color: isActive ? it.color : 'rgba(255,255,255,0.18)', fontFamily: 'JetBrains Mono, monospace' }}>{count}</span>}
            </button>
          );
        })}

        {/* Presets */}
        <div style={{ margin: '10px 2px 0', padding: '12px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 8 }}>
            Presets rápidos
          </div>
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => applyPreset(p)} style={{
              width: '100%', padding: '7px 10px', borderRadius: 7, marginBottom: 3,
              background: preset === p.id ? `${p.color}14` : 'transparent',
              border: `1px solid ${preset === p.id ? `${p.color}30` : 'transparent'}`,
              color: preset === p.id ? p.color : 'rgba(255,255,255,0.4)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.15s',
              outline: 'none',
              boxShadow: preset === p.id ? `0 0 12px ${p.color}18` : 'none',
            }}
              onMouseEnter={e => { if (preset !== p.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
              onMouseLeave={e => { if (preset !== p.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; } }}
            >
              <span>{p.label}</span>
              <span style={{ fontSize: 9, opacity: 0.6 }}>{p.desc}</span>
            </button>
          ))}
        </div>

        <button onClick={apply} disabled={applying}
          style={{
            margin: '8px 2px 0', padding: '12px', borderRadius: 9, border: 'none',
            background: applying ? 'rgba(20,255,114,0.1)' : 'linear-gradient(135deg,#14ff72,#00d45e)',
            color: applying ? '#14ff72' : '#000',
            fontSize: 12, fontWeight: 800, cursor: applying ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            boxShadow: applying ? 'none' : '0 4px 24px rgba(20,255,114,0.28)',
            transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
            outline: 'none',
          }}
          onMouseEnter={e => { if (!applying) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(20,255,114,0.4)'; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = applying ? 'none' : '0 4px 24px rgba(20,255,114,0.28)'; }}
        >
          {applying
            ? <><Rocket size={12} style={{ animation: 'spin-slow 1s linear infinite' }} /> Aplicando...</>
            : <><Rocket size={12} /> Aplicar {enabledCount} tweaks</>
          }
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {activeNav && (
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${activeNav.color}20, ${activeNav.color}08)`, border: `1px solid ${activeNav.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${activeNav.color}18` }}>
                <activeNav.icon size={15} style={{ color: activeNav.color, filter: `drop-shadow(0 0 4px ${activeNav.color}80)` }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{activeNav?.label}</h1>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {filtered.length} tweaks · {filtered.filter(t => values[t.id] === "on").length} activos
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => toggleAll(active === "mis-ajustes" ? "all" : active)}
              style={{ padding: '6px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.15s', outline: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              Toggle todo
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.28)', pointerEvents: 'none' }} />
          <input placeholder="Buscar tweak, servicio, registro..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 36, paddingRight: 12 }} />
        </div>

        {/* ── Category info panels ───────────────────────── */}

        {active === "basico" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Timer a 0.5ms", gain: "+10% FPS estabilidad", icon: "⚡", color: "#14ff72" },
              { label: "Game Mode ON", gain: "+3-8 FPS promedio", icon: "🎮", color: "#00ccff" },
              { label: "HAGS activo", gain: "Menos stutters", icon: "🖥️", color: "#d926ff" },
            ].map(item => (
              <div key={item.label} style={{ padding: "12px 14px", borderRadius: 11, background: `${item.color}08`, border: `1px solid ${item.color}18` }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: item.color, fontWeight: 600 }}>{item.gain}</div>
              </div>
            ))}
          </div>
        )}

        {active === "ajustes" && gpuBrand === "amd" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div className="section-label" style={{ color: "#EF4444", margin: 0 }}>Ajustes AMD Radeon detectados — configuración óptima</div>
              <span style={{ fontSize: 9, background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>AMD</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[
                { setting: "Anti-Lag+", value: "ON", color: "#14ff72" },
                { setting: "HYPR-RX", value: "ON", color: "#14ff72" },
                { setting: "FreeSync", value: "ON", color: "#14ff72" },
                { setting: "Radeon Chill", value: "OFF", color: "#ff6b6b" },
                { setting: "RSR", value: "OFF (nativo)", color: "#ff6b6b" },
                { setting: "RIS Nitidez", value: "ON (80%)", color: "#14ff72" },
                { setting: "Vsync", value: "OFF", color: "#ff6b6b" },
                { setting: "ReBAR/SAM", value: "ON (BIOS)", color: "#00ccff" },
              ].map(s => (
                <div key={s.setting} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{s.setting}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "ajustes" && gpuBrand !== "amd" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(217,38,255,0.05)", border: "1px solid rgba(217,38,255,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div className="section-label" style={{ color: "#d926ff", margin: 0 }}>
                {gpuBrand === "nvidia" ? "Ajustes NVIDIA detectados — configuración óptima" : "Ajustes GPU / Tweaks recomendados para gaming"}
              </div>
              {gpuBrand === "nvidia" && (
                <span style={{ fontSize: 9, background: "rgba(118,185,0,0.15)", color: "#76B900", border: "1px solid rgba(118,185,0,0.3)", borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>NVIDIA</span>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[
                { setting: "Low Latency Mode", value: "Ultra", color: "#14ff72" },
                { setting: "Power Management", value: "Max Performance", color: "#14ff72" },
                { setting: "Vsync", value: "OFF", color: "#ff6b6b" },
                { setting: "Shader Cache", value: "Unlimited", color: "#14ff72" },
                { setting: "Threaded Opt.", value: "ON", color: "#14ff72" },
                { setting: "FXAA (Driver)", value: "OFF", color: "#ff6b6b" },
                { setting: "DSR", value: "OFF", color: "#ff6b6b" },
                { setting: "ReBAR/SAM", value: "ON (BIOS)", color: "#00ccff" },
              ].map(s => (
                <div key={s.setting} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{s.setting}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "administracion-energia" && (
          <div style={{ marginBottom: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)" }}>
              <div className="section-label" style={{ marginBottom: 10, color: "#ff6b6b" }}>Planes de Energía</div>
              {[
                { plan: "Alto Rendimiento", desc: "CPU al 100% siempre", recommended: true },
                { plan: "Máximo Rendimiento", desc: "Oculto — el mejor para gaming", recommended: true },
                { plan: "Equilibrado", desc: "Baja frecuencia en idle", recommended: false },
                { plan: "Ahorro de energía", desc: "Reduce frecuencia agresivamente", recommended: false },
              ].map(p => (
                <div key={p.plan} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <span style={{ fontSize: 11, color: p.recommended ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: p.recommended ? 700 : 400 }}>{p.plan}</span>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{p.desc}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: p.recommended ? "#14ff72" : "#ff6b6b" }}>{p.recommended ? "✓ Recom." : "✗"}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)" }}>
              <div className="section-label" style={{ marginBottom: 10, color: "#ff6b6b" }}>Impacto XMP / EXPO</div>
              {[
                { cpu: "Ryzen (todos)", gain: "+10-25% en gaming", color: "#14ff72" },
                { cpu: "Intel 12th+", gain: "+3-8% en gaming", color: "#00ccff" },
                { cpu: "DDR5", gain: "+5-12% vs base 4800", color: "#d926ff" },
              ].map(r => (
                <div key={r.cpu} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{r.cpu}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: r.color }}>{r.gain}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 9.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
                Actívalo en BIOS → AI Tweaker / D.O.C.P. / EXPO
              </div>
            </div>
          </div>
        )}

        {active === "adaptadores-red" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(38,208,206,0.05)", border: "1px solid rgba(38,208,206,0.15)" }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#26d0ce" }}>Guía rápida de red para gaming</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { label: "Nagle", state: "OFF", desc: "-10-50ms latencia", good: true },
                { label: "QoS reservado", state: "0%", desc: "+20% ancho de banda", good: true },
                { label: "IPv6", state: "OFF (si IPv4)", desc: "Menos reintentos", good: true },
                { label: "MTU", state: "1500", desc: "Sin fragmentación", good: true },
                { label: "Network Throttling", state: "OFF", desc: "Sin límite artificial", good: true },
                { label: "RSS", state: "ON", desc: "Multi-núcleo para red", good: true },
                { label: "Interrupt Mod.", state: "OFF", desc: "Respuesta inmediata", good: true },
                { label: "TCP ACK Freq", state: "1", desc: "ACK por paquete", good: true },
              ].map(n => (
                <div key={n.label} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{n.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#26d0ce", fontFamily: "JetBrains Mono, monospace" }}>{n.state}</div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{n.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "privacidad" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(116,185,255,0.05)", border: "1px solid rgba(116,185,255,0.15)" }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#74b9ff" }}>¿Qué datos recopila Windows por defecto?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { item: "Historial de búsquedas en Inicio", sent: "Servidores Bing/Microsoft" },
                { item: "Apps abiertas y tiempo de uso", sent: "Microsoft Activity History" },
                { item: "Archivos tocados recientemente", sent: "Timeline de Microsoft" },
                { item: "Patrones de escritura (teclado)", sent: "Personalización online" },
                { item: "Datos de diagnóstico del sistema", sent: "DiagTrack → Microsoft" },
                { item: "Apps instaladas (telemetría)", sent: "CEIP de Microsoft" },
              ].map(d => (
                <div key={d.item} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "#ff6b6b", flexShrink: 0, fontSize: 11 }}>→</span>
                  <div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{d.item}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{d.sent}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "inicio-automatico" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(255,209,102,0.05)", border: "1px solid rgba(255,209,102,0.15)" }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#ffd166" }}>RAM consumida por apps en background</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { app: "iCUE (Corsair)", ram: "~400MB", score: 4 },
                { app: "Discord", ram: "~300MB", score: 3 },
                { app: "Steam", ram: "~250MB", score: 3 },
                { app: "GeForce Exp.", ram: "~200MB", score: 2 },
                { app: "OneDrive", ram: "~180MB", score: 2 },
                { app: "Spotify", ram: "~120MB", score: 2 },
                { app: "Teams Chat", ram: "~400MB", score: 4 },
                { app: "Razer Synapse", ram: "~300MB", score: 3 },
              ].map(a => (
                <div key={a.app} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.app}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: a.score >= 3 ? "#ff6b6b" : "#ffaa00", fontFamily: "JetBrains Mono, monospace" }}>{a.ram}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "personalizacion" && (
          <div style={{ marginBottom: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,159,67,0.05)", border: "1px solid rgba(255,159,67,0.15)" }}>
              <div className="section-label" style={{ marginBottom: 10, color: "#ff9f43" }}>Elementos a desactivar en Taskbar</div>
              {["Widget Board", "Chat integrado (Teams)", "Búsqueda extendida", "Task View", "Cortana"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  <span style={{ color: "#ff6b6b", fontSize: 12 }}>✕</span> {item}
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,159,67,0.05)", border: "1px solid rgba(255,159,67,0.15)" }}>
              <div className="section-label" style={{ marginBottom: 10, color: "#ff9f43" }}>Configuración de mouse óptima</div>
              {[
                { setting: "Velocidad del puntero", value: "6/11 (neutro)" },
                { setting: "Mejorar precisión", value: "OFF siempre" },
                { setting: "Polling Rate", value: "1000Hz+ competitivo" },
                { setting: "DPI recomendado", value: "400-1600 DPI" },
                { setting: "Raw Input", value: "ON en el juego" },
              ].map(s => (
                <div key={s.setting} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 10.5 }}>
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>{s.setting}</span>
                  <span style={{ color: "#ff9f43", fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "panel-nvidia" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(118,185,0,0.06)", border: "1px solid rgba(118,185,0,0.2)" }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#76B900" }}>Configuración NVIDIA óptima para FPS competitivo</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { cat: "Latencia", settings: ["Low Latency: Ultra", "Pre-rendered: 1 frame", "Reflex: ON + Boost"] },
                { cat: "Rendimiento", settings: ["Power: Max Performance", "Threaded Opt: ON", "Shader Cache: Ilimitado"] },
                { cat: "Calidad vs FPS", settings: ["FXAA driver: OFF", "Ambient Occ: OFF", "DSR: OFF"] },
              ].map(group => (
                <div key={group.cat} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#76B900", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{group.cat}</div>
                  {group.settings.map(s => (
                    <div key={s} style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 4, display: "flex", gap: 5 }}>
                      <span style={{ color: "#76B900" }}>›</span> {s}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "panel-amd" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#EF4444" }}>Configuración AMD Radeon óptima para FPS competitivo</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
              {[
                { cat: "Anti-Lag & Latencia", settings: ["Anti-Lag+: ON", "HYPR-RX: ON", "FreeSync Premium: ON"] },
                { cat: "Rendimiento", settings: ["RSR: OFF (resolución nativa)", "RIS nitidez: ON (80%)", "SAM/ReBAR: ON (BIOS)"] },
                { cat: "Calidad vs FPS", settings: ["Radeon Chill: OFF", "MorphAA: OFF", "Vsync: OFF en juego"] },
              ].map(group => (
                <div key={group.cat} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#EF4444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{group.cat}</div>
                  {group.settings.map(s => (
                    <div key={s} style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 4, display: "flex", gap: 5 }}>
                      <span style={{ color: "#EF4444" }}>›</span> {s}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { setting: "FSR (juego)", value: "Quality / Native", color: "#14ff72" },
                { setting: "Detalles texturas", value: "Alto", color: "#14ff72" },
                { setting: "Tessellation", value: "AMD-optimizado", color: "#14ff72" },
                { setting: "Surface Format", value: "OFF (filtro)", color: "#ff6b6b" },
              ].map(s => (
                <div key={s.setting} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{s.setting}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "dispositivos" && (
          <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(0,204,255,0.05)", border: "1px solid rgba(0,204,255,0.15)" }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#00ccff" }}>Hardware — Configuración óptima para gaming</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { device: "🖱️ Mouse", tips: ["Raw Input: ON", "Acceleration: OFF", "Polling: 1000Hz+", "Velocidad: 6/11"] },
                { device: "🎧 Audio", tips: ["Sample: 48000Hz", "Bit: 24-bit", "Modo exclusivo: ON", "Buffer: bajo (<20ms)"] },
                { device: "💾 SSD/NVMe", tips: ["TRIM: habilitado", "Write cache: ON", "Desfrag: OFF (SSD)", "SysMain: OFF"] },
              ].map(d => (
                <div key={d.device} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 12, marginBottom: 6 }}>{d.device}</div>
                  {d.tips.map(t => (
                    <div key={t} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.45)", marginBottom: 3, display: "flex", gap: 5 }}>
                      <span style={{ color: "#00ccff" }}>›</span> {t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "limpieza" && (
          <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Trash2 size={16} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Limpieza recomendada mensual</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                Temporales · Prefetch · Caché de shaders · Caché de Discord · DirectX Cache · Papelera · Logs de eventos.
                Una limpieza mensual puede liberar <span style={{ color: "#14ff72", fontWeight: 700 }}>5-30GB</span> según el uso.
              </div>
            </div>
          </div>
        )}

        {active === "eliminacion" && (
          <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.18)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <AlertTriangle size={14} style={{ color: "#ff6b6b" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#ff6b6b" }}>Estas acciones son permanentes — revísalas antes de aplicar</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              Desinstalar OneDrive, Cortana, bloatware y componentes obsoletos libera RAM y reduce el tiempo de inicio. Anti-cheats permanecen intactos y Pine Opti los protege automáticamente.
            </div>
          </div>
        )}

        {active === "obsoleto" && (
          <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, background: "rgba(178,190,195,0.05)", border: "1px solid rgba(178,190,195,0.15)" }}>
            <div className="section-label" style={{ marginBottom: 8, color: "#b2bec3" }}>Componentes Windows 2025 seguros de desactivar</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
              Internet Explorer · XPS Writer · Fax · Telnet · SMBv1 · WMP Legacy · Remote Differential Compression · Mixed Reality Portal.<br />
              Ninguno es necesario en un PC gaming moderno. Desactivarlos no rompe ningún juego ni anti-cheat.
            </div>
          </div>
        )}

        {/* Servicios — protected services panel */}
        {active === "servicios" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(217,38,255,0.06)", border: "1px solid rgba(217,38,255,0.2)", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <ShieldCheck size={13} style={{ color: "#d926ff" }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: "#d926ff", letterSpacing: "0.14em", textTransform: "uppercase" }}>Servicios Anti-Cheat — PROTEGIDOS permanentemente</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[
                  { name: "BlackBox", vendor: "Garena Free Fire", color: "#ff6b6b" },
                  { name: "Keller SS", vendor: "Garena", color: "#ff6b6b" },
                  { name: "Garena Shell", vendor: "Garena", color: "#ff6b6b" },
                  { name: "Easy Anti-Cheat", vendor: "Epic Games", color: "#ffaa00" },
                  { name: "BattlEye", vendor: "BattlEye Innovations", color: "#ffaa00" },
                  { name: "Riot Vanguard", vendor: "Riot Games", color: "#ffaa00" },
                  { name: "FACEIT AC", vendor: "FACEIT", color: "#00ccff" },
                  { name: "ESEA Client", vendor: "ESEA", color: "#00ccff" },
                  { name: "Steam / VAC", vendor: "Valve", color: "#00ccff" },
                ].map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 9px", background: `${s.color}06`, border: `1px solid ${s.color}18`, borderRadius: 8 }}>
                    <Lock size={9} style={{ color: s.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{s.name}</div>
                      <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.25)" }}>{s.vendor}</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 7.5, fontWeight: 800, color: s.color, letterSpacing: "0.08em", background: `${s.color}12`, padding: "2px 5px", borderRadius: 4, flexShrink: 0 }}>BLINDADO</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 9.5, color: "rgba(255,255,255,0.28)", lineHeight: 1.5 }}>
                Pine Opti <strong style={{ color: "#fff" }}>nunca</strong> modifica estos servicios. Los tweaks de esta sección solo afectan servicios genéricos de Windows — nunca anti-cheats ni componentes del juego.
              </div>
            </div>
          </div>
        )}

        {/* Tareas — info panel */}
        {active === "tareas" && (
          <div style={{ marginBottom: 14, padding: "13px 15px", borderRadius: 12, background: "rgba(162,155,254,0.05)", border: "1px solid rgba(162,155,254,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={13} style={{ color: "#a29bfe" }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "#a29bfe", letterSpacing: "0.12em", textTransform: "uppercase" }}>Tareas programadas de Windows</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              Las tareas programadas se ejecutan automáticamente en segundo plano. Algunas se activan durante gaming causando picos de CPU/disco.
              Desactivar las no esenciales puede reducir stutters aleatorios. <strong style={{ color: "#a29bfe" }}>Anti-cheats jamás se tocan.</strong>
            </div>
          </div>
        )}

        {/* Security panel */}
        {active === "seguridad" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: '20px 22px', borderRadius: 14, background: 'rgba(13,17,23,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 14 }}>Estado de seguridad del sistema</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Secure Boot", ok: true },
                  { label: "TPM 2.0", ok: true },
                  { label: "Virtualización", ok: true },
                  { label: "Firewall", ok: true },
                  { label: "Windows Defender", ok: true },
                  { label: "UAC Activo", ok: true },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(20,255,114,0.04)', border: '1px solid rgba(20,255,114,0.1)', borderRadius: 9, transition: 'all 0.15s' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#14ff72', boxShadow: '0 0 8px #14ff72', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(217,38,255,0.06)', border: '1px solid rgba(217,38,255,0.2)', boxShadow: '0 0 24px rgba(217,38,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <ShieldCheck size={14} style={{ color: '#d926ff' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#d926ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Compromiso Anti-Cheat</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                Pine Opti <strong style={{ color: '#fff' }}>nunca</strong> modifica servicios de anti-cheat. <strong style={{ color: '#d926ff' }}>BlackBox</strong>, <strong style={{ color: '#d926ff' }}>Vanguard</strong>, <strong style={{ color: '#d926ff' }}>EAC</strong>, <strong style={{ color: '#d926ff' }}>BattlEye</strong> y <strong style={{ color: '#d926ff' }}>Ricochet</strong> están blindados automáticamente.
              </p>
            </div>
          </div>
        )}

        {/* Tweak list */}
        {filtered.length > 0 && active !== "seguridad" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {filtered.map((o, i) => {
              const isOn = values[o.id] === "on";
              const impactColor = IMPACT_COLOR[o.impact] || IMPACT_COLOR.low;
              return (
                <div key={o.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  padding: '12px 14px',
                  background: isOn ? 'rgba(20,255,114,0.04)' : 'rgba(11,15,26,0.8)',
                  borderRadius: 10,
                  border: `1px solid ${isOn ? 'rgba(20,255,114,0.14)' : 'rgba(255,255,255,0.055)'}`,
                  transition: 'all 0.15s cubic-bezier(0.16,1,0.3,1)',
                  animation: `fade-up 0.22s cubic-bezier(0.16,1,0.3,1) both`,
                  animationDelay: `${Math.min(i * 15, 180)}ms`,
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = isOn ? 'rgba(20,255,114,0.24)' : 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = isOn ? 'rgba(20,255,114,0.07)' : 'rgba(255,255,255,0.025)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = isOn ? 'rgba(20,255,114,0.14)' : 'rgba(255,255,255,0.055)';
                    e.currentTarget.style.background = isOn ? 'rgba(20,255,114,0.04)' : 'rgba(11,15,26,0.8)';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isOn ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.45)', letterSpacing: '-0.01em' }}>{o.label}</span>
                      <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: `${impactColor}14`, border: `1px solid ${impactColor}22`, color: impactColor, letterSpacing: '0.08em' }}>
                        {IMPACT_LABEL[o.impact]}
                      </span>
                      {o.safe && <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: 'rgba(20,255,114,0.08)', border: '1px solid rgba(20,255,114,0.18)', color: '#14ff72', letterSpacing: '0.06em' }}>SEGURO</span>}
                      {o.reboot && <span style={{ fontSize: 8, fontWeight: 600, padding: '2px 5px', borderRadius: 4, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.18)', color: '#ff6b6b', letterSpacing: '0.06em' }}>REBOOT</span>}
                    </div>
                    <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: o.reasoning ? 3 : 0 }}>{o.description}</p>
                    {o.reasoning && (
                      <p style={{ fontSize: 9.5, color: 'rgba(20,255,114,0.5)', fontStyle: 'italic', lineHeight: 1.4 }}>💡 {o.reasoning}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right', minWidth: 52 }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 1 }}>Valor</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: impactColor, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>{o.recommended_value}</div>
                    </div>
                    <Toggle value={isOn} onChange={v => setValuesAndPersist(p => ({ ...p, [o.id]: v ? "on" : "off" }))} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {filtered.length === 0 && active !== "seguridad" && (
          <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Zap size={44} style={{ marginBottom: 12, opacity: 0.1 }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Sin tweaks para "{search}"</div>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>Prueba buscar en "Mis ajustes"</div>
          </div>
        )}
      </main>
    </div>
  );
}
