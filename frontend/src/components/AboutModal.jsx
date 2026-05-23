import { useEffect } from "react";
import { X } from "lucide-react";

const LOGO = "https://customer-assets.emergentagent.com/job_firewall-pro-2/artifacts/yp9jj9mp_logo.ico";

export default function AboutModal({ open, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6" data-testid="about-modal" onClick={onClose}>
      <div className="glass max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white" data-testid="about-close"><X/></button>
        <div className="flex flex-col items-center text-center">
          <img src={LOGO} alt="" className="w-20 h-20 rounded-full neon-glow mb-4"/>
          <h2 className="font-display text-3xl uppercase tracking-[0.2em] neon-text">Pine Opti</h2>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-1">Neon Edition · v1.0 · build 26</p>

          <div className="my-6 border-t border-white/10 w-full"/>

          <p className="text-sm text-white/70 leading-relaxed">
            Optimizador de PC pro-gamer con <strong className="text-[#14ff72]">IA real</strong> (Claude Sonnet 4.5).
          </p>
          <div className="my-4 px-4 py-3 rounded border border-[#14ff72]/30 bg-[#14ff72]/5 text-left">
            <div className="text-[10px] uppercase tracking-widest text-[#14ff72] mb-1">Promesa de seguridad</div>
            <ul className="text-xs text-white/80 leading-relaxed space-y-1">
              <li>✓ <strong>Cero modificaciones</strong> a servicios de Windows</li>
              <li>✓ <strong>Cero riesgo de ban</strong> en Free Fire / CS2 / Valorant / Fortnite</li>
              <li>✓ <strong>Cero daño</strong> a tu Windows o registro</li>
              <li>✓ Tweaks <strong>permanentes</strong> · Modo automático al iniciar</li>
              <li>✓ Escaneo <strong>real</strong> de tu hardware vía WebGL + sensores</li>
            </ul>
          </div>
          <p className="text-xs text-white/45 mt-3 leading-relaxed">
            Anti-cheats blindados: BlackBox, Keller SS, EAC, BattlEye, Vanguard, FACEIT, Garena Shell, ESEA.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6 w-full">
            <div className="glass p-3"><div className="text-[10px] uppercase text-white/40">Tweaks</div><div className="font-display text-lg neon-text">200+</div></div>
            <div className="glass p-3"><div className="text-[10px] uppercase text-white/40">Juegos</div><div className="font-display text-lg neon-text">9</div></div>
            <div className="glass p-3"><div className="text-[10px] uppercase text-white/40">Anti-cheats</div><div className="font-display text-lg neon-text">8</div></div>
          </div>

          <p className="text-[10px] text-white/30 mt-6 uppercase tracking-widest">Hecho con ♥ para gamers que apuestan</p>
        </div>
      </div>
    </div>
  );
}
