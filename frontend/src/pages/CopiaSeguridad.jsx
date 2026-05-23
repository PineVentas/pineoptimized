import { useEffect, useState, useCallback } from "react";
import { ShieldCheck, Save, RotateCcw, Clock, Loader2, CheckCircle2, AlertTriangle, Plus, HardDrive } from "lucide-react";
import { toast } from "sonner";

function timeAgo(dateStr) {
  if (!dateStr) return "Desconocida";
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (day > 0) return `Hace ${day} día${day > 1 ? 's' : ''}`;
  if (h  > 0) return `Hace ${h} hora${h > 1 ? 's' : ''}`;
  return "Hace menos de 1 hora";
}

export default function CopiaSeguridad() {
  const [creating, setCreating]       = useState(false);
  const [restoring, setRestoring]     = useState(null);
  const [points, setPoints]           = useState([]);
  const [loadingPoints, setLoading]   = useState(false);
  const [progress, setProgress]       = useState(0);
  const isElectron = !!(window.electronAPI?.createRestorePoint);

  const mockPoints = [
    { id: 1, description: "Pine Opti — Auto v1.2",            date: new Date(Date.now() - 3600000*1).toISOString(),  type: "APLICACIÓN", size: "~2.6 MB" },
    { id: 2, description: "Antes de Optimización Gaming",      date: new Date(Date.now() - 86400000*1).toISOString(), type: "MANUAL",     size: "~2.4 MB" },
    { id: 3, description: "Antes de tweaks NVIDIA",            date: new Date(Date.now() - 86400000*2).toISOString(), type: "MANUAL",     size: "~2.2 MB" },
    { id: 4, description: "Instalación limpia de Windows",     date: new Date(Date.now() - 86400000*5).toISOString(), type: "SISTEMA",    size: "~1.9 MB" },
    { id: 5, description: "Sistema limpio — Inicio",           date: new Date(Date.now() - 86400000*8).toISOString(), type: "SISTEMA",    size: "~1.8 MB" },
  ];

  const loadPoints = useCallback(async () => {
    if (!isElectron) { setPoints(mockPoints); return; }
    setLoading(true);
    try {
      const r = await window.electronAPI.getRestorePoints();
      if (r?.ok && r.points?.length > 0) setPoints(r.points.slice(-6).reverse());
      else setPoints(mockPoints);
    } catch { setPoints(mockPoints); }
    finally  { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isElectron]);

  useEffect(() => { loadPoints(); }, [loadPoints]);

  const createBackup = async () => {
    if (!isElectron) { toast.info("Crear copia requiere la app de escritorio (.exe)"); return; }
    setCreating(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(p => Math.min(p + 12, 90)), 300);
    try {
      const r = await window.electronAPI.createRestorePoint("Pine Opti — " + new Date().toLocaleDateString('es'));
      clearInterval(interval);
      setProgress(100);
      if (r?.ok) {
        toast.success("✅ Punto de restauración creado");
        await loadPoints();
      } else {
        toast.error("Error creando punto de restauración");
      }
    } catch { clearInterval(interval); toast.error("Error creando copia de seguridad"); }
    finally  { setCreating(false); setProgress(0); }
  };

  const restore = async (pt) => {
    if (!isElectron) { toast.info("Restaurar requiere la app de escritorio (.exe)"); return; }
    setRestoring(pt.id);
    try {
      const r = await window.electronAPI.restorePoint(pt.id);
      if (r?.ok) toast.success(`✅ Sistema restaurado a: ${pt.description}`);
      else toast.error("Error restaurando punto");
    } catch { toast.error("Error al restaurar"); }
    finally  { setRestoring(null); }
  };

  const typeColor = { APLICACIÓN: '#14ff72', MANUAL: '#00ccff', SISTEMA: '#d926ff' };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 32px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,rgba(20,255,114,0.2),rgba(20,255,114,0.06))', border: '1px solid rgba(20,255,114,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} style={{ color: '#14ff72' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Copia de Seguridad</h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Puntos de restauración de Windows · {points.length} guardados
            </p>
          </div>
        </div>
        <button onClick={createBackup} disabled={creating} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
          {creating ? <><Loader2 size={13} style={{ animation: 'spin-slow 1s linear infinite' }} /> Creando...</> : <><Plus size={13} /> Crear punto ahora</>}
        </button>
      </div>

      {/* Progress bar */}
      {creating && (
        <div style={{ marginBottom: 16, borderRadius: 12, padding: '14px 18px', background: 'rgba(20,255,114,0.06)', border: '1px solid rgba(20,255,114,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#14ff72', fontWeight: 700 }}>Creando punto de restauración...</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>{progress}%</span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#14ff72', borderRadius: 99, boxShadow: '0 0 8px rgba(20,255,114,0.5)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Top info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { icon: HardDrive, label: 'Puntos guardados', value: points.length, color: '#14ff72', unit: 'total' },
          { icon: Clock, label: 'Último creado', value: points[0] ? timeAgo(points[0].date) : 'Ninguno', color: '#00ccff', unit: '' },
          { icon: ShieldCheck, label: 'Estado protección', value: points.length > 0 ? 'Activa' : 'Sin backups', color: points.length > 0 ? '#14ff72' : '#ff6b6b', unit: '' },
        ].map(card => (
          <div key={card.label} style={{ borderRadius: 14, padding: '16px 18px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <card.icon size={14} style={{ color: card.color }} />
              <span className="section-label">{card.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: card.color, letterSpacing: '-0.04em', fontFamily: 'JetBrains Mono, monospace' }}>
              {card.value}
              {card.unit && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{card.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Points list */}
      <div className="section-label" style={{ marginBottom: 12 }}>Puntos de restauración</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loadingPoints ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
            <Loader2 size={20} style={{ animation: 'spin-slow 1s linear infinite', margin: '0 auto 8px' }} />
            Cargando puntos...
          </div>
        ) : points.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', borderRadius: 14, background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <AlertTriangle size={32} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Sin puntos de restauración</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Crea uno ahora para proteger tu configuración actual.</div>
          </div>
        ) : points.map((pt, idx) => (
          <div key={pt.id} className="stagger" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 18px', borderRadius: 13,
            background: idx === 0 ? 'rgba(20,255,114,0.04)' : 'var(--surface)',
            border: `1px solid ${idx === 0 ? 'rgba(20,255,114,0.18)' : 'rgba(255,255,255,0.07)'}`,
            animationDelay: `${idx * 0.05}s`,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${typeColor[pt.type] || '#14ff72'}12`, border: `1px solid ${typeColor[pt.type] || '#14ff72'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Save size={16} style={{ color: typeColor[pt.type] || '#14ff72' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{pt.description}</span>
                {idx === 0 && <span style={{ fontSize: 8, fontWeight: 800, color: '#14ff72', background: 'rgba(20,255,114,0.12)', border: '1px solid rgba(20,255,114,0.25)', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.1em' }}>MÁS RECIENTE</span>}
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={9} /> {timeAgo(pt.date)}</span>
                <span style={{ color: typeColor[pt.type] || '#14ff72', fontWeight: 700 }}>{pt.type}</span>
                {pt.size && <span>{pt.size}</span>}
              </div>
            </div>
            <button
              onClick={() => restore(pt)}
              disabled={restoring === pt.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 16px', borderRadius: 9, fontSize: 11, fontWeight: 700,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: restoring === pt.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                cursor: restoring === pt.id ? 'not-allowed' : 'pointer',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (restoring !== pt.id) { e.currentTarget.style.background = 'rgba(0,204,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,204,255,0.3)'; e.currentTarget.style.color = '#00ccff'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              {restoring === pt.id
                ? <><Loader2 size={12} style={{ animation: 'spin-slow 1s linear infinite' }} /> Restaurando...</>
                : <><RotateCcw size={12} /> Restaurar</>}
            </button>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="card" style={{ marginTop: 20, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <AlertTriangle size={14} style={{ color: '#ffd166', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd166', marginBottom: 4 }}>Importante antes de optimizar</div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
            Crea siempre un punto de restauración <strong style={{ color: 'rgba(255,255,255,0.6)' }}>antes</strong> de aplicar optimizaciones del sistema. 
            Si algo falla, puedes volver al estado actual en menos de 2 minutos.
            Los puntos de restauración de Windows ocupan poco espacio y se pueden borrar desde "Protección del sistema".
          </p>
        </div>
      </div>
    </div>
  );
}
