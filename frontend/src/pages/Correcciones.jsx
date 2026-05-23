import { useState } from "react";
import { Wand2, Wifi, Mic, Volume2, MonitorSmartphone, Bluetooth, CheckCircle2, Layers, Package, RefreshCw, ShieldCheck, Cpu, HardDrive, Gamepad2, Shield, Printer, Network } from "lucide-react";
import { toast } from "sonner";

const FIXES = [
  {
    id: "audio", icon: Volume2, title: "Reparar Audio",
    desc: "Reinicia los servicios AudioSrv y AudioEndpointBuilder. Resuelve: sin sonido, crackling, delay de audio.",
    color: "#00ccff", steps: ["Detener AudioSrv", "Detener AudioEndpointBuilder", "Iniciar servicios", "Verificar estado"],
    cmd: 'net stop AudioSrv /y && net stop AudioEndpointBuilder /y && net start AudioEndpointBuilder && net start AudioSrv',
  },
  {
    id: "mic", icon: Mic, title: "Reparar Micrófono",
    desc: "Restablece permisos del micrófono en el registro. Resuelve: mic no detectado, sin permisos de app.",
    color: "#14ff72", steps: ["Verificar permisos", "Limpiar registro", "Reiniciar servicio de audio", "Recargar permisos"],
    cmd: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone" /v Value /t REG_SZ /d Allow /f',
  },
  {
    id: "net", icon: Wifi, title: "Reparar Red / DNS",
    desc: "Flush DNS · Reset TCP/IP Stack · Reset Winsock · Renueva IP. Resuelve: sin internet, DNS incorrecto.",
    color: "#4e9eff", steps: ["Flush DNS", "Reset TCP/IP", "Reset Winsock", "Renovar IP"],
    cmd: 'ipconfig /flushdns && netsh int ip reset && netsh winsock reset && ipconfig /renew',
  },
  {
    id: "display", icon: MonitorSmartphone, title: "Reparar Pantalla",
    desc: "Reinicia Explorer.exe para refrescar el driver de pantalla. Resuelve: artefactos, resolución incorrecta.",
    color: "#d926ff", steps: ["Cerrar Explorer", "Limpiar caché de pantalla", "Reiniciar Explorer", "Verificar display"],
    cmd: 'taskkill /f /im explorer.exe && start explorer.exe',
  },
  {
    id: "bt", icon: Bluetooth, title: "Reparar Bluetooth",
    desc: "Detiene y reinicia el servicio bthserv. Resuelve: dispositivos que no conectan, Bluetooth no disponible.",
    color: "#74b9ff", steps: ["Detener bthserv", "Limpiar caché BT", "Reiniciar servicio", "Verificar dispositivos"],
    cmd: 'net stop bthserv && net start bthserv',
  },
  {
    id: "directx", icon: Layers, title: "Reparar DirectX",
    desc: "Verifica integridad de DirectX y diagnostica hardware gráfico. Resuelve: crashes en juegos, errores DX.",
    color: "#ffd166", steps: ["Iniciar diagnóstico", "Verificar DX11/DX12", "Comprobar DXGI", "Regenerar shaders"],
    cmd: 'dxdiag /t %TEMP%\\dxdiag_pine.txt',
  },
  {
    id: "windows_store", icon: Package, title: "Reparar Windows Store",
    desc: "Re-registra paquetes de la Store y limpia la caché. Resuelve: tienda no abre, apps sin instalar.",
    color: "#ff9f43", steps: ["Limpiar caché Store", "Re-registrar paquetes", "Reiniciar wsreset", "Verificar servicios"],
    cmd: 'wsreset.exe',
  },
  {
    id: "sfc", icon: Shield, title: "SFC / DISM Scan",
    desc: "Ejecuta sfc /scannow y DISM para reparar archivos del sistema corruptos. Requiere Admin.",
    color: "#14ff72", steps: ["Ejecutar DISM /online", "Restaurar salud", "Ejecutar SFC", "Verificar integridad"],
    cmd: 'DISM /Online /Cleanup-Image /RestoreHealth && sfc /scannow',
  },
  {
    id: "vcredist", icon: Package, title: "Reparar Visual C++",
    desc: "Detecta librerías Visual C++ Redistributable faltantes o corruptas. Resuelve: errores de DLL en juegos.",
    color: "#d926ff", steps: ["Detectar versiones", "Verificar DLLs", "Registrar librerías", "Validar runtime"],
    cmd: 'for %i in (vcruntime140.dll msvcp140.dll) do regsvr32 /s %SystemRoot%\\System32\\%i',
  },
  {
    id: "gamebar", icon: Gamepad2, title: "Deshabilitar Game Bar",
    desc: "Desactiva Xbox Game Bar y Game DVR que consumen CPU/RAM durante el gaming.",
    color: "#ff6b6b", steps: ["Deshabilitar Game DVR", "Desactivar Game Bar", "Limpiar overlay", "Reiniciar servicios"],
    cmd: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f && reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "disk", icon: HardDrive, title: "Reparar Disco / CHKDSK",
    desc: "Ejecuta chkdsk para detectar y corregir errores del sistema de archivos en el disco principal.",
    color: "#ff9f43", steps: ["Analizar disco", "Detectar errores", "Marcar sectores", "Programar corrección"],
    cmd: 'chkdsk C: /f /r /scan',
  },
  {
    id: "network-adapter", icon: Network, title: "Resetear Adaptador de Red",
    desc: "Resetea el adaptador de red y limpia la tabla ARP. Resuelve: latencia alta, drops de conexión en gaming.",
    color: "#26d0ce", steps: ["Deshabilitar adaptador", "Limpiar caché ARP", "Reiniciar adaptador", "Verificar conectividad"],
    cmd: 'netsh interface set interface name="Ethernet" admin=disable && timeout /t 2 && netsh interface set interface name="Ethernet" admin=enable && arp -d *',
  },
  {
    id: "general", icon: Wand2, title: "Reparación Total",
    desc: "Suite completa: SFC + DISM + audio + red + DNS + registro. Todo en un solo paso. Para problemas graves.",
    color: "#14ff72", steps: ["Reparar audio", "Reparar red + DNS", "SFC /scannow", "Limpiar registro"],
    cmd: 'sfc /scannow',
    featured: true,
  },
];

export default function Correcciones() {
  const [running, setRunning] = useState({});
  const [done, setDone]       = useState({});
  const [steps, setSteps]     = useState({});
  const isElectron = !!(window.electronAPI?.runFix);

  const runFix = async (fix) => {
    if (!isElectron) {
      toast.info("Esta función requiere la app de escritorio (.exe)");
      return;
    }
    setRunning(r => ({ ...r, [fix.id]: true }));
    setDone(d => ({ ...d, [fix.id]: false }));
    setSteps(s => ({ ...s, [fix.id]: 0 }));

    const stepDelay = 600;
    for (let i = 0; i < fix.steps.length; i++) {
      await new Promise(r => setTimeout(r, stepDelay));
      setSteps(s => ({ ...s, [fix.id]: i + 1 }));
    }

    try {
      await window.electronAPI.runFix(fix.id);
      setDone(d => ({ ...d, [fix.id]: true }));
      toast.success(`✅ ${fix.title} completado`);
    } catch (e) {
      toast.error(`Error: ${e?.message || 'desconocido'}`);
    } finally {
      setRunning(r => ({ ...r, [fix.id]: false }));
    }
  };

  const runAll = async () => {
    for (const fix of FIXES) {
      if (!done[fix.id]) await runFix(fix);
    }
    toast.success("Reparación completa finalizada");
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 32px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,rgba(20,255,114,0.2),rgba(20,255,114,0.06))', border: '1px solid rgba(20,255,114,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wand2 size={18} style={{ color: '#14ff72' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Correcciones</h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Repara componentes de Windows · {FIXES.length} módulos
            </p>
          </div>
        </div>
        <button onClick={runAll} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
          <ShieldCheck size={14} /> Reparar todo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {FIXES.map(fix => {
          const Icon    = fix.icon;
          const isRun   = running[fix.id];
          const isDone  = done[fix.id];
          const stepIdx = steps[fix.id] ?? 0;
          const color   = fix.color;

          return (
            <div key={fix.id} style={{
              borderRadius: 16, padding: '20px',
              background: isDone ? `rgba(20,255,114,0.04)` : fix.featured ? `linear-gradient(135deg, ${color}08, ${color}03)` : 'var(--surface)',
              border: `1px solid ${isDone ? 'rgba(20,255,114,0.25)' : isRun ? `${color}30` : fix.featured ? `${color}20` : 'rgba(255,255,255,0.07)'}`,
              position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.2s, background 0.2s',
              boxShadow: fix.featured ? `0 0 30px ${color}06` : 'none',
            }}>
              {fix.featured && (
                <div style={{ position: 'absolute', top: -6, right: 16 }}>
                  <div style={{ background: `linear-gradient(135deg, ${color}, #00d45e)`, color: '#000', fontSize: 8, fontWeight: 800, padding: '3px 10px', borderRadius: '0 0 8px 8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    COMPLETO
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isDone ? `0 0 12px ${color}25` : 'none' }}>
                  {isDone ? <CheckCircle2 size={18} style={{ color: '#14ff72' }} /> : <Icon size={18} style={{ color }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3 }}>{fix.title}</div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>{fix.desc}</p>
                </div>
              </div>

              {/* Steps progress */}
              {isRun && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {fix.steps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: i < stepIdx ? '#14ff72' : i === stepIdx ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: i < stepIdx ? '#14ff72' : i === stepIdx ? color : 'rgba(255,255,255,0.08)', border: i === stepIdx ? `1px solid ${color}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {i < stepIdx && <svg width="7" height="5" viewBox="0 0 7 5"><path d="M1 2.5L2.5 4L6 1" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>}
                          {i === stepIdx && <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, animation: 'blink 0.8s infinite' }} />}
                        </div>
                        <span>{step}</span>
                        {i === stepIdx && <RefreshCw size={9} style={{ animation: 'spin-slow 1s linear infinite', flexShrink: 0 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => runFix(fix)}
                disabled={isRun}
                style={{
                  width: '100%', padding: '10px', borderRadius: 9,
                  fontSize: 11, fontWeight: 800, cursor: isRun || isDone ? 'default' : 'pointer',
                  background: isDone ? 'rgba(20,255,114,0.12)' : isRun ? 'rgba(255,255,255,0.04)' : fix.featured ? `linear-gradient(135deg, ${color}, #00d45e)` : color,
                  color: isDone ? '#14ff72' : isRun ? 'rgba(255,255,255,0.4)' : fix.featured ? '#000' : '#fff',
                  border: isDone ? '1px solid rgba(20,255,114,0.3)' : isRun ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                {isDone ? <><CheckCircle2 size={13} /> Completado</> : isRun ? <><RefreshCw size={13} style={{ animation: 'spin-slow 1s linear infinite' }} /> Ejecutando...</> : <><Icon size={13} /> Ejecutar</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
