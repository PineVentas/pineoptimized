import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ShieldCheck, Check, Zap, Loader2, Gamepad2, Target, Search, Lock, Star, X } from "lucide-react";
import { GAMES } from "../lib/gamesData";

function GameCard({ g, isApplied, isApplying, onApply, onSelect, isSelected }) {
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const showBanner = g.banner && !bannerError;
  const showLogo   = g.logo && !logoError;

  return (
    <div
      onClick={() => onSelect(g)}
      style={{
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        background: 'var(--surface)',
        border: `1px solid ${isSelected ? `${g.color}55` : 'rgba(255,255,255,0.07)'}`,
        boxShadow: isSelected ? `0 0 28px ${g.color}20` : 'none',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = `${g.color}30`;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* ── Banner ── */}
      <div style={{
        height: 110, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        background: showBanner
          ? `linear-gradient(135deg, ${g.color}40, ${g.color}10)`
          : `linear-gradient(135deg, ${g.color}30, ${g.color}08)`,
      }}>
        {/* Background image */}
        {showBanner && (
          <img
            src={g.banner}
            alt=""
            onError={() => setBannerError(true)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: 0.45,
            }}
          />
        )}

        {/* Color overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: showBanner
            ? `linear-gradient(180deg, ${g.color}08 0%, rgba(0,0,0,0.65) 100%)`
            : `radial-gradient(circle at 35% 50%, ${g.color}35, transparent 70%)`,
        }} />

        {/* Logo / Icon */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
          {showLogo ? (
            <img
              src={g.logo}
              alt={g.name}
              onError={() => setLogoError(true)}
              style={{
                maxHeight: 52, maxWidth: '70%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.8)) drop-shadow(0 0 24px rgba(0,0,0,0.5))',
              }}
            />
          ) : (
            <span style={{ fontSize: 42, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))' }}>{g.icon}</span>
          )}
        </div>

        {/* Applied badge */}
        {isApplied && (
          <div style={{
            position: 'absolute', top: 8, left: 8, zIndex: 3,
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 99,
            background: 'rgba(20,255,114,0.85)',
            fontSize: 8, fontWeight: 800, color: '#000', letterSpacing: '0.08em',
          }}>
            <Check size={8} /> ACTIVO
          </div>
        )}

        {/* FPS badge */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8, zIndex: 3,
          fontSize: 9, fontWeight: 800, color: g.color,
          letterSpacing: '0.06em',
          background: `rgba(0,0,0,0.7)`,
          backdropFilter: 'blur(4px)',
          padding: '3px 8px', borderRadius: 99,
          border: `1px solid ${g.color}40`,
        }}>
          {g.expectedFpsGain}
        </div>

        {/* Genre badge */}
        <div style={{
          position: 'absolute', bottom: 8, left: 8, zIndex: 3,
          fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          padding: '3px 7px', borderRadius: 99,
          border: '1px solid rgba(255,255,255,0.1)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {g.genre}
        </div>
      </div>

      {/* ── Info ── */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2, lineHeight: 1.2 }}>
              {g.name}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {g.engine}
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onApply(g); }}
            disabled={isApplying}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 11px', borderRadius: 8,
              fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: isApplying ? 'not-allowed' : 'pointer',
              background: isApplied ? 'rgba(20,255,114,0.12)' : `${g.color}20`,
              border: `1px solid ${isApplied ? 'rgba(20,255,114,0.35)' : `${g.color}40`}`,
              color: isApplied ? '#14ff72' : g.color,
              transition: 'all 0.12s',
            }}
          >
            {isApplying
              ? <Loader2 size={9} style={{ animation: 'spin-slow 1s linear infinite' }} />
              : isApplied
                ? <><Check size={9} /> OK</>
                : <><Zap size={9} /> Aplicar</>
            }
          </button>
        </div>

        {/* Anti-cheats */}
        {g.anticheat?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {g.anticheat.map(ac => (
              <span key={ac} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 7px', borderRadius: 5,
                background: 'rgba(217,38,255,0.08)',
                border: '1px solid rgba(217,38,255,0.2)',
                fontSize: 8, fontWeight: 700, color: '#d926ff',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                <ShieldCheck size={7} /> {ac}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const LS_APPLIED_KEY  = "pine_applied_games";
const LS_SELECTED_KEY = "pine_selected_game";

const GENRE_FILTERS = ["Todos", "Battle Royale", "FPS Táctico", "FPS Competitivo", "MOBA", "Open World", "Sandbox", "Survival", "Hero Shooter", "Metaverso / Juegos", "Survival / RPG"];

export default function GameProfiles() {
  const [selected, setSelected] = useState(() => {
    try {
      const id = localStorage.getItem(LS_SELECTED_KEY);
      return GAMES.find(g => g.id === id) || GAMES[0];
    } catch { return GAMES[0]; }
  });
  const [applying, setApplying]     = useState(null);
  const [appliedGames, setAppliedGames] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_APPLIED_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  const [search, setSearch]   = useState("");
  const [genre, setGenre]     = useState("Todos");
  const [detailLogo, setDetailLogo] = useState(false);
  const isElectron = !!(window.electronAPI?.applyGameProfile);

  const filtered = useMemo(() => GAMES.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                        g.engine.toLowerCase().includes(search.toLowerCase());
    const matchGenre  = genre === "Todos" || g.genre === genre;
    return matchSearch && matchGenre;
  }), [search, genre]);

  const applyProfile = async (g) => {
    setApplying(g.id);
    try {
      if (isElectron) {
        const r = await window.electronAPI.applyGameProfile(g.id);
        if (r.ok) {
          setAppliedGames(prev => {
            const next = new Set([...prev, g.id]);
            try { localStorage.setItem(LS_APPLIED_KEY, JSON.stringify([...next])); } catch {}
            return next;
          });
          toast.success(`✅ ${g.name} — ${g.tweaks.length} tweaks aplicados · Anti-cheats blindados`);
        } else {
          toast.error("Error aplicando perfil. Ejecuta como administrador.");
        }
      } else {
        await new Promise(r => setTimeout(r, 800));
        setAppliedGames(prev => {
          const next = new Set([...prev, g.id]);
          try { localStorage.setItem(LS_APPLIED_KEY, JSON.stringify([...next])); } catch {}
          return next;
        });
        toast.success(`✅ ${g.name} — Perfil cargado · ${g.expectedFpsGain} estimado`);
        toast.info("Para tweaks de registry, usa Pine Opti.exe como Administrador");
      }
    } catch {
      toast.error("Error al aplicar perfil");
    }
    setApplying(null);
  };

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }} className="page-enter">

      {/* ── Game grid ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 26px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,rgba(20,255,114,0.2),rgba(20,255,114,0.06))', border: '1px solid rgba(20,255,114,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gamepad2 size={18} style={{ color: '#14ff72' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>Perfiles de Juego</h1>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {GAMES.length} juegos · tweaks específicos por título · anti-cheats protegidos
              </p>
            </div>
          </div>
          <div style={{
            padding: '7px 14px', borderRadius: 8,
            background: isElectron ? 'rgba(20,255,114,0.08)' : 'rgba(255,166,0,0.08)',
            border: `1px solid ${isElectron ? 'rgba(20,255,114,0.2)' : 'rgba(255,166,0,0.2)'}`,
            fontSize: 10, fontWeight: 700,
            color: isElectron ? '#14ff72' : '#ffa600',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {isElectron ? <><Check size={11} /> Modo real</> : <><Zap size={11} /> Requiere .exe para registry</>}
          </div>
        </div>

        {/* Search + Genre filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar juego o engine..."
              style={{ width: '100%', paddingLeft: 34, paddingRight: search ? 34 : 12, height: 36, fontSize: 12, borderRadius: 9 }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2 }}>
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {["Todos", "Battle Royale", "FPS Táctico", "MOBA", "Survival", "Open World", "Sandbox"].map(g => (
              <button key={g} onClick={() => setGenre(g)} style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                background: genre === g ? 'rgba(20,255,114,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${genre === g ? 'rgba(20,255,114,0.35)' : 'rgba(255,255,255,0.08)'}`,
                color: genre === g ? '#14ff72' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.12s', letterSpacing: '0.04em',
              }}>{g}</button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
            {filtered.length} / {GAMES.length} juegos
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.2)' }}>
            <Gamepad2 size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <div style={{ fontSize: 13, fontWeight: 700 }}>Sin resultados para "{search}"</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="stagger">
            {filtered.map(g => (
              <GameCard
                key={g.id} g={g}
                isApplied={appliedGames.has(g.id)}
                isApplying={applying === g.id}
                isSelected={selected?.id === g.id}
                onApply={applyProfile}
                onSelect={(g) => {
                  setSelected(g);
                  setDetailLogo(false);
                  try { localStorage.setItem(LS_SELECTED_KEY, g.id); } catch {}
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail panel ── */}
      {selected && (
        <aside style={{
          width: 300, borderLeft: '1px solid rgba(255,255,255,0.055)',
          overflowY: 'auto', flexShrink: 0,
          padding: '20px 18px',
          background: 'rgba(5,7,10,0.5)',
        }}>

          {/* Banner */}
          <div style={{
            borderRadius: 14, height: 130, overflow: 'hidden', marginBottom: 16,
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: selected.banner
              ? `linear-gradient(135deg, ${selected.color}30, ${selected.color}08)`
              : `linear-gradient(135deg, ${selected.color}25, ${selected.color}06)`,
          }}>
            {selected.banner && !detailLogo && (
              <img
                src={selected.banner}
                alt=""
                onError={() => setDetailLogo(true)}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center', opacity: 0.5,
                }}
              />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: selected.banner
                ? `linear-gradient(180deg, ${selected.color}10 0%, rgba(0,0,0,0.7) 100%)`
                : `radial-gradient(circle at 40% 60%, ${selected.color}30, transparent 70%)`,
            }} />
            {selected.logo ? (
              <img
                src={selected.logo}
                alt={selected.name}
                style={{
                  maxHeight: 60, maxWidth: '75%', objectFit: 'contain',
                  position: 'relative', zIndex: 1,
                  filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.9))',
                }}
                onError={() => {}}
              />
            ) : (
              <span style={{ fontSize: 52, position: 'relative', zIndex: 1 }}>{selected.icon}</span>
            )}
            {/* Genre label */}
            <div style={{
              position: 'absolute', bottom: 8, left: 10, zIndex: 2,
              fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
              padding: '3px 8px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)',
            }}>{selected.genre}</div>
          </div>

          {/* Name + engine */}
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1, marginBottom: 4 }}>
              {selected.name}
            </h2>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              {selected.engine}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{selected.description}</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { icon: Target, label: "FPS Target", value: selected.fps_target, color: selected.color },
              { icon: Zap,    label: "Ganancia est.", value: selected.expectedFpsGain, color: '#14ff72' },
            ].map(({ icon: Ic, label, value, color }) => (
              <div key={label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                <Ic size={12} style={{ color, marginBottom: 5 }} />
                <div style={{ fontSize: 13, fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Anti-cheats */}
          {selected.anticheat?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>Anti-cheats protegidos</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {selected.anticheat.map(ac => (
                  <span key={ac} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 9px', borderRadius: 7,
                    background: 'rgba(217,38,255,0.1)', border: '1px solid rgba(217,38,255,0.22)',
                    fontSize: 9, fontWeight: 700, color: '#d926ff', letterSpacing: '0.06em',
                  }}>
                    <Lock size={8} /> {ac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {selected.settings?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
                Configuración óptima
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {selected.settings.map(s => (
                  <div key={s.key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 7,
                  }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{s.key}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: selected.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tweaks list */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
              Tweaks incluidos ({selected.tweaks.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {selected.tweaks.map((tw, i) => {
                const isProtected = tw.toLowerCase().includes("intocable") || tw.toLowerCase().includes("nunca");
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 7,
                    fontSize: 10.5, lineHeight: 1.5,
                    color: isProtected ? 'rgba(217,38,255,0.85)' : 'rgba(255,255,255,0.55)',
                    padding: '5px 8px', borderRadius: 7,
                    background: isProtected ? 'rgba(217,38,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isProtected ? 'rgba(217,38,255,0.15)' : 'rgba(255,255,255,0.04)'}`,
                  }}>
                    <span style={{ color: isProtected ? '#d926ff' : selected.color, flexShrink: 0, marginTop: 2, fontSize: 9 }}>
                      {isProtected ? '🔒' : '›'}
                    </span>
                    {tw}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={() => applyProfile(selected)}
            disabled={applying === selected.id}
            style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: appliedGames.has(selected.id)
                ? 'rgba(20,255,114,0.1)'
                : `linear-gradient(135deg, ${selected.color}, ${selected.color}bb)`,
              color: appliedGames.has(selected.id) ? '#14ff72' : '#000',
              fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              boxShadow: appliedGames.has(selected.id) ? 'none' : `0 4px 20px ${selected.color}35`,
              transition: 'all 0.15s',
            }}
          >
            {applying === selected.id
              ? <><Loader2 size={13} style={{ animation: 'spin-slow 1s linear infinite' }} /> Aplicando...</>
              : appliedGames.has(selected.id)
                ? <><Check size={13} /> Perfil aplicado</>
                : <><Zap size={13} /> Aplicar perfil</>
            }
          </button>

          {/* Stats footer */}
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 20 }}>
            {[
              { label: 'Tweaks', value: selected.tweaks.length },
              { label: 'Settings', value: selected.settings?.length ?? 0 },
              { label: 'Protegidos', value: selected.anticheat?.length ?? 0 },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: selected.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
