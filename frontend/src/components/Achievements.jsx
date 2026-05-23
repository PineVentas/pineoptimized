import { Rocket, Zap, Trophy, ShieldCheck, Sparkles, Gamepad2, Wifi, Brush, Lock } from "lucide-react";

const ICONS = { Rocket, Zap, Trophy, ShieldCheck, Sparkles, Gamepad2, Wifi, Brush };

export default function Achievements({ items }) {
  const unlocked = items.filter(i => i.unlocked).length;

  return (
    <div className="glass p-4" data-testid="achievements">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display uppercase tracking-widest text-white/80 text-base flex items-center gap-2">
          <Trophy size={14} className="text-[#d926ff]" /> Logros
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/40">{unlocked}/{items.length}</span>
          {items.length > 0 && (
            <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d926ff] to-[#7c3aed] rounded-full transition-all duration-700"
                style={{ width: `${(unlocked / items.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Trophy size={28} className="text-white/10 mb-2" />
          <p className="text-xs text-white/30">Completa optimizaciones para desbloquear logros</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {items.map(a => {
            const Ic = ICONS[a.icon] || Trophy;
            return (
              <div
                key={a.id}
                data-testid={`ach-${a.id}`}
                className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center p-2 transition-all duration-200 ${a.unlocked
                  ? "border-white/10 bg-white/3 hover:border-[#d926ff]/30"
                  : "border-white/5 bg-black/40 opacity-40"
                  }`}
                title={a.name}
              >
                {!a.unlocked && <Lock size={9} className="absolute top-1.5 right-1.5 text-white/20" />}
                {a.unlocked && (
                  <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 30%, ${a.color}, transparent 70%)` }} />
                )}
                <Ic size={18} style={{ color: a.unlocked ? a.color : "#444" }} />
                <div className="text-[8px] uppercase tracking-widest text-center mt-1 text-white/50 line-clamp-2 leading-tight">{a.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
