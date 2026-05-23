import { useState, useRef, useEffect } from "react";
import { Activity, Play, Square, Wifi, Globe, Server, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const SERVERS = [
  { id: "cloudflare", name: "Cloudflare",       host: "1.1.1.1",                    url: "https://1.1.1.1/cdn-cgi/trace",                              type: "CDN",    region: "Global",    color: "#f48120" },
  { id: "google",     name: "Google",            host: "8.8.8.8",                    url: "https://www.gstatic.com/generate_204",                       type: "Tech",   region: "Global",    color: "#4285F4" },
  { id: "riot",       name: "Riot / Valorant",   host: "riotgames.com",              url: "https://status.riotgames.com",                               type: "Gaming", region: "Global",    color: "#FF4655" },
  { id: "steam",      name: "Steam",             host: "store.steampowered.com",     url: "https://store.steampowered.com/favicon.ico",                 type: "Gaming", region: "Global",    color: "#1b2838" },
  { id: "epicgames",  name: "Epic Games",        host: "epicgames.com",              url: "https://static-assets-prod.unrealengine.com/favicon.ico",    type: "Gaming", region: "Global",    color: "#2f2f2f" },
  { id: "aws",        name: "Amazon AWS",        host: "aws.amazon.com",             url: "https://aws.amazon.com/favicon.ico",                         type: "Cloud",  region: "Global",    color: "#FF9900" },
  { id: "battlenet",  name: "Battle.net",        host: "battle.net",                 url: "https://battle.net/favicon.ico",                             type: "Gaming", region: "Global",    color: "#0099ff" },
  { id: "ea",         name: "EA / Origin",       host: "ea.com",                     url: "https://www.ea.com/favicon.ico",                             type: "Gaming", region: "Global",    color: "#FF6B35" },
  { id: "ubisoft",    name: "Ubisoft Connect",   host: "ubisoft.com",                url: "https://www.ubisoft.com/favicon.ico",                        type: "Gaming", region: "Global",    color: "#0070ff" },
  { id: "xbox",       name: "Xbox Live",         host: "xbox.com",                   url: "https://www.xbox.com/favicon.ico",                           type: "Gaming", region: "Global",    color: "#107C10" },
  { id: "twitch",     name: "Twitch",            host: "twitch.tv",                  url: "https://static.twitchsvc.net/favicon.ico",                   type: "Stream", region: "Global",    color: "#9146FF" },
  { id: "youtube",    name: "YouTube",           host: "youtube.com",                url: "https://www.youtube.com/favicon.ico",                        type: "Stream", region: "Global",    color: "#FF0000" },
];

const QUALITY = (ms) => {
  if (!ms) return { label: "—", color: "rgba(255,255,255,0.2)" };
  if (ms <= 20)  return { label: "Excelente", color: "#14ff72", bar: 100 };
  if (ms <= 50)  return { label: "Muy bueno", color: "#00ccff", bar: 85 };
  if (ms <= 100) return { label: "Bueno",     color: "#ffd166", bar: 65 };
  if (ms <= 200) return { label: "Alto",      color: "#ff9f43", bar: 40 };
  return               { label: "Crítico",    color: "#ff6b6b", bar: 20 };
};

async function pingServer(url) {
  try {
    const t0 = performance.now();
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(4000) });
    return Math.round(performance.now() - t0);
  } catch {
    return null;
  }
}

export default function LatencyTest() {
  const [results, setResults] = useState({});
  const [running, setRunning]  = useState(false);
  const [continuous, setContinuous] = useState(false);
  const [history, setHistory]  = useState([]); // { time, avg }
  const contRef = useRef(false);
  const chartRef = useRef(null);

  const runOnce = async () => {
    const newResults = {};
    for (const srv of SERVERS) {
      const pings = [];
      for (let i = 0; i < 3; i++) {
        const ms = await pingServer(srv.url);
        if (ms !== null) pings.push(ms);
      }
      if (pings.length > 0) {
        const avg = Math.round(pings.reduce((a,b)=>a+b,0)/pings.length);
        const min = Math.min(...pings);
        newResults[srv.id] = { avg, min, pings };
      } else {
        newResults[srv.id] = null;
      }
      setResults(r => ({ ...r, [srv.id]: newResults[srv.id] }));
    }
    const vals = Object.values(newResults).filter(Boolean).map(r => r.avg);
    if (vals.length > 0) {
      const avg = Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
      setHistory(h => [...h.slice(-29), { time: new Date().toLocaleTimeString('es', {hour:'2-digit',minute:'2-digit',second:'2-digit'}), avg }]);
    }
  };

  const start = async () => {
    setRunning(true);
    setResults({});
    await runOnce();
    if (contRef.current) {
      const loop = async () => {
        if (!contRef.current) { setRunning(false); return; }
        await runOnce();
        setTimeout(loop, 3000);
      };
      setTimeout(loop, 3000);
    } else {
      setRunning(false);
      toast.success("Test completado");
    }
  };

  const toggleContinuous = () => {
    if (continuous) {
      contRef.current = false;
      setContinuous(false);
      setRunning(false);
    } else {
      contRef.current = true;
      setContinuous(true);
      start();
    }
  };

  useEffect(() => { return () => { contRef.current = false; }; }, []);

  const avgAll = (() => {
    const vals = Object.values(results).filter(Boolean).map(r => r.avg);
    return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : null;
  })();

  const q = QUALITY(avgAll);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 32px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,rgba(0,204,255,0.2),rgba(0,204,255,0.06))', border: '1px solid rgba(0,204,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={18} style={{ color: '#00ccff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Test de Latencia</h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Ping real via HTTP · {SERVERS.length} servidores · Gaming + Streaming
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={start} disabled={running && !continuous}
            className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
            <RefreshCw size={13} style={{ animation: (running && !continuous) ? 'spin-slow 1s linear infinite' : 'none' }} />
            Test único
          </button>
          <button onClick={toggleContinuous}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 9,
              fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
              background: continuous ? 'rgba(255,107,107,0.15)' : 'linear-gradient(135deg,#00ccff,#0099cc)',
              border: continuous ? '1px solid rgba(255,107,107,0.4)' : 'none',
              color: continuous ? '#ff6b6b' : '#000', cursor: 'pointer',
            }}>
            {continuous ? <><Square size={13} /> Detener</> : <><Play size={13} /> Monitor continuo</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Big avg card */}
          <div style={{
            borderRadius: 16, padding: '24px 28px',
            background: 'linear-gradient(135deg, rgba(10,13,22,0.9), rgba(8,14,20,0.95))',
            border: `1px solid ${q.color}30`,
            display: 'flex', alignItems: 'center', gap: 24,
            boxShadow: `0 0 40px ${q.color}08`,
          }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-0.06em', color: avgAll ? q.color : 'rgba(255,255,255,0.15)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, textShadow: avgAll ? `0 0 30px ${q.color}40` : 'none' }}>
                {avgAll ?? '—'}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.1em', marginTop: 4 }}>ms promedio</div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: avgAll ? q.color : 'rgba(255,255,255,0.2)', marginBottom: 6 }}>
                {avgAll ? q.label : running ? 'Midiendo...' : 'Sin datos'}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                {avgAll
                  ? avgAll <= 50 ? 'Excelente para gaming competitivo. Input lag mínimo.'
                  : avgAll <= 100 ? 'Conexión aceptable para gaming casual.'
                  : 'Latencia alta. Considera cambiar de DNS o revisar tu red.'
                  : 'Haz clic en "Test único" o inicia el monitor continuo.'}
              </p>
              {avgAll && (
                <div style={{ marginTop: 10, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${q.bar}%`, background: q.color, borderRadius: 99, boxShadow: `0 0 8px ${q.color}60`, transition: 'width 0.6s ease' }} />
                </div>
              )}
            </div>
          </div>

          {/* Server list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {SERVERS.map(srv => {
              const res = results[srv.id];
              const qr = QUALITY(res?.avg);
              const isPending = running && !res;
              return (
                <div key={srv.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 12,
                  background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'border-color 0.15s',
                }}>
                  {/* Icon */}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${srv.color}14`, border: `1px solid ${srv.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {srv.type === 'Gaming' ? <Server size={15} style={{ color: srv.color }} />
                    : srv.type === 'CDN'   ? <Globe size={15} style={{ color: srv.color }} />
                    :                        <Wifi size={15} style={{ color: srv.color }} />}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{srv.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>{srv.host}</div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: `${srv.color}12`, border: `1px solid ${srv.color}20`, color: srv.color, fontWeight: 700, letterSpacing: '0.08em' }}>{srv.type}</span>
                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{srv.region}</span>
                  </div>

                  {/* Result */}
                  <div style={{ width: 120, textAlign: 'right', flexShrink: 0 }}>
                    {isPending ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#00ccff', animation: `blink 1s ${i*0.2}s ease-in-out infinite` }} />)}
                      </div>
                    ) : res === null ? (
                      <span style={{ fontSize: 11, color: '#ff6b6b', fontWeight: 700 }}>Timeout</span>
                    ) : res ? (
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 900, color: qr.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em' }}>{res.avg}</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 3 }}>ms</span>
                        <div style={{ fontSize: 9, color: qr.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 1 }}>{qr.label}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* History panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: '16px 18px', flex: 1 }}>
            <div className="section-label" style={{ marginBottom: 14 }}>Historial de pings</div>
            {history.length === 0 ? (
              <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>
                Sin datos aún
              </div>
            ) : (
              <div>
                {/* Mini chart */}
                <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', gap: 3, marginBottom: 12 }}>
                  {history.slice(-20).map((h, i) => {
                    const maxMs = Math.max(...history.map(x=>x.avg), 100);
                    const pct   = (h.avg / maxMs) * 100;
                    const qh    = QUALITY(h.avg);
                    return (
                      <div key={i} title={`${h.avg}ms`} style={{ flex: 1, height: `${Math.max(pct, 5)}%`, background: qh.color, borderRadius: '3px 3px 0 0', opacity: 0.7 + (i/history.length)*0.3, transition: 'height 0.3s ease' }} />
                    );
                  })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 240, overflowY: 'auto' }}>
                  {[...history].reverse().map((h, i) => {
                    const qh = QUALITY(h.avg);
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{h.time}</span>
                        <span style={{ color: qh.color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{h.avg}ms</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '14px 16px' }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Referencia gaming</div>
            {[
              { label: '< 20ms', desc: 'Torneo / Pro',   color: '#14ff72' },
              { label: '< 50ms', desc: 'Competitivo',    color: '#00ccff' },
              { label: '< 100ms', desc: 'Casual',        color: '#ffd166' },
              { label: '> 100ms', desc: 'Problemático',  color: '#ff6b6b' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 11 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: r.color, fontWeight: 700 }}>{r.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
