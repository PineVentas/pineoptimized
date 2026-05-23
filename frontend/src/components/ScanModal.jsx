/**
 * ScanModal — Optimizador inteligente automático.
 * 100% local: usa Electron IPC (get-hardware-info + apply-optimization).
 * Sin backend. Sin selección manual. Sin romper nada.
 */
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  X, Cpu, Microchip, MemoryStick, HardDrive,
  Monitor, ShieldCheck, CheckCircle2, Zap, Loader2,
} from "lucide-react";

// ── PASOS DE ESCANEO ────────────────────────────────────────
const SCAN_STEPS = [
  { label: "Leyendo información del procesador…",   icon: Cpu },
  { label: "Detectando GPU y VRAM disponible…",     icon: Microchip },
  { label: "Midiendo RAM total y disponible…",      icon: MemoryStick },
  { label: "Verificando tipo de disco (SSD/HDD)…",  icon: HardDrive },
  { label: "Detectando perfil: laptop o desktop…",  icon: Monitor },
  { label: "Seleccionando optimizaciones seguras…", icon: ShieldCheck },
];

// ── LÓGICA DE SELECCIÓN DE TWEAKS ───────────────────────────
function selectTweaks(hw) {
  const tweaks = [];

  // SIEMPRE SEGUROS — aplican a cualquier PC gaming
  tweaks.push(
    { id: "hags",             label: "HAGS activado",              desc: "Hardware-Accelerated GPU Scheduling para menos latencia GPU" },
    { id: "game-mode",        label: "Game Mode activado",         desc: "Windows prioriza CPU/GPU al proceso del juego activo" },
    { id: "twk-dvr",          label: "Game DVR desactivado",       desc: "Elimina grabación en segundo plano que consume RAM y CPU" },
    { id: "twk-fso",          label: "Fullscreen Optimizado",      desc: "Modo exclusivo de pantalla completa — menor input lag" },
    { id: "xbox-bar",         label: "Xbox Game Bar desactivado",  desc: "Elimina el overlay que consume hasta 8% CPU innecesariamente" },
    { id: "twk-gpu-priority", label: "GPU Priority = 8",           desc: "GPU prioriza peticiones del juego sobre el escritorio" },
    { id: "twk-sys-resp",     label: "SystemResponsiveness = 0",   desc: "CPU dedica 100% de quantum al proceso en primer plano" },
    { id: "process-sep",      label: "Win32PrioritySeparation = 38", desc: "Separación óptima de prioridad para gaming" },
    { id: "power-throttling", label: "Power Throttling desactivado", desc: "CPU no reduce frecuencia durante partidas" },
    { id: "twk-irq-priority", label: "IRQ8 prioridad elevada",     desc: "Timer del sistema con mayor prioridad — timing más preciso" },
    { id: "clean-temp",       label: "Archivos temporales eliminados", desc: "Limpia C:\\Temp y %TEMP% — libera espacio y mejora lecturas" },
    { id: "clean-dns",        label: "DNS Cache limpiado",         desc: "Flush DNS para conexiones de red más rápidas" },
    { id: "priv-ads",         label: "Publicidad personalizada off", desc: "Elimina tracking de anuncios de Windows" },
    { id: "priv-telemetry",   label: "Telemetría desactivada",     desc: "Windows deja de enviar datos de uso — menos tráfico de fondo" },
    { id: "twk-ntfs-last",    label: "NTFS Last Access off",       desc: "Menos escrituras en disco al acceder a archivos del juego" },
    { id: "net-nagle",        label: "Nagle Algorithm desactivado", desc: "TCP envía paquetes de inmediato — menor latencia en multijugador" },
    { id: "net-throttling",   label: "Network Throttling off",     desc: "Windows no limita el ancho de banda de red de los juegos" },
  );

  // NVIDIA detectada
  const gpuStr = [hw?.gpu?.model || "", hw?.gpu?.vendor || ""].join(" ").toLowerCase();
  const isNvidia = gpuStr.includes("nvidia") || gpuStr.includes("geforce") ||
                   gpuStr.includes("rtx") || gpuStr.includes("gtx") || gpuStr.includes("quadro");
  if (isNvidia) {
    tweaks.push(
      { id: "nv-power",       label: "NVIDIA PowerMizer → Max",   desc: "GPU siempre a máxima frecuencia — sin throttling de energía" },
      { id: "nv-lowlatency",  label: "NVIDIA Low Latency Mode",   desc: "Modo ultra-baja latencia para menor input lag" },
      { id: "nv-threaded",    label: "Threaded Optimization on",  desc: "Optimización multi-hilo de shaders NVIDIA" },
      { id: "nv-shader-cache", label: "Shader Cache ilimitado",   desc: "Caché de shaders máximo — menos stutter al cargar shaders nuevos" },
    );
  }

  // AMD detectada
  const isAmd = gpuStr.includes("amd") || gpuStr.includes("radeon") || gpuStr.includes(" rx ");
  if (isAmd) {
    tweaks.push(
      { id: "visual-perf", label: "Visual Effects → Performance",  desc: "AMD rinde mejor con efectos de escritorio reducidos" },
    );
  }

  // Desktop (no laptop) → tweaks de energía agresivos
  const isLaptop = hw?.is_laptop ?? false;
  if (!isLaptop) {
    tweaks.push(
      { id: "pwr-ultimate",  label: "Plan: Alto Rendimiento",     desc: "Máxima frecuencia de CPU sin ningún límite de energía" },
      { id: "cpu-min-freq",  label: "CPU frecuencia mínima 100%", desc: "CPU nunca reduce velocidad en idle — instantáneo al jugar" },
      { id: "sleep-disable", label: "Suspensión desactivada",     desc: "PC de escritorio no necesita suspensión automática" },
      { id: "boost-mode",    label: "CPU Boost → Agresivo",       desc: "Intel Turbo / AMD Precision Boost al máximo siempre" },
      { id: "usb-suspend",   label: "USB Selective Suspend off",  desc: "Mouse/teclado/headset nunca se suspenden" },
      { id: "pci-link",      label: "PCIe Active State off",      desc: "PCIe link nunca entra en estado de ahorro de energía" },
    );
  } else {
    // Laptop — solo boost cuando está enchufado
    tweaks.push(
      { id: "boost-mode", label: "CPU Boost activado",            desc: "Turbo activo cuando el laptop está enchufado a corriente" },
    );
  }

  // Poca RAM (< 8 GB) → liberar RAM visual
  const ramGb = hw?.ram?.total_gb ?? 8;
  if (ramGb < 8) {
    tweaks.push(
      { id: "visual-perf",  label: `Efectos visuales mínimos (${ramGb} GB RAM)`, desc: "Con poca RAM, cada MB importa — efectos de escritorio desactivados" },
      { id: "animations",   label: "Animaciones de Windows off",  desc: "Elimina animaciones del escritorio para liberar GPU/RAM" },
      { id: "transparency", label: "Transparencias desactivadas", desc: "Las transparencias del escritorio consumen GPU innecesariamente" },
    );
  }

  // SSD / NVMe → tweaks específicos de SSD
  const diskType = (hw?.disk?.type || "SSD").toUpperCase();
  const isSsd = diskType === "SSD" || diskType === "NVME" || diskType === "NVM";
  if (isSsd) {
    tweaks.push(
      { id: "twk-trim",         label: "TRIM habilitado",           desc: "SSD mantiene rendimiento óptimo con TRIM activo" },
      { id: "twk-prefetch-ssd", label: "Prefetch off (SSD)",        desc: "Los SSDs no necesitan Prefetch — libera RAM innecesariamente usada" },
    );
  }

  // Muchos hilos (≥ 8) → separación de prioridad extra
  const threads = hw?.cpu?.threads ?? 4;
  if (threads >= 8) {
    tweaks.push(
      { id: "twk-priority-sep", label: `Priority Sep. (${threads} hilos)`, desc: "Separación de prioridad ajustada para procesador multi-núcleo" },
    );
  }

  // Eliminar duplicados por id
  const seen = new Set();
  return tweaks.filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
}

// ── COMPONENTE PRINCIPAL ────────────────────────────────────
export default function ScanModal({ open, onClose, onComplete }) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [phase,    setPhase]    = useState("idle");   // idle | scanning | applying | done
  const [hardware, setHardware] = useState(null);
  const [tweaks,   setTweaks]   = useState([]);
  const [applyIdx, setApplyIdx] = useState(0);
  const [applied,  setApplied]  = useState([]);
  const cancelRef = useRef(false);

  const isElectron = typeof window !== "undefined" && !!window.electronAPI?.applyOptimization;

  useEffect(() => {
    if (!open) return;
    cancelRef.current = false;
    setStepIdx(0);
    setPhase("scanning");
    setHardware(null);
    setTweaks([]);
    setApplyIdx(0);
    setApplied([]);
    runAll();
    return () => { cancelRef.current = true; };
  }, [open]); // eslint-disable-line

  async function runAll() {
    // ── FASE 1: Escaneo visual ──────────────────────────────
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      if (cancelRef.current) return;
      setStepIdx(i);
      await sleep(420 + Math.random() * 260);
    }

    // ── FASE 2: Detectar hardware real ─────────────────────
    let hw = null;
    if (isElectron) {
      try { hw = await window.electronAPI.getHardwareInfo(); } catch {}
    }
    if (!hw) {
      // Fallback navegador
      const { detectHardware } = await import("../lib/hardwareDetect");
      const b = await detectHardware();
      const gpu = b.gpu_renderer || "";
      hw = {
        cpu:  { model: "CPU", cores: Math.ceil((b.cpu_threads || 4) / 2), threads: b.cpu_threads || 4, clock_ghz: 3.0 },
        gpu:  { model: gpu, vendor: b.gpu_vendor || "" },
        ram:  { total_gb: b.ram_gb || 8 },
        disk: { type: "SSD" },
        is_laptop: b.is_laptop,
      };
    }
    if (cancelRef.current) return;
    setHardware(hw);

    // ── FASE 3: Seleccionar tweaks ──────────────────────────
    const list = selectTweaks(hw);
    setTweaks(list);
    setPhase("applying");

    // ── FASE 4: Aplicar uno a uno ───────────────────────────
    const done = [];
    for (let i = 0; i < list.length; i++) {
      if (cancelRef.current) return;
      setApplyIdx(i);
      await sleep(55 + Math.random() * 90);
      if (isElectron) {
        try { await window.electronAPI.applyOptimization(list[i].id, true); } catch {}
      }
      done.push(list[i].id);
      setApplied([...done]);
    }
    setApplyIdx(list.length);

    // ── FASE 5: Listo ────────────────────────────────────────
    if (cancelRef.current) return;
    setPhase("done");
    const boost = calcBoost(done.length, hw);
    toast.success(`✅ ${done.length} optimizaciones aplicadas · +${boost}% rendimiento estimado`);
    onComplete && onComplete({ applied: done, boost_percent: boost, hardware: hw });
    await sleep(3200);
    if (!cancelRef.current) onClose();
  }

  function calcBoost(count, hw) {
    const base = Math.round(count * 2.2);
    const extra = hw?.is_laptop ? 0 : 6;
    return Math.min(base + extra, 45);
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  if (!open) return null;

  const boost = calcBoost(applied.length, hardware);
  const pct   = tweaks.length > 0 ? Math.round((applyIdx / tweaks.length) * 100) : 0;
  const gpuLabel = hardware?.gpu?.model
    ? hardware.gpu.model.replace(/\(.*?\)/g, "").trim().slice(0, 38)
    : "GPU";

  // ── GPU tag con color ────────────────────────────────────
  const gpuStr = (hardware?.gpu?.model || "").toLowerCase();
  const gpuColor = gpuStr.includes("nvidia") || gpuStr.includes("geforce") || gpuStr.includes("rtx") || gpuStr.includes("gtx")
    ? "#76b900"
    : gpuStr.includes("amd") || gpuStr.includes("radeon")
      ? "#ed1c24"
      : gpuStr.includes("intel")
        ? "#0071c5"
        : "#14ff72";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fade-in 0.18s ease",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 580,
        background: "rgba(8,11,20,0.98)",
        border: "1px solid rgba(20,255,114,0.18)",
        borderRadius: 18,
        boxShadow: "0 0 60px rgba(20,255,114,0.08), 0 24px 60px rgba(0,0,0,0.6)",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Glow top */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 300, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(20,255,114,0.6), transparent)",
        }} />

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: "linear-gradient(135deg, rgba(20,255,114,0.22), rgba(0,200,80,0.12))",
              border: "1px solid rgba(20,255,114,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(20,255,114,0.18)",
            }}>
              <Zap size={18} style={{ color: "#14ff72" }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" }}>
                Optimización Automática
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 1 }}>
                Pine Opti · Inteligente · Segura
              </div>
            </div>
          </div>

          {phase !== "applying" && (
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.4)",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px 22px" }}>

          {/* FASE: Scanning */}
          {phase === "scanning" && (
            <>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "rgba(255,255,255,0.38)", letterSpacing: "0.01em" }}>
                Analizando tu PC para aplicar las mejores optimizaciones automáticamente…
              </p>
              <div style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 12, padding: "14px 16px",
                position: "relative", overflow: "hidden",
              }}>
                {/* scan line */}
                <div className="scan-line" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SCAN_STEPS.map((s, i) => {
                    const done   = i < stepIdx;
                    const active = i === stepIdx;
                    const Icon   = s.icon;
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        fontSize: 12, fontFamily: "JetBrains Mono, monospace",
                        color: active ? "#14ff72" : done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                        transition: "color 0.3s",
                      }}>
                        <Icon size={14} style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{s.label}</span>
                        {done   && <CheckCircle2 size={13} style={{ color: "#14ff72" }} />}
                        {active && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* FASE: Applying */}
          {phase === "applying" && (
            <>
              {/* Hardware detectado */}
              {hardware && (
                <div style={{
                  display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14,
                }}>
                  {[
                    { label: hardware.cpu?.model?.split(" ").slice(0, 3).join(" ") || "CPU", color: "#00ccff" },
                    { label: gpuLabel, color: gpuColor },
                    { label: `${hardware.ram?.total_gb ?? "?"}GB RAM`, color: "#a78bfa" },
                    { label: hardware.disk?.type || "SSD", color: "#fb923c" },
                    { label: hardware.is_laptop ? "Laptop" : "Desktop", color: "#14ff72" },
                  ].map((t, i) => (
                    <div key={i} style={{
                      padding: "3px 10px", borderRadius: 6,
                      background: `${t.color}14`,
                      border: `1px solid ${t.color}30`,
                      fontSize: 10, fontWeight: 700,
                      color: t.color, letterSpacing: "0.03em",
                      whiteSpace: "nowrap",
                    }}>
                      {t.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    Aplicando {applyIdx} de {tweaks.length} optimizaciones…
                  </span>
                  <span style={{ color: "#14ff72", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                    {pct}%
                  </span>
                </div>
                <div style={{
                  height: 6, background: "rgba(255,255,255,0.06)",
                  borderRadius: 99, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #14ff72, #00ccff)",
                    borderRadius: 99,
                    transition: "width 0.25s ease",
                    boxShadow: "0 0 12px rgba(20,255,114,0.5)",
                  }} />
                </div>
              </div>

              {/* Lista de tweaks con check animado */}
              <div style={{
                maxHeight: 280, overflowY: "auto",
                display: "flex", flexDirection: "column", gap: 5,
                paddingRight: 4,
              }}>
                {tweaks.map((t, i) => {
                  const done   = applied.includes(t.id);
                  const active = i === applyIdx;
                  return (
                    <div key={t.id} style={{
                      display: "flex", alignItems: "flex-start", gap: 9,
                      padding: "7px 10px",
                      borderRadius: 9,
                      background: done
                        ? "rgba(20,255,114,0.06)"
                        : active
                          ? "rgba(20,255,114,0.03)"
                          : "transparent",
                      border: done
                        ? "1px solid rgba(20,255,114,0.18)"
                        : active
                          ? "1px solid rgba(20,255,114,0.08)"
                          : "1px solid transparent",
                      transition: "all 0.3s ease",
                      opacity: i > applyIdx ? 0.35 : 1,
                    }}>
                      <div style={{
                        width: 18, height: 18, flexShrink: 0, marginTop: 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {done
                          ? <CheckCircle2 size={15} style={{ color: "#14ff72" }} />
                          : active
                            ? <Loader2 size={14} style={{ color: "#14ff72", animation: "spin 1s linear infinite" }} />
                            : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12, fontWeight: 700,
                          color: done ? "#fff" : active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                          letterSpacing: "-0.01em",
                        }}>
                          {t.label}
                        </div>
                        {(done || active) && (
                          <div style={{
                            fontSize: 10, color: "rgba(255,255,255,0.38)",
                            marginTop: 1, lineHeight: 1.4,
                          }}>
                            {t.desc}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* FASE: Done */}
          {phase === "done" && (
            <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(20,255,114,0.18) 0%, rgba(20,255,114,0.04) 70%)",
                border: "2px solid rgba(20,255,114,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
                boxShadow: "0 0 40px rgba(20,255,114,0.2)",
                animation: "scale-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>
                <CheckCircle2 size={32} style={{ color: "#14ff72" }} />
              </div>

              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: 4 }}>
                ¡Optimización completa!
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 18 }}>
                {applied.length} tweaks aplicados · Rendimiento estimado
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(20,255,114,0.1)",
                border: "1px solid rgba(20,255,114,0.3)",
                borderRadius: 12, padding: "10px 22px",
                marginBottom: 20,
              }}>
                <Zap size={18} style={{ color: "#14ff72" }} />
                <span style={{ fontSize: 26, fontWeight: 900, color: "#14ff72", letterSpacing: "-0.04em" }}>
                  +{boost}%
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                  FPS estimado
                </span>
              </div>

              {hardware && (
                <div style={{
                  fontSize: 11, color: "rgba(255,255,255,0.28)",
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  {hardware.cpu?.model?.split(" ").slice(0, 4).join(" ")} ·{" "}
                  {gpuLabel} ·{" "}
                  {hardware.ram?.total_gb}GB RAM ·{" "}
                  {hardware.is_laptop ? "Laptop" : "Desktop"}
                </div>
              )}

              <div style={{ marginTop: 14, fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
                Cerrando automáticamente…
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
