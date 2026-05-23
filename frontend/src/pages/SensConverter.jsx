import { useState, useEffect } from "react";
import { Target, ArrowRight, Info, Copy, Check, Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";

const GAMES = [
  { id: "valorant",      name: "Valorant",              mult: 0.07,    icon: "🎯", color: "#ff4655", platform: "pc" },
  { id: "csgo",          name: "CS2 / CS:GO",           mult: 0.022,   icon: "💣", color: "#f0a800", platform: "pc" },
  { id: "fortnite",      name: "Fortnite",              mult: 0.5,     icon: "🏗️", color: "#00d4ff", platform: "pc" },
  { id: "freeFire",      name: "Free Fire (Emulador)",  mult: 0.082,   icon: "🔥", color: "#ff6b35", platform: "emu", emuNote: true },
  { id: "apex",          name: "Apex Legends",          mult: 0.022,   icon: "🏆", color: "#cd3333", platform: "pc" },
  { id: "pubg",          name: "PUBG",                  mult: 0.07,    icon: "🪖", color: "#f0a800", platform: "pc" },
  { id: "overwatch",     name: "Overwatch 2",           mult: 0.0066,  icon: "⚔️", color: "#fa9c1e", platform: "pc" },
  { id: "cod",           name: "Warzone / CoD",         mult: 0.0066,  icon: "🎖️", color: "#28a745", platform: "pc" },
  { id: "rainbow",       name: "Rainbow Six Siege",     mult: 0.02,    icon: "🌈", color: "#6b5ce7", platform: "pc" },
  { id: "minecraft",     name: "Minecraft",             mult: 0.15,    icon: "⛏️", color: "#5c8a3c", platform: "pc" },
  { id: "dota2",         name: "Dota 2",                mult: 0.016,   icon: "🏹", color: "#c23c2a", platform: "pc" },
  { id: "lol",           name: "League of Legends",     mult: 0.063,   icon: "⚡", color: "#c89b3c", platform: "pc" },
  { id: "gtav",          name: "GTA V / Online",        mult: 3.0,     icon: "🚗", color: "#f4b942", platform: "pc" },
  { id: "bf2042",        name: "Battlefield 2042",      mult: 0.1,     icon: "💥", color: "#ff6b35", platform: "pc" },
  { id: "tarkov",        name: "Escape From Tarkov",    mult: 0.05,    icon: "🪖", color: "#8b7355", platform: "pc" },
  { id: "hunt",          name: "Hunt Showdown",         mult: 0.06,    icon: "🔫", color: "#a0522d", platform: "pc" },
  { id: "roblox",        name: "Roblox",                mult: 1.0,     icon: "🟥", color: "#e53935", platform: "pc" },
  { id: "pubgMobile",    name: "PUBG Mobile (Emu)",     mult: 0.10,    icon: "📱", color: "#f0a800", platform: "emu", emuNote: true },
  { id: "codMobile",     name: "COD Mobile (Emu)",      mult: 0.09,    icon: "📱", color: "#28a745", platform: "emu", emuNote: true },
];

const DPI_PRESETS = [400, 600, 800, 1000, 1200, 1600, 3200];

function eDPI(sens, dpi) { return parseFloat((sens * dpi).toFixed(2)); }
function convert(fromSens, fromDPI, toDPI, fromMult, toMult) {
  const realSens = fromSens * fromMult * fromDPI;
  return parseFloat((realSens / (toMult * toDPI)).toFixed(4));
}

const LS = {
  fromGame: "pine_sens_fromgame",
  toGame:   "pine_sens_togame",
  fromSens: "pine_sens_fromsens",
  fromDPI:  "pine_sens_fromdpi",
  toDPI:    "pine_sens_todpi",
};

function getLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function setLS(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

export default function SensConverter() {
  const [fromGame, setFromGame] = useState(() => getLS(LS.fromGame, "csgo"));
  const [toGame,   setToGame]   = useState(() => getLS(LS.toGame,   "valorant"));
  const [fromSens, setFromSens] = useState(() => getLS(LS.fromSens, "2.0"));
  const [fromDPI,  setFromDPI]  = useState(() => getLS(LS.fromDPI,  800));
  const [toDPI,    setToDPI]    = useState(() => getLS(LS.toDPI,    800));
  const [result,   setResult]   = useState(null);
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    const from = GAMES.find(g => g.id === fromGame);
    const to   = GAMES.find(g => g.id === toGame);
    const s    = parseFloat(fromSens);
    if (!from || !to || isNaN(s) || s <= 0) { setResult(null); return; }
    const converted = convert(s, fromDPI, toDPI, from.mult, to.mult);
    setResult({ converted, edpiFrom: eDPI(s, fromDPI), edpiTo: eDPI(converted, toDPI), from, to });
  }, [fromGame, toGame, fromSens, fromDPI, toDPI]);

  const updateFromGame = (v) => { setFromGame(v); setLS(LS.fromGame, v); };
  const updateToGame   = (v) => { setToGame(v);   setLS(LS.toGame,   v); };
  const updateFromSens = (v) => { setFromSens(v); setLS(LS.fromSens, v); };
  const updateFromDPI  = (v) => { setFromDPI(v);  setLS(LS.fromDPI,  v); };
  const updateToDPI    = (v) => { setToDPI(v);    setLS(LS.toDPI,    v); };

  const swap = () => {
    const newFrom = toGame, newTo = fromGame;
    const newFromDPI = toDPI, newToDPI = fromDPI;
    updateFromGame(newFrom); updateToGame(newTo);
    updateFromDPI(newFromDPI); updateToDPI(newToDPI);
    if (result) updateFromSens(String(result.converted));
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(String(result.converted));
    setCopied(true);
    toast.success(`Copiado: ${result.converted}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const fromG = GAMES.find(g => g.id === fromGame);
  const toG   = GAMES.find(g => g.id === toGame);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px 28px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, rgba(217,38,255,0.22), rgba(217,38,255,0.07))', border: '1px solid rgba(217,38,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(217,38,255,0.12)' }}>
          <Target size={17} style={{ color: '#d926ff' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
            Conversor de Sensibilidad
          </h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', marginTop: 3, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            {GAMES.length} juegos · Mantén el mismo control muscular
          </p>
        </div>
      </div>

      {/* Main converter */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 12, alignItems: 'start', marginBottom: 16 }}>

        {/* FROM */}
        <div style={{ borderRadius: 14, padding: '20px', background: 'rgba(10,14,25,0.95)', border: `1px solid ${fromG ? fromG.color + '25' : 'rgba(255,255,255,0.07)'}`, boxShadow: fromG ? `0 0 24px ${fromG.color}08` : 'none', transition: 'border-color 0.3s' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Juego de origen</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 14 }}>
            {GAMES.map(g => (
              <button key={g.id} onClick={() => updateFromGame(g.id)} style={{
                padding: '7px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                background: fromGame === g.id ? `${g.color}18` : 'rgba(255,255,255,0.025)',
                border: `1px solid ${fromGame === g.id ? g.color + '40' : 'rgba(255,255,255,0.06)'}`,
                fontSize: 10.5, fontWeight: fromGame === g.id ? 700 : 500,
                color: fromGame === g.id ? g.color : 'rgba(255,255,255,0.45)',
                transition: 'all 0.12s', outline: 'none',
                position: 'relative',
              }}>
                <span>{g.icon} {g.name}</span>
                {g.emuNote && <span style={{ display: 'block', fontSize: 8, color: fromGame === g.id ? `${g.color}90` : 'rgba(255,255,255,0.25)', marginTop: 1, fontWeight: 500 }}>📱 Emulador</span>}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Sensibilidad ingame</div>
            <input
              type="number" min="0.01" step="0.01" value={fromSens}
              onChange={e => updateFromSens(e.target.value)}
              style={{ fontSize: 26, fontWeight: 900, padding: '10px 14px', letterSpacing: '-0.04em', fontFamily: 'JetBrains Mono, monospace', color: fromG?.color || '#14ff72', background: `${fromG?.color || '#14ff72'}08`, borderColor: `${fromG?.color || '#14ff72'}20` }}
            />
          </div>

          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>DPI del mouse</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {DPI_PRESETS.map(d => (
                <button key={d} onClick={() => updateFromDPI(d)} style={{
                  padding: '4px 9px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', outline: 'none',
                  border: fromDPI === d ? '1px solid rgba(20,255,114,0.4)' : '1px solid rgba(255,255,255,0.07)',
                  background: fromDPI === d ? 'rgba(20,255,114,0.12)' : 'rgba(255,255,255,0.03)',
                  color: fromDPI === d ? '#14ff72' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.12s',
                }}>{d}</button>
              ))}
            </div>
            <input type="number" value={fromDPI} onChange={e => updateFromDPI(Number(e.target.value))}
              style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }} />
          </div>

          {result && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: `${fromG?.color || '#14ff72'}08`, border: `1px solid ${fromG?.color || '#14ff72'}18`, borderRadius: 9 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>eDPI · {fromG?.name}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: fromG?.color || '#14ff72', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em' }}>{result.edpiFrom}</div>
            </div>
          )}
        </div>

        {/* Center: swap */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 52 }}>
          <button onClick={swap} style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s var(--easing-spring)',
            color: 'rgba(255,255,255,0.4)', fontSize: 18, outline: 'none',
          }}
            title="Invertir"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,255,114,0.1)'; e.currentTarget.style.borderColor = 'rgba(20,255,114,0.35)'; e.currentTarget.style.color = '#14ff72'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'none'; }}
          >
            ⇄
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 2, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* TO */}
        <div style={{ borderRadius: 14, padding: '20px', background: 'rgba(10,14,25,0.95)', border: `1px solid ${toG ? toG.color + '25' : 'rgba(255,255,255,0.07)'}`, boxShadow: toG ? `0 0 24px ${toG.color}08` : 'none', transition: 'border-color 0.3s' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Juego de destino</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 14 }}>
            {GAMES.map(g => (
              <button key={g.id} onClick={() => updateToGame(g.id)} style={{
                padding: '7px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                background: toGame === g.id ? `${g.color}18` : 'rgba(255,255,255,0.025)',
                border: `1px solid ${toGame === g.id ? g.color + '40' : 'rgba(255,255,255,0.06)'}`,
                fontSize: 10.5, fontWeight: toGame === g.id ? 700 : 500,
                color: toGame === g.id ? g.color : 'rgba(255,255,255,0.45)',
                transition: 'all 0.12s', outline: 'none',
              }}>
                <span>{g.icon} {g.name}</span>
                {g.emuNote && <span style={{ display: 'block', fontSize: 8, color: toGame === g.id ? `${g.color}90` : 'rgba(255,255,255,0.25)', marginTop: 1, fontWeight: 500 }}>📱 Emulador</span>}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Sensibilidad convertida</div>
            <div style={{ position: 'relative' }}>
              <div style={{
                fontSize: 36, fontWeight: 900, letterSpacing: '-0.05em',
                color: result ? (toG?.color || '#d926ff') : 'rgba(255,255,255,0.1)',
                fontFamily: 'JetBrains Mono, monospace', padding: '10px 44px 10px 14px',
                background: result ? `${toG?.color || '#d926ff'}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${result ? (toG?.color || '#d926ff') + '25' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 9, transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                textShadow: result ? `0 0 24px ${toG?.color || '#d926ff'}50` : 'none',
                minHeight: 58, display: 'flex', alignItems: 'center',
              }}>
                {result ? result.converted : '—'}
              </div>
              {result && (
                <button onClick={copyResult} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 28, height: 28, borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.07)', color: copied ? '#14ff72' : 'rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', outline: 'none',
                }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>DPI del mouse</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {DPI_PRESETS.map(d => (
                <button key={d} onClick={() => updateToDPI(d)} style={{
                  padding: '4px 9px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', outline: 'none',
                  border: toDPI === d ? `1px solid ${toG?.color || '#d926ff'}45` : '1px solid rgba(255,255,255,0.07)',
                  background: toDPI === d ? `${toG?.color || '#d926ff'}14` : 'rgba(255,255,255,0.03)',
                  color: toDPI === d ? (toG?.color || '#d926ff') : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.12s',
                }}>{d}</button>
              ))}
            </div>
            <input type="number" value={toDPI} onChange={e => updateToDPI(Number(e.target.value))}
              style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }} />
          </div>

          {result && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: `${toG?.color || '#d926ff'}08`, border: `1px solid ${toG?.color || '#d926ff'}18`, borderRadius: 9 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>eDPI · {toG?.name}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: toG?.color || '#d926ff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em' }}>{result.edpiTo}</div>
            </div>
          )}
        </div>
      </div>

      {/* Emulator info note */}
      {(fromG?.emuNote || toG?.emuNote) && (
        <div style={{
          borderRadius: 10, marginBottom: 14,
          background: 'rgba(255,107,53,0.07)',
          border: '1px solid rgba(255,107,53,0.22)',
          padding: '11px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>📱</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b35', marginBottom: 3 }}>Juego de emulador seleccionado</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>
              La sensibilidad está calibrada para <strong style={{ color: 'rgba(255,255,255,0.75)' }}>emulador de Android</strong> (BlueStacks, LDPlayer, MEmu). En Free Fire emulador usa el slider de sensibilidad in-game (0–100) junto con el DPI de tu ratón. Sensibilidad recomendada para emulador: <strong style={{ color: '#ff6b35' }}>General 50–65 · Punto Rojo 60–75</strong>.
            </div>
          </div>
        </div>
      )}

      {/* Result banner */}
      {result && (
        <div style={{
          borderRadius: 13, marginBottom: 16,
          background: `linear-gradient(135deg, ${toG?.color || '#d926ff'}0E, ${fromG?.color || '#14ff72'}07)`,
          border: `1px solid ${toG?.color || '#d926ff'}22`,
          padding: '16px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          animation: 'spring-in 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 5 }}>Conversión</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              <strong style={{ color: fromG?.color || '#14ff72' }}>{fromSens}</strong> en <strong style={{ color: '#fff' }}>{result.from.name}</strong>
              {' '}@<strong style={{ color: 'rgba(255,255,255,0.7)' }}> {fromDPI}DPI</strong>
              {' → '}
              <strong style={{ color: toG?.color || '#d926ff', fontSize: 15 }}>{result.converted}</strong> en <strong style={{ color: '#fff' }}>{result.to.name}</strong>
              {' '}@<strong style={{ color: 'rgba(255,255,255,0.7)' }}> {toDPI}DPI</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Mismo eDPI</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: result.edpiFrom === result.edpiTo ? '#14ff72' : '#ffd166' }}>
              {result.edpiFrom === result.edpiTo ? '✅ Idéntico' : `${result.edpiFrom} → ${result.edpiTo}`}
            </div>
          </div>
        </div>
      )}

      {/* Reference table */}
      <div style={{ borderRadius: 13, padding: '18px 20px', background: 'rgba(10,14,25,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
          <Info size={13} style={{ color: '#00ccff' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Tabla de referencia — todos los juegos</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 6 }}>
          {GAMES.map(g => {
            const s    = parseFloat(fromSens);
            const from = GAMES.find(g2 => g2.id === fromGame);
            if (isNaN(s) || !from) return null;
            const conv   = convert(s, fromDPI, toDPI, from.mult, g.mult);
            const isFrom = g.id === fromGame;
            const isTo   = g.id === toGame;
            return (
              <div key={g.id} style={{
                padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
                background: isTo ? `${toG?.color}10` : isFrom ? `${fromG?.color}08` : 'rgba(255,255,255,0.02)',
                border: isTo ? `1px solid ${toG?.color}28` : isFrom ? `1px solid ${fromG?.color}20` : '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.15s',
              }}
                onClick={() => isFrom ? null : updateToGame(g.id)}
              >
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.38)', marginBottom: 4 }}>{g.icon} {g.name}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: isTo ? (toG?.color || '#d926ff') : isFrom ? (fromG?.color || '#14ff72') : '#fff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
                  {isFrom ? fromSens : conv}
                </div>
                <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>eDPI: {eDPI(isFrom ? parseFloat(fromSens) : conv, toDPI)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
