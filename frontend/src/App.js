import "./App.css";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Sidebar from "./components/Sidebar";
import WindowChrome from "./components/WindowChrome";
import CommandPalette from "./components/CommandPalette";
import { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Inicio        = lazy(() => import("./pages/Inicio"));
const Optimizacion  = lazy(() => import("./pages/Optimizacion"));
const Herramientas  = lazy(() => import("./pages/Herramientas"));
const CopiaSeguridad= lazy(() => import("./pages/CopiaSeguridad"));
const Correcciones  = lazy(() => import("./pages/Correcciones"));
const Configuracion = lazy(() => import("./pages/Configuracion"));
const GameProfiles  = lazy(() => import("./pages/GameProfiles"));
const DnsOptimizer  = lazy(() => import("./pages/DnsOptimizer"));
const ProcessKiller = lazy(() => import("./pages/ProcessKiller"));
const FixAI         = lazy(() => import("./pages/FixAI"));
const PineStore     = lazy(() => import("./pages/PineStore"));
const Bottleneck    = lazy(() => import("./pages/Bottleneck"));
const LatencyTest   = lazy(() => import("./pages/LatencyTest"));
const SystemCleaner = lazy(() => import("./pages/SystemCleaner"));
const SensConverter = lazy(() => import("./pages/SensConverter"));
const PowerPlan            = lazy(() => import("./pages/PowerPlan"));
const ServiciosProtegidos  = lazy(() => import("./pages/ServiciosProtegidos"));
const MiPC                 = lazy(() => import("./pages/MiPC"));
const Monitor              = lazy(() => import("./pages/Monitor"));
const ModoTorneo           = lazy(() => import("./pages/ModoTorneo"));
const FPSEstimator         = lazy(() => import("./pages/FPSEstimator"));
const Historial            = lazy(() => import("./pages/Historial"));
const Overclock            = lazy(() => import("./pages/Overclock"));

if (typeof window !== "undefined" && !window.performance.getEntriesByType) {
  window.performance.getEntriesByType = () => [];
}

function PageLoader() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#14ff72', opacity: 0.4,
            animation: 'typing-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

const LOAD_PHASES = [
  { pct: 12, label: "Iniciando Pine Opti...",       icon: "⚡" },
  { pct: 28, label: "Detectando hardware...",        icon: "🖥️" },
  { pct: 44, label: "Cargando base de datos...",     icon: "🗂️" },
  { pct: 60, label: "Configurando optimizaciones...", icon: "⚙️" },
  { pct: 75, label: "Verificando anti-cheats...",    icon: "🛡️" },
  { pct: 88, label: "Preparando interfaz...",        icon: "🎮" },
  { pct: 100, label: "¡Sistema listo!",              icon: "✅" },
];

function LoadingScreen({ onDone }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut]   = useState(false);

  useEffect(() => {
    const delays = [0, 220, 450, 700, 980, 1270, 1600];
    const timers = LOAD_PHASES.map((p, i) => setTimeout(() => {
      setPhaseIdx(i);
      setProgress(p.pct);
    }, delays[i]));

    const doneTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onDone, 350);
    }, 2100);

    return () => { timers.forEach(clearTimeout); clearTimeout(doneTimer); };
  }, [onDone]);

  const cur = LOAD_PHASES[phaseIdx];

  return (
    <div style={{
      height: '100vh', width: '100vw',
      background: '#06080f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', userSelect: 'none', position: 'relative',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.35s ease',
    }}>
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(20,255,114,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(20,255,114,0.025) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-55%)', width: 700, height: 700, background: 'radial-gradient(circle,rgba(20,255,114,0.07) 0%,transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>

        {/* Logo animated */}
        <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', animation: 'spin-slow 6s linear infinite' }}>
            <circle cx="50" cy="50" r="44" stroke="rgba(20,255,114,0.15)" strokeWidth="1" fill="none" strokeDasharray="7 5" />
          </svg>
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ position: 'absolute', animation: 'spin-slow 9s linear infinite reverse' }}>
            <circle cx="38" cy="38" r="32" stroke="rgba(0,204,255,0.1)" strokeWidth="1" fill="none" strokeDasharray="4 9" />
          </svg>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#14ff72,#00d45e)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(20,255,114,0.5),0 0 120px rgba(20,255,114,0.12)', position: 'relative', zIndex: 1 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 12 L10 7 L15 12 L10 17 Z" fill="#000"/>
              <path d="M12 7 L17 12 L12 17" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1 }}>
            Pine <span style={{ color: '#14ff72', filter: 'drop-shadow(0 0 14px rgba(20,255,114,0.7))' }}>Opti</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600 }}>
            Gaming Optimizer Suite · v1.2
          </div>
        </div>

        {/* Modules checklist */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {LOAD_PHASES.slice(0, -1).map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: i <= phaseIdx ? 1 : 0.18,
              transition: 'opacity 0.3s ease',
              fontSize: 10.5,
              color: i < phaseIdx ? '#14ff72' : i === phaseIdx ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)',
            }}>
              <span style={{ fontSize: 12, width: 16, textAlign: 'center' }}>
                {i < phaseIdx ? '✓' : i === phaseIdx ? '›' : '·'}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: 280 }}>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#14ff72,#00ccff)', borderRadius: 99, transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)', boxShadow: '0 0 14px rgba(20,255,114,0.7)' }} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5 }}>
            <span style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>{cur.icon} {cur.label}</span>
            <span style={{ color: '#14ff72', opacity: 0.7 }}>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom version */}
      <div style={{ position: 'absolute', bottom: 20, fontSize: 9, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        Pine Opti v1.2.0 · Windows Gaming Suite · Anti-cheats protegidos
      </div>
    </div>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return children;
}

const NAV_SHORTCUTS = [
  "/", "/optimizacion", "/herramientas", "/pine-store",
  "/juegos", "/limpieza", "/sensibilidad", "/power-plan", "/configuracion",
];

const THEME_COLORS = {
  green:   { color: "#14ff72", glow: "rgba(20,255,114,0.4)" },
  cyan:    { color: "#00ccff", glow: "rgba(0,204,255,0.4)" },
  magenta: { color: "#d926ff", glow: "rgba(217,38,255,0.4)" },
  amber:   { color: "#ffaa00", glow: "rgba(255,170,0,0.4)" },
  red:     { color: "#ff4444", glow: "rgba(255,68,68,0.4)" },
  orange:  { color: "#ff6b35", glow: "rgba(255,107,53,0.4)" },
  blue:    { color: "#4d79ff", glow: "rgba(77,121,255,0.4)" },
  white:   { color: "#e8e8e8", glow: "rgba(232,232,232,0.3)" },
};

function applyThemeVars(id) {
  const t = THEME_COLORS[id] || THEME_COLORS.green;
  document.documentElement.style.setProperty('--accent', t.color);
  document.documentElement.style.setProperty('--accent-glow', t.glow);
  document.documentElement.style.setProperty('--accent-dim', `${t.color}14`);
  document.documentElement.style.setProperty('--accent-border', `${t.color}33`);
}

function Shell() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pine_theme");
      applyThemeVars(saved || "green");
    } catch {}
    const onThemeChange = (e) => {
      if (e.detail?.color) {
        document.documentElement.style.setProperty('--accent', e.detail.color);
        document.documentElement.style.setProperty('--accent-glow', e.detail.glow || 'rgba(20,255,114,0.4)');
        document.documentElement.style.setProperty('--accent-dim', `${e.detail.color}14`);
        document.documentElement.style.setProperty('--accent-border', `${e.detail.color}33`);
      }
    };
    window.addEventListener('pine-theme-change', onThemeChange);
    return () => window.removeEventListener('pine-theme-change', onThemeChange);
  }, []);

  const handleKey = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key) - 1;
      if (NAV_SHORTCUTS[idx]) { e.preventDefault(); navigate(NAV_SHORTCUTS[idx]); }
    }
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div className="flex h-screen text-white overflow-hidden bg-grid" style={{ fontFamily: 'Inter, sans-serif', background: '#06080f' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <WindowChrome />
        <main className="flex-1 overflow-hidden relative">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"               element={<Inicio />} />
              <Route path="/optimizacion"   element={<Optimizacion />} />
              <Route path="/herramientas"   element={<Herramientas />} />
              <Route path="/fix-ai"         element={<FixAI />} />
              <Route path="/copia-seguridad" element={<CopiaSeguridad />} />
              <Route path="/correcciones"   element={<Correcciones />} />
              <Route path="/pine-store"     element={<PineStore />} />
              <Route path="/configuracion"  element={<Configuracion />} />
              <Route path="/juegos"         element={<GameProfiles />} />
              <Route path="/dns"            element={<DnsOptimizer />} />
              <Route path="/procesos"       element={<ProcessKiller />} />
              <Route path="/bottleneck"     element={<Bottleneck />} />
              <Route path="/latencia"       element={<LatencyTest />} />
              <Route path="/limpieza"       element={<SystemCleaner />} />
              <Route path="/sensibilidad"   element={<SensConverter />} />
              <Route path="/power-plan"          element={<PowerPlan />} />
              <Route path="/servicios-protegidos" element={<ServiciosProtegidos />} />
              <Route path="/mi-pc"               element={<MiPC />} />
              <Route path="/monitor"             element={<Monitor />} />
              <Route path="/modo-torneo"         element={<ModoTorneo />} />
              <Route path="/fps-estimator"       element={<FPSEstimator />} />
              <Route path="/historial"           element={<Historial />} />
              <Route path="/overclock"           element={<Overclock />} />
              <Route path="*"                    element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <CommandPalette />
      </div>
    </div>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) return <LoadingScreen onDone={() => setIsReady(true)} />;

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(10,13,22,0.97)",
                border: "1px solid rgba(20,255,114,0.12)",
                color: "#e2e8f0",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                borderRadius: "11px",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
              },
              duration: 3500,
            }}
          />
          <Routes>
            <Route path="/*" element={<Protected><Shell /></Protected>} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
