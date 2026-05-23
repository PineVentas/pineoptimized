import { useState } from "react";
import { Thermometer, ShieldAlert, ChevronDown, CheckCircle2, AlertTriangle, XCircle, Zap, Cpu, MemoryStick, Microchip, Info, ExternalLink } from "lucide-react";

const STEPS_RAM = [
  { n: 1, title: "Accede a la BIOS/UEFI", desc: "Reinicia el PC y presiona la tecla de BIOS al iniciar (suele ser DEL, F2 o F12 según tu placa base). Busca la sección 'AI Tweaker', 'OC', 'D.O.C.P' o 'EXPO'.", safe: true },
  { n: 2, title: "Activa XMP / EXPO / DOCP", desc: "Busca el perfil XMP (Intel) o EXPO/DOCP (AMD). Actívalo y selecciona el perfil #1 que corresponde a las frecuencias impresas en tus módulos de RAM (ej. 3200 MHz, 3600 MHz, 6000 MHz).", safe: true },
  { n: 3, title: "Guarda y reinicia", desc: "Presiona F10 para guardar. El sistema puede tardar un poco más en arrancar la primera vez — eso es normal. Si no enciende, borra la CMOS (quita la pila de la placa 10 segundos) para volver a valores por defecto.", safe: true },
  { n: 4, title: "Verifica estabilidad", desc: "Abre CPU-Z → pestaña 'Memory' y comprueba que la frecuencia sea la correcta. Ejecuta MemTest86 durante 1 hora o juega durante 30 minutos para confirmar estabilidad.", safe: true },
];

const STEPS_CPU = [
  { n: 1, title: "Activa PBO / Precision Boost Overdrive (AMD)", desc: "En AMD Ryzen: BIOS → Advanced → AMD Overclocking → PBO → 'Advanced'. Configura PPT/TDC/EDC al máximo permitido por tu placa base. No modifiques voltajes manualmente.", safe: true },
  { n: 2, title: "Intel: Solo activa XMP y MCE", desc: "Para Intel de 12a/13a/14a gen, simplemente activa el perfil XMP de la RAM y deja que el procesador haga Turbo Boost automático. NO subas manualmente el multiplicador si eres principiante.", safe: true },
  { n: 3, title: "Controla la temperatura", desc: "Instala HWMonitor o Ryzen Master. Bajo carga gaming la temperatura no debe superar 85°C en CPU. Si supera 90°C, aplica nueva pasta térmica antes de hacer cualquier OC.", safe: false },
  { n: 4, title: "Prueba de estrés (opcional)", desc: "Ejecuta Cinebench R23 (test multi-núcleo 10 min) o Prime95 Small FFTs 15 minutos. Si el sistema se reinicia o hay errores, el OC no es estable — vuelve a valores base.", safe: false },
];

const STEPS_GPU = [
  { n: 1, title: "Instala MSI Afterburner", desc: "Descarga MSI Afterburner (funciona con cualquier GPU, no solo MSI). Es la herramienta estándar para OC de GPU.", safe: true },
  { n: 2, title: "Sube el Power Limit al máximo", desc: "En Afterburner, mueve 'Power Limit' al 100% (o el máximo permitido). Esto le da más margen a la GPU para hacer boost automático. Es completamente seguro.", safe: true },
  { n: 3, title: "Core Clock +100–150 MHz", desc: "Sube el 'Core Clock' en pasos de +50 MHz. Aplica, ejecuta Unigine Heaven o Furmark 5 minutos entre cada paso. Si hay artefactos visuales (pixels raros, pantalla negra) el límite es ahí — baja 25 MHz.", safe: true },
  { n: 4, title: "Memory Clock +500–800 MHz", desc: "Sube el 'Memory Clock' en pasos de +200 MHz. La VRAM es más estable — puedes subir más sin riesgo. Artefactos visuales = límite encontrado.", safe: true },
  { n: 5, title: "Fan Curve agresiva", desc: "En Afterburner abre 'Fan' y crea una curva que suba los fans a 60% desde 65°C. Más ventilación = más headroom para el OC sin riesgo térmico.", safe: true },
  { n: 6, title: "Guarda el perfil", desc: "Una vez estable, guarda el perfil en uno de los slots (P1–P5) de Afterburner y activa 'Start with Windows' para que se aplique automáticamente.", safe: true },
];

const DONTS = [
  "No subas el voltaje de CPU/GPU si eres principiante — el calor excesivo mata el hardware.",
  "No hagas OC en portátiles — el sistema de refrigeración no está diseñado para ello.",
  "No ignores las temperaturas. 95°C+ en GPU o CPU de forma sostenida = daño a largo plazo.",
  "No uses el PC sin pasta térmica de calidad. La pasta seca arruina cualquier OC.",
  "No hagas OC en CPU sin cooler de calidad (al menos un cooler de 120mm de torre).",
  "No subas el Core Clock de GPU más de +200 MHz sin probar estabilidad paso a paso.",
];

const SAFE_GAINS = [
  { label: "XMP/EXPO en RAM",          gain: "+3–8% FPS en juegos CPU-limited",   color: "#14ff72", risk: "Cero riesgo" },
  { label: "PBO en AMD Ryzen",          gain: "+5–12% rendimiento multi-núcleo",   color: "#14ff72", risk: "Muy bajo" },
  { label: "Power Limit GPU al 100%",   gain: "+2–5% FPS instantáneo",            color: "#14ff72", risk: "Cero riesgo" },
  { label: "Core Clock GPU +100 MHz",   gain: "+5–8% FPS en juegos GPU-limited",   color: "#ffd166", risk: "Bajo" },
  { label: "Memory Clock GPU +600 MHz", gain: "+3–7% FPS (especialmente 1440p/4K)",color: "#ffd166", risk: "Muy bajo" },
  { label: "Voltaje manual CPU",        gain: "+10–15% pero gran riesgo",          color: "#ff4444", risk: "ALTO — no recomendado" },
];

function StepCard({ step, expanded, onToggle }) {
  return (
    <div style={{ border: `1px solid ${expanded ? "rgba(20,255,114,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.15s", marginBottom: 6 }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", userSelect: "none" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: expanded ? "rgba(20,255,114,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${expanded ? "rgba(20,255,114,0.4)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: expanded ? "#14ff72" : "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace" }}>{step.n}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{step.title}</div>
          {!step.safe && <span style={{ fontSize: 9, color: "#ff8c00", fontWeight: 700 }}>⚠ Avanzado</span>}
        </div>
        <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.3)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </div>
      {expanded && (
        <div style={{ padding: "0 16px 14px 56px", fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ paddingTop: 12 }}>{step.desc}</div>
        </div>
      )}
    </div>
  );
}

export default function Overclock() {
  const [section, setSection] = useState("ram");
  const [expandedSteps, setExpandedSteps] = useState({});

  const toggle = (id) => setExpandedSteps(p => ({ ...p, [id]: !p[id] }));

  const SECTIONS = [
    { id: "ram", label: "RAM (XMP/EXPO)", icon: MemoryStick, color: "#00ccff", steps: STEPS_RAM, gain: "Más fácil y seguro — activa el perfil oficial de tu RAM" },
    { id: "cpu", label: "CPU (PBO / Auto OC)", icon: Cpu, color: "#14ff72", steps: STEPS_CPU, gain: "Extrae más rendimiento sin tocar voltajes" },
    { id: "gpu", label: "GPU (Afterburner)", icon: Microchip, color: "#d926ff", steps: STEPS_GPU, gain: "Más FPS en juegos con OC de Core y Memory" },
  ];

  const cur = SECTIONS.find(s => s.id === section);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px" }} className="page-enter">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(255,68,68,0.22),rgba(255,68,68,0.06))", border: "1px solid rgba(255,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Thermometer size={18} style={{ color: "#ff4444" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>Guía de Overclock</h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Seguro · Paso a paso · Sin quemar tu PC
            </p>
          </div>
        </div>
      </div>

      {/* Warning banner */}
      <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,170,0,0.07)", border: "1px solid rgba(255,170,0,0.2)", display: "flex", gap: 12, marginBottom: 18, alignItems: "flex-start" }}>
        <ShieldAlert size={16} style={{ color: "#ffaa00", flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#ffaa00", marginBottom: 3 }}>Lee esto antes de empezar</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            El overclock puede invalidar la garantía de algunos componentes y en casos extremos dañar hardware. Esta guía se centra en métodos <strong style={{ color: "rgba(255,255,255,0.8)" }}>seguros y sin riesgo real</strong> como XMP/EXPO, PBO y MSI Afterburner con valores conservadores. Siempre monitoriza temperaturas.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>

        {/* Izquierda */}
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)} style={{
                flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                background: section === s.id ? `${s.color}15` : "rgba(255,255,255,0.03)",
                border: `1px solid ${section === s.id ? `${s.color}40` : "rgba(255,255,255,0.07)"}`,
                color: section === s.id ? s.color : "rgba(255,255,255,0.45)",
                fontSize: 12, fontWeight: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                transition: "all 0.12s",
              }}>
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Section gain */}
          <div style={{ padding: "10px 14px", borderRadius: 9, background: `${cur.color}08`, border: `1px solid ${cur.color}18`, marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <Zap size={12} style={{ color: cur.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)" }}>{cur.gain}</span>
          </div>

          {/* Steps */}
          {cur.steps.map((step) => (
            <StepCard key={step.n} step={step} expanded={!!expandedSteps[`${section}-${step.n}`]} onToggle={() => toggle(`${section}-${step.n}`)} />
          ))}
        </div>

        {/* Derecha */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Ganancias esperadas */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <Zap size={12} style={{ color: "#14ff72" }} />
              <span className="section-label">Ganancias esperadas</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SAFE_GAINS.map((g, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${g.color}18` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{g.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{g.gain}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {g.color === "#ff4444" ? <XCircle size={9} style={{ color: g.color }} /> : <CheckCircle2 size={9} style={{ color: g.color }} />}
                    <span style={{ fontSize: 9, color: g.color, fontWeight: 700 }}>{g.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No hagas esto */}
          <div className="card" style={{ padding: "16px", background: "rgba(255,68,68,0.04)", border: "1px solid rgba(255,68,68,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <AlertTriangle size={12} style={{ color: "#ff4444" }} />
              <span className="section-label" style={{ color: "rgba(255,100,100,0.7)" }}>No hagas esto</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {DONTS.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>
                  <XCircle size={10} style={{ color: "#ff4444", flexShrink: 0, marginTop: 2 }} />
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Herramientas */}
          <div className="card" style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <Info size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
              <span className="section-label">Herramientas recomendadas</span>
            </div>
            {[
              { name: "MSI Afterburner", desc: "OC de GPU — universal", color: "#ff4444" },
              { name: "CPU-Z", desc: "Verifica frecuencias RAM/CPU", color: "#00ccff" },
              { name: "HWMonitor", desc: "Temperaturas en tiempo real", color: "#14ff72" },
              { name: "MemTest86", desc: "Estabilidad de RAM", color: "#ffd166" },
              { name: "Cinebench R23", desc: "Stress test de CPU", color: "#d926ff" },
              { name: "Ryzen Master", desc: "PBO y OC para AMD", color: "#ff8c00" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, boxShadow: `0 0 5px ${t.color}`, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
