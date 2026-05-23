import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Skull, Lock, Check, Database, Loader2, RefreshCw, Zap, ShieldCheck, MemoryStick } from "lucide-react";

const ANTICHEAT_PROTECTED = [
  "vgc", "vgtray", "vanguard", "easyanticheat", "eac_launcher",
  "battleye", "beservice", "bservice", "garena", "blackbox",
  "kellerss", "keller", "garenaff", "garenaplus", "garenafflauncher",
  "garenacore", "garenashell", "faceitclient", "faceit",
  "esea", "xigncode", "xhunter", "nprotect", "gameguard",
  "mhyprot", "riotclient", "riotclientservices",
];

const SYSTEM_PROTECTED = [
  "system", "idle", "svchost", "lsass", "csrss", "wininit",
  "services", "smss", "registry", "fontdrvhost", "dwm", "winlogon",
];

const SAFE_REASONS = {
  "OneDrive": "Sync cloud innecesario",
  "Teams": "Chat corporativo — cierra durante gaming",
  "Spotify": "Reproductor de música en background",
  "Discord": "Chat gaming (overlay puede causar lag)",
  "msedge": "Edge en background",
  "chrome": "Chrome consumiendo RAM",
  "MicrosoftEdge": "Edge duplicado",
  "SearchUI": "Búsqueda de Windows",
  "SearchApp": "Búsqueda de Windows",
  "YourPhone": "Sincronización de teléfono",
  "WinStore.App": "Microsoft Store en background",
  "SearchHost": "Windows Search",
  "Cortana": "Asistente virtual de Windows",
  "SteamWebHelper": "Browser interno de Steam",
  "EpicGamesLauncher": "Launcher de Epic en background",
  "backgroundTaskHost": "Tareas background de UWP",
  "RuntimeBroker": "Permisos de apps UWP",
  "dllhost": "COM Surrogate",
  "SkypeApp": "Skype en background",
  "opera": "Opera en background",
  "brave": "Brave en background",
  "GameBar": "Xbox Game Bar innecesario",
  "GameBarPresenceWriter": "Overlay Xbox innecesario",
  "Slack": "Chat de trabajo innecesario en gaming",
  "Telegram": "Mensajería en background",
  "WhatsApp": "WhatsApp Desktop en background",
  "zoom": "Videoconferencia en background",
  "AdobeUpdateService": "Actualizaciones Adobe — innecesario",
  "CCleaner": "Limpiador de terceros en background",
  "NahimicService": "Audio Nahimic — puede causar conflictos",
  "MSIAfterburner": "OC tool — cierra si no se usa",
  "RivaTunerStatisticsServer": "RTSS — añade latencia al overlay",
  "OBSStudio": "OBS en background sin grabar",
  "Overwolf": "Overlay de juegos — consume GPU",
  "NVDisplay.Container": "Panel NVIDIA innecesario",
  "nvcontainer": "Container NVIDIA — liberable",
  "AdobeIPCBroker": "Broker de Adobe — innecesario",
  "acrotray": "Adobe Acrobat en background",
  "iTunesHelper": "iTunes helper — innecesario",
  "AppleMobileDeviceService": "Servicio Apple innecesario",
  "Dropbox": "Sync Dropbox — pausa durante gaming",
  "GoogleDriveSync": "Google Drive sync en background",
  "firefox": "Firefox en background",
  "TelegramDesktop": "Telegram Desktop en background",
  "mpv": "Reproductor de video en background",
  "vlc": "VLC Media Player en background",
};

function isAntiCheat(name) {
  const lower = (name || "").toLowerCase().replace(".exe", "");
  return ANTICHEAT_PROTECTED.some(ac => lower.includes(ac));
}
function isSystem(name) {
  const lower = (name || "").toLowerCase().replace(".exe", "");
  return SYSTEM_PROTECTED.some(s => lower === s || lower.startsWith(s));
}

function RamBar({ value, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const color = pct > 70 ? "#ff4444" : pct > 40 ? "#ffaa00" : "#14ff72";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color, opacity: 0.8 }}
        />
      </div>
      <span className="text-[10px] text-white/50 w-10 text-right font-mono">{value}MB</span>
    </div>
  );
}

export default function ProcessKiller() {
  const [procs, setProcs] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [killing, setKilling] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const isElectron = !!(window.electronAPI && window.electronAPI.getProcesses);

  const buildProcessList = (rawList) => {
    return rawList.map(p => {
      const name = p.Name || p.name || "";
      const ac = isAntiCheat(name);
      const sys = isSystem(name);
      const reason = SAFE_REASONS[name] || (ac ? "Anti-cheat protegido" : sys ? "Proceso del sistema" : "Proceso en background");
      return {
        name,
        pid: p.Id || p.id,
        cpu_pct: parseFloat(p.CPU || p.cpu || 0),
        ram_mb: p.RAM_MB || p.ram_mb || Math.round((p.WorkingSet || 0) / 1048576),
        safe_to_kill: !ac && !sys,
        is_anticheat: ac,
        reason,
      };
    });
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isElectron) {
        const r = await window.electronAPI.getProcesses();
        if (r.ok && r.processes.length > 0) setProcs(buildProcessList(r.processes));
      } else {
        const r = await api.get("/processes");
        setProcs(buildProcessList(r.data.processes));
      }
    } catch {
      toast.error("Error al cargar procesos");
    } finally {
      setLoading(false);
    }
  }, [isElectron]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const toggle = (name) => {
    const p = procs.find(p => p.name === name);
    if (!p?.safe_to_kill) return;
    setSelected(prev => {
      const n = new Set(prev);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });
  };

  const selectAllSafe = () => {
    const safe = procs.filter(p => p.safe_to_kill && p.ram_mb > 50).map(p => p.name);
    setSelected(new Set(safe));
    toast(`✅ ${safe.length} procesos seguros seleccionados`);
  };

  const killAll = async () => {
    if (selected.size === 0) return toast("Selecciona procesos primero");
    setKilling(true);
    const names = Array.from(selected);
    const ramFreed = procs.filter(p => names.includes(p.name)).reduce((s, p) => s + p.ram_mb, 0);
    try {
      if (isElectron) {
        const r = await window.electronAPI.killProcesses(names);
        if (r.ok) {
          toast.success(`✅ ${names.length} procesos cerrados · ~${ramFreed}MB liberados`);
          if (r.skipped?.length) toast.warning(`⚠️ ${r.skipped.length} anti-cheats blindados y omitidos`);
          setSelected(new Set());
          setTimeout(load, 1200);
        } else {
          toast.error(r.reason || "Error al cerrar procesos. Ejecuta como Administrador.");
        }
      } else {
        const r = await api.post("/processes/kill", { names });
        toast.success(`${r.data.killed.length} procesos cerrados · ${r.data.ram_freed_mb}MB liberados`);
        if (r.data.skipped_critical?.length) toast.warning(`${r.data.skipped_critical.length} procesos críticos protegidos`);
        setSelected(new Set());
        setTimeout(load, 1200);
      }
    } catch {
      toast.error("Error al cerrar procesos");
    } finally {
      setKilling(false);
    }
  };

  const filtered = procs
    .filter(p =>
      filter === "safe" ? p.safe_to_kill :
      filter === "anticheat" ? p.is_anticheat : true
    )
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const totalRam = procs.reduce((s, p) => s + p.ram_mb, 0);
  const selectedRam = procs.filter(p => selected.has(p.name)).reduce((s, p) => s + p.ram_mb, 0);
  const antiCheatCount = procs.filter(p => p.is_anticheat).length;
  const maxRam = Math.max(...procs.map(p => p.ram_mb), 1);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 32px' }} className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,rgba(217,38,255,0.2),rgba(217,38,255,0.06))', border: '1px solid rgba(217,38,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skull size={18} style={{ color: '#d926ff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Process Killer</h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {isElectron ? "Lista en vivo · anti-cheats blindados automáticamente" : "Libera RAM cerrando procesos en background"}
            </p>
          </div>
        </div>
        <button onClick={load} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <RefreshCw size={12} style={{ animation: loading ? 'spin-slow 1s linear infinite' : 'none' }} /> Actualizar
        </button>
      </div>

      {isElectron && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 10, background: 'rgba(20,255,114,0.06)', border: '1px solid rgba(20,255,114,0.2)', fontSize: 11, color: '#14ff72', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={13} /> Modo real activo · {antiCheatCount} anti-cheats detectados y blindados automáticamente
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { icon: MemoryStick, color: "#14ff72", value: totalRam, unit: "MB", label: "RAM en uso" },
          { icon: Skull, color: "#d926ff", value: selected.size, unit: "", label: "Seleccionados" },
          { icon: Check, color: "#00ccff", value: selectedRam, unit: "MB", label: "A liberar" },
          { icon: ShieldCheck, color: "#d926ff", value: antiCheatCount, unit: "", label: "Anti-cheats" },
        ].map(({ icon: Ic, color, value, unit, label }, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Ic size={14} style={{ color, marginBottom: 8 }} />
            <div style={{ fontSize: 22, fontWeight: 800, color: i === 2 && value > 0 ? color : '#fff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {value}<span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 4, fontFamily: 'Inter, sans-serif' }}>{unit}</span>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Actions + Search */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={selectAllSafe} className="btn-primary text-xs flex items-center gap-1.5">
          <Zap size={12} /> Seleccionar seguros
        </button>
        <button onClick={() => setSelected(new Set())} className="btn-ghost text-xs">Limpiar</button>
        <div style={{ flex: 1, minWidth: 140 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar proceso..."
            style={{
              width: '100%', height: '100%', minHeight: 32,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 11, padding: '0 12px',
              outline: 'none', fontFamily: 'JetBrains Mono, monospace',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(20,255,114,0.35)'; e.target.style.boxShadow = '0 0 0 2px rgba(20,255,114,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/60 focus:outline-none focus:border-white/20"
        >
          <option value="all">Todos ({procs.length})</option>
          <option value="safe">Solo seguros ({procs.filter(p => p.safe_to_kill).length})</option>
          <option value="anticheat">Anti-cheats ({antiCheatCount})</option>
        </select>
      </div>

      {/* Process list */}
      <div className="glass overflow-hidden" data-testid="proc-list">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-white/5 text-[10px] uppercase tracking-widest text-white/30">
          <div className="col-span-1" />
          <div className="col-span-4">Proceso</div>
          <div className="col-span-2">CPU</div>
          <div className="col-span-4">RAM</div>
          <div className="col-span-1">Estado</div>
        </div>

        {loading && procs.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-10 text-white/40 text-sm">
            <Loader2 size={16} className="animate-spin" /> Leyendo procesos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-white/30">No hay procesos en esta categoría</div>
        ) : (
          filtered.map(p => (
            <div
              key={p.name + (p.pid || "")}
              data-testid={`proc-${p.name}`}
              onClick={() => toggle(p.name)}
              className={`grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-white/4 text-sm transition-colors ${p.safe_to_kill ? "cursor-pointer hover:bg-white/4" : "opacity-50 cursor-default"} ${selected.has(p.name) ? "bg-[#14ff72]/6 border-l-2 border-l-[#14ff72]/40" : ""}`}
            >
              <div className="col-span-1 flex items-center">
                {p.is_anticheat ? (
                  <ShieldCheck size={13} className="text-[#d926ff]" />
                ) : p.safe_to_kill ? (
                  <div className={`w-4 h-4 rounded border ${selected.has(p.name) ? "bg-[#14ff72] border-[#14ff72]" : "border-white/25"} flex items-center justify-center transition-all`}>
                    {selected.has(p.name) && <Check size={10} className="text-black" />}
                  </div>
                ) : <Lock size={12} className="text-white/20" />}
              </div>
              <div className="col-span-4 font-mono text-xs flex items-center truncate text-white/80">{p.name}</div>
              <div className="col-span-2 text-xs text-white/50 flex items-center font-mono">
                {p.cpu_pct > 0 ? (
                  <span style={{ color: p.cpu_pct > 20 ? "#ffaa00" : undefined }}>{p.cpu_pct.toFixed(1)}%</span>
                ) : "—"}
              </div>
              <div className="col-span-4 flex items-center">
                <div className="w-full">
                  <RamBar value={p.ram_mb} max={maxRam} />
                </div>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                {p.is_anticheat ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d926ff]" title="Anti-cheat" />
                ) : p.safe_to_kill ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14ff72]/50" title="Seguro" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/15" title="Sistema" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Kill bar */}
      <div className="sticky bottom-0 mt-4 flex justify-end items-center gap-3">
        {selected.size > 0 && (
          <span className="text-xs px-3 py-1.5 rounded-lg bg-[#14ff72]/10 text-[#14ff72] border border-[#14ff72]/20 mr-auto">
            {selected.size} seleccionados · {selectedRam}MB a liberar
          </span>
        )}
        <button
          onClick={killAll}
          disabled={killing || selected.size === 0}
          className="btn-primary flex items-center gap-2"
          data-testid="kill-btn"
        >
          {killing
            ? <><Loader2 size={14} className="animate-spin" /> Cerrando...</>
            : <><Skull size={14} /> Matar ({selected.size})</>
          }
        </button>
      </div>
    </div>
  );
}
