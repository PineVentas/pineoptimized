import { useState } from "react";
import { Zap, Battery, Gauge, Rocket, CheckCircle2, Info, Cpu, Monitor, Usb, Timer } from "lucide-react";
import { toast } from "sonner";

const LS_KEY = "pine_power_plan";

const PLANS = [
  {
    id: "balanced",
    name: "Equilibrado",
    desc: "Balance entre rendimiento y ahorro. Plan predeterminado de Windows.",
    icon: Battery,
    color: "#00ccff",
    guid: "381b4222-f694-41f0-9685-ff5bb260df2e",
    tag: "Default",
    fps: "Base",
    good_for: ["Uso diario", "Portátiles", "Ofimática"],
  },
  {
    id: "high",
    name: "Alto Rendimiento",
    desc: "Prioriza rendimiento sobre ahorro de energía. Recomendado para juegos.",
    icon: Gauge,
    color: "#ffd166",
    guid: "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
    tag: "Gaming",
    fps: "+5%",
    good_for: ["Gaming", "Streaming", "Edición de video"],
    recommended: true,
  },
  {
    id: "ultimate",
    name: "Máximo Rendimiento",
    desc: "Máxima potencia sin compromisos. Input lag mínimo. Solo escritorio.",
    icon: Rocket,
    color: "#14ff72",
    guid: "e9a42b02-d5df-448d-aa00-03f14749eb61",
    tag: "ULTRA",
    fps: "+12%",
    good_for: ["Competitivo", "Torneo", "PC escritorio"],
    pro: true,
  },
];

export default function PowerPlan() {
  const [active, setActive]  = useState(() => {
    try { return localStorage.getItem(LS_KEY) || "balanced"; } catch { return "balanced"; }
  });
  const [applying, setApply] = useState(false);

  const apply = async (plan) => {
    const isElectron = !!(window.electronAPI);
    if (!isElectron) {
      setActive(plan.id);
      try { localStorage.setItem(LS_KEY, plan.id); } catch {}
      toast.success(`Plan "${plan.name}" guardado — se aplicará con la versión .exe`);
      return;
    }
    setApply(true);
    try {
      const cmd = `powercfg /setactive ${plan.guid}`;
      await window.electronAPI.runFix("powercfg", cmd);
      setActive(plan.id);
      try { localStorage.setItem(LS_KEY, plan.id); } catch {}
      toast.success(`✅ Plan de energía: ${plan.name} activado`);
    } catch {
      toast.error("Error aplicando el plan. Ejecuta como Administrador.");
    }
    setApply(false);
  };

  const activePlan = PLANS.find(p => p.id === active);

  return (
    <div className="h-full overflow-y-auto page-enter" style={{ padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, rgba(255,209,102,0.2), rgba(255,209,102,0.06))', border: '1px solid rgba(255,209,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(255,209,102,0.1)' }}>
              <Zap size={16} style={{ color: '#ffd166' }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>Plan de Energía</h1>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
            Controla cómo Windows gestiona CPU y GPU para gaming
          </p>
        </div>
        {activePlan && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10,
            background: `${activePlan.color}12`, border: `1px solid ${activePlan.color}28`,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: activePlan.color, boxShadow: `0 0 8px ${activePlan.color}` }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: activePlan.color }}>{activePlan.name}</span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>ACTIVO</span>
          </div>
        )}
      </div>

      {/* Plans grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {PLANS.map(plan => {
          const Icon = plan.icon;
          const isActive = active === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => !applying && apply(plan)}
              style={{
                padding: '24px 22px', borderRadius: 16, cursor: applying ? 'not-allowed' : 'pointer',
                background: isActive ? `linear-gradient(135deg, ${plan.color}12, ${plan.color}05)` : 'rgba(11,15,26,0.9)',
                border: `1px solid ${isActive ? `${plan.color}35` : 'rgba(255,255,255,0.07)'}`,
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: isActive ? `0 0 32px ${plan.color}14, 0 8px 24px rgba(0,0,0,0.3)` : '0 2px 12px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={e => { if (!isActive && !applying) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)'; } }}
            >
              {/* Background glow */}
              {isActive && (
                <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, background: `radial-gradient(circle, ${plan.color}18, transparent 70%)`, pointerEvents: 'none' }} />
              )}

              {/* Recommended badge */}
              {plan.recommended && (
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: `${plan.color}20`, border: `1px solid ${plan.color}35`, color: plan.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  RECOMENDADO
                </div>
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icon + FPS badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${plan.color}22, ${plan.color}08)`, border: `1px solid ${plan.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? `0 0 20px ${plan.color}28` : 'none', transition: 'box-shadow 0.3s ease' }}>
                    <Icon size={22} style={{ color: plan.color }} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: plan.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.03em', filter: isActive ? `drop-shadow(0 0 8px ${plan.color}60)` : 'none' }}>{plan.fps}</div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>FPS boost</div>
                  </div>
                </div>

                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{plan.name}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 5, background: `${plan.color}18`, border: `1px solid ${plan.color}28`, color: plan.color, letterSpacing: '0.08em' }}>{plan.tag}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>{plan.desc}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
                  {plan.good_for.map(g => (
                    <span key={g} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{g}</span>
                  ))}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={13} style={{ color: plan.color }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: plan.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Plan activo</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra power tweaks */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
          Tweaks Avanzados de Energía
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            {
              icon: Usb, color: '#00ccff',
              title: 'USB Selective Suspend',
              desc: 'Desactiva la suspensión selectiva de USB para eliminar micro-stutters causados por mouse/teclado.',
              cmd: 'powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0',
              tag: '-Stutter',
              tagColor: '#14ff72',
            },
            {
              icon: Timer, color: '#ffd166',
              title: 'Timer Resolution 0.5ms',
              desc: 'Reduce el timer de Windows a 0.5ms para mayor precisión en FPS y menor input lag.',
              cmd: 'bcdedit /set useplatformtick yes',
              tag: '-InputLag',
              tagColor: '#ffd166',
            },
            {
              icon: Cpu, color: '#d926ff',
              title: 'CPU Min Freq 100%',
              desc: 'Fuerza CPU al 100% mínimo. Elimina el downclocking automático durante gaming.',
              cmd: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100',
              tag: '+Estabilidad',
              tagColor: '#d926ff',
            },
            {
              icon: Monitor, color: '#ff9f43',
              title: 'Display Power Saving OFF',
              desc: 'Desactiva el ahorro de energía del panel. Reduce color shifting y ghosting en monitores.',
              cmd: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_VIDEO VIDEOIDLE 0',
              tag: '-Ghosting',
              tagColor: '#ff9f43',
            },
          ].map((tweak) => {
            const Icon = tweak.icon;
            return (
              <div
                key={tweak.title}
                style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(10,14,25,0.95)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${tweak.color}10, transparent 65%)`, pointerEvents: 'none' }} />
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tweak.color}15`, border: `1px solid ${tweak.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color: tweak.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{tweak.title}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: `${tweak.tagColor}15`, border: `1px solid ${tweak.tagColor}28`, color: tweak.tagColor, letterSpacing: '0.08em' }}>{tweak.tag}</span>
                  </div>
                  <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.55, margin: '0 0 10px' }}>{tweak.desc}</p>
                  <button
                    onClick={async () => {
                      if (!window.electronAPI) {
                        toast.success(`Tweak "${tweak.title}" guardado — aplica con versión .exe`);
                        return;
                      }
                      try {
                        await window.electronAPI.runFix('powercfg', tweak.cmd);
                        toast.success(`✅ ${tweak.title} aplicado`);
                      } catch {
                        toast.error(`Error aplicando ${tweak.title}`);
                      }
                    }}
                    style={{
                      padding: '5px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700,
                      background: `${tweak.color}15`, border: `1px solid ${tweak.color}28`,
                      color: tweak.color, cursor: 'pointer',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${tweak.color}25`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${tweak.color}15`; }}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info box */}
      <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(0,204,255,0.05)', border: '1px solid rgba(0,204,255,0.14)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Info size={15} style={{ color: '#00ccff', flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#00ccff', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Consejo</div>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Para laptops, usa <strong style={{ color: '#fff' }}>Alto Rendimiento</strong> — el Máximo puede causar sobrecalentamiento. En PCs de escritorio, <strong style={{ color: '#14ff72' }}>Máximo Rendimiento</strong> elimina el throttling de CPU y reduce el input lag.
          </p>
        </div>
      </div>
    </div>
  );
}
