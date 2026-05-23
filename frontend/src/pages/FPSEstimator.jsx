import { useState } from "react";
import { Gauge, Cpu, Microchip, ChevronDown, Zap, TrendingUp } from "lucide-react";

// ── Hardware lists (identical tier system as Bottleneck) ─────────────────────
const CPUS = [
  { name: "AMD Ryzen 9 9950X3D",   score: 110, tag: "2025" },
  { name: "AMD Ryzen 9 9950X",     score: 106, tag: "2025" },
  { name: "AMD Ryzen 9 9900X3D",   score: 105, tag: "2025" },
  { name: "AMD Ryzen 7 9800X3D",   score: 104, tag: "2025" },
  { name: "AMD Ryzen 9 9900X",     score: 101, tag: "2025" },
  { name: "Intel Core Ultra 9 285K",score: 103, tag: "2024" },
  { name: "Intel Core Ultra 7 265K",score: 96,  tag: "2024" },
  { name: "AMD Ryzen 7 9700X",     score: 93,  tag: "2025" },
  { name: "Intel Core Ultra 5 245K",score: 88,  tag: "2024" },
  { name: "AMD Ryzen 5 9600X",     score: 86,  tag: "2025" },
  { name: "AMD Ryzen 5 9600",      score: 83,  tag: "2025" },
  { name: "Intel Core i9-14900KS", score: 99 },
  { name: "Intel Core i9-14900K",  score: 98 },
  { name: "Intel Core i9-14900KF", score: 97 },
  { name: "AMD Ryzen 9 7950X3D",   score: 99 },
  { name: "AMD Ryzen 9 7950X",     score: 97 },
  { name: "AMD Ryzen 7 7800X3D",   score: 95 },
  { name: "AMD Ryzen 9 7900X3D",   score: 94 },
  { name: "Intel Core i9-13900K",  score: 95 },
  { name: "Intel Core i9-13900KF", score: 94 },
  { name: "AMD Ryzen 9 5950X",     score: 92 },
  { name: "Intel Core i7-14700K",  score: 92 },
  { name: "Intel Core i7-14700KF", score: 91 },
  { name: "AMD Ryzen 9 7900X",     score: 91 },
  { name: "Intel Core i7-13700K",  score: 90 },
  { name: "AMD Ryzen 9 5900X",     score: 88 },
  { name: "Intel Core Ultra 5 235",score: 82 },
  { name: "AMD Ryzen 7 7700X",     score: 87 },
  { name: "Intel Core i5-14600K",  score: 85 },
  { name: "AMD Ryzen 7 7700",      score: 85 },
  { name: "AMD Ryzen 7 5800X3D",   score: 84 },
  { name: "Intel Core i5-13600K",  score: 83 },
  { name: "Intel Core i5-13600KF", score: 82 },
  { name: "Intel Core i7-12700K",  score: 82 },
  { name: "AMD Ryzen 5 7600X",     score: 80 },
  { name: "AMD Ryzen 7 5800X",     score: 79 },
  { name: "AMD Ryzen 5 7600",      score: 78 },
  { name: "Intel Core i5-12600K",  score: 78 },
  { name: "Intel Core i5-13400F",  score: 78 },
  { name: "AMD Ryzen 7 5700X",     score: 76 },
  { name: "Intel Core i5-14500",   score: 76 },
  { name: "AMD Ryzen 5 5600X",     score: 73 },
  { name: "Intel Core i5-12400F",  score: 73 },
  { name: "Intel Core i5-14400F",  score: 72 },
  { name: "Intel Core i9-11900K",  score: 74 },
  { name: "Intel Core i7-11700K",  score: 72 },
  { name: "AMD Ryzen 7 5700G",     score: 70 },
  { name: "Intel Core i5-11600K",  score: 70 },
  { name: "Intel Core i5-11400F",  score: 67 },
  { name: "AMD Ryzen 5 5600",      score: 69 },
  { name: "Intel Core i7-10700K",  score: 68 },
  { name: "AMD Ryzen 9 3900X",     score: 72 },
  { name: "AMD Ryzen 5 3600X",     score: 65 },
  { name: "AMD Ryzen 5 3600XT",    score: 64 },
  { name: "AMD Ryzen 5 5500",      score: 64 },
  { name: "AMD Ryzen 5 5600G",     score: 63 },
  { name: "Intel Core i5-10600K",  score: 63 },
  { name: "AMD Ryzen 5 3600",      score: 62 },
  { name: "AMD Ryzen 7 3700X",     score: 66 },
  { name: "Intel Core i3-12100F",  score: 58 },
  { name: "Intel Core i3-14100F",  score: 57 },
  { name: "Intel Core i3-13100F",  score: 56 },
  { name: "Intel Core i7-8700K",   score: 56 },
  { name: "Intel Core i5-10400F",  score: 55 },
  { name: "Intel Core i7-9700K",   score: 54 },
  { name: "AMD Ryzen 5 2600X",     score: 52 },
  { name: "AMD Ryzen 7 2700X",     score: 52 },
  { name: "AMD Ryzen 5 2600",      score: 50 },
  { name: "Intel Core i5-8400",    score: 48 },
  { name: "AMD Ryzen 3 5300G",     score: 48 },
  { name: "AMD Ryzen 3 3300X",     score: 47 },
  { name: "Intel Core i5-9600K",   score: 46 },
  { name: "Intel Core i3-10100F",  score: 44 },
  { name: "AMD Ryzen 3 3100",      score: 42 },
  { name: "Intel Core i5-7600K",   score: 40 },
  { name: "AMD FX-8350",           score: 28 },
  { name: "Intel Core i7-4770K",   score: 30 },
  { name: "AMD FX-6300",           score: 20 },
];

const GPUS = [
  { name: "NVIDIA RTX 5090",             score: 118, tag: "2025" },
  { name: "NVIDIA RTX 5080",             score: 108, tag: "2025" },
  { name: "NVIDIA RTX 5070 Ti",          score: 97,  tag: "2025" },
  { name: "AMD RX 9070 XT",              score: 86,  tag: "2025" },
  { name: "NVIDIA RTX 5070",             score: 88,  tag: "2025" },
  { name: "AMD RX 9070",                 score: 78,  tag: "2025" },
  { name: "NVIDIA RTX 5060 Ti 16GB",     score: 74,  tag: "2025" },
  { name: "NVIDIA RTX 5060 Ti",          score: 72,  tag: "2025" },
  { name: "AMD RX 9060 XT",              score: 64,  tag: "2025" },
  { name: "NVIDIA RTX 5060",             score: 63,  tag: "2025" },
  { name: "NVIDIA RTX 4090",             score: 100 },
  { name: "NVIDIA RTX 4090 D",           score: 98  },
  { name: "NVIDIA RTX 4080 Super",       score: 91  },
  { name: "NVIDIA RTX 4080",             score: 88  },
  { name: "AMD RX 7900 XTX",             score: 87  },
  { name: "NVIDIA RTX 4070 Ti Super",    score: 83  },
  { name: "AMD RX 7900 XT",              score: 80  },
  { name: "AMD RX 7900 GRE",             score: 82  },
  { name: "NVIDIA RTX 4070 Super",       score: 79  },
  { name: "NVIDIA RTX 3080 Ti",          score: 78  },
  { name: "NVIDIA RTX 4070",             score: 74  },
  { name: "NVIDIA RTX 3080",             score: 74  },
  { name: "AMD RX 7800 XT",              score: 72  },
  { name: "AMD RX 6800 XT",              score: 72  },
  { name: "Intel Arc B770",              score: 68,  tag: "2025" },
  { name: "NVIDIA RTX 3070 Ti",          score: 70  },
  { name: "NVIDIA RTX 4060 Ti 16GB",     score: 69  },
  { name: "NVIDIA RTX 4060 Ti",          score: 68  },
  { name: "NVIDIA RTX 2080 Ti",          score: 68  },
  { name: "AMD RX 7700 XT",              score: 65  },
  { name: "NVIDIA RTX 3070",             score: 67  },
  { name: "AMD RX 6750 XT",              score: 64  },
  { name: "AMD RX 7600 XT",              score: 62  },
  { name: "AMD RX 6700 XT",              score: 62  },
  { name: "NVIDIA RTX 4060",             score: 61  },
  { name: "NVIDIA RTX 3060 Ti",          score: 60  },
  { name: "Intel Arc B580",              score: 57,  tag: "2025" },
  { name: "NVIDIA RTX 2080 Super",       score: 56  },
  { name: "AMD RX 6650 XT",              score: 56  },
  { name: "NVIDIA RTX 2070 Super",       score: 58  },
  { name: "AMD RX 7600",                 score: 55  },
  { name: "NVIDIA RTX 3060",             score: 53  },
  { name: "NVIDIA RTX 2080",             score: 53  },
  { name: "AMD RX 6600 XT",              score: 54  },
  { name: "NVIDIA RTX 2070",             score: 52  },
  { name: "AMD RX 5700 XT",              score: 51  },
  { name: "AMD RX 6600",                 score: 50  },
  { name: "NVIDIA GTX 1080 Ti",          score: 50  },
  { name: "Intel Arc B570",              score: 48,  tag: "2025" },
  { name: "NVIDIA RTX 2060 Super",       score: 48  },
  { name: "AMD RX 5700",                 score: 47  },
  { name: "Intel Arc A770 16GB",         score: 52  },
  { name: "Intel Arc A750",              score: 46  },
  { name: "NVIDIA GTX 1080",             score: 44  },
  { name: "NVIDIA GTX 1070 Ti",          score: 40  },
  { name: "AMD RX 5600 XT",              score: 40  },
  { name: "NVIDIA RTX 2060",             score: 42  },
  { name: "NVIDIA GTX 1660 Super",       score: 38  },
  { name: "NVIDIA GTX 1660 Ti",          score: 36  },
  { name: "NVIDIA GTX 1070",             score: 36  },
  { name: "NVIDIA RTX 3050 8GB",         score: 36  },
  { name: "NVIDIA RTX 3050",             score: 34  },
  { name: "NVIDIA GTX 1660",             score: 32  },
  { name: "AMD RX 5500 XT 8GB",          score: 30  },
  { name: "NVIDIA GTX 1650 Super",       score: 30  },
  { name: "AMD RX 480 8GB",              score: 24  },
  { name: "AMD RX 580 8GB",              score: 26  },
  { name: "NVIDIA GTX 1060 6GB",         score: 24  },
  { name: "NVIDIA GTX 1650",             score: 22  },
  { name: "AMD RX 6500 XT",              score: 22  },
  { name: "NVIDIA GTX 970",              score: 20  },
  { name: "AMD RX 570 4GB",              score: 18  },
  { name: "AMD RX 6400",                 score: 16  },
  { name: "NVIDIA GTX 1050 Ti",          score: 14  },
  { name: "NVIDIA GTX 1060 3GB",         score: 20  },
  // Laptops
  { name: "NVIDIA RTX 5070 (Laptop)",    score: 80, tag: "Laptop" },
  { name: "NVIDIA RTX 5060 (Laptop)",    score: 62, tag: "Laptop" },
  { name: "NVIDIA RTX 4090 (Laptop)",    score: 82, tag: "Laptop" },
  { name: "NVIDIA RTX 4080 (Laptop)",    score: 76, tag: "Laptop" },
  { name: "NVIDIA RTX 4070 (Laptop)",    score: 66, tag: "Laptop" },
  { name: "NVIDIA RTX 4060 (Laptop)",    score: 55, tag: "Laptop" },
  { name: "NVIDIA RTX 4050 (Laptop)",    score: 48, tag: "Laptop" },
  { name: "NVIDIA RTX 3080 (Laptop)",    score: 64, tag: "Laptop" },
  { name: "NVIDIA RTX 3070 (Laptop)",    score: 58, tag: "Laptop" },
];

// ── Juegos con pesos CPU/GPU ──────────────────────────────────────────────────
const GAMES_FPS = [
  { id: "cs2",       name: "Counter-Strike 2",       color: "#ff8c00", emoji: "🔫", base1080: 280, base1440: 180, base4k: 90,  cpuW: 0.55, gpuW: 0.45 },
  { id: "valorant",  name: "Valorant",               color: "#ff4655", emoji: "🎯", base1080: 320, base1440: 220, base4k: 110, cpuW: 0.60, gpuW: 0.40 },
  { id: "fortnite",  name: "Fortnite",               color: "#a855f7", emoji: "🏗️", base1080: 160, base1440: 100, base4k: 55,  cpuW: 0.40, gpuW: 0.60 },
  { id: "apex",      name: "Apex Legends",           color: "#ff4444", emoji: "🦾", base1080: 190, base1440: 120, base4k: 65,  cpuW: 0.45, gpuW: 0.55 },
  { id: "cod",       name: "COD: Warzone / MW3",     color: "#4caf50", emoji: "🪖", base1080: 140, base1440: 90,  base4k: 45,  cpuW: 0.40, gpuW: 0.60 },
  { id: "pubg",      name: "PUBG: Battlegrounds",    color: "#f59e0b", emoji: "🐔", base1080: 130, base1440: 80,  base4k: 40,  cpuW: 0.45, gpuW: 0.55 },
  { id: "lol",       name: "League of Legends",      color: "#06b6d4", emoji: "⚔️", base1080: 280, base1440: 220, base4k: 140, cpuW: 0.65, gpuW: 0.35 },
  { id: "r6siege",   name: "Rainbow Six Siege",      color: "#8b5cf6", emoji: "🏠", base1080: 300, base1440: 200, base4k: 100, cpuW: 0.50, gpuW: 0.50 },
  { id: "overwatch", name: "Overwatch 2",            color: "#ff6b35", emoji: "⚡", base1080: 260, base1440: 170, base4k: 85,  cpuW: 0.55, gpuW: 0.45 },
  { id: "dota2",     name: "Dota 2",                 color: "#dc2626", emoji: "🗡️", base1080: 290, base1440: 210, base4k: 120, cpuW: 0.60, gpuW: 0.40 },
  { id: "gta5",      name: "GTA V (Enhanced)",       color: "#22c55e", emoji: "🚗", base1080: 200, base1440: 130, base4k: 65,  cpuW: 0.45, gpuW: 0.55 },
  { id: "cyberpunk", name: "Cyberpunk 2077",         color: "#facc15", emoji: "🤖", base1080: 90,  base1440: 55,  base4k: 28,  cpuW: 0.35, gpuW: 0.65 },
  { id: "tarkov",    name: "Escape from Tarkov",     color: "#78716c", emoji: "🪖", base1080: 130, base1440: 85,  base4k: 42,  cpuW: 0.55, gpuW: 0.45 },
  { id: "free-fire", name: "Free Fire (Emulador)",   color: "#f97316", emoji: "🔥", base1080: 240, base1440: 180, base4k: 100, cpuW: 0.55, gpuW: 0.45 },
  { id: "minecraft", name: "Minecraft Java",         color: "#92cf40", emoji: "⛏️", base1080: 280, base1440: 230, base4k: 160, cpuW: 0.70, gpuW: 0.30 },
  { id: "roblox",    name: "Roblox",                 color: "#ef4444", emoji: "🟥", base1080: 200, base1440: 140, base4k: 80,  cpuW: 0.50, gpuW: 0.50 },
  { id: "thefinals", name: "The Finals",             color: "#f59e0b", emoji: "💥", base1080: 150, base1440: 95,  base4k: 48,  cpuW: 0.40, gpuW: 0.60 },
];

const QUALITY_MULT = {
  "Bajo":        { cpu: 1.15, gpu: 0.75 },
  "Medio":       { cpu: 1.00, gpu: 1.00 },
  "Alto":        { cpu: 0.95, gpu: 1.25 },
  "Ultra":       { cpu: 0.92, gpu: 1.55 },
  "Competitivo": { cpu: 1.10, gpu: 0.80 },
};

const REF_CPU = 70;
const REF_GPU = 60;

function calcFPS(game, cpuScore, gpuScore, res, quality, pineBoost) {
  const baseKey = res === "1080p" ? "base1080" : res === "1440p" ? "base1440" : "base4k";
  const base = game[baseKey];
  const qm = QUALITY_MULT[quality] || QUALITY_MULT["Medio"];
  const cpuMult = (1 + (cpuScore - REF_CPU) / REF_CPU * game.cpuW * 0.9) * qm.cpu;
  const gpuMult = (1 + (gpuScore - REF_GPU) / REF_GPU * game.gpuW * 0.9) * qm.gpu;
  const raw = Math.round(base * cpuMult * gpuMult);
  return pineBoost ? Math.round(raw * 1.10) : raw;
}

function fpsTier(fps) {
  if (fps >= 360) return { label: "360+ FPS", color: "#d926ff", grade: "S+" };
  if (fps >= 240) return { label: "240+ FPS", color: "#d926ff", grade: "S" };
  if (fps >= 144) return { label: "144+ FPS", color: "#14ff72", grade: "A" };
  if (fps >= 60)  return { label: "60+ FPS",  color: "#ffd166", grade: "B" };
  if (fps >= 30)  return { label: "30+ FPS",  color: "#ff8c00", grade: "C" };
  return              { label: "<30 FPS",  color: "#ff4444", grade: "D" };
}

function Dropdown({ label, items, selected, onSelect, icon: Icon, color, placeholder }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon size={13} style={{ color }} />
        <span className="section-label">{label}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>{items.length} modelos</span>
      </div>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12, color: selected ? "#fff" : "rgba(255,255,255,0.3)", fontWeight: selected ? 600 : 400, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selected?.name || placeholder}
          </span>
          {selected?.tag && <span style={{ fontSize: 9, color: selected.tag === "2025" ? "#14ff72" : selected.tag === "Laptop" ? "#ffaa00" : "#00ccff" }}>{selected.tag}</span>}
        </div>
        <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
      </div>
      {open && (
        <div style={{ position: "absolute", left: 0, right: 0, top: "100%", marginTop: 4, zIndex: 50, background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={`Buscar (ej: 5060 Ti, 9800X3D, i9)...`} style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fff", outline: "none", border: "none" }} />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.map(item => (
              <div key={item.name} onClick={() => { onSelect(item); setOpen(false); setQ(""); }}
                style={{ padding: "7px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div>
                  <span style={{ color: "#fff" }}>{item.name}</span>
                  {item.tag && <span style={{ marginLeft: 6, fontSize: 8, fontWeight: 800, color: item.tag === "2025" ? "#14ff72" : item.tag === "Laptop" ? "#ffaa00" : "#00ccff" }}>{item.tag}</span>}
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", fontSize: 10, flexShrink: 0, marginLeft: 8 }}>Score {item.score}</span>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: 16, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Sin resultados</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FPSEstimator() {
  const [cpu, setCpu] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [res, setRes] = useState("1080p");
  const [quality, setQuality] = useState("Medio");
  const [pineBoost, setPineBoost] = useState(false);

  const hasHW = cpu && gpu;

  const avgFps = hasHW
    ? Math.round(GAMES_FPS.slice(0, 6).reduce((acc, g) => acc + calcFPS(g, cpu.score, gpu.score, res, quality, pineBoost), 0) / 6)
    : null;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px" }} className="page-enter">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(0,204,255,0.2),rgba(0,204,255,0.06))", border: "1px solid rgba(0,204,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TrendingUp size={18} style={{ color: "#00ccff" }} />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>FPS Estimator</h1>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {GAMES_FPS.length} juegos · {CPUS.length} CPUs · {GPUS.length} GPUs · RTX 5060 Ti incluida
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", gap: 16 }}>
        {/* Config panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Resolución */}
          <div className="card" style={{ padding: "14px 16px" }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Resolución</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["1080p", "1440p", "4K"].map(r => (
                <button key={r} onClick={() => setRes(r)} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", background: res === r ? "rgba(0,204,255,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${res === r ? "rgba(0,204,255,0.4)" : "rgba(255,255,255,0.08)"}`, color: res === r ? "#00ccff" : "rgba(255,255,255,0.5)", transition: "all 0.12s" }}>{r}</button>
              ))}
            </div>
          </div>

          {/* Calidad */}
          <div className="card" style={{ padding: "14px 16px" }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Calidad gráfica</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {Object.keys(QUALITY_MULT).map(q => (
                <button key={q} onClick={() => setQuality(q)} style={{ flex: "1 1 auto", padding: "6px 8px", borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: "pointer", background: quality === q ? "rgba(217,38,255,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${quality === q ? "rgba(217,38,255,0.35)" : "rgba(255,255,255,0.07)"}`, color: quality === q ? "#d926ff" : "rgba(255,255,255,0.4)", transition: "all 0.12s", whiteSpace: "nowrap" }}>{q}</button>
              ))}
            </div>
          </div>

          {/* CPU */}
          <div className="card" style={{ padding: "14px 16px" }}>
            <Dropdown label="CPU" items={CPUS} selected={cpu} onSelect={setCpu} icon={Cpu} color="#14ff72" placeholder="Selecciona CPU..." />
          </div>

          {/* GPU */}
          <div className="card" style={{ padding: "14px 16px" }}>
            <Dropdown label="GPU" items={GPUS} selected={gpu} onSelect={setGpu} icon={Microchip} color="#d926ff" placeholder="Selecciona GPU..." />
          </div>

          {/* Pine Opti boost */}
          <div className="card" style={{ padding: "12px 14px", background: pineBoost ? "rgba(20,255,114,0.06)" : undefined, border: `1px solid ${pineBoost ? "rgba(20,255,114,0.2)" : "rgba(255,255,255,0.07)"}`, cursor: "pointer", transition: "all 0.15s" }} onClick={() => setPineBoost(!pineBoost)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 18, borderRadius: 99, background: pineBoost ? "#14ff72" : "rgba(255,255,255,0.1)", transition: "all 0.2s", position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 2, left: pineBoost ? 14 : 2, width: 14, height: 14, borderRadius: "50%", background: pineBoost ? "#000" : "rgba(255,255,255,0.5)", transition: "left 0.2s" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: pineBoost ? "#14ff72" : "rgba(255,255,255,0.6)" }}>Pine Opti Boost</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>+10% FPS estimado con optimizaciones</div>
              </div>
            </div>
          </div>

          {/* Setup summary */}
          {hasHW && (
            <div className="card" style={{ padding: "14px 16px", background: "rgba(0,204,255,0.04)", border: "1px solid rgba(0,204,255,0.12)" }}>
              <div className="section-label" style={{ marginBottom: 10 }}>Promedio estimado</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#00ccff", letterSpacing: "-0.05em", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                {avgFps}<span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginLeft: 4, fontFamily: "Inter, sans-serif" }}>FPS</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                {res} · {quality} · {pineBoost ? "con Pine Boost" : "sin Pine Boost"}
              </div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  { k: "CPU", v: `Score ${cpu.score}`, c: "#14ff72" },
                  { k: "GPU", v: `Score ${gpu.score}`, c: "#d926ff" },
                ].map(r => (
                  <div key={r.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>{r.k}</span>
                    <span style={{ color: r.c, fontFamily: "JetBrains Mono, monospace" }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results grid */}
        <div>
          {!hasHW ? (
            <div className="card" style={{ padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
              <Gauge size={42} style={{ color: "rgba(255,255,255,0.08)", marginBottom: 16 }} />
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", lineHeight: 1.7, marginBottom: 12 }}>
                Selecciona tu CPU y GPU para ver los FPS estimados en {GAMES_FPS.length} juegos
              </p>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.2)", lineHeight: 1.7 }}>
                {CPUS.length} procesadores · {GPUS.length} GPUs<br />
                Incluye RTX 5090 · 5060 Ti · RX 9070 XT · Ryzen 9800X3D
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
              {GAMES_FPS.map(game => {
                const fps = calcFPS(game, cpu.score, gpu.score, res, quality, pineBoost);
                const fpsRaw = calcFPS(game, cpu.score, gpu.score, res, quality, false);
                const tier = fpsTier(fps);
                const pct = Math.min(100, (fps / 400) * 100);
                return (
                  <div key={game.id} className="card" style={{ padding: "14px 15px", border: `1px solid ${game.color}12` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 16 }}>{game.emoji}</span>
                        <div>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{game.name}</div>
                          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.28)" }}>{res} · {quality}</div>
                        </div>
                      </div>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${tier.color}15`, border: `1px solid ${tier.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 900, color: tier.color }}>{tier.grade}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: 28, fontWeight: 900, color: tier.color, letterSpacing: "-0.05em", fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 2 }}>
                      {fps}
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginLeft: 3, fontFamily: "Inter, sans-serif" }}>FPS</span>
                    </div>

                    {pineBoost && fps !== fpsRaw && (
                      <div style={{ fontSize: 9, color: "#14ff72", marginBottom: 6, fontWeight: 700 }}>
                        +{fps - fpsRaw} FPS con Pine Opti
                      </div>
                    )}

                    <div style={{ fontSize: 8.5, color: tier.color, fontWeight: 700, marginBottom: 8 }}>{tier.label}</div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${game.color}80,${game.color})`, borderRadius: 99, transition: "width 0.7s ease" }} />
                    </div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between" }}>
                      <span>CPU {Math.round(game.cpuW * 100)}%</span>
                      <span>GPU {Math.round(game.gpuW * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
        <Zap size={12} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", margin: 0, lineHeight: 1.55 }}>
          FPS estimados según la calidad seleccionada. Valores reales pueden variar ±20% por drivers, temperatura, resolución de texturas y configuración avanzada. El Pine Opti Boost (+10%) es un estimado conservador de las ganancias reales de las optimizaciones.
        </p>
      </div>
    </div>
  );
}
