import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Gauge, Wrench, Sparkles, CloudUpload, Wand2,
  Settings, Gamepad2, ShoppingBag, Target, Trash2, Zap, ShieldCheck, Monitor,
  Activity, Trophy, TrendingUp, ClipboardList, Thermometer, Network, Skull, Cpu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Sidebar() {
  const { user }    = useAuth();
  const { t }       = useLanguage();
  const location    = useLocation();

  const groups = [
    {
      label: "Principal",
      items: [
        { to: "/",             icon: Home,       label: t("nav.inicio"),       testid: "nav-inicio" },
        { to: "/optimizacion", icon: Gauge,      label: t("nav.optimizacion"), testid: "nav-optimizacion" },
        { to: "/juegos",       icon: Gamepad2,   label: t("nav.perfiles"),     testid: "nav-games" },
        { to: "/mi-pc",        icon: Cpu,        label: "Mi PC",               testid: "nav-mipc" },
        { to: "/monitor",      icon: Activity,   label: "Monitor",             testid: "nav-monitor", badge: "LIVE" },
      ]
    },
    {
      label: "Gaming",
      items: [
        { to: "/modo-torneo",    icon: Trophy,      label: "Modo Torneo",       testid: "nav-torneo",  badge: "HOT" },
        { to: "/fps-estimator",  icon: TrendingUp,  label: "FPS Estimator",     testid: "nav-fps" },
        { to: "/overclock",      icon: Thermometer, label: "Overclock",         testid: "nav-oc" },
        { to: "/bottleneck",     icon: Gauge,       label: "Cuello de Botella", testid: "nav-bottleneck" },
        { to: "/sensibilidad",   icon: Target,      label: "Sens Converter",    testid: "nav-sensibilidad" },
        { to: "/latencia",       icon: Activity,    label: "Test Latencia",     testid: "nav-latencia" },
      ]
    },
    {
      label: "Herramientas",
      items: [
        { to: "/herramientas",  icon: Wrench,      label: t("nav.herramientas"),   testid: "nav-herramientas" },
        { to: "/pine-store",    icon: ShoppingBag, label: "Pine Store",            testid: "nav-store" },
        { to: "/dns",           icon: Network,     label: "DNS Optimizer",         testid: "nav-dns" },
        { to: "/procesos",      icon: Skull,       label: "Process Killer",        testid: "nav-procesos" },
        { to: "/limpieza",      icon: Trash2,      label: "Limpieza Sistema",      testid: "nav-limpieza" },
        { to: "/power-plan",    icon: Zap,         label: "Plan de Energía",       testid: "nav-power" },
        { to: "/fix-ai",        icon: Sparkles,    label: "Fix AI",                testid: "nav-fixai", badge: "AI" },
        { to: "/historial",     icon: ClipboardList, label: "Historial",           testid: "nav-historial" },
      ]
    },
    {
      label: "Sistema",
      items: [
        { to: "/copia-seguridad",       icon: CloudUpload,  label: t("nav.copia"),            testid: "nav-backup" },
        { to: "/correcciones",          icon: Wand2,        label: t("nav.correcciones"),     testid: "nav-correcciones" },
        { to: "/servicios-protegidos",  icon: ShieldCheck,  label: "Servicios Protegidos",    testid: "nav-servicios", badge: "AC" },
        { to: "/configuracion",         icon: Settings,     label: t("nav.config"),           testid: "nav-config" },
      ]
    }
  ];

  const initials = user?.username?.[0]?.toUpperCase() || "U";

  return (
    <aside
      data-testid="sidebar"
      className="flex flex-col h-full relative"
      style={{
        width: 206, minWidth: 206,
        background: 'linear-gradient(180deg, #05070d 0%, #06091200 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 30,
      }}
    >
      {/* Ambient green glow top */}
      <div style={{
        position: 'absolute', top: -60, left: -30, width: 240, height: 240,
        background: 'radial-gradient(circle, rgba(20,255,114,0.05) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 80, right: -60, width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(0,204,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Logo ── */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
        position: 'relative',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg, #14ff72 0%, #00cc56 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 18px rgba(20,255,114,0.35), 0 0 36px rgba(20,255,114,0.1)',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7 L6 3.5 L9.5 7 L6 10.5 Z" fill="#000"/>
            <path d="M7.5 3.5 L11 7 L7.5 10.5" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
            Pine <span style={{ color: '#14ff72', filter: 'drop-shadow(0 0 6px rgba(20,255,114,0.5))' }}>Opti</span>
          </div>
          <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 1, fontWeight: 600 }}>
            Gaming Suite
          </div>
        </div>
      </div>

      {/* ── Nav groups ── */}
      <nav style={{
        flex: 1, padding: '10px 8px',
        overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {groups.map(group => (
          <div key={group.label}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)', padding: '0 8px', marginBottom: 4,
            }}>
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.items.map((it) => {
                const isActive = it.to === "/"
                  ? location.pathname === "/" || location.pathname === ""
                  : location.pathname.startsWith(it.to);
                return (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    end={it.to === "/"}
                    data-testid={it.testid}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '7px 10px', borderRadius: 8,
                      textDecoration: 'none', fontSize: 12.5,
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.13s var(--easing-out)',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(20,255,114,0.13) 0%, rgba(20,255,114,0.04) 100%)'
                        : 'transparent',
                      color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                      position: 'relative', outline: 'none',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.78)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                      }
                    }}
                  >
                    <it.icon
                      size={14}
                      style={{
                        flexShrink: 0,
                        color: isActive ? '#14ff72' : 'inherit',
                        filter: isActive ? 'drop-shadow(0 0 5px rgba(20,255,114,0.55))' : 'none',
                        transition: 'filter 0.13s',
                      }}
                    />
                    <span style={{
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em', flex: 1,
                    }}>
                      {it.label}
                    </span>
                    {it.badge && (
                      <span style={{
                        fontSize: 8, fontWeight: 800,
                        background:
                          it.badge === 'AI'   ? 'linear-gradient(90deg, #14ff72, #00ccff)' :
                          it.badge === 'LIVE' ? 'linear-gradient(90deg, #ff4444, #ff8c00)' :
                          it.badge === 'HOT'  ? 'linear-gradient(90deg, #ff6b35, #ff4444)' :
                          it.badge === 'NEW'  ? 'linear-gradient(90deg, #ffd166, #ff8c00)' :
                          it.badge === 'AC'   ? 'linear-gradient(90deg, #d926ff, #ff6b9d)' :
                          'linear-gradient(90deg, #d926ff, #ff6b9d)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0,
                      }}>{it.badge}</span>
                    )}
                    {isActive && (
                      <div style={{
                        position: 'absolute', right: 8, width: 4, height: 4,
                        borderRadius: '50%', background: '#14ff72',
                        boxShadow: '0 0 6px #14ff72', flexShrink: 0,
                      }} />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div style={{ padding: '10px 10px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(20,255,114,0.22), rgba(0,204,255,0.12))',
            border: '1px solid rgba(20,255,114,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#14ff72', fontWeight: 900, fontSize: 13, letterSpacing: '-0.02em',
            boxShadow: '0 0 14px rgba(20,255,114,0.12)',
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}>
              {user?.username || 'Usuario'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#14ff72', boxShadow: '0 0 6px #14ff72' }} className="blink" />
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                PRO · Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
