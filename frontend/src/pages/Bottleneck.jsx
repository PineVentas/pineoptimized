import { useState } from "react";
import { Cpu, Microchip, AlertTriangle, CheckCircle, ChevronDown, Zap, TrendingUp, Monitor } from "lucide-react";

const CPUS = [
  // ── AMD Ryzen 9000 Series ──────────────────────────────────────
  { name: "AMD Ryzen 9 9950X3D",   score: 110, tier: "flagship", tag: "2025" },
  { name: "AMD Ryzen 9 9950X",     score: 106, tier: "flagship", tag: "2025" },
  { name: "AMD Ryzen 9 9900X3D",   score: 105, tier: "flagship", tag: "2025" },
  { name: "AMD Ryzen 7 9800X3D",   score: 104, tier: "flagship", tag: "2025" },
  { name: "AMD Ryzen 9 9900X",     score: 101, tier: "flagship", tag: "2025" },
  { name: "AMD Ryzen 7 9700X",     score: 93,  tier: "flagship", tag: "2025" },
  { name: "AMD Ryzen 5 9600X",     score: 86,  tier: "high",     tag: "2025" },
  { name: "AMD Ryzen 5 9600",      score: 83,  tier: "high",     tag: "2025" },
  // ── Intel Core Ultra 200 Series ───────────────────────────────
  { name: "Intel Core Ultra 9 285K", score: 103, tier: "flagship", tag: "2024" },
  { name: "Intel Core Ultra 7 265K", score: 96,  tier: "flagship", tag: "2024" },
  { name: "Intel Core Ultra 5 245K", score: 88,  tier: "high",     tag: "2024" },
  { name: "Intel Core Ultra 5 235",  score: 82,  tier: "high",     tag: "2024" },
  // ── Intel 14th Gen ────────────────────────────────────────────
  { name: "Intel Core i9-14900KS",  score: 99, tier: "flagship", tag: "2024" },
  { name: "Intel Core i9-14900K",   score: 98, tier: "flagship", tag: "2024" },
  { name: "Intel Core i9-14900KF",  score: 97, tier: "flagship", tag: "2024" },
  { name: "Intel Core i7-14700K",   score: 92, tier: "high",     tag: "2024" },
  { name: "Intel Core i7-14700KF",  score: 91, tier: "high",     tag: "2024" },
  { name: "Intel Core i5-14600K",   score: 85, tier: "high",     tag: "2024" },
  { name: "Intel Core i5-14600KF",  score: 84, tier: "high",     tag: "2024" },
  { name: "Intel Core i5-14500",    score: 76, tier: "mid",      tag: "2024" },
  { name: "Intel Core i5-14400F",   score: 72, tier: "mid",      tag: "2024" },
  { name: "Intel Core i3-14100F",   score: 57, tier: "entry",    tag: "2024" },
  // ── AMD Ryzen 7000 Series ─────────────────────────────────────
  { name: "AMD Ryzen 9 7950X3D",   score: 99, tier: "flagship" },
  { name: "AMD Ryzen 9 7950X",     score: 97, tier: "flagship" },
  { name: "AMD Ryzen 7 7800X3D",   score: 95, tier: "flagship" },
  { name: "AMD Ryzen 9 7900X3D",   score: 94, tier: "flagship" },
  { name: "AMD Ryzen 9 7900X",     score: 91, tier: "high" },
  { name: "AMD Ryzen 7 7700X",     score: 87, tier: "high" },
  { name: "AMD Ryzen 7 7700",      score: 85, tier: "high" },
  { name: "AMD Ryzen 5 7600X",     score: 80, tier: "mid" },
  { name: "AMD Ryzen 5 7600",      score: 78, tier: "mid" },
  // ── Intel 13th Gen ────────────────────────────────────────────
  { name: "Intel Core i9-13900K",  score: 95, tier: "flagship" },
  { name: "Intel Core i9-13900KF", score: 94, tier: "flagship" },
  { name: "Intel Core i9-12900K",  score: 93, tier: "flagship" },
  { name: "Intel Core i7-13700K",  score: 90, tier: "high" },
  { name: "Intel Core i7-13700KF", score: 89, tier: "high" },
  { name: "Intel Core i5-13600K",  score: 83, tier: "high" },
  { name: "Intel Core i5-13600KF", score: 82, tier: "high" },
  { name: "Intel Core i5-13400F",  score: 78, tier: "mid" },
  { name: "Intel Core i3-13100F",  score: 56, tier: "entry" },
  // ── AMD Ryzen 5000 Series ─────────────────────────────────────
  { name: "AMD Ryzen 9 5950X",     score: 92, tier: "high" },
  { name: "AMD Ryzen 9 5900X",     score: 88, tier: "high" },
  { name: "AMD Ryzen 7 5800X3D",   score: 84, tier: "mid" },
  { name: "AMD Ryzen 7 5800X",     score: 79, tier: "mid" },
  { name: "AMD Ryzen 7 5700X",     score: 76, tier: "mid" },
  { name: "AMD Ryzen 7 5700G",     score: 70, tier: "mid" },
  { name: "AMD Ryzen 5 5600X",     score: 73, tier: "mid" },
  { name: "AMD Ryzen 5 5600",      score: 69, tier: "mid" },
  { name: "AMD Ryzen 5 5600G",     score: 63, tier: "entry" },
  { name: "AMD Ryzen 5 5500",      score: 64, tier: "entry" },
  { name: "AMD Ryzen 3 5300G",     score: 48, tier: "entry" },
  // ── Intel 12th Gen ────────────────────────────────────────────
  { name: "Intel Core i7-12700K",  score: 82, tier: "mid" },
  { name: "Intel Core i7-12700KF", score: 81, tier: "mid" },
  { name: "Intel Core i5-12600K",  score: 78, tier: "mid" },
  { name: "Intel Core i5-12600KF", score: 77, tier: "mid" },
  { name: "Intel Core i5-12400F",  score: 73, tier: "mid" },
  { name: "Intel Core i3-12100F",  score: 58, tier: "entry" },
  // ── Intel 11th Gen ────────────────────────────────────────────
  { name: "Intel Core i9-11900K",  score: 74, tier: "mid" },
  { name: "Intel Core i7-11700K",  score: 72, tier: "mid" },
  { name: "Intel Core i5-11600K",  score: 70, tier: "mid" },
  { name: "Intel Core i5-11400F",  score: 67, tier: "mid" },
  // ── Intel 10th Gen ────────────────────────────────────────────
  { name: "Intel Core i9-10900K",  score: 70, tier: "mid" },
  { name: "Intel Core i7-10700K",  score: 68, tier: "mid" },
  { name: "Intel Core i5-10600K",  score: 63, tier: "entry" },
  { name: "Intel Core i5-10400F",  score: 55, tier: "entry" },
  { name: "Intel Core i3-10100F",  score: 44, tier: "entry" },
  // ── AMD Ryzen 3000 Series ─────────────────────────────────────
  { name: "AMD Ryzen 9 3900X",     score: 72, tier: "mid" },
  { name: "AMD Ryzen 7 3700X",     score: 66, tier: "entry" },
  { name: "AMD Ryzen 5 3600X",     score: 65, tier: "entry" },
  { name: "AMD Ryzen 5 3600",      score: 62, tier: "entry" },
  { name: "AMD Ryzen 5 3600XT",    score: 64, tier: "entry" },
  { name: "AMD Ryzen 3 3300X",     score: 47, tier: "entry" },
  { name: "AMD Ryzen 3 3100",      score: 42, tier: "entry" },
  // ── AMD Ryzen 2000 Series ─────────────────────────────────────
  { name: "AMD Ryzen 7 2700X",     score: 52, tier: "entry" },
  { name: "AMD Ryzen 5 2600X",     score: 52, tier: "entry" },
  { name: "AMD Ryzen 5 2600",      score: 50, tier: "entry" },
  // ── Intel Older ───────────────────────────────────────────────
  { name: "Intel Core i7-9700K",   score: 54, tier: "entry" },
  { name: "Intel Core i5-9600K",   score: 46, tier: "entry" },
  { name: "Intel Core i7-8700K",   score: 56, tier: "entry" },
  { name: "Intel Core i5-8400",    score: 48, tier: "entry" },
  { name: "Intel Core i7-7700K",   score: 42, tier: "entry" },
  { name: "Intel Core i5-7600K",   score: 40, tier: "entry" },
  // ── Legacy ────────────────────────────────────────────────────
  { name: "AMD FX-8350",           score: 28, tier: "legacy" },
  { name: "AMD FX-8300",           score: 25, tier: "legacy" },
  { name: "Intel Core i7-4770K",   score: 30, tier: "legacy" },
  { name: "Intel Core i5-4690K",   score: 24, tier: "legacy" },
  { name: "AMD FX-6300",           score: 20, tier: "legacy" },
];

const GPUS = [
  // ── NVIDIA RTX 50 Series ──────────────────────────────────────
  { name: "NVIDIA RTX 5090",             score: 118, tier: "flagship", tag: "2025" },
  { name: "NVIDIA RTX 5080",             score: 108, tier: "flagship", tag: "2025" },
  { name: "NVIDIA RTX 5070 Ti",          score: 97,  tier: "flagship", tag: "2025" },
  { name: "NVIDIA RTX 5070",             score: 88,  tier: "high",     tag: "2025" },
  { name: "NVIDIA RTX 5060 Ti 16GB",     score: 74,  tier: "high",     tag: "2025" },
  { name: "NVIDIA RTX 5060 Ti",          score: 72,  tier: "high",     tag: "2025" },
  { name: "NVIDIA RTX 5060",             score: 63,  tier: "mid",      tag: "2025" },
  // ── AMD RX 9000 Series ────────────────────────────────────────
  { name: "AMD RX 9070 XT",              score: 86,  tier: "high",     tag: "2025" },
  { name: "AMD RX 9070",                 score: 78,  tier: "high",     tag: "2025" },
  { name: "AMD RX 9060 XT",              score: 64,  tier: "mid",      tag: "2025" },
  // ── NVIDIA RTX 40 Series ──────────────────────────────────────
  { name: "NVIDIA RTX 4090",             score: 100, tier: "flagship" },
  { name: "NVIDIA RTX 4090 D",           score: 98,  tier: "flagship" },
  { name: "NVIDIA RTX 4080 Super",       score: 91,  tier: "flagship" },
  { name: "NVIDIA RTX 4080",             score: 88,  tier: "flagship" },
  { name: "NVIDIA RTX 4070 Ti Super",    score: 83,  tier: "high" },
  { name: "NVIDIA RTX 4070 Super",       score: 79,  tier: "high" },
  { name: "NVIDIA RTX 4070",             score: 74,  tier: "high" },
  { name: "NVIDIA RTX 4060 Ti 16GB",     score: 69,  tier: "mid" },
  { name: "NVIDIA RTX 4060 Ti",          score: 68,  tier: "mid" },
  { name: "NVIDIA RTX 4060",             score: 61,  tier: "mid" },
  { name: "NVIDIA RTX 4050",             score: 46,  tier: "entry" },
  // ── AMD RX 7000 Series ────────────────────────────────────────
  { name: "AMD RX 7900 XTX",             score: 87,  tier: "flagship" },
  { name: "AMD RX 7900 XT",              score: 80,  tier: "high" },
  { name: "AMD RX 7900 GRE",             score: 82,  tier: "high" },
  { name: "AMD RX 7800 XT",              score: 72,  tier: "high" },
  { name: "AMD RX 7700 XT",              score: 65,  tier: "mid" },
  { name: "AMD RX 7600 XT",              score: 62,  tier: "mid" },
  { name: "AMD RX 7600",                 score: 55,  tier: "mid" },
  // ── Intel Arc B Series ────────────────────────────────────────
  { name: "Intel Arc B770",              score: 68,  tier: "mid",      tag: "2025" },
  { name: "Intel Arc B580",              score: 57,  tier: "mid",      tag: "2025" },
  { name: "Intel Arc B570",              score: 48,  tier: "entry",    tag: "2025" },
  // ── NVIDIA RTX 30 Series ──────────────────────────────────────
  { name: "NVIDIA RTX 3090 Ti",          score: 86,  tier: "high" },
  { name: "NVIDIA RTX 3090",             score: 84,  tier: "high" },
  { name: "NVIDIA RTX 3080 Ti",          score: 78,  tier: "high" },
  { name: "NVIDIA RTX 3080 12GB",        score: 76,  tier: "high" },
  { name: "NVIDIA RTX 3080",             score: 74,  tier: "high" },
  { name: "NVIDIA RTX 3070 Ti",          score: 70,  tier: "mid" },
  { name: "NVIDIA RTX 3070",             score: 67,  tier: "mid" },
  { name: "NVIDIA RTX 3060 Ti",          score: 60,  tier: "mid" },
  { name: "NVIDIA RTX 3060",             score: 53,  tier: "mid" },
  { name: "NVIDIA RTX 3050 8GB",         score: 36,  tier: "legacy" },
  { name: "NVIDIA RTX 3050",             score: 34,  tier: "legacy" },
  // ── AMD RX 6000 Series ────────────────────────────────────────
  { name: "AMD RX 6950 XT",              score: 76,  tier: "high" },
  { name: "AMD RX 6900 XT",              score: 74,  tier: "high" },
  { name: "AMD RX 6800 XT",              score: 72,  tier: "high" },
  { name: "AMD RX 6800",                 score: 68,  tier: "mid" },
  { name: "AMD RX 6750 XT",              score: 64,  tier: "mid" },
  { name: "AMD RX 6700 XT",              score: 62,  tier: "mid" },
  { name: "AMD RX 6700",                 score: 58,  tier: "mid" },
  { name: "AMD RX 6650 XT",              score: 56,  tier: "mid" },
  { name: "AMD RX 6600 XT",              score: 54,  tier: "mid" },
  { name: "AMD RX 6600",                 score: 50,  tier: "entry" },
  { name: "AMD RX 6500 XT",              score: 22,  tier: "legacy" },
  { name: "AMD RX 6400",                 score: 16,  tier: "legacy" },
  // ── Intel Arc A Series ────────────────────────────────────────
  { name: "Intel Arc A770 16GB",         score: 52,  tier: "entry" },
  { name: "Intel Arc A750",              score: 46,  tier: "entry" },
  { name: "Intel Arc A580",              score: 40,  tier: "entry" },
  // ── NVIDIA RTX 20 Series ──────────────────────────────────────
  { name: "NVIDIA RTX 2080 Ti",          score: 68,  tier: "mid" },
  { name: "NVIDIA RTX 2080 Super",       score: 56,  tier: "mid" },
  { name: "NVIDIA RTX 2080",             score: 53,  tier: "mid" },
  { name: "NVIDIA RTX 2070 Super",       score: 58,  tier: "mid" },
  { name: "NVIDIA RTX 2070",             score: 52,  tier: "entry" },
  { name: "NVIDIA RTX 2060 Super",       score: 48,  tier: "entry" },
  { name: "NVIDIA RTX 2060",             score: 42,  tier: "entry" },
  // ── NVIDIA GTX / AMD RX 5000 / Older ─────────────────────────
  { name: "NVIDIA GTX 1080 Ti",          score: 50,  tier: "entry" },
  { name: "NVIDIA GTX 1080",             score: 44,  tier: "entry" },
  { name: "NVIDIA GTX 1070 Ti",          score: 40,  tier: "entry" },
  { name: "NVIDIA GTX 1070",             score: 36,  tier: "entry" },
  { name: "AMD RX 5700 XT",              score: 51,  tier: "entry" },
  { name: "AMD RX 5700",                 score: 47,  tier: "entry" },
  { name: "AMD RX 5600 XT",              score: 40,  tier: "entry" },
  { name: "AMD RX 5500 XT 8GB",          score: 30,  tier: "legacy" },
  { name: "NVIDIA GTX 1660 Super",       score: 38,  tier: "entry" },
  { name: "NVIDIA GTX 1660 Ti",          score: 36,  tier: "entry" },
  { name: "NVIDIA GTX 1660",             score: 32,  tier: "legacy" },
  { name: "NVIDIA GTX 1650 Super",       score: 30,  tier: "legacy" },
  { name: "NVIDIA GTX 1650",             score: 22,  tier: "legacy" },
  { name: "NVIDIA GTX 1060 6GB",         score: 24,  tier: "legacy" },
  { name: "NVIDIA GTX 1060 3GB",         score: 20,  tier: "legacy" },
  { name: "NVIDIA GTX 1050 Ti",          score: 14,  tier: "legacy" },
  { name: "NVIDIA GTX 970",              score: 20,  tier: "legacy" },
  { name: "AMD RX 580 8GB",              score: 26,  tier: "legacy" },
  { name: "AMD RX 570 4GB",              score: 18,  tier: "legacy" },
  { name: "AMD RX 480 8GB",              score: 24,  tier: "legacy" },
  // ── Laptops GPU (Mobile) ──────────────────────────────────────
  { name: "NVIDIA RTX 5070 (Laptop)",    score: 80,  tier: "high",     tag: "Laptop" },
  { name: "NVIDIA RTX 5060 (Laptop)",    score: 62,  tier: "mid",      tag: "Laptop" },
  { name: "NVIDIA RTX 4090 (Laptop)",    score: 82,  tier: "high",     tag: "Laptop" },
  { name: "NVIDIA RTX 4080 (Laptop)",    score: 76,  tier: "high",     tag: "Laptop" },
  { name: "NVIDIA RTX 4070 (Laptop)",    score: 66,  tier: "mid",      tag: "Laptop" },
  { name: "NVIDIA RTX 4060 (Laptop)",    score: 55,  tier: "mid",      tag: "Laptop" },
  { name: "NVIDIA RTX 4050 (Laptop)",    score: 48,  tier: "entry",    tag: "Laptop" },
  { name: "NVIDIA RTX 3080 (Laptop)",    score: 64,  tier: "mid",      tag: "Laptop" },
  { name: "NVIDIA RTX 3070 (Laptop)",    score: 58,  tier: "mid",      tag: "Laptop" },
  { name: "AMD RX 7700S (Laptop)",       score: 56,  tier: "mid",      tag: "Laptop" },
];

const RESOLUTION_MULTIPLIER = { "1080p": 1.0, "1440p": 1.35, "4K": 1.8 };

function calcBottleneck(cpuScore, gpuScore, resolution) {
  const gpuAdj = gpuScore * (RESOLUTION_MULTIPLIER[resolution] || 1);
  const ratio = cpuScore / gpuAdj;
  if (ratio < 0.75) return { pct: Math.round((1 - ratio) * 100), type: "CPU", severity: ratio < 0.55 ? "high" : "medium" };
  if (ratio > 1.35) return { pct: Math.round((1 - 1 / ratio) * 100), type: "GPU", severity: ratio > 1.6 ? "high" : "medium" };
  return { pct: Math.round(Math.abs(ratio - 1) * 100), type: "balanced", severity: "low" };
}

function getUpgradePath(result, cpu, gpu) {
  if (result.type === "CPU" && result.severity === "high") {
    const newScore = Math.round(gpu.score * 0.85);
    const match = CPUS.find(c => Math.abs(c.score - newScore) < 5);
    return match ? `Actualiza a un ${match.name} para eliminar el cuello de botella` : "Considera un CPU de gama alta para este GPU";
  }
  if (result.type === "GPU" && result.severity === "high") {
    const newScore = Math.round(cpu.score * 1.1);
    const match = GPUS.find(g => Math.abs(g.score - newScore) < 6);
    return match ? `Actualiza a una ${match.name} para eliminar el cuello de botella` : "Considera una GPU de mayor tier";
  }
  return null;
}

function getRecs(result, cpu, gpu, resolution) {
  const upgrade = getUpgradePath(result, cpu, gpu);
  if (result.type === "balanced") return [
    "Excelente combinación — sin cuello de botella significativo.",
    `Tu setup está equilibrado para jugar a ${resolution}.`,
    "Considera activar HAGS y ReBAR/SAM en BIOS para más rendimiento.",
    "Pine Opti puede mejorar estos FPS entre 5–15% con sus optimizaciones.",
  ];
  if (result.type === "CPU") return [
    `Tu ${cpu.name} está limitando la ${gpu.name}.`,
    result.severity === "high"
      ? "El cuello de botella es severo — actualizar el CPU dará el mayor impacto."
      : "Cuello de botella moderado — optimizar la configuración puede ayudar.",
    `Sube la resolución a ${resolution === "1080p" ? "1440p" : "4K"} para que la GPU trabaje más.`,
    "Activa HAGS y Game Mode en Optimizaciones de Pine Opti.",
    ...(upgrade ? [upgrade] : []),
    "Cierra aplicaciones en segundo plano para liberar núcleos al juego.",
  ];
  return [
    `La ${gpu.name} está limitando el ${cpu.name}.`,
    result.severity === "high"
      ? "El cuello de botella es severo — una nueva GPU es la mejor inversión."
      : "Cuello de botella moderado — baja ajustes gráficos para más FPS.",
    `Baja la resolución a ${resolution === "4K" ? "1440p" : "1080p"} para liberar la GPU.`,
    "Activa ReBAR/SAM en BIOS si tu placa lo soporta.",
    ...(upgrade ? [upgrade] : []),
    "Baja sombras y distancia de render — son los más costosos en GPU.",
  ];
}

export default function Bottleneck() {
  const [cpuQ, setCpuQ] = useState("");
  const [gpuQ, setGpuQ] = useState("");
  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedGpu, setSelectedGpu] = useState(null);
  const [resolution, setResolution] = useState("1080p");
  const [showCpuList, setShowCpuList] = useState(false);
  const [showGpuList, setShowGpuList] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const filteredCpus = CPUS.filter(c =>
    c.name.toLowerCase().includes(cpuQ.toLowerCase()) &&
    (!showNew || c.tag === "2025" || c.tag === "2024")
  );
  const filteredGpus = GPUS.filter(g =>
    g.name.toLowerCase().includes(gpuQ.toLowerCase()) &&
    (!showNew || g.tag === "2025" || g.tag === "2024")
  );

  const result = selectedCpu && selectedGpu ? calcBottleneck(selectedCpu.score, selectedGpu.score, resolution) : null;
  const recs = result ? getRecs(result, selectedCpu, selectedGpu, resolution) : [];

  const severityColor = { low: "#14ff72", medium: "#ffaa00", high: "#ff4444" };
  const color = result ? severityColor[result.severity] : "#14ff72";

  const tierLabel = { flagship: "FLAGSHIP", high: "HIGH-END", mid: "MID-RANGE", entry: "ENTRY", legacy: "LEGACY" };
  const tierColor = {
    flagship: { text: "#d926ff", bg: "rgba(217,38,255,0.1)" },
    high:     { text: "#14ff72", bg: "rgba(20,255,114,0.08)" },
    mid:      { text: "#00ccff", bg: "rgba(0,204,255,0.08)" },
    entry:    { text: "rgba(255,255,255,0.45)", bg: "rgba(255,255,255,0.04)" },
    legacy:   { text: "rgba(255,255,255,0.25)", bg: "rgba(255,255,255,0.02)" },
  };

  const ItemRow = ({ item, onClick }) => {
    const tc = tierColor[item.tier] || tierColor.entry;
    return (
      <div onClick={onClick}
        style={{ padding: "8px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, transition: "background 0.1s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {item.name}
            {item.tag && (
              <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 4, background: item.tag === "2025" ? "rgba(20,255,114,0.15)" : item.tag === "2024" ? "rgba(0,204,255,0.12)" : "rgba(255,170,0,0.12)", color: item.tag === "2025" ? "#14ff72" : item.tag === "2024" ? "#00ccff" : "#ffaa00", letterSpacing: "0.06em" }}>
                {item.tag}
              </span>
            )}
          </div>
          <div style={{ fontSize: 9, marginTop: 1, padding: "1px 5px", borderRadius: 3, background: tc.bg, color: tc.text, display: "inline-block", fontWeight: 700, letterSpacing: "0.06em" }}>
            {tierLabel[item.tier]}
          </div>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", marginLeft: 8, flexShrink: 0 }}>
          {item.score}
        </span>
      </div>
    );
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px" }} className="page-enter">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(20,255,114,0.2),rgba(20,255,114,0.06))", border: "1px solid rgba(20,255,114,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cpu size={18} style={{ color: "#14ff72" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>Cuello de Botella</h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {CPUS.length} CPUs · {GPUS.length} GPUs · RTX 50xx · RX 9000 · Ryzen 9000
            </p>
          </div>
        </div>
        <button onClick={() => setShowNew(!showNew)} style={{ padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: showNew ? "rgba(20,255,114,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${showNew ? "rgba(20,255,114,0.3)" : "rgba(255,255,255,0.08)"}`, color: showNew ? "#14ff72" : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, transition: "all 0.13s" }}>
          {showNew ? "✓ Solo 2024–2025" : "Filtrar nuevos"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Resolución */}
          <div className="card" style={{ padding: "16px 18px" }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Resolución de juego</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["1080p", "1440p", "4K"].map(r => (
                <button key={r} onClick={() => setResolution(r)} style={{ flex: 1, padding: "9px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", background: resolution === r ? "rgba(20,255,114,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${resolution === r ? "rgba(20,255,114,0.4)" : "rgba(255,255,255,0.08)"}`, color: resolution === r ? "#14ff72" : "rgba(255,255,255,0.5)", transition: "all 0.12s" }}>{r}</button>
              ))}
            </div>
          </div>

          {/* CPU */}
          <div className="card" style={{ padding: "16px 18px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Cpu size={14} style={{ color: "#14ff72" }} />
              <span className="section-label">Procesador (CPU) — {CPUS.length} modelos</span>
            </div>
            <div onClick={() => { setShowCpuList(!showCpuList); setShowGpuList(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
              {selectedCpu ? (
                <div>
                  <div style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{selectedCpu.name}</div>
                  <div style={{ fontSize: 9, color: tierColor[selectedCpu.tier]?.text || "#fff" }}>{tierLabel[selectedCpu.tier]}{selectedCpu.tag ? ` · ${selectedCpu.tag}` : ""}</div>
                </div>
              ) : <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Busca o selecciona tu CPU...</span>}
              <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>
            {showCpuList && (
              <div style={{ position: "absolute", left: 16, right: 16, top: "100%", marginTop: 4, zIndex: 50, background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
                <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <input autoFocus value={cpuQ} onChange={e => setCpuQ(e.target.value)} placeholder="Buscar CPU (ej: i9, Ryzen 9, 9800X3D)..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fff", outline: "none", border: "none" }} />
                </div>
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {filteredCpus.map(c => <ItemRow key={c.name} item={c} onClick={() => { setSelectedCpu(c); setShowCpuList(false); setCpuQ(""); }} />)}
                  {filteredCpus.length === 0 && <div style={{ padding: "16px", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Sin resultados</div>}
                </div>
              </div>
            )}
          </div>

          {/* GPU */}
          <div className="card" style={{ padding: "16px 18px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Microchip size={14} style={{ color: "#00ccff" }} />
              <span className="section-label">Tarjeta Gráfica (GPU) — {GPUS.length} modelos</span>
            </div>
            <div onClick={() => { setShowGpuList(!showGpuList); setShowCpuList(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
              {selectedGpu ? (
                <div>
                  <div style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{selectedGpu.name}</div>
                  <div style={{ fontSize: 9, color: tierColor[selectedGpu.tier]?.text || "#fff" }}>{tierLabel[selectedGpu.tier]}{selectedGpu.tag ? ` · ${selectedGpu.tag}` : ""}</div>
                </div>
              ) : <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Busca o selecciona tu GPU...</span>}
              <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>
            {showGpuList && (
              <div style={{ position: "absolute", left: 16, right: 16, top: "100%", marginTop: 4, zIndex: 50, background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
                <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <input autoFocus value={gpuQ} onChange={e => setGpuQ(e.target.value)} placeholder="Buscar GPU (ej: 5060 Ti, RTX 4090, RX 7900)..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fff", outline: "none", border: "none" }} />
                </div>
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {filteredGpus.map(g => <ItemRow key={g.name} item={g} onClick={() => { setSelectedGpu(g); setShowGpuList(false); setGpuQ(""); }} />)}
                  {filteredGpus.length === 0 && <div style={{ padding: "16px", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Sin resultados</div>}
                </div>
              </div>
            )}
          </div>

          {/* Comparación visual si hay selección */}
          {selectedCpu && selectedGpu && (
            <div className="card" style={{ padding: "16px 18px" }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Comparación de rendimiento</div>
              {[
                { label: `CPU · ${selectedCpu.name}`, value: Math.min(100, selectedCpu.score), gradient: "linear-gradient(90deg,#14ff72,#00ccff)", note: `Score ${selectedCpu.score}` },
                { label: `GPU · ${selectedGpu.name}`, value: Math.min(100, selectedGpu.score), gradient: "linear-gradient(90deg,#00ccff,#d926ff)", note: `Score ${selectedGpu.score}` },
              ].map(bar => (
                <div key={bar.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 5 }}>
                    <span style={{ color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>{bar.label}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>{bar.note}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${bar.value}%`, background: bar.gradient, borderRadius: 99, transition: "width 0.7s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 0 8px rgba(20,255,114,0.3)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultado */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result ? (
            <>
              <div className="card" style={{ padding: "20px", textAlign: "center", border: `1px solid ${color}30`, background: `${color}05` }}>
                <div className="section-label" style={{ marginBottom: 16 }}>Resultado del análisis</div>
                <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
                  <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
                      strokeDasharray={`${result.pct} ${100 - result.pct}`} strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 0.6s ease", filter: `drop-shadow(0 0 5px ${color}70)` }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: "JetBrains Mono, monospace", letterSpacing: "-0.04em", lineHeight: 1 }}>{result.pct}%</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginTop: 4 }}>{result.type === "balanced" ? "Balanceado" : result.type}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 4 }}>
                  {result.type === "balanced" ? "✅ Sin cuello de botella" : `⚠️ Cuello de botella: ${result.type}`}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {result.severity === "high" ? "Severo" : result.severity === "medium" ? "Moderado" : "Mínimo"}
                </div>
              </div>

              <div className="card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Zap size={12} style={{ color: "#14ff72" }} />
                  <span className="section-label">Recomendaciones</span>
                </div>
                {recs.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 10.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, marginBottom: 6 }}>
                    <span style={{ color: "#14ff72", flexShrink: 0, marginTop: 1 }}>›</span> {r}
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: "14px 16px", background: "rgba(20,255,114,0.04)", border: "1px solid rgba(20,255,114,0.1)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Pine Opti puede mejorar</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#14ff72", letterSpacing: "-0.04em", fontFamily: "JetBrains Mono, monospace" }}>+5–15%</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>FPS extra con optimizaciones activas</div>
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: "40px 20px", textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Cpu size={36} style={{ color: "rgba(255,255,255,0.1)", marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginBottom: 14 }}>
                Selecciona tu CPU y GPU para ver el análisis de cuello de botella
              </p>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", lineHeight: 1.6 }}>
                {CPUS.length} CPUs disponibles · {GPUS.length} GPUs disponibles<br />
                Incluye RTX 50xx, RX 9000, Ryzen 9000, Core Ultra
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
