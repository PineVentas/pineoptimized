import { useState, useEffect } from "react";
import { Trophy, Gamepad2, Zap, ShieldCheck, Wifi, Cpu, ChevronRight, CheckCircle2, Play, RotateCcw, Clock, History } from "lucide-react";
import { toast } from "sonner";

const GAMES = [
  { id: "cs2",        name: "Counter-Strike 2",     color: "#ff8c00", emoji: "🔫" },
  { id: "valorant",   name: "Valorant",              color: "#ff4655", emoji: "🎯" },
  { id: "fortnite",   name: "Fortnite",              color: "#a855f7", emoji: "🏗️" },
  { id: "apex",       name: "Apex Legends",          color: "#ff4444", emoji: "🦾" },
  { id: "cod",        name: "COD: Warzone / MW3",    color: "#4caf50", emoji: "🪖" },
  { id: "pubg",       name: "PUBG: Battlegrounds",   color: "#f59e0b", emoji: "🐔" },
  { id: "lol",        name: "League of Legends",     color: "#06b6d4", emoji: "⚔️" },
  { id: "free-fire",  name: "Free Fire",             color: "#f97316", emoji: "🔥" },
  { id: "roblox",     name: "Roblox",                color: "#ef4444", emoji: "🟥" },
  { id: "rainbow6",   name: "Rainbow Six Siege",     color: "#3b82f6", emoji: "🏠" },
  { id: "dota2",      name: "Dota 2",                color: "#c0392b", emoji: "🐉" },
  { id: "overwatch2", name: "Overwatch 2",           color: "#f97316", emoji: "🦸" },
  { id: "gta5",       name: "GTA V",                 color: "#22c55e", emoji: "🚗" },
  { id: "minecraft",  name: "Minecraft",             color: "#7c3aed", emoji: "⛏️" },
  { id: "palworld",   name: "Palworld",              color: "#84cc16", emoji: "🦎" },
];

const STEPS = [
  { id: "power",   icon: Zap,          label: "Plan de Energía",        desc: "Máximo Rendimiento activado",          color: "#14ff72", time: 400 },
  { id: "dns",     icon: Wifi,         label: "DNS Gaming",             desc: "Cloudflare 1.1.1.1 configurado",       color: "#00ccff", time: 700 },
  { id: "process", icon: Cpu,          label: "Prioridad del proceso",  desc: "Alta prioridad asignada al ejecutable", color: "#d926ff", time: 600 },
  { id: "anticheat",icon: ShieldCheck, label: "Anti-cheats protegidos", desc: "Whitelist completa verificada",         color: "#ffd166", time: 500 },
  { id: "tweaks",  icon: Gamepad2,     label: "Tweaks de juego",        desc: "Optimizaciones específicas aplicadas",  color: "#ff8c00", time: 800 },
  { id: "network", icon: Wifi,         label: "Red TCP optimizada",     desc: "No Delay + ACK Frequency = 1",          color: "#14ff72", time: 600 },
];

const LS_KEY = "pine_torneo_history";

function saveHistory(game, steps) {
  try {
    const prev = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    const entry = { game, steps: steps.length, date: new Date().toLocaleString("es-ES"), ts: Date.now() };
    localStorage.setItem(LS_KEY, JSON.stringify([entry, ...prev].slice(0, 20)));
  } catch {}
}

export default function ModoTorneo() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    let id;
    if (phase === "running") {
      setElapsed(0);
      id = setInterval(() => setElapsed(e => e + 100), 100);
    }
    return () => clearInterval(id);
  }, [phase]);

  const progressPct = phase === "running"
    ? Math.min(Math.round((completedSteps.length / STEPS.length) * 100), 99)
    : phase === "done" ? 100 : 0;

  const runTorneo = () => {
    if (!selectedGame) { toast.error("Selecciona un juego primero"); return; }
    setPhase("running");
    setCompletedSteps([]);
    setCurrentStep(0);

    let delay = 0;
    STEPS.forEach((step, i) => {
      delay += (i === 0 ? 200 : STEPS[i - 1].time);
      setTimeout(() => {
        setCurrentStep(i);
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step.id]);
          if (i === STEPS.length - 1) {
            setPhase("done");
            setCurrentStep(null);
            saveHistory(selectedGame.name, STEPS);
            setHistory(() => {
              try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
            });
            toast.success(`¡Modo Torneo activado para ${selectedGame.name}!`);
          }
        }, step.time - 100);
      }, delay);
    });
  };

  const reset = () => {
    setPhase("idle");
    setCompletedSteps([]);
    setCurrentStep(null);
    setSelectedGame(null);
    setElapsed(0);
  };

  const game = selectedGame;
  const totalTime = STEPS.reduce((a, s) => a + s.time, 0);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px" }} className="page-enter">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(255,209,102,0.25),rgba(255,209,102,0.06))", border: "1px solid rgba(255,209,102,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy size={18} style={{ color: "#ffd166" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>Modo Torneo</h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              One-Click · Todo optimizado en {(totalTime / 1000).toFixed(1)}s
            </p>
          </div>
        </div>
        {phase === "done" && (
          <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}>
            <RotateCcw size={12} /> Resetear
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

        {/* Izquierda: selector de juego */}
        <div>
          {phase === "idle" && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                Paso 1 — Selecciona tu juego
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 20 }}>
                {GAMES.map(g => (
                  <button key={g.id} onClick={() => setSelectedGame(g)} style={{
                    padding: "12px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                    background: selectedGame?.id === g.id ? `${g.color}15` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedGame?.id === g.id ? `${g.color}45` : "rgba(255,255,255,0.07)"}`,
                    transition: "all 0.12s",
                  }}
                    onMouseEnter={e => { if (selectedGame?.id !== g.id) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; } }}
                    onMouseLeave={e => { if (selectedGame?.id !== g.id) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; } }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{g.emoji}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: selectedGame?.id === g.id ? g.color : "#fff", lineHeight: 1.3 }}>{g.name}</div>
                    {selectedGame?.id === g.id && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <CheckCircle2 size={10} style={{ color: g.color }} />
                        <span style={{ fontSize: 9, color: g.color, fontWeight: 700 }}>SELECCIONADO</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
                Paso 2 — Optimizaciones que se aplicarán
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                {STEPS.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <s.icon size={12} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{s.desc}</div>
                    </div>
                    <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.2)", marginLeft: "auto" }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {(phase === "running" || phase === "done") && (
            <div className="card" style={{ padding: "20px", border: phase === "done" ? "1px solid rgba(20,255,114,0.2)" : "1px solid rgba(255,209,102,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  {phase === "running" ? "Aplicando optimizaciones..." : "¡Modo Torneo activo!"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {phase === "running" && (
                    <span style={{ fontSize: 10, color: "#ffd166", fontFamily: "JetBrains Mono, monospace" }}>
                      {(elapsed / 1000).toFixed(1)}s
                    </span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 800, color: phase === "done" ? "#14ff72" : "#ffd166", fontFamily: "JetBrains Mono, monospace" }}>
                    {progressPct}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", marginBottom: 14 }}>
                <div style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: phase === "done" ? "linear-gradient(90deg,#14ff72,#00ccff)" : "linear-gradient(90deg,#ffd166,#ff8c00)",
                  borderRadius: 99,
                  transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                  boxShadow: phase === "done" ? "0 0 10px rgba(20,255,114,0.5)" : "0 0 10px rgba(255,209,102,0.5)",
                }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {STEPS.map((s, i) => {
                  const done = completedSteps.includes(s.id);
                  const active = currentStep === i;
                  return (
                    <div key={s.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 14px", borderRadius: 9,
                      background: done ? `${s.color}08` : active ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${done ? `${s.color}25` : active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`,
                      opacity: !done && !active && phase === "running" ? 0.4 : 1,
                      transition: "all 0.3s ease",
                    }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? `${s.color}20` : "rgba(255,255,255,0.05)", border: `1px solid ${done ? s.color : "rgba(255,255,255,0.08)"}` }}>
                        {done ? <CheckCircle2 size={12} style={{ color: s.color }} /> : active ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd166", animation: "blink 0.6s infinite" }} /> : <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>{i + 1}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: done ? s.color : "#fff" }}>{s.label}</div>
                        {done && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>{s.desc}</div>}
                        {active && <div style={{ fontSize: 9.5, color: "#ffd166" }}>Aplicando...</div>}
                      </div>
                      {done && <span style={{ fontSize: 9, color: s.color, fontWeight: 800, letterSpacing: "0.06em" }}>OK</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Derecha: panel de acción */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{
            padding: "24px 20px", textAlign: "center",
            background: game ? `${game.color}08` : undefined,
            border: game ? `1px solid ${game.color}20` : undefined,
          }}>
            {game ? (
              <>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{game.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: game.color, marginBottom: 4 }}>{game.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
                  {STEPS.length} optimizaciones · ~{(totalTime / 1000).toFixed(0)}s
                </div>
              </>
            ) : (
              <>
                <Trophy size={36} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 14px" }} />
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 20, lineHeight: 1.6 }}>
                  Selecciona un juego para activar todas las optimizaciones de una vez
                </div>
              </>
            )}

            {phase === "idle" && (
              <button onClick={runTorneo} disabled={!game} style={{
                width: "100%", padding: "13px", borderRadius: 10, cursor: game ? "pointer" : "not-allowed",
                background: game ? `linear-gradient(90deg, ${game.color}, ${game.color}cc)` : "rgba(255,255,255,0.05)",
                border: "none", color: game ? "#000" : "rgba(255,255,255,0.2)",
                fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: game ? `0 0 24px ${game.color}40` : "none",
                transition: "all 0.15s",
              }}>
                <Play size={14} fill="currentColor" />
                Activar Modo Torneo
              </button>
            )}

            {phase === "running" && (
              <div style={{ width: "100%", padding: "13px", borderRadius: 10, background: "rgba(255,209,102,0.1)", border: "1px solid rgba(255,209,102,0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffd166", animation: "blink 0.6s infinite" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#ffd166" }}>Optimizando...</span>
              </div>
            )}

            {phase === "done" && (
              <div style={{ width: "100%", padding: "13px", borderRadius: 10, background: "rgba(20,255,114,0.1)", border: "1px solid rgba(20,255,114,0.25)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={22} style={{ color: "#14ff72" }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: "#14ff72" }}>¡PC lista para el torneo!</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{STEPS.length} tweaks aplicados</span>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
              Qué hace este modo
            </div>
            {[
              "Aplica el plan de energía óptimo para tu hardware",
              "Configura DNS Cloudflare para menor ping",
              "Pone el ejecutable del juego en prioridad Alta",
              "Activa whitelist total de anti-cheats",
              "Aplica los tweaks específicos del juego",
              "Optimiza TCP con No Delay + ACK Freq 1",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 10.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 5 }}>
                <span style={{ color: "#14ff72", flexShrink: 0 }}>›</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Historial de sesiones */}
      {history.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <History size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Últimas sesiones
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {history.slice(0, 5).map((h, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", borderRadius: 8,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <Trophy size={11} style={{ color: "#ffd16660", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", flex: 1 }}>{h.game}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>{h.steps} tweaks</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>
                  <Clock size={9} /> {h.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
