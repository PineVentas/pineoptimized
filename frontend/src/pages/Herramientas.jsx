import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, Trash2, Target, Zap, Wifi, Globe,
  Monitor, BarChart3, ArrowUpRight, Star, Wrench,
  Skull, Network, ShieldCheck, Gauge, Cpu, Flame,
  Wand2, Sparkles, Calculator, Activity, HardDrive, Gamepad2
} from "lucide-react";

const TOOL_GROUPS = [
  {
    label: "Sistema",
    tools: [
      {
        id: "pine-store", route: "/pine-store",
        name: "Pine Store", tagline: "Apps Store",
        desc: "Instala apps sin Microsoft Store. winget + Chocolatey + descarga directa.",
        icon: ShoppingBag, color: "#14ff72", featured: true,
      },
      {
        id: "limpieza", route: "/limpieza",
        name: "Limpieza del Sistema", tagline: "Libera ~500MB",
        desc: "Elimina archivos temporales, caché, Prefetch, WU cache y papelera.",
        icon: Trash2, color: "#ff6b6b",
      },
      {
        id: "power-plan", route: "/power-plan",
        name: "Plan de Energía", tagline: "+FPS · Bajo latencia",
        desc: "Activa Alto Rendimiento o Máximo Rendimiento. Elimina throttling de CPU.",
        icon: Zap, color: "#ffd166",
      },
      {
        id: "procesos", route: "/procesos",
        name: "Process Killer", tagline: "Libera RAM",
        desc: "Cierra procesos en background y libera RAM antes de jugar. Anti-cheats protegidos.",
        icon: Skull, color: "#d926ff",
      },
      {
        id: "servicios-protegidos", route: "/servicios-protegidos",
        name: "Servicios Protegidos", tagline: "Anticheat · Free Fire",
        desc: "Monitorea en tiempo real los servicios requeridos por el anticheat de Free Fire.",
        icon: ShieldCheck, color: "#14ff72", badge: "AC",
      },
      {
        id: "correcciones", route: "/correcciones",
        name: "Reparaciones", tagline: "Fix todo",
        desc: "Repara audio, red, pantalla, DirectX, Bluetooth y Windows Store en un clic.",
        icon: Wand2, color: "#00ccff",
      },
    ]
  },
  {
    label: "Gaming & Red",
    tools: [
      {
        id: "dns", route: "/dns",
        name: "DNS Optimizer", tagline: "-30ms Ping",
        desc: "Benchmarks de Cloudflare, Google y Quad9 en tiempo real. Aplica el más rápido.",
        icon: Network, color: "#00ccff",
      },
      {
        id: "latencia", route: "/latencia",
        name: "Latency Test", tagline: "Ping Gaming",
        desc: "Mide latencia real a servidores de Riot, Valve, Garena y CDNs globales.",
        icon: Activity, color: "#26d0ce",
      },
      {
        id: "bottleneck", route: "/bottleneck",
        name: "Bottleneck Calc", tagline: "CPU vs GPU",
        desc: "Calcula el cuello de botella entre tu CPU y GPU para gaming.",
        icon: Calculator, color: "#ff9f43",
      },
      {
        id: "juegos", route: "/juegos",
        name: "Perfiles de Juego", tagline: "Free Fire · CS2 · Val",
        desc: "Tweaks específicos por juego. Protección total de anti-cheats.",
        icon: Gamepad2, color: "#ff6b6b", badge: "HOT",
      },
      {
        id: "fix-ai", route: "/fix-ai",
        name: "Fix AI", tagline: "IA Offline",
        desc: "Asistente de IA completamente offline. Responde sobre FPS, ping, hardware y tweaks.",
        icon: Sparkles, color: "#d926ff", badge: "AI",
      },
      {
        id: "sensibilidad", route: "/sensibilidad",
        name: "Sens Converter", tagline: "Aim perfecto",
        desc: "Convierte tu sens entre Valorant, CS2, Free Fire, Apex y 10+ juegos.",
        icon: Target, color: "#ff6b6b", badge: "GAMER",
      },
    ]
  },
  {
    label: "Herramientas Web",
    tools: [
      {
        id: "internet-speed", external: "https://fast.com",
        name: "Test de Internet", tagline: "Velocidad real",
        desc: "Mide tu descarga, subida y latencia con Fast.com de Netflix.",
        icon: Wifi, color: "#00ccff",
      },
      {
        id: "ping-test", external: "https://www.meter.net/ping-test/",
        name: "Test de Ping", tagline: "Latencia real",
        desc: "Mide el ping a servidores de juego desde tu ubicación actual.",
        icon: BarChart3, color: "#26d0ce",
      },
      {
        id: "gpu-benchmark", external: "https://benchmark.unigine.com/superposition",
        name: "GPU Benchmark", tagline: "Superposition",
        desc: "Prueba el rendimiento real de tu GPU con Unigine Superposition.",
        icon: Monitor, color: "#ff9f43",
      },
      {
        id: "cpu-benchmark", external: "https://www.cpubenchmark.net/",
        name: "CPU Benchmark", tagline: "Passmark",
        desc: "Compara el rendimiento de tu CPU con millones de resultados reales.",
        icon: Cpu, color: "#ffd166",
      },
      {
        id: "gpu-temp", external: "https://www.techpowerup.com/gpuz/",
        name: "GPU-Z",
        tagline: "Info GPU",
        desc: "Descarga GPU-Z para ver temperatura, uso y especificaciones en tiempo real.",
        icon: Flame, color: "#ff4e4e",
      },
      {
        id: "whatismyip", external: "https://whatismyipaddress.com",
        name: "Mi IP / Red", tagline: "Info de conexión",
        desc: "Ve tu IP, ISP, país y detalles de tu conexión a internet.",
        icon: Globe, color: "#4e9eff",
      },
      {
        id: "userbenchmark", external: "https://www.userbenchmark.com/",
        name: "UserBenchmark", tagline: "Ranking de PC",
        desc: "Benchmarks tu CPU, GPU y SSD y compara con millones de PCs reales.",
        icon: BarChart3, color: "#a29bfe",
      },
      {
        id: "speedtest", external: "https://www.speedtest.net/",
        name: "Speedtest by Ookla", tagline: "Ping + Jitter",
        desc: "El test de internet más usado del mundo. Mide ping, jitter y velocidad.",
        icon: Wifi, color: "#14ff72",
      },
    ]
  },
  {
    label: "Análisis & Hardware",
    tools: [
      {
        id: "capframex", route: "/pine-store",
        name: "CapFrameX", tagline: "Frametimes reales",
        desc: "Captura 1% low, 0.1% low y frametimes reales. La mejor herramienta para análisis de FPS.",
        icon: Activity, color: "#14ff72", badge: "PRO",
      },
      {
        id: "hwinfo64", route: "/pine-store",
        name: "HWiNFO64", tagline: "Sensor completo",
        desc: "Todo sobre tu PC: temperaturas, voltajes, clocks y más de 500 sensores en tiempo real.",
        icon: Cpu, color: "#FF8C00",
      },
      {
        id: "openrgb-tool", route: "/pine-store",
        name: "OpenRGB", tagline: "RGB unificado",
        desc: "Controla toda la iluminación RGB de tu PC desde una sola app. Compatible con 500+ dispositivos.",
        icon: Flame, color: "#FF2D78",
      },
      {
        id: "fancontrol-tool", route: "/pine-store",
        name: "Fan Control", tagline: "Temperatura/Ruido",
        desc: "Crea curvas de ventiladores personalizadas. Reduce el ruido sin sacrificar temperatura.",
        icon: Gauge, color: "#00ccff",
      },
      {
        id: "throttlestop-tool", route: "/pine-store",
        name: "ThrottleStop", tagline: "Undervolting CPU",
        desc: "Undervolting para CPUs Intel. Menos calor, mismos FPS, mejor sostenimiento de boost.",
        icon: Cpu, color: "#ffd166", badge: "ADV",
      },
      {
        id: "crystaldiskmark", external: "https://crystalmark.info/en/software/crystaldiskmark/",
        name: "CrystalDiskMark", tagline: "SSD Benchmark",
        desc: "Benchmark oficial para medir la velocidad real de tu SSD o HDD — lectura/escritura.",
        icon: HardDrive, color: "#8B5CF6",
      },
    ]
  },
  {
    label: "Streaming & Contenido",
    tools: [
      {
        id: "streamlabs-tool", route: "/pine-store",
        name: "Streamlabs Desktop", tagline: "Stream fácil",
        desc: "OBS + alertas + widgets en un solo click. Ideal para empezar a streamear en Twitch/YouTube.",
        icon: Monitor, color: "#80F5D2", featured: true,
      },
      {
        id: "voicemod-tool", route: "/pine-store",
        name: "Voicemod", tagline: "Voz en tiempo real",
        desc: "Cambia tu voz en tiempo real durante streams y gaming. Cientos de efectos.",
        icon: Activity, color: "#00C8FF",
      },
      {
        id: "nvidia-broadcast-tool", route: "/pine-store",
        name: "NVIDIA Broadcast", tagline: "IA de audio/vídeo",
        desc: "Elimina ruido de fondo con IA, virtual camera y supresión de eco. Solo GPUs NVIDIA.",
        icon: Flame, color: "#76B900", badge: "IA",
      },
      {
        id: "vb-cable-tool", route: "/pine-store",
        name: "VB-Audio Cable", tagline: "Audio virtual",
        desc: "Cable de audio virtual gratuito para enrutar audio entre apps. Esencial para streams.",
        icon: Network, color: "#FF8C00",
      },
    ]
  },
];

const ALL_TOOLS = TOOL_GROUPS.flatMap(g => g.tools);

export default function Herramientas() {
  const nav = useNavigate();

  const handleClick = (t) => {
    if (t.external) { window.open(t.external, "_blank", "noopener,noreferrer"); return; }
    if (t.route) nav(t.route);
  };

  const totalInternal = ALL_TOOLS.filter(t => t.route).length;
  const totalExternal = ALL_TOOLS.filter(t => t.external).length;

  const ToolCard = ({ t }) => {
    const Icon  = t.icon;
    const color = t.color;
    return (
      <button
        key={t.id}
        data-testid={`tool-${t.id}`}
        onClick={() => handleClick(t)}
        style={{
          position: 'relative',
          background: t.featured ? `linear-gradient(135deg, ${color}0D, ${color}04)` : 'rgba(10,14,25,0.95)',
          border: `1px solid ${t.featured ? `${color}28` : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 13, padding: '18px',
          textAlign: 'left', cursor: 'pointer',
          transition: 'transform 0.2s var(--easing-spring), box-shadow 0.2s ease, border-color 0.15s ease',
          overflow: 'hidden', width: '100%', outline: 'none',
          boxShadow: t.featured ? `0 0 24px ${color}06` : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.015)';
          e.currentTarget.style.boxShadow = `0 14px 36px rgba(0,0,0,0.45), 0 0 0 1px ${color}28`;
          e.currentTarget.style.borderColor = `${color}40`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = t.featured ? `0 0 24px ${color}06` : 'none';
          e.currentTarget.style.borderColor = t.featured ? `${color}28` : 'rgba(255,255,255,0.07)';
        }}
      >
        <div style={{ position: 'absolute', top: -24, right: -24, width: 130, height: 130, background: `radial-gradient(circle, ${color}16, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 13, right: 13, display: 'flex', gap: 5 }}>
          {t.featured && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(20,255,114,0.12)', border: '1px solid rgba(20,255,114,0.25)', borderRadius: 5, padding: '2px 7px' }}>
              <Star size={7} style={{ color: '#14ff72', fill: '#14ff72' }} />
              <span style={{ fontSize: 8, fontWeight: 800, color: '#14ff72', letterSpacing: '0.1em' }}>TOP</span>
            </div>
          )}
          {t.badge && (
            <div style={{ background: `${color}15`, border: `1px solid ${color}28`, borderRadius: 5, padding: '2px 7px' }}>
              <span style={{ fontSize: 8, fontWeight: 800, color, letterSpacing: '0.1em' }}>{t.badge}</span>
            </div>
          )}
          {t.external && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '2px 7px' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>WEB</span>
            </div>
          )}
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `linear-gradient(135deg, ${color}18, ${color}08)`,
          border: `1px solid ${color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14, boxShadow: `0 4px 14px ${color}14`,
        }}>
          <Icon size={19} style={{ color }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9.5, fontWeight: 800, color: `${color}CC`, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            {t.tagline}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 7 }}>
            {t.name}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.55, margin: 0 }}>
            {t.desc}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `${color}12`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpRight size={12} style={{ color }} />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px 28px' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, rgba(20,255,114,0.2), rgba(20,255,114,0.06))', border: '1px solid rgba(20,255,114,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(20,255,114,0.1)' }}>
            <Wrench size={16} style={{ color: '#14ff72' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Herramientas</h1>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Suite completa · {ALL_TOOLS.length} herramientas para gamers
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: "Total", value: ALL_TOOLS.length },
            { label: "Integradas", value: totalInternal },
            { label: "Web", value: totalExternal },
          ].map(s => (
            <div key={s.label} style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#14ff72', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped sections */}
      {TOOL_GROUPS.map(group => (
        <div key={group.label} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {group.label}
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', fontWeight: 600 }}>{group.tools.length} tools</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {group.tools.map(t => <ToolCard key={t.id} t={t} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
