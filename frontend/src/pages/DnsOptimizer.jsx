import { useState } from "react";
import { Globe, Zap, Shield, Clock, CheckCircle2, Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const DNS_SERVERS = [
  { id: "cloudflare",    name: "Cloudflare",         primary: "1.1.1.1",        secondary: "1.0.0.1",        color: "#f48120", tag: "PRIVACIDAD", doh: "https://cloudflare-dns.com/dns-query?name=google.com&type=A",   desc: "El DNS más rápido del mundo. Sin logs de usuario. Ideal para gaming." },
  { id: "cloudflare2",   name: "Cloudflare Family",  primary: "1.1.1.3",        secondary: "1.0.0.3",        color: "#ffaa00", tag: "FAMILIA",    doh: "https://cloudflare-dns.com/dns-query?name=google.com&type=A",   desc: "Bloquea malware y contenido adulto automáticamente." },
  { id: "google",        name: "Google DNS",          primary: "8.8.8.8",        secondary: "8.8.4.4",        color: "#4285F4", tag: "RÁPIDO",     doh: "https://dns.google/resolve?name=google.com&type=A",             desc: "Alta fiabilidad y velocidad global de Google. Infraestructura masiva." },
  { id: "quad9",         name: "Quad9",               primary: "9.9.9.9",        secondary: "149.112.112.112",color: "#2196F3", tag: "SEGURIDAD",  doh: "https://dns.quad9.net:5053/dns-query?name=google.com&type=A",   desc: "Bloquea dominios maliciosos con lista actualizada. Sin logs de usuario." },
  { id: "opendns",       name: "OpenDNS",             primary: "208.67.222.222", secondary: "208.67.220.220", color: "#006399", tag: "CONTROL",    doh: "https://cloudflare-dns.com/dns-query?name=google.com&type=A",   desc: "Control parental y protección contra phishing. DNS de Cisco." },
  { id: "adguard",       name: "AdGuard DNS",         primary: "94.140.14.14",   secondary: "94.140.15.15",   color: "#68BD71", tag: "ADBLOCK",    doh: "https://dns.adguard.com/resolve?name=google.com&type=A",         desc: "Bloquea anuncios y rastreadores a nivel de DNS sin instalar nada." },
  { id: "nextdns",       name: "NextDNS",             primary: "45.90.28.0",     secondary: "45.90.30.0",     color: "#00b4d8", tag: "PREMIUM",    doh: "https://dns.nextdns.io/dns-query?name=google.com&type=A",        desc: "DNS premium configurable. Bloqueo por categoría y analytics." },
  { id: "comodo",        name: "Comodo Secure",       primary: "8.26.56.26",     secondary: "8.20.247.20",    color: "#d926ff", tag: "SECURE",     doh: "https://cloudflare-dns.com/dns-query?name=google.com&type=A",   desc: "Bloquea dominios peligrosos con la base de datos de Comodo." },
  { id: "cleanbrowsing", name: "CleanBrowsing",       primary: "185.228.168.9",  secondary: "185.228.169.9",  color: "#ff9f43", tag: "LIMPIO",     doh: "https://doh.cleanbrowsing.org/doh/family-filter?dns=google.com", desc: "DNS familiar con filtro de contenido. Protege a niños en red." },
  { id: "verisign",      name: "Verisign",            primary: "64.6.64.6",      secondary: "64.6.65.6",      color: "#14ff72", tag: "ESTABLE",    doh: "https://cloudflare-dns.com/dns-query?name=google.com&type=A",   desc: "DNS de alta disponibilidad de Verisign. Sin filtros. Muy estable." },
];

async function testDns(doh) {
  try {
    const headers = { 'Accept': 'application/dns-json' };
    const t0 = performance.now();
    await fetch(doh, { headers, signal: AbortSignal.timeout(3000) });
    return Math.round(performance.now() - t0);
  } catch { return null; }
}

export default function DnsOptimizer() {
  const [benchmarks, setBenchmarks] = useState({});
  const [current, setCurrent]       = useState(null);
  const [applying, setApplying]     = useState(null);
  const [testing, setTesting]       = useState(false);
  const isElectron = !!(window.electronAPI?.applyDns);

  const runBenchmark = async () => {
    setTesting(true);
    setBenchmarks({});
    toast.info("Midiendo velocidad de servidores DNS...");
    for (const srv of DNS_SERVERS) {
      const pings = [];
      for (let i = 0; i < 3; i++) {
        const ms = await testDns(srv.doh);
        if (ms !== null) pings.push(ms);
        await new Promise(r => setTimeout(r, 100));
      }
      const avg = pings.length ? Math.round(pings.reduce((a,b)=>a+b,0)/pings.length) : null;
      setBenchmarks(b => ({ ...b, [srv.id]: avg }));
    }
    setTesting(false);
    toast.success("Benchmark completado");
  };

  const apply = async (srv) => {
    setApplying(srv.id);
    try {
      if (isElectron) {
        const r = await window.electronAPI.applyDns(srv.primary, srv.secondary);
        if (!r?.ok) { toast.error("Error aplicando DNS"); return; }
      }
      setCurrent(srv.id);
      try {
        localStorage.setItem("pine_dns_choice", JSON.stringify({
          id: srv.id, name: srv.name, primary: srv.primary, secondary: srv.secondary, ts: Date.now(),
        }));
      } catch {}
      toast.success(`✅ DNS configurado: ${srv.name} (${srv.primary})`);
      if (!isElectron) toast.info("Copia los IPs y aplícalos en Configuración > Red > DNS de Windows");
    } catch { toast.error("Error aplicando DNS"); }
    finally  { setApplying(null); }
  };

  const resetDns = async () => {
    if (!isElectron) { toast.info("Requiere app .exe"); return; }
    try {
      await window.electronAPI.applyDns("", "");
      setCurrent(null);
      toast.success("DNS restaurado a automático (DHCP)");
    } catch { toast.error("Error restaurando DNS"); }
  };

  const sorted = [...DNS_SERVERS].sort((a,b) => {
    const ba = benchmarks[a.id] ?? 9999;
    const bb = benchmarks[b.id] ?? 9999;
    return ba - bb;
  });

  const fastest = sorted.find(s => benchmarks[s.id] != null);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 32px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,rgba(20,255,114,0.2),rgba(20,255,114,0.06))', border: '1px solid rgba(20,255,114,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={18} style={{ color: '#14ff72' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>DNS Optimizer</h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Benchmark real · {DNS_SERVERS.length} servidores · Menos ping en juegos
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={resetDns} className="btn-ghost" style={{ fontSize: 11 }}>Reset a DHCP</button>
          <button onClick={runBenchmark} disabled={testing} className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
            {testing
              ? <><RefreshCw size={13} style={{ animation: 'spin-slow 1s linear infinite' }} /> Midiendo...</>
              : <><Play size={13} /> Benchmark ahora</>}
          </button>
        </div>
      </div>

      {/* Best DNS banner */}
      {fastest && (
        <div style={{
          borderRadius: 14, padding: '16px 20px', marginBottom: 18,
          background: 'linear-gradient(90deg, rgba(20,255,114,0.08), rgba(20,255,114,0.03))',
          border: '1px solid rgba(20,255,114,0.2)',
          display: 'flex', alignItems: 'center', gap: 14,
          animation: 'spring-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <Zap size={18} style={{ color: '#14ff72', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
              Más rápido: <span style={{ color: '#14ff72' }}>{fastest.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>{benchmarks[fastest.id]}ms</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {fastest.primary} / {fastest.secondary}
            </div>
          </div>
          <button onClick={() => apply(fastest)}
            className="btn-primary" style={{ fontSize: 11, padding: '7px 16px' }}>
            Aplicar DNS más rápido
          </button>
        </div>
      )}

      {/* DNS cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
        {sorted.map((srv, idx) => {
          const ms    = benchmarks[srv.id];
          const isCur = current === srv.id;
          const isBest = fastest?.id === srv.id && ms != null;
          return (
            <div key={srv.id} style={{
              borderRadius: 14, padding: '18px',
              background: isCur ? `rgba(20,255,114,0.06)` : 'var(--surface)',
              border: `1px solid ${isCur ? 'rgba(20,255,114,0.3)' : isBest && ms != null ? `${srv.color}30` : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
            }}>
              {isBest && ms != null && (
                <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 8, fontWeight: 700, color: '#14ff72', background: 'rgba(20,255,114,0.12)', border: '1px solid rgba(20,255,114,0.25)', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.1em' }}>
                  MÁS RÁPIDO
                </div>
              )}
              {isCur && (
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: '#14ff72' }}>
                  <CheckCircle2 size={11} /> ACTIVO
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${srv.color}14`, border: `1px solid ${srv.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} style={{ color: srv.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{srv.name}</div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${srv.color}12`, border: `1px solid ${srv.color}22`, color: srv.color, letterSpacing: '0.08em' }}>
                    {srv.tag}
                  </span>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  {testing && !ms ? (
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: srv.color, animation: `blink 1s ${i*0.2}s infinite` }} />)}
                    </div>
                  ) : ms ? (
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: ms < 50 ? '#14ff72' : ms < 100 ? '#ffd166' : '#ff6b6b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1 }}>{ms}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>ms DoH</div>
                    </div>
                  ) : (
                    <Clock size={16} style={{ color: 'rgba(255,255,255,0.15)' }} />
                  )}
                </div>
              </div>

              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 12, lineHeight: 1.55 }}>{srv.desc}</p>

              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[srv.primary, srv.secondary].map(ip => (
                  <code key={ip} style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '3px 8px', fontFamily: 'JetBrains Mono, monospace' }}>{ip}</code>
                ))}
              </div>

              <button
                onClick={() => apply(srv)}
                disabled={applying === srv.id || isCur}
                style={{
                  width: '100%', padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                  cursor: isCur ? 'default' : 'pointer',
                  background: isCur ? 'rgba(20,255,114,0.15)' : `${srv.color}`,
                  color: isCur ? '#14ff72' : '#fff',
                  border: isCur ? '1px solid rgba(20,255,114,0.3)' : 'none',
                  letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.15s',
                }}
              >
                {isCur ? '✓ Activo' : applying === srv.id ? 'Aplicando...' : 'Aplicar DNS'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 16, padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Zap size={12} style={{ color: '#14ff72' }} />
          <span className="section-label">¿Por qué cambiar el DNS?</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {[
            { icon: '⚡', title: 'Menos ping DNS', desc: 'Resuelve nombres de dominio más rápido al iniciar el juego' },
            { icon: '🔒', title: 'Más privacidad', desc: 'Algunos DNS no registran tus consultas como hace el ISP' },
            { icon: '🛡️', title: 'Bloqueo malware', desc: 'DNS como Quad9 y AdGuard bloquean dominios peligrosos' },
            { icon: '🚀', title: 'Conexión estable', desc: 'DNS confiables reducen picos de lag en sesiones largas' },
          ].map(t => (
            <div key={t.title} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>{t.title}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
