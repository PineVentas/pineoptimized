import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(6,8,15,0.97)",
        border: "1px solid rgba(20,255,114,0.25)",
        borderRadius: 9,
        padding: "9px 14px",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 11,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
        <div style={{ color: "#14ff72", fontWeight: 800, fontSize: 16, letterSpacing: "-0.03em" }}>{payload[0].value}%</div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, marginTop: 1 }}>boost rendimiento</div>
      </div>
    );
  }
  return null;
}

export default function BoostChart({ data }) {
  const max = data?.length ? Math.max(...data.map(d => d.value)) : 100;
  const avg  = data?.length ? Math.round(data.reduce((a, b) => a + b.value, 0) / data.length) : 0;

  return (
    <div className="glass" style={{ padding: '18px 20px' }} data-testid="boost-chart">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>
            Histórico de Boost
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Rendimiento optimizado · 7 días
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#14ff72', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1, filter: 'drop-shadow(0 0 8px rgba(20,255,114,0.5))' }}>{max}%</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>Pico</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#00ccff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1 }}>{avg}%</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>Prom.</div>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 110 }}>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="boostGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#14ff72" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#14ff72" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="boostLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#00ccff" />
                <stop offset="100%" stopColor="#14ff72" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.035)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(20,255,114,0.15)", strokeWidth: 1, strokeDasharray: "4 3" }} />
            <Area
              type="monotone" dataKey="value"
              stroke="url(#boostLine)"
              strokeWidth={2}
              fill="url(#boostGrad)"
              filter="url(#glow)"
              dot={{ fill: "#14ff72", r: 2.5, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#14ff72", stroke: "rgba(20,255,114,0.3)", strokeWidth: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
