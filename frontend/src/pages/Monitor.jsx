import { useState, useEffect, useRef } from "react";
import { Cpu, Microchip, MemoryStick, HardDrive, Thermometer, Activity, Wifi, ZapOff, TrendingUp } from "lucide-react";

const HISTORY_LEN = 60;

function useSimulatedMetric(base, variance, interval = 1000) {
  const [value, setValue] = useState(base);
  const [history, setHistory] = useState(() => Array(HISTORY_LEN).fill(base));
  const [peak, setPeak] = useState(base);
  const ref = useRef(base);

  useEffect(() => {
    const tick = () => {
      const delta = (Math.random() - 0.5) * variance * 2;
      const next = Math.max(0, Math.min(100, ref.current + delta));
      ref.current = next;
      const rounded = Math.round(next);
      setValue(rounded);
      setPeak(p => Math.max(p, rounded));
      setHistory(h => [...h.slice(1), rounded]);
    };
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [variance, interval]);

  return { value, history, peak };
}

function Sparkline({ data, color, height = 48 }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = Math.max(max - min, 10);
  const w = 100;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height, display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${height} ${pts} ${w},${height}`}
        fill={`url(#grad-${color.replace("#","")})`}
        stroke="none"
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
      />
    </svg>
  );
}

function MetricCard({ label, value, history, color, icon: Icon, unit = "%", sub, warn, peak }) {
  const isWarn = warn && value >= warn;
  const displayColor = isWarn ? "#ff4444" : color;
  const c = 2 * Math.PI * 22;
  const dash = (value * c) / 100;

  return (
    <div className="card" style={{
      padding: "18px 20px",
      border: `1px solid ${isWarn ? "rgba(255,68,68,0.3)" : "rgba(255,255,255,0.07)"}`,
      background: isWarn ? "rgba(255,68,68,0.04)" : undefined,
      transition: "border-color 0.3s, background 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${displayColor}15`, border: `1px solid ${displayColor}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={13} style={{ color: displayColor }} />
          </div>
          <div>
            <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", display: "block" }}>{label}</span>
            {peak !== undefined && (
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.04em" }}>
                <TrendingUp size={8} style={{ display: "inline", verticalAlign: "middle", marginRight: 2, color: isWarn && peak >= warn ? "#ff4444" : "rgba(255,255,255,0.2)" }} />
                MAX {peak}{unit}
              </span>
            )}
          </div>
        </div>
        <div style={{ position: "relative", width: 48, height: 48 }}>
          <svg viewBox="0 0 52 52" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle cx="26" cy="26" r="22" fill="none" stroke={displayColor} strokeWidth="4"
              strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.4s ease, stroke 0.3s", filter: `drop-shadow(0 0 4px ${displayColor}70)` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: displayColor, fontFamily: "JetBrains Mono, monospace" }}>{value}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.05em", lineHeight: 1 }}>
          {value}<span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginLeft: 2 }}>{unit}</span>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", marginTop: 3 }}>{sub}</div>
        {isWarn && <div style={{ fontSize: 9.5, color: "#ff4444", marginTop: 4, fontWeight: 700 }}>⚠ Temperatura alta</div>}
      </div>

      <Sparkline data={history} color={displayColor} height={44} />
    </div>
  );
}

function NetCard({ down, up, downH, upH }) {
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,204,255,0.12)", border: "1px solid rgba(0,204,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Wifi size={13} style={{ color: "#00ccff" }} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Red</span>
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>↓ DOWNLOAD</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#14ff72", letterSpacing: "-0.04em", fontFamily: "JetBrains Mono, monospace" }}>{down}<span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginLeft: 3 }}>MB/s</span></div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>↑ UPLOAD</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#00ccff", letterSpacing: "-0.04em", fontFamily: "JetBrains Mono, monospace" }}>{up}<span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginLeft: 3 }}>MB/s</span></div>
        </div>
      </div>
      <Sparkline data={downH} color="#14ff72" height={36} />
    </div>
  );
}

export default function Monitor() {
  const cpu  = useSimulatedMetric(42, 8, 900);
  const gpu  = useSimulatedMetric(58, 12, 800);
  const ram  = useSimulatedMetric(54, 4, 1200);
  const disk = useSimulatedMetric(22, 15, 1500);
  const cpuTemp = useSimulatedMetric(62, 5, 1100);
  const gpuTemp = useSimulatedMetric(68, 6, 1000);
  const netDown = useSimulatedMetric(12, 8, 700);
  const netUp   = useSimulatedMetric(3, 2, 700);

  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
      setUptime(u => u + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (d) => d.toLocaleTimeString("es-ES");
  const fmtUptime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${String(sec).padStart(2, "0")}s`;
  };

  const avgUsage = Math.round((cpu.value + gpu.value + ram.value) / 3);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px" }} className="page-enter">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(20,255,114,0.2),rgba(20,255,114,0.06))", border: "1px solid rgba(20,255,114,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={18} style={{ color: "#14ff72" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>Monitor en Tiempo Real</h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Uso de hardware · Actualización cada ~1s
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Sesión", value: fmtUptime(uptime), color: "#14ff72" },
              { label: "Avg Load", value: `${avgUsage}%`, color: avgUsage > 80 ? "#ff4444" : avgUsage > 60 ? "#ffd166" : "#14ff72" },
              { label: "Hora", value: fmt(time), color: "rgba(255,255,255,0.5)" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#14ff72", boxShadow: "0 0 8px #14ff72", animation: "blink 1.4s ease-in-out infinite" }} />
        </div>
      </div>

      {/* Grid métricas principales */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <MetricCard label="CPU" value={cpu.value} history={cpu.history} peak={cpu.peak} color="#14ff72" icon={Cpu} sub={`${navigator.hardwareConcurrency || 8} hilos activos`} />
        <MetricCard label="GPU" value={gpu.value} history={gpu.history} peak={gpu.peak} color="#d926ff" icon={Microchip} sub="VRAM estimada libre" />
        <MetricCard label="RAM" value={ram.value} history={ram.history} peak={ram.peak} color="#00ccff" icon={MemoryStick} sub={`${navigator.deviceMemory || 8} GB total`} />
        <MetricCard label="Disco" value={disk.value} history={disk.history} peak={disk.peak} color="#ffd166" icon={HardDrive} sub="I/O actividad disco" />
      </div>

      {/* Fila inferior */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <MetricCard label="Temp CPU" value={cpuTemp.value} history={cpuTemp.history} peak={cpuTemp.peak} color="#ff8c00" icon={Thermometer} unit="°C" sub="Temperatura del núcleo" warn={85} />
        <MetricCard label="Temp GPU" value={gpuTemp.value} history={gpuTemp.history} peak={gpuTemp.peak} color="#ff4655" icon={Thermometer} unit="°C" sub="Temperatura del die" warn={90} />
        <NetCard down={(netDown.value / 10).toFixed(1)} up={(netUp.value / 10).toFixed(1)} downH={netDown.history.map(v => v / 10)} upH={netUp.history.map(v => v / 10)} />
      </div>

      <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <ZapOff size={12} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", margin: 0, lineHeight: 1.5 }}>
          Valores simulados en modo web — para sensores reales (temperaturas, VRAM exacta, frecuencias de clock) usa la versión .exe de Pine Opti con permisos de administrador.
        </p>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
