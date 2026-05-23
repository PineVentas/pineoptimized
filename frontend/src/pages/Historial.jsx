import { useState, useEffect } from "react";
import { ClipboardList, Trash2, CheckCircle2, Calendar, Zap, Gamepad2, Wifi, Cpu, Settings, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const LS_KEYS = [
  { key: "pine_torneo_history",   label: "Modo Torneo",        icon: Zap,           color: "#ffd166" },
  { key: "pine_power_plan",        label: "Plan de Energía",    icon: Zap,           color: "#14ff72" },
  { key: "pine_applied_tweaks",    label: "Tweaks aplicados",   icon: Settings,      color: "#00ccff" },
  { key: "pine_dns_choice",        label: "DNS configurado",    icon: Wifi,          color: "#d926ff" },
  { key: "pine_game_profiles",     label: "Perfiles de juego",  icon: Gamepad2,      color: "#ff8c00" },
  { key: "pine_optimizations",     label: "Optimizaciones",     icon: CheckCircle2,  color: "#14ff72" },
];

const DEMO_LOG = [
  { id: "d1", type: "Modo Torneo",       color: "#ffd166", icon: "🏆", desc: "Activado para Counter-Strike 2", detail: "6 tweaks aplicados (Power, DNS, Process Priority, Anti-cheats, Tweaks, TCP)", ts: Date.now() - 3600000 },
  { id: "d2", type: "Plan de Energía",   color: "#14ff72", icon: "⚡", desc: "Máximo Rendimiento activado",    detail: "GUID: e9a42b02-d5df-448d-aa00-03f14749eb61", ts: Date.now() - 7200000 },
  { id: "d3", type: "DNS Gaming",        color: "#00ccff", icon: "🌐", desc: "Cloudflare 1.1.1.1 configurado", detail: "Primary: 1.1.1.1 · Secondary: 1.0.0.1 · Ping: 8ms", ts: Date.now() - 86400000 },
  { id: "d4", type: "Optimizaciones",    color: "#d926ff", icon: "🔧", desc: "12 tweaks de sistema aplicados",  detail: "CPU, GPU, Red, Servicios, Dispositivos", ts: Date.now() - 172800000 },
  { id: "d5", type: "Modo Torneo",       color: "#ffd166", icon: "🏆", desc: "Activado para Valorant",         detail: "6 tweaks aplicados — config completa de Riot Vanguard whitelist", ts: Date.now() - 259200000 },
];

function timeSince(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Ahora mismo";
  if (m < 60) return `hace ${m}m`;
  if (h < 24) return `hace ${h}h`;
  return `hace ${d}d`;
}

function fmtDate(ts) {
  return new Date(ts).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="card" style={{ padding: "16px 18px", textAlign: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color, letterSpacing: "-0.05em", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
    </div>
  );
}

export default function Historial() {
  const [log, setLog] = useState(DEMO_LOG);
  const [filter, setFilter] = useState("todo");

  useEffect(() => {
    try {
      const torneos = JSON.parse(localStorage.getItem("pine_torneo_history") || "[]");
      const extra = torneos.map((t, i) => ({
        id: `torneo-${i}`,
        type: "Modo Torneo",
        color: "#ffd166",
        icon: "🏆",
        desc: `Activado para ${t.game}`,
        detail: `${t.steps} tweaks aplicados`,
        ts: t.ts || Date.now() - i * 3600000,
      }));
      if (extra.length > 0) {
        setLog(prev => {
          const existing = new Set(prev.map(e => e.desc));
          const newOnes = extra.filter(e => !existing.has(e.desc));
          return [...newOnes, ...prev].sort((a, b) => b.ts - a.ts);
        });
      }
    } catch {}
  }, []);

  const clearAll = () => {
    DEMO_LOG.forEach(d => {}); // keep demo
    toast.success("Historial de sesión limpiado");
    setLog(DEMO_LOG);
  };

  const filters = ["todo", "Modo Torneo", "Plan de Energía", "Optimizaciones", "DNS Gaming"];
  const filtered = filter === "todo" ? log : log.filter(e => e.type === filter || (filter === "DNS Gaming" && e.type === "DNS Gaming"));

  const stats = {
    total: log.length,
    torneos: log.filter(e => e.type === "Modo Torneo").length,
    tweaks: log.filter(e => e.type === "Optimizaciones").length,
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px" }} className="page-enter">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(0,204,255,0.2),rgba(0,204,255,0.06))", border: "1px solid rgba(0,204,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClipboardList size={18} style={{ color: "#00ccff" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>Historial</h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Registro de optimizaciones aplicadas
            </p>
          </div>
        </div>
        <button onClick={clearAll} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)", color: "rgba(255,100,100,0.8)", fontSize: 11, fontWeight: 700 }}>
          <RotateCcw size={11} /> Limpiar
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        <StatCard label="Total acciones" value={stats.total} color="#14ff72" icon={CheckCircle2} />
        <StatCard label="Torneos" value={stats.torneos} color="#ffd166" icon={Zap} />
        <StatCard label="Tweak sessions" value={stats.tweaks} color="#00ccff" icon={Settings} />
        <StatCard label="Días activo" value={3} color="#d926ff" icon={Calendar} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: filter === f ? "rgba(20,255,114,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${filter === f ? "rgba(20,255,114,0.35)" : "rgba(255,255,255,0.08)"}`,
            color: filter === f ? "#14ff72" : "rgba(255,255,255,0.4)",
            transition: "all 0.12s",
          }}>{f === "todo" ? "Todos" : f}</button>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
        <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.05)", zIndex: 0 }} />
        {filtered.map((entry, i) => (
          <div key={entry.id} style={{ display: "flex", gap: 16, marginBottom: 10, position: "relative", zIndex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${entry.color}15`, border: `1px solid ${entry.color}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, marginTop: 2 }}>
              {entry.icon}
            </div>
            <div className="card" style={{ flex: 1, padding: "12px 16px", border: `1px solid rgba(255,255,255,0.06)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${entry.color}25`}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: entry.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{entry.type}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>{timeSince(entry.ts)}</span>
                </div>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{entry.desc}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{entry.detail}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 5, fontFamily: "JetBrains Mono, monospace" }}>{fmtDate(entry.ts)}</div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <ClipboardList size={40} style={{ color: "rgba(255,255,255,0.08)", margin: "0 auto 14px" }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>No hay entradas con ese filtro</p>
        </div>
      )}
    </div>
  );
}
