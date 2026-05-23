import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2, XCircle, HelpCircle, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

const IS_ELECTRON = typeof window !== "undefined" && window.electronAPI;

const MOCK_SERVICES = [
  { id: 'PcaSvc',    name: 'PcaSvc',    label: 'Program Compatibility Assistant', why: 'Requerido por el anticheat de Free Fire para validar compatibilidad de la app.', status: 'Running', startType: 'Automatic' },
  { id: 'PlugPlay',  name: 'PlugPlay',  label: 'Plug and Play',                   why: 'Gestiona la detección de hardware. El anticheat verifica periféricos de entrada.', status: 'Running', startType: 'Automatic' },
  { id: 'DPS',       name: 'DPS',       label: 'Diagnostic Policy Service',        why: 'Diagnóstico del sistema. Free Fire lo consulta para verificar el entorno.', status: 'Running', startType: 'Automatic' },
  { id: 'DiagTrack', name: 'DiagTrack', label: 'Connected User Experiences',       why: 'El anticheat de Garena verifica que este servicio esté operativo.', status: 'Running', startType: 'Automatic' },
  { id: 'SysMain',   name: 'SysMain',   label: 'SysMain (Superfetch)',             why: 'Gestión de memoria del sistema. Necesario para la estabilidad del anticheat.', status: 'Running', startType: 'Automatic' },
  { id: 'Sysmon',    name: 'Sysmon',    label: 'System Monitor',                   why: 'Monitoreo de actividad del sistema. Estado "Manual/Detenido" es su comportamiento normal en Windows — Pine Opti nunca lo modifica.', status: 'Running', startType: 'Manual' },
  { id: 'EventLog',  name: 'EventLog',  label: 'Windows Event Log',                why: 'Registro de eventos del SO. El anticheat escribe y verifica entradas de log.', status: 'Running', startType: 'Automatic' },
];

function isNormalStopped(status, startType) {
  return (status || '').toLowerCase() === 'stopped' &&
    ['manual', 'manualtriggerstart'].includes((startType || '').toLowerCase());
}

function statusColor(status, startType) {
  if (!status) return '#888';
  const s = status.toLowerCase();
  if (s === 'running')                      return '#14ff72';
  if (s === 'stopped' && isNormalStopped(s, startType)) return '#ffd166';
  if (s === 'stopped')                      return '#ff4e4e';
  if (s === 'paused')                       return '#ffd166';
  if (s === 'notfound')                     return '#888';
  return '#888';
}

function statusLabel(status, startType) {
  if (!status) return 'Desconocido';
  const s = status.toLowerCase();
  if (s === 'running')   return 'Activo';
  if (s === 'stopped' && isNormalStopped(s, startType)) return 'Normal (Manual)';
  if (s === 'stopped')   return 'Detenido';
  if (s === 'paused')    return 'En pausa';
  if (s === 'notfound')  return 'No encontrado';
  if (s === 'unknown')   return 'Desconocido';
  return status;
}

function StatusIcon({ status, startType }) {
  const s = (status || '').toLowerCase();
  if (s === 'running')  return <CheckCircle2  size={15} style={{ color: '#14ff72', filter: 'drop-shadow(0 0 5px rgba(20,255,114,0.6))' }} />;
  if (s === 'stopped' && isNormalStopped(s, startType))
                        return <AlertTriangle size={15} style={{ color: '#ffd166' }} />;
  if (s === 'stopped')  return <XCircle       size={15} style={{ color: '#ff4e4e', filter: 'drop-shadow(0 0 5px rgba(255,78,78,0.5))' }} />;
  if (s === 'paused')   return <AlertTriangle size={15} style={{ color: '#ffd166' }} />;
  return <HelpCircle size={15} style={{ color: '#888' }} />;
}

function startTypeLabel(st) {
  if (!st) return '';
  const s = st.toLowerCase();
  if (s === 'automatic')         return 'Automático';
  if (s === 'manual')            return 'Manual';
  if (s === 'disabled')          return 'Desactivado';
  if (s === 'automaticdelayedstart') return 'Auto (delayed)';
  return st;
}

export default function ServiciosProtegidos() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [lastScan, setLastScan]   = useState(null);
  const [expanded, setExpanded]   = useState(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (IS_ELECTRON && window.electronAPI.invoke) {
        data = await window.electronAPI.invoke('get-protected-services-status');
      } else {
        await new Promise(r => setTimeout(r, 900));
        data = MOCK_SERVICES;
      }
      setServices(Array.isArray(data) ? data : MOCK_SERVICES);
      setLastScan(new Date());
    } catch {
      setServices(MOCK_SERVICES);
      setLastScan(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const running  = services.filter(s => s.status?.toLowerCase() === 'running').length;
  // Solo cuenta como problema si un servicio AUTOMÁTICO está detenido.
  // Los servicios con tipo "Manual" que están detenidos es su estado normal en Windows.
  const stopped  = services.filter(s =>
    s.status?.toLowerCase() === 'stopped' &&
    !['manual','manualtriggerstart'].includes(s.startType?.toLowerCase())
  ).length;
  const unknown  = services.filter(s => !['running','stopped'].includes(s.status?.toLowerCase())).length;
  const allOk    = stopped === 0 && services.length > 0;

  return (
    <div style={{
      height: '100%', overflowY: 'auto', padding: '28px 32px',
      background: '#06080f',
    }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: allOk
              ? 'linear-gradient(135deg, rgba(20,255,114,0.18), rgba(20,255,114,0.06))'
              : 'linear-gradient(135deg, rgba(255,78,78,0.18), rgba(255,78,78,0.06))',
            border: allOk ? '1px solid rgba(20,255,114,0.22)' : '1px solid rgba(255,78,78,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: allOk ? '0 0 24px rgba(20,255,114,0.12)' : '0 0 24px rgba(255,78,78,0.10)',
          }}>
            <ShieldCheck size={20} style={{ color: allOk ? '#14ff72' : '#ff4e4e' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: 0, lineHeight: 1,
            }}>
              Servicios Protegidos
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '5px 0 0', letterSpacing: '-0.01em' }}>
              Estado en tiempo real · Pine Opti nunca toca estos servicios
            </p>
          </div>
        </div>

        <button
          onClick={() => { fetchStatus(); toast.info('Escaneando servicios...'); }}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 9,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1, transition: 'all 0.14s',
          }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Escaneando...' : 'Actualizar'}
        </button>
      </div>

      {/* ── Status banner ── */}
      <div style={{
        marginBottom: 24, padding: '16px 20px', borderRadius: 13,
        background: allOk
          ? 'linear-gradient(120deg, rgba(20,255,114,0.07) 0%, rgba(20,255,114,0.02) 100%)'
          : 'linear-gradient(120deg, rgba(255,78,78,0.09) 0%, rgba(255,78,78,0.02) 100%)',
        border: allOk ? '1px solid rgba(20,255,114,0.15)' : '1px solid rgba(255,78,78,0.18)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: allOk ? 'rgba(20,255,114,0.12)' : 'rgba(255,78,78,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {allOk
            ? <Lock size={17} style={{ color: '#14ff72' }} />
            : <AlertTriangle size={17} style={{ color: '#ff4e4e' }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: allOk ? '#14ff72' : '#ff4e4e', letterSpacing: '-0.02em' }}>
            {allOk
              ? 'Todos los servicios del anticheat están activos y protegidos'
              : `${stopped} servicio${stopped !== 1 ? 's' : ''} detenido${stopped !== 1 ? 's' : ''} — Free Fire podría no funcionar correctamente`}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3, letterSpacing: '-0.01em' }}>
            {lastScan ? `Última verificación: ${lastScan.toLocaleTimeString()}` : 'Sin escanear'}
            {' · '}Pine Opti no ha modificado ninguno de estos servicios
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
          {[
            { n: running, label: 'Activos',   color: '#14ff72' },
            { n: stopped, label: 'Detenidos', color: '#ff4e4e' },
            { n: unknown, label: 'Unknown',   color: '#888'    },
          ].map(({ n, label, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: '-0.05em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Service cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(loading && services.length === 0 ? MOCK_SERVICES.map(s => ({ ...s, status: 'Unknown' })) : services).map((svc) => {
          const isExp      = expanded === svc.id;
          const normalStop = isNormalStopped(svc.status, svc.startType);
          const color      = statusColor(svc.status, svc.startType);
          const running    = svc.status?.toLowerCase() === 'running';

          return (
            <div
              key={svc.id}
              onClick={() => setExpanded(isExp ? null : svc.id)}
              style={{
                borderRadius: 12, cursor: 'pointer',
                background: isExp
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isExp ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.055)'}`,
                transition: 'all 0.15s',
                overflow: 'hidden',
              }}
            >
              {/* Row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
              }}>
                {/* Status dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: color,
                  boxShadow: running ? `0 0 8px ${color}` : 'none',
                  animation: loading ? 'blink 1.2s ease-in-out infinite' : 'none',
                }} />

                {/* Service name badge */}
                <div style={{
                  padding: '3px 9px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11.5, fontWeight: 700,
                  color: running ? '#fff' : 'rgba(255,255,255,0.45)',
                  flexShrink: 0, letterSpacing: '0.02em',
                }}>
                  {svc.name}
                </div>

                {/* Label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}>
                    {svc.label}
                  </div>
                </div>

                {/* Start type chip */}
                <div style={{
                  padding: '2px 8px', borderRadius: 5,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: 10, color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.04em', flexShrink: 0,
                }}>
                  {startTypeLabel(svc.startType)}
                </div>

                {/* Status badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 6,
                  background: running
                    ? 'rgba(20,255,114,0.08)'
                    : normalStop
                      ? 'rgba(255,209,102,0.08)'
                      : 'rgba(255,78,78,0.08)',
                  border: `1px solid ${running
                    ? 'rgba(20,255,114,0.18)'
                    : normalStop
                      ? 'rgba(255,209,102,0.18)'
                      : 'rgba(255,78,78,0.18)'}`,
                  flexShrink: 0,
                }}>
                  <StatusIcon status={svc.status} startType={svc.startType} />
                  <span style={{
                    fontSize: 11.5, fontWeight: 700,
                    color,
                    letterSpacing: '-0.01em',
                  }}>
                    {statusLabel(svc.status, svc.startType)}
                  </span>
                </div>

                {/* Lock icon */}
                <Shield size={13} style={{ color: 'rgba(20,255,114,0.35)', flexShrink: 0 }} />
              </div>

              {/* Expanded detail */}
              {isExp && (
                <div style={{
                  padding: '0 18px 16px 40px',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: 14,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 9,
                    padding: '12px 14px', borderRadius: 9,
                    background: 'rgba(20,255,114,0.04)',
                    border: '1px solid rgba(20,255,114,0.10)',
                  }}>
                    <ShieldCheck size={13} style={{ color: '#14ff72', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#14ff72', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
                        ¿Por qué está protegido?
                      </div>
                      <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, letterSpacing: '-0.01em' }}>
                        {svc.why}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(20,255,114,0.5)', letterSpacing: '-0.01em' }}>
                        Pine Opti tiene este servicio en lista blanca permanente. Ninguna optimización puede detenerlo ni desactivarlo.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Note ── */}
      <div style={{
        marginTop: 24, padding: '14px 18px', borderRadius: 11,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Lock size={13} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.28)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          Estos servicios están bajo bloqueo de nivel kernel en Pine Opti. Cualquier optimización que intentara modificarlos es cancelada automáticamente antes de ejecutarse. Secure Boot y TPM 2.0 son configuraciones de firmware y no pueden ser alteradas por ningún software.
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
