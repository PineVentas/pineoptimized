import { useEffect, useState } from "react";
import { Lock, MessageSquare, AlertCircle, Download, Trash2, Palette, Info, Zap, ShieldCheck, Languages, Bell, Monitor, Cpu, ChevronRight } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";
import AboutModal from "../components/AboutModal";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/ui/LanguageSelector";

const THEMES = [
  { id: "green",   name: "Neon Verde",    color: "#14ff72", glow: "rgba(20,255,114,0.4)" },
  { id: "cyan",    name: "Cyber Cyan",    color: "#00ccff", glow: "rgba(0,204,255,0.4)" },
  { id: "magenta", name: "Magenta Pro",   color: "#d926ff", glow: "rgba(217,38,255,0.4)" },
  { id: "amber",   name: "Sunset Amber",  color: "#ffaa00", glow: "rgba(255,170,0,0.4)" },
  { id: "red",     name: "Blood Red",     color: "#ff4444", glow: "rgba(255,68,68,0.4)"  },
  { id: "orange",  name: "Fire Orange",   color: "#ff6b35", glow: "rgba(255,107,53,0.4)" },
  { id: "blue",    name: "Royal Blue",    color: "#4d79ff", glow: "rgba(77,121,255,0.4)" },
  { id: "white",   name: "Arctic White",  color: "#e8e8e8", glow: "rgba(232,232,232,0.3)"},
];

function PineToggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      position: 'relative', width: 44, height: 24, borderRadius: 99,
      background: value ? 'rgba(20,255,114,0.2)' : 'rgba(255,255,255,0.07)',
      border: `1px solid ${value ? 'rgba(20,255,114,0.4)' : 'rgba(255,255,255,0.1)'}`,
      cursor: 'pointer', flexShrink: 0,
      transition: 'all 0.15s ease',
      boxShadow: value ? '0 0 10px rgba(20,255,114,0.12)' : 'none',
    }}>
      <div style={{
        position: 'absolute', top: 3, left: value ? 22 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: value ? '#14ff72' : 'rgba(255,255,255,0.3)',
        boxShadow: value ? '0 0 8px rgba(20,255,114,0.6)' : 'none',
        transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </button>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="section-label" style={{ marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, desc, right, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 16px', borderRadius: 10,
      background: danger ? 'rgba(255,107,107,0.04)' : 'var(--surface)',
      border: `1px solid ${danger ? 'rgba(255,107,107,0.12)' : 'rgba(255,255,255,0.06)'}`,
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: danger ? 'rgba(255,107,107,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} style={{ color: danger ? '#ff6b6b' : 'rgba(255,255,255,0.5)' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: danger ? '#ff6b6b' : 'rgba(255,255,255,0.8)' }}>{label}</div>
        {desc && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function getLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function setLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

export default function Configuracion() {
  const { language, setLanguage, t } = useLanguage();
  const [s, setS] = useState(() => getLS("pine_settings", { rpc: true, errors: false, autoUpdate: false, pin: "", theme: "green" }));
  const [aboutOpen, setAbout]   = useState(false);
  const [autoMode, setAutoMode] = useState(() => getLS("pine_automode", false));
  const [activeTheme, setActiveTheme] = useState(() => getLS("pine_theme", "green"));

  useEffect(() => {
    api.get("/settings").then(r => {
      setS(prev => {
        const merged = { ...prev, ...r.data.settings };
        setLS("pine_settings", merged);
        return merged;
      });
      if (r.data.settings?.theme) { setActiveTheme(r.data.settings.theme); setLS("pine_theme", r.data.settings.theme); }
    }).catch(() => {});
    api.get("/auto-mode").then(r => { setAutoMode(r.data.enabled); setLS("pine_automode", r.data.enabled); }).catch(() => {});
  }, []);

  const save = (next) => { setS(next); setLS("pine_settings", next); api.post("/settings", { settings: next }).catch(() => {}); };

  const toggleAuto = async (v) => {
    setAutoMode(v); setLS("pine_automode", v);
    try {
      await api.post("/auto-mode", { enabled: v });
      toast.success(v ? "Modo automático activado — tweaks permanentes" : "Modo manual restaurado");
    } catch { toast.error("Error"); }
  };

  const applyTheme = async (id) => {
    setActiveTheme(id); setLS("pine_theme", id);
    save({ ...s, theme: id });
    const theme = THEMES.find(t => t.id === id);
    if (theme) {
      document.documentElement.style.setProperty('--accent', theme.color);
      document.documentElement.style.setProperty('--accent-glow', theme.glow);
      document.documentElement.style.setProperty('--accent-dim', `${theme.color}14`);
      document.documentElement.style.setProperty('--accent-border', `${theme.color}33`);
      window.dispatchEvent(new CustomEvent('pine-theme-change', { detail: theme }));
    }
    try { await api.post("/theme", { theme: id }); toast.success(`🎨 Tema aplicado: ${theme?.name}`); } catch {}
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 32px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Configuración</h1>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Personalización y preferencias</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        <div>

          {/* Auto mode - featured */}
          <Section label="Rendimiento y sistema">
            <div style={{
              borderRadius: 14, padding: '20px',
              background: autoMode ? 'linear-gradient(135deg, rgba(20,255,114,0.1), rgba(20,255,114,0.04))' : 'var(--surface)',
              border: `1px solid ${autoMode ? 'rgba(20,255,114,0.3)' : 'rgba(255,255,255,0.07)'}`,
              marginBottom: 2,
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: autoMode ? 'rgba(20,255,114,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${autoMode ? 'rgba(20,255,114,0.3)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={18} style={{ color: autoMode ? '#14ff72' : 'rgba(255,255,255,0.4)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Modo Automático</span>
                    <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 4, background: 'rgba(20,255,114,0.12)', border: '1px solid rgba(20,255,114,0.25)', color: '#14ff72', fontWeight: 800, letterSpacing: '0.1em' }}>RECOMENDADO</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 10 }}>
                    Pine Opti aplica los tweaks al arranque del sistema. No necesitas abrirlo cada vez que vayas a jugar — los cambios son permanentes y los anti-cheats nunca son tocados.
                  </p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
                    <span style={{ color: '#14ff72', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={10} /> 100% Anti-ban
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>· Tweaks al inicio de Windows</span>
                  </div>
                </div>
                <PineToggle value={autoMode} onChange={toggleAuto} />
              </div>
            </div>
            <Row icon={Cpu} label="Prioridad de proceso"
              desc="Establece el proceso del juego como alta prioridad automáticamente"
              right={<PineToggle value={s.rpc} onChange={(v) => save({...s, rpc: v})} />} />
            <Row icon={Monitor} label="Actualizaciones automáticas"
              desc="Descarga e instala actualizaciones en segundo plano"
              right={<PineToggle value={s.autoUpdate} onChange={(v) => save({...s, autoUpdate: v})} />} />
            <Row icon={Zap} label="Minimizar al iniciar"
              desc="Pine Opti arranca minimizado en la bandeja del sistema"
              right={<PineToggle value={s.startMin ?? false} onChange={(v) => save({...s, startMin: v})} />} />
            <Row icon={ChevronRight} label="Animaciones de la interfaz"
              desc="Desactiva para máximo rendimiento en PCs lentas"
              right={<PineToggle value={s.animations ?? true} onChange={(v) => save({...s, animations: v})} />} />
          </Section>

          {/* Notificaciones */}
          <Section label="Notificaciones y sonido">
            <Row icon={Bell} label="Informe de errores"
              desc="Envía reportes anónimos para mejorar la app"
              right={<PineToggle value={s.errors} onChange={(v) => save({...s, errors: v})} />} />
            <Row icon={Bell} label="Notificar al terminar operaciones"
              desc="Muestra notificación cuando un proceso largo termina"
              right={<PineToggle value={s.notifyDone ?? true} onChange={(v) => save({...s, notifyDone: v})} />} />
          </Section>

          {/* Seguridad */}
          <Section label="Seguridad">
            <Row icon={Lock} label="PIN de acceso"
              desc="Requiere PIN al abrir Pine Opti"
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontWeight: 800, letterSpacing: '0.1em' }}>PRO</span>
                  <button onClick={() => toast.info("PIN disponible en el .exe instalado")}
                    style={{ padding: '5px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', letterSpacing: '0.05em' }}>
                    Configurar
                  </button>
                </div>
              } />
            <Row icon={ShieldCheck} label="Servicios protegidos activos"
              desc="Bloquea tweaks que puedan afectar anticheat — siempre activo"
              right={<span style={{ fontSize: 10, fontWeight: 800, color: '#14ff72', letterSpacing: '0.08em' }}>ACTIVO</span>} />
          </Section>

          {/* Danger zone */}
          <Section label="Zona de peligro">
            <Row icon={Trash2} label="Desinstalar Pine Opti"
              desc="Elimina la app, sus ajustes y todos los tweaks aplicados"
              danger
              right={
                <button onClick={() => toast.warning("Esta acción solo afectará al .exe instalado")}
                  style={{ padding: '6px 14px', borderRadius: 7, fontSize: 10, fontWeight: 700, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)', color: '#ff6b6b', cursor: 'pointer', letterSpacing: '0.05em' }}>
                  Desinstalar
                </button>
              } />
          </Section>

        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Theme picker */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Palette size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span className="section-label">Tema de color</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {THEMES.map(theme => (
                <button key={theme.id} onClick={() => applyTheme(theme.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  background: activeTheme === theme.id ? `${theme.color}0C` : 'transparent',
                  border: `1px solid ${activeTheme === theme.id ? `${theme.color}30` : 'rgba(255,255,255,0.05)'}`,
                  transition: 'all 0.12s ease',
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: theme.color, boxShadow: activeTheme === theme.id ? `0 0 12px ${theme.glow}` : 'none', transition: 'box-shadow 0.15s', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: activeTheme === theme.id ? theme.color : 'rgba(255,255,255,0.5)', transition: 'color 0.15s', flex: 1, textAlign: 'left' }}>{theme.name}</span>
                  {activeTheme === theme.id && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.color }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Languages size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span className="section-label">Idioma</span>
            </div>
            <LanguageSelector />
          </div>

          {/* About */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Info size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span className="section-label">Información</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { label: 'Versión', value: 'v1.2.0 Neon' },
                { label: 'Modo', value: 'Offline / Desktop' },
                { label: 'Stack', value: 'React + Electron' },
                { label: 'Build', value: '2026.05.22' },
                { label: 'Juegos', value: '13 perfiles' },
                { label: 'DNS', value: '10 servidores' },
                { label: 'Tweaks', value: '50+ aplicables' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setAbout(true)} style={{
              width: '100%', marginTop: 14, padding: '9px', borderRadius: 9,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <Info size={12} /> Ver créditos completos
            </button>
          </div>

          {/* Keyboard shortcuts */}
          <div className="card" style={{ padding: '18px' }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Atajos de teclado</div>
            {[
              { key: 'Ctrl + K',   desc: 'Paleta de comandos' },
              { key: 'Ctrl + 1–9', desc: 'Cambiar sección' },
              { key: 'Ctrl + L',   desc: 'Limpieza rápida' },
              { key: 'Ctrl + D',   desc: 'Test de DNS' },
              { key: 'Ctrl + F',   desc: 'Fix AI' },
              { key: 'Esc',        desc: 'Cerrar modal / menú' },
            ].map(s => (
              <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.desc}</span>
                <code style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{s.key}</code>
              </div>
            ))}
          </div>

        </div>
      </div>

      <AboutModal open={aboutOpen} onClose={() => setAbout(false)} />
    </div>
  );
}
