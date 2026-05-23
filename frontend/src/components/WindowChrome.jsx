import { Minus, X, Square, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useRealFPS } from "../hooks/useRealFPS";

export default function WindowChrome() {
  const minimize = () => window.electronAPI?.minimize();
  const maximize = () => window.electronAPI?.maximize();
  const close    = () => window.electronAPI?.close();

  const [now, setNow] = useState(() => new Date());
  const fps = useRealFPS();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();

  const fpsColor = fps === null ? '#14ff72' : fps >= 55 ? '#14ff72' : fps >= 30 ? '#ffaa00' : '#ff4d4d';

  return (
    <div
      data-testid="window-chrome"
      style={{
        height: 34, flexShrink: 0,
        background: 'rgba(5,7,13,0.99)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0 0 14px',
        WebkitAppRegion: 'drag',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Left — branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#14ff72', boxShadow: '0 0 7px #14ff72' }} className="blink" />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.01em' }}>Pine Opti</span>
        </div>
        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>v1.2 · Gaming Suite</span>

        {/* Live FPS in chrome */}
        {fps !== null && (
          <>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Activity size={9} style={{ color: fpsColor }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: fpsColor, letterSpacing: '-0.02em' }}>
                {fps} <span style={{ fontWeight: 500, fontSize: 8, opacity: 0.7 }}>FPS</span>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Center — clock */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 8,
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.04em' }}>
          {timeStr}
        </span>
        <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', fontWeight: 600 }}>{dateStr}</span>
      </div>

      {/* Right — window controls */}
      <div style={{ display: 'flex', WebkitAppRegion: 'no-drag', marginLeft: 'auto' }}>
        {[
          { onClick: minimize, testid: "min-btn",   icon: Minus,  size: 11, hoverBg: 'rgba(255,255,255,0.08)', hoverColor: '#fff' },
          { onClick: maximize, testid: "max-btn",   icon: Square, size: 9,  hoverBg: 'rgba(255,255,255,0.08)', hoverColor: '#fff' },
          { onClick: close,    testid: "close-btn", icon: X,      size: 11, hoverBg: 'rgba(192,57,43,0.85)',   hoverColor: '#fff' },
        ].map(({ onClick, testid, icon: Icon, size, hoverBg, hoverColor }) => (
          <button
            key={testid}
            onClick={onClick}
            data-testid={testid}
            style={{
              width: 40, height: 34, border: 'none', background: 'transparent',
              color: 'rgba(255,255,255,0.28)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.1s ease, color 0.1s ease',
              outline: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; }}
          >
            <Icon size={size} />
          </button>
        ))}
      </div>
    </div>
  );
}
