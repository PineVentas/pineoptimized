import { useEffect, useState } from "react";

export default function HardwareWidget({ label, value, sub, percent, icon: Icon, testid }) {
  const [animated, setAnimated] = useState(0);
  const p = percent ?? 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(p), 150);
    return () => clearTimeout(t);
  }, [p]);

  const color  = p > 80 ? "#ff4d4d" : p > 60 ? "#ffaa00" : "#14ff72";
  const glow   = p > 80 ? "rgba(255,77,77,0.45)"  : p > 60 ? "rgba(255,170,0,0.45)" : "rgba(20,255,114,0.45)";
  const dimCol = p > 80 ? "rgba(255,77,77,0.1)"    : p > 60 ? "rgba(255,170,0,0.1)"  : "rgba(20,255,114,0.07)";
  const c    = 2 * Math.PI * 30;
  const dash = (animated * c) / 100;

  return (
    <div
      data-testid={testid}
      className="glass-glow"
      style={{
        padding: '15px',
        borderRadius: 13,
        background: 'rgba(9,13,22,0.96)',
        border: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
      }}
    >
      {/* Dynamic glow bg based on usage */}
      <div style={{
        position: 'absolute', top: -24, right: -24,
        width: 110, height: 110,
        background: `radial-gradient(circle, ${dimCol} 0%, transparent 68%)`,
        pointerEvents: 'none',
        transition: 'background 0.6s ease',
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        {/* Left: info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
            {Icon && (
              <div style={{
                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                background: `linear-gradient(135deg, ${color}18, ${color}06)`,
                border: `1px solid ${color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${color}12`,
              }}>
                <Icon size={11} style={{ color, filter: `drop-shadow(0 0 3px ${glow})` }} />
              </div>
            )}
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}>
              {label}
            </span>
          </div>

          {/* Value */}
          <div style={{
            fontSize: 13.5, fontWeight: 800,
            color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }} title={value}>
            {value || (
              <span style={{ display: 'flex', gap: 4 }}>
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="shimmer" style={{ display: 'inline-block', width: 40 + i * 18, height: 13, borderRadius: 4, verticalAlign: 'middle' }} />
                ))}
              </span>
            )}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', marginTop: 2.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.01em' }}>
            {sub}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 11, height: 3, background: 'rgba(255,255,255,0.055)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${animated}%`,
              background: `linear-gradient(90deg, ${color}70, ${color})`,
              boxShadow: `0 0 7px ${glow}`,
              transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }} />
          </div>
        </div>

        {/* Right: ring */}
        <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
          <svg viewBox="0 0 68 68" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="34" cy="34" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5.5" />
            <circle
              cx="34" cy="34" r="30"
              fill="none"
              stroke={color}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
              style={{
                filter: `drop-shadow(0 0 5px ${glow})`,
                transition: 'stroke-dasharray 0.9s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease',
              }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 0,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 900,
              color, letterSpacing: '-0.03em',
              filter: `drop-shadow(0 0 5px ${glow})`,
            }}>
              {animated}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
