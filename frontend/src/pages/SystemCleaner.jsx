import { useState, useCallback } from "react";
import { Trash2, RefreshCw, CheckCircle2, HardDrive, Chrome, Folder, Cpu, AlertTriangle, Zap } from "lucide-react";
import { toast } from "sonner";

const CLEAN_TARGETS = [
  { id: "temp",     icon: Folder,        label: "Archivos Temporales",     desc: "C:\\Windows\\Temp y %TEMP%",            size: "~250 MB",   color: "#14ff72" },
  { id: "prefetch", icon: Cpu,           label: "Caché Prefetch",          desc: "C:\\Windows\\Prefetch",                 size: "~50 MB",    color: "#00ccff" },
  { id: "recycle",  icon: Trash2,        label: "Papelera de Reciclaje",   desc: "Todas las unidades",                    size: "~Varía",    color: "#ff6b6b" },
  { id: "eventlog", icon: AlertTriangle, label: "Registros de Eventos",    desc: "Event Viewer logs",                     size: "~100 MB",   color: "#ffd166" },
  { id: "thumbs",   icon: Chrome,        label: "Miniaturas Windows",      desc: "Caché de imágenes/videos",              size: "~80 MB",    color: "#d926ff" },
  { id: "dns",      icon: HardDrive,     label: "Caché DNS",               desc: "Flush DNS + NetBIOS",                   size: "Inmediato", color: "#26d0ce" },
  { id: "wucache",  icon: Zap,           label: "Caché Windows Update",    desc: "C:\\Windows\\SoftwareDistribution",     size: "~300 MB",   color: "#ff9f43" },
  { id: "errorreports", icon: AlertTriangle, label: "Reportes de Error",   desc: "%LOCALAPPDATA%\\Microsoft\\Windows\\WER", size: "~40 MB",  color: "#ff6b6b" },
  { id: "shadercache", icon: HardDrive,  label: "Shader Cache GPU",        desc: "Caché de shaders DirectX/OpenGL",       size: "~200 MB",   color: "#00ccff" },
  { id: "downloads", icon: Folder,       label: "Carpeta Descargas",       desc: "Archivos antiguos +30 días",            size: "~Varía",    color: "#14ff72" },
];

const TOTAL_SIZE_MB = 1020;

function getStoredSelected() {
  try {
    const v = localStorage.getItem("pine_cleaner_selected");
    if (v) return new Set(JSON.parse(v));
  } catch {}
  return new Set(["temp", "prefetch", "recycle"]);
}

function saveSelected(s) {
  try { localStorage.setItem("pine_cleaner_selected", JSON.stringify([...s])); } catch {}
}

export default function SystemCleaner() {
  const [selected, setSelected] = useState(getStoredSelected);
  const [running,  setRunning]  = useState(false);
  const [done,     setDone]     = useState(new Set());
  const [progress, setProgress] = useState(0);

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSelected(next);
      return next;
    });
  }, []);

  const selectAll = () => { const s = new Set(CLEAN_TARGETS.map(t => t.id)); setSelected(s); saveSelected(s); };
  const clearAll  = () => { setSelected(new Set()); saveSelected(new Set()); };

  const run = async () => {
    if (selected.size === 0) { toast.warning("Selecciona al menos un objetivo."); return; }
    const isElectron = !!(window.electronAPI?.runFix);
    if (!isElectron) {
      // Demo mode: simulate cleaning
      setRunning(true);
      setProgress(0);
      const targets = CLEAN_TARGETS.filter(t => selected.has(t.id));
      const newDone = new Set();
      for (let i = 0; i < targets.length; i++) {
        await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
        newDone.add(targets[i].id);
        setDone(new Set(newDone));
        setProgress(Math.round(((i + 1) / targets.length) * 100));
        toast.success(`✅ ${targets[i].label} limpiado`);
      }
      setRunning(false);
      setProgress(100);
      toast.success(`🎉 Limpieza completada · ${newDone.size} tarea${newDone.size !== 1 ? 's' : ''} realizadas`);
      return;
    }
    setRunning(true);
    setProgress(0);
    const targets = CLEAN_TARGETS.filter(t => selected.has(t.id));
    const newDone = new Set();
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      try {
        await window.electronAPI.runFix('general');
        newDone.add(target.id);
        toast.success(`✅ ${target.label} limpiado`);
      } catch {
        toast.error(`Error limpiando ${target.label}`);
      }
      setDone(new Set(newDone));
      setProgress(Math.round(((i + 1) / targets.length) * 100));
    }
    setRunning(false);
    toast.success(`🎉 Limpieza completada · ${newDone.size} tarea${newDone.size !== 1 ? 's' : ''} realizadas`);
  };

  const selectedTargets = CLEAN_TARGETS.filter(t => selected.has(t.id));
  const estimatedMB = Math.round((selectedTargets.length / CLEAN_TARGETS.length) * TOTAL_SIZE_MB);
  const allDone = done.size > 0 && [...selected].every(id => done.has(id));

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px 28px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, rgba(255,107,107,0.22), rgba(255,107,107,0.07))', border: '1px solid rgba(255,107,107,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(255,107,107,0.1)' }}>
            <Trash2 size={16} style={{ color: '#ff6b6b' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Limpieza del Sistema</h1>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', marginTop: 3, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Elimina basura · Libera espacio · Mejora el rendimiento
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', gap: 14 }}>

        {/* Targets list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Objetivos · {selected.size} seleccionados
            </span>
            <div style={{ display: 'flex', gap: 7 }}>
              <button onClick={selectAll} className="btn-ghost" style={{ padding: '3px 10px', fontSize: 9 }}>Todos</button>
              <button onClick={clearAll}  className="btn-ghost" style={{ padding: '3px 10px', fontSize: 9 }}>Ninguno</button>
            </div>
          </div>

          {CLEAN_TARGETS.map((t, idx) => {
            const Icon  = t.icon;
            const isSel = selected.has(t.id);
            const isDone = done.has(t.id);
            return (
              <div
                key={t.id}
                onClick={() => !running && toggle(t.id)}
                className="glass-glow"
                style={{
                  display: 'flex', alignItems: 'center', gap: 13,
                  padding: '13px 15px', borderRadius: 11,
                  border: isSel ? `1px solid ${t.color}30` : '1px solid rgba(255,255,255,0.06)',
                  background: isSel
                    ? isDone ? 'rgba(20,255,114,0.04)' : `linear-gradient(90deg, ${t.color}09, transparent 80%)`
                    : 'rgba(10,14,25,0.92)',
                  cursor: running ? 'not-allowed' : 'pointer',
                  transition: 'all 0.18s var(--easing-out)',
                  opacity: running && !isSel ? 0.5 : 1,
                  animation: `fade-up 0.18s var(--easing-out) ${idx * 0.04}s both`,
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 19, height: 19, borderRadius: 5, flexShrink: 0,
                  background: isSel ? (isDone ? '#14ff72' : t.color) : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isSel ? (isDone ? '#14ff72' : t.color) : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s var(--easing-spring)',
                  boxShadow: isSel ? `0 0 10px ${isDone ? '#14ff72' : t.color}45` : 'none',
                }}>
                  {isSel && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.2 5.8L8 1" stroke={isDone ? '#000' : '#000'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* Icon */}
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${t.color}10`, border: `1px solid ${t.color}1E`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isDone ? <CheckCircle2 size={15} style={{ color: '#14ff72' }} /> : <Icon size={15} style={{ color: t.color }} />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: isDone ? '#14ff72' : '#fff', letterSpacing: '-0.01em' }}>{t.label}</div>
                  <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{t.desc}</div>
                </div>

                {/* Running indicator */}
                {running && selected.has(t.id) && !done.has(t.id) && (
                  <RefreshCw size={12} style={{ color: t.color, animation: 'spin-slow 1s linear infinite', flexShrink: 0 }} />
                )}

                {/* Size */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {isDone ? (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#14ff72' }}>Limpiado</span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: isSel ? t.color : 'rgba(255,255,255,0.18)', fontFamily: 'JetBrains Mono, monospace' }}>{t.size}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Summary card */}
          <div style={{ borderRadius: 13, padding: '18px', background: 'rgba(10,14,25,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Resumen</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Tareas seleccionadas</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em' }}>{selected.size}</span>
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.055)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Espacio estimado</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#14ff72', fontFamily: 'JetBrains Mono, monospace' }}>
                  {selected.size > 0 ? `~${estimatedMB} MB` : '—'}
                </span>
              </div>

              {/* Progress bar */}
              {running && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <span>Progreso</span>
                    <span style={{ color: '#14ff72', fontFamily: 'JetBrains Mono, monospace' }}>{progress}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, borderRadius: 99, background: 'linear-gradient(90deg, #14ff72, #00ccff)', transition: 'width 0.4s var(--easing-out)', boxShadow: '0 0 8px rgba(20,255,114,0.5)' }} />
                  </div>
                </div>
              )}

              {allDone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px', borderRadius: 9, background: 'rgba(20,255,114,0.07)', border: '1px solid rgba(20,255,114,0.18)' }}>
                  <CheckCircle2 size={13} style={{ color: '#14ff72' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#14ff72' }}>¡Todo limpio!</span>
                </div>
              )}
            </div>
          </div>

          {/* Run button */}
          <button
            onClick={run}
            disabled={running || selected.size === 0}
            className="btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {running
              ? <><RefreshCw size={14} style={{ animation: 'spin-slow 1s linear infinite' }} /> Limpiando...</>
              : allDone
              ? <><CheckCircle2 size={14} /> Limpieza completada</>
              : <><Zap size={14} /> Limpiar ahora</>
            }
          </button>

          {/* Warning */}
          <div style={{ background: 'rgba(255,209,102,0.05)', border: '1px solid rgba(255,209,102,0.14)', borderRadius: 10, padding: '12px 13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
              <AlertTriangle size={11} style={{ color: '#ffd166', flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: '#ffd166', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Info</span>
            </div>
            <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0 }}>
              Solo se eliminan archivos temporales seguros. El sistema los regenera automáticamente según los necesite.
            </p>
          </div>

          {/* Tips */}
          <div style={{ borderRadius: 11, padding: '14px', background: 'rgba(10,14,25,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 11 }}>Tips Gaming</div>
            {[
              "Limpia antes de cada sesión de juego para máximo rendimiento.",
              "El Prefetch puede mejorar tiempos de carga; limpiarlo es opcional.",
              "Vaciar la papelera libera espacio real en disco.",
              "El Shader Cache GPU (~200MB) se puede limpiar sin perder settings.",
              "La caché de Windows Update puede ocupar hasta 300MB — límpiarla es seguro.",
              "Los Reportes de Error de Windows no son necesarios para el gaming.",
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 9, fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>
                <span style={{ color: '#14ff72', flexShrink: 0, fontSize: 10, marginTop: 1, fontWeight: 700 }}>→</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
