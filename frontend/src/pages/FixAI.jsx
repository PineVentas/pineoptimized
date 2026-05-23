/**
 * Fix AI — Asistente gaming offline.
 * Motor local 100% sin backend. Respuestas inteligentes por base de conocimiento.
 */
import { useEffect, useRef, useState } from "react";
import { Sparkles, RefreshCw, Send, Bot, User, Zap, WifiOff } from "lucide-react";
import { localAIReply } from "../lib/localAI";

const QUICK_PROMPTS = [
  { icon: "🎮", text: "¿Cómo optimizo Free Fire?" },
  { icon: "🔥", text: "GPU se calienta mucho" },
  { icon: "🛡️", text: "¿Qué anti-cheats debo proteger?" },
  { icon: "⚡", text: "Mejorar FPS en Valorant" },
  { icon: "📶", text: "Reducir el ping" },
  { icon: "💾", text: "Optimizar la RAM" },
  { icon: "🖥️", text: "¿Qué plan de energía usar para gaming?" },
  { icon: "🔊", text: "Se cortó el audio, ¿cómo reparo?" },
  { icon: "🌐", text: "¿Cuál es el mejor DNS para gaming?" },
  { icon: "💿", text: "¿Cómo liberar espacio en disco?" },
  { icon: "🎯", text: "Optimizar CS2 para competitivo" },
  { icon: "⚠️", text: "PC con lag y stutters en juegos" },
  { icon: "🖱️", text: "Mouse con input lag en Free Fire" },
  { icon: "📊", text: "¿Cómo saber si tengo bottleneck?" },
  { icon: "🔌", text: "Juego crashea al iniciar, ¿qué hago?" },
  { icon: "⚔️", text: "Optimizar League of Legends" },
  { icon: "🐔", text: "Mejorar FPS en PUBG" },
  { icon: "🏠", text: "Rainbow Six Siege sin lag" },
  { icon: "🖱️", text: "¿Cómo reducir el input lag?" },
  { icon: "🖥️", text: "¿Cuántos Hz necesito para gaming?" },
  { icon: "🟥", text: "Optimizar Roblox en PC" },
  { icon: "🪖", text: "Warzone sin stutters" },
  { icon: "🌆", text: "GTA V Online tiene mucho lag" },
  { icon: "🤖", text: "Mejorar FPS en Overwatch 2" },
  { icon: "🛡️", text: "Dota 2 se traba en teamfights" },
  { icon: "🪟", text: "Rainbow Six Siege sin stutters" },
  { icon: "🏆", text: "¿Qué hace el Modo Torneo?" },
  { icon: "📦", text: "¿Cómo instalo apps sin Microsoft Store?" },
];

// Simula un efecto de escritura progresiva
function useTypingText(text, active) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active || !text) { setDisplayed(text); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const speed = text.length > 400 ? 6 : text.length > 200 ? 9 : 12;
    const iv = setInterval(() => {
      i += Math.ceil(text.length / 120); // adapta velocidad al largo del texto
      if (i >= text.length) { setDisplayed(text); setDone(true); clearInterval(iv); }
      else { setDisplayed(text.slice(0, i)); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, active]);

  return { displayed, done };
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 2px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#14ff72", opacity: 0.5,
          animation: "typing-dot 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </div>
  );
}

function AiAvatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 9, flexShrink: 0, marginTop: 2,
      background: "linear-gradient(135deg, rgba(20,255,114,0.18), rgba(0,204,255,0.12))",
      border: "1px solid rgba(20,255,114,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Bot size={13} style={{ color: "#14ff72" }} />
    </div>
  );
}

function UserAvatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 9, flexShrink: 0, marginTop: 2,
      background: "rgba(20,255,114,0.12)",
      border: "1px solid rgba(20,255,114,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <User size={13} style={{ color: "#14ff72" }} />
    </div>
  );
}

// Renderiza markdown simple (negrita, código inline, listas)
function RenderText({ text }) {
  const lines = (text || "").split("\n");
  return (
    <div style={{ margin: 0 }}>
      {lines.map((line, li) => {
        // Línea de tabla (contiene |)
        if (line.includes("|") && line.trim().startsWith("|")) {
          return null; // skip table formatting lines
        }
        // Encabezado **texto**
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <div key={li} style={{ marginBottom: line === "" ? 6 : 2, lineHeight: 1.65 }}>
            {line === "" ? "\u00A0" : parts.map((p, pi) => {
              if (p.startsWith("**") && p.endsWith("**")) {
                return <strong key={pi} style={{ color: "#fff", fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
              }
              if (p.startsWith("`") && p.endsWith("`")) {
                return (
                  <code key={pi} style={{
                    background: "rgba(20,255,114,0.1)",
                    border: "1px solid rgba(20,255,114,0.2)",
                    borderRadius: 4, padding: "1px 5px",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.85em", color: "#14ff72",
                  }}>
                    {p.slice(1, -1)}
                  </code>
                );
              }
              // Bullets
              if (p.startsWith("• ") || p.startsWith("→ ")) {
                return <span key={pi}>{p}</span>;
              }
              return <span key={pi}>{p}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function Message({ m, i, isLast }) {
  const isUser = m.role === "user";
  const { displayed } = useTypingText(m.text, !isUser && isLast);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 10,
        animation: "slide-in-right 0.28s cubic-bezier(0.16,1,0.3,1) both",
        animationDelay: "0.02s",
      }}
    >
      {isUser ? <UserAvatar /> : <AiAvatar />}

      <div style={{
        maxWidth: "76%",
        padding: "10px 14px",
        borderRadius: isUser ? "12px 3px 12px 12px" : "3px 12px 12px 12px",
        fontSize: 13,
        color: "rgba(255,255,255,0.88)",
        background: isUser
          ? "linear-gradient(135deg, rgba(20,255,114,0.12), rgba(20,255,114,0.06))"
          : "rgba(11,15,26,0.9)",
        border: `1px solid ${isUser ? "rgba(20,255,114,0.2)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(12px)",
      }}>
        {isUser
          ? <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{m.text}</p>
          : <RenderText text={isLast ? displayed : m.text} />
        }
      </div>
    </div>
  );
}

export default function FixAI() {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [charCount, setCharCount] = useState(0);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = (msg) => {
    const text = (msg || input).trim();
    if (!text || loading) return;
    setInput(""); setCharCount(0);
    const userMsg = { role: "user", text };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    // Simular "pensamiento" (250-800ms según largo de respuesta)
    const thinkMs = 250 + Math.random() * 550;
    setTimeout(() => {
      const reply = localAIReply(text);
      setMessages(m => [...m, { role: "assistant", text: reply }]);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, thinkMs);
  };

  const reset = () => {
    setMessages([]);
    setInput("");
    setCharCount(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const lastAiIdx = messages.reduce((acc, m, i) => m.role === "assistant" ? i : acc, -1);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>

      {/* Ambient bg */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 400, height: 300,
        background: "radial-gradient(circle at 100% 0%, rgba(20,255,114,0.04) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
        background: "rgba(6,8,15,0.9)",
        backdropFilter: "blur(12px)",
        flexShrink: 0, zIndex: 10, position: "relative",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "linear-gradient(135deg, rgba(20,255,114,0.2), rgba(0,204,255,0.15))",
          border: "1px solid rgba(20,255,114,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 16px rgba(20,255,114,0.15)",
        }}>
          <Sparkles size={16} style={{ color: "#14ff72" }} />
        </div>

        <div>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.03em", color: "#fff" }}>
            Fix <span style={{ color: "#14ff72" }}>AI</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: -1 }}>
            Asistente Gaming · Pine Opti
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {/* Badge offline */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(20,255,114,0.07)",
            border: "1px solid rgba(20,255,114,0.15)",
            borderRadius: 6, padding: "3px 8px",
            fontSize: 9, color: "rgba(20,255,114,0.8)", letterSpacing: "0.08em",
            textTransform: "uppercase", fontWeight: 700,
          }}>
            <WifiOff size={9} />
            Offline
          </div>

          <button
            onClick={reset}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 7, padding: "5px 10px",
              fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            <RefreshCw size={12} /> Nueva sesión
          </button>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "24px",
        display: "flex", flexDirection: "column", gap: 14,
        position: "relative", zIndex: 1,
      }}>

        {/* Welcome state */}
        {messages.length === 0 && (
          <div style={{ animation: "slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
              <AiAvatar />
              <div style={{
                background: "rgba(11,15,26,0.9)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "3px 12px 12px 12px",
                padding: "14px 18px", maxWidth: 500,
              }}>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
                  Hola, soy <strong style={{ color: "#14ff72" }}>Fix AI</strong> — tu asistente de optimización gaming.
                  Funciono <strong style={{ color: "#14ff72" }}>100% offline</strong>, sin necesidad de internet ni servidor.
                  Pregúntame sobre FPS, hardware, anti-cheats, ping o cualquier problema de rendimiento.
                </p>

                {/* Quick prompts */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: 10 }}>
                    Preguntas frecuentes
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {QUICK_PROMPTS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => send(q.text)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 8, padding: "5px 10px",
                          fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer",
                          transition: "all 0.15s",
                          animation: "slide-up 0.3s cubic-bezier(0.16,1,0.3,1) both",
                          animationDelay: `${0.05 + i * 0.05}s`,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "rgba(20,255,114,0.3)";
                          e.currentTarget.style.color = "#14ff72";
                          e.currentTarget.style.background = "rgba(20,255,114,0.06)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        }}
                      >
                        <span style={{ fontSize: 13 }}>{q.icon}</span> {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { icon: "🎯", label: "Tweaks de FPS" },
                { icon: "🛡️", label: "Anti-ban safety" },
                { icon: "🔧", label: "Diagnóstico PC" },
                { icon: "⚡", label: "Latencia & Ping" },
                { icon: "📴", label: "Sin internet" },
              ].map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(20,255,114,0.05)", border: "1px solid rgba(20,255,114,0.1)",
                  borderRadius: 8, padding: "4px 10px",
                  fontSize: 10, color: "rgba(20,255,114,0.7)", fontWeight: 600,
                  animation: "bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
                  animationDelay: `${0.2 + i * 0.07}s`,
                }}>
                  <span>{f.icon}</span> {f.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) => (
          <Message key={i} m={m} i={i} isLast={i === lastAiIdx} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <AiAvatar />
            <div style={{
              background: "rgba(11,15,26,0.9)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "3px 12px 12px 12px",
              padding: "12px 14px",
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: "12px 24px 16px",
        borderTop: "1px solid rgba(255,255,255,0.055)",
        background: "rgba(6,8,15,0.95)",
        backdropFilter: "blur(12px)",
        flexShrink: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setCharCount(e.target.value.length); }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="Pregunta sobre optimización, FPS, hardware, anti-cheats…"
              style={{
                width: "100%",
                background: "rgba(11,15,26,0.95)",
                border: input.length > 0 ? "1px solid rgba(20,255,114,0.35)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "12px 48px 12px 14px",
                fontSize: 13, color: "#fff",
                resize: "none", minHeight: 46, maxHeight: 120,
                lineHeight: 1.5,
                transition: "border-color 0.2s, box-shadow 0.2s",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                boxShadow: input.length > 0 ? "0 0 0 3px rgba(20,255,114,0.06)" : "none",
              }}
            />

            {charCount > 20 && (
              <span style={{
                position: "absolute", bottom: 10, right: 46,
                fontSize: 9, color: "rgba(255,255,255,0.2)",
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {charCount}
              </span>
            )}

            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                position: "absolute", right: 8, bottom: 7,
                width: 32, height: 32, borderRadius: 8,
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #14ff72, #00d45e)"
                  : "rgba(255,255,255,0.07)",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s var(--easing-spring)",
                boxShadow: input.trim() && !loading ? "0 2px 12px rgba(20,255,114,0.25)" : "none",
              }}
            >
              <Send size={13} style={{
                color: input.trim() && !loading ? "#000" : "rgba(255,255,255,0.25)",
                transform: "translateX(1px)",
              }} />
            </button>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: 6,
          fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em",
        }}>
          <span>Enter para enviar · Shift+Enter para nueva línea</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Zap size={8} style={{ color: "#14ff72" }} />
            Pine AI Engine v2.0 · Offline
          </span>
        </div>
      </div>
    </div>
  );
}
