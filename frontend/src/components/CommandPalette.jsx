import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Command } from "lucide-react";

const ROUTES = [
  { path: "/", label: "Inicio · Dashboard" },
  { path: "/optimizacion", label: "Optimización · Tweaks" },
  { path: "/perfiles-juego", label: "Perfiles de Juego · Free Fire, Valorant, CS2" },
  { path: "/herramientas", label: "Herramientas · 9 módulos" },
  { path: "/dns", label: "DNS Optimizer · Cloudflare, Google" },
  { path: "/procesos", label: "Process Killer · Liberar RAM" },
  { path: "/tweax-ai", label: "TweaX AI · Asistente Claude" },
  { path: "/copia-seguridad", label: "Copia de Seguridad · Snapshots" },
  { path: "/correcciones", label: "Correcciones · Reparaciones rápidas" },
  { path: "/configuracion", label: "Configuración · Tema, PIN, RPC" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (!open) return null;
  const filtered = ROUTES.filter(r => r.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-start justify-center pt-32" onClick={() => setOpen(false)} data-testid="command-palette">
      <div className="glass w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <Search size={16} className="text-[#14ff72]"/>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar página…" className="flex-1 bg-transparent outline-none text-sm font-mono" data-testid="cmd-input"/>
          <kbd className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 rounded px-1.5 py-0.5">esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.map(r => (
            <button key={r.path} onClick={() => { nav(r.path); setOpen(false); setQ(""); }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#14ff72]/10 hover:text-[#14ff72] transition-colors font-mono"
              data-testid={`cmd-${r.path}`}>
              {r.label}
            </button>
          ))}
          {filtered.length === 0 && <div className="px-4 py-6 text-center text-white/40 text-xs uppercase tracking-widest">Sin resultados</div>}
        </div>
        <div className="px-4 py-2 border-t border-white/10 flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
          <Command size={10}/> Pulsa Ctrl+K para abrir
        </div>
      </div>
    </div>
  );
}
