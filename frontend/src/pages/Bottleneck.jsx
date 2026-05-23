import { useState, useEffect, useRef } from "react";
import { Cpu, Microchip, ChevronDown, Zap, TrendingUp, ArrowRight, Info, Gamepad2 } from "lucide-react";

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

// FPS base estimates at score=100 for each game (GPU-adjusted, 1080p)
const GAME_FPS_BASE = [
  { name: "Valorant",         icon: "🎯", cpuW: 0.60, gpuW: 0.40, base: 420 },
  { name: "CS2",              icon: "💣", cpuW: 0.55, gpuW: 0.45, base: 380 },
  { name: "Free Fire (Emu)",  icon: "🔥", cpuW: 0.45, gpuW: 0.55, base: 240 },
  { name: "PUBG",             icon: "🪖", cpuW: 0.40, gpuW: 0.60, base: 160 },
  { name: "Fortnite",         icon: "🏗️", cpuW: 0.42, gpuW: 0.58, base: 200 },
  { name: "Apex Legends",     icon: "🏆", cpuW: 0.45, gpuW: 0.55, base: 220 },
  { name: "Warzone",          icon: "🎖️", cpuW: 0.38, gpuW: 0.62, base: 140 },
];

function estimateFPS(game, cpuScore, gpuScore, resolution) {
  const resMult = { "1080p": 1.0, "1440p": 0.68, "4K": 0.42 };
  const eff = (cpuScore * game.cpuW + gpuScore * game.gpuW) / 100;
  return Math.round(game.base * eff * (resMult[resolution] || 1));
}

function calcBottleneck(cpuScore, gpuScore, resolution) {
  const gpuAdj = gpuScore * (RESOLUTION_MULTIPLIER[resolution] || 1);
  const ratio = cpuScore / gpuAdj;
  const cpuUtil = Math.min(100, Math.round(ratio > 1 ? 100 : ratio * 100));
  const gpuUtil = Math.min(100, Math.round(ratio < 1 ? 100 : (1 / ratio) * 100));
  if (ratio < 0.75) return { pct: Math.round((1 - ratio) * 100), type: "CPU", severity: ratio < 0.55 ? "high" : "medium", cpuUtil, gpuUtil };
  if (ratio > 1.35) return { pct: Math.round((1 - 1 / ratio) * 100), type: "GPU", severity: ratio > 1.6 ? "high" : "medium", cpuUtil, gpuUtil };
  return { pct: Math.round(Math.abs(ratio - 1) * 100), type: "balanced", severity: "low", cpuUtil, gpuUtil };
}

function getUpgradeCard(result, cpu, gpu) {
  if (result.type === "CPU") {
    const targetScore = Math.round(gpu.score * (RESOLUTION_MULTIPLIER["1080p"]) * 0.88);
    const candidates = CPUS.filter(c => c.score >= targetScore && c.score <= targetScore + 18 && c.name !== cpu.name);
    const match = candidates[0] || CPUS.find(c => c.tier === "flagship" && c.score > cpu.score);
    const gain = match ? Math.round(((match.score - cpu.score) / cpu.score) * 100 * 0.7) : 0;
    return match ? { component: "CPU", current: cpu.name, upgrade: match.name, gain, tier: match.tier } : null;
  }
  if (result.type === "GPU") {
    const targetScore = Math.round(cpu.score * 1.05);
    const candidates = GPUS.filter(g => g.score >= targetScore && g.score <= targetScore + 20 && g.name !== gpu.name);
    const match = candidates[0] || GPUS.find(g => g.tier === "high" && g.score > gpu.score);
    const gain = match ? Math.round(((match.score - gpu.score) / gpu.score) * 100 * 0.8) : 0;
    return match ? { component: "GPU", current: gpu.name, upgrade: match.name, gain, tier: match.tier } : null;
  }
  return null;
}

function getRecs(result, cpu, gpu, resolution) {
  if (result.type === "balanced") return [
    "Excelente combinación — sin cuello de botella significativo.",
    `Tu setup está bien equilibrado para ${resolution}.`,
    "Activa HAGS y ReBAR/SAM en BIOS para exprimir más rendimiento.",
    "Pine Opti puede mejorar estos FPS entre 5–15% con sus optimizaciones.",
  ];
  if (result.type === "CPU") return [
    `Tu ${cpu.name} está limitando la ${gpu.name}.`,
    result.severity === "high"
      ? "Cuello de botella severo — actualizar el CPU tendrá el mayor impacto."
      : "Cuello de botella moderado — optimizar la configuración puede ayudar bastante.",
    `Sube la resolución a ${resolution === "1080p" ? "1440p" : "4K"} para que la GPU trabaje más.`,
    "Activa HAGS y Game Mode en Optimizaciones de Pine Opti.",
    "Cierra apps en segundo plano para liberar núcleos al juego.",
  ];
  return [
    `La ${gpu.name} está limitando el ${cpu.name}.`,
    result.severity === "high"
      ? "Cuello de botella severo — una nueva GPU es la mejor inversión."
      : "Cuello de botella moderado — baja los ajustes gráficos para más FPS.",
    `Baja la resolución a ${resolution === "4K" ? "1440p" : "1080p"} para liberar la GPU.`,
    "Activa ReBAR/SAM en BIOS si tu placa y GPU lo soportan.",
    "Baja sombras y distancia de render — son los más costosos en GPU.",
  ];
}

// Animated count-up hook
function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    const start = prev.current;
    const diff = target - start;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
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
  const [animate, setAnimate] = useState(false);

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
  const upgradeCard = result ? getUpgradeCard(result, selectedCpu, selectedGpu) : null;

  useEffect(() => {
    if (result) { setAnimate(false); requestAnimationFrame(() => setAnimate(true)); }
  }, [selectedCpu, selectedGpu, resolution]);

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

  const animPct = useCountUp(animate && result ? result.pct : 0);
  const animCpuUtil = useCountUp(animate && result ? result.cpuUtil : 0);
  const animGpuUtil = useCountUp(animate && result ? result.gpuUtil : 0);

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

      {/* ── Selector row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        {/* CPU */}
        <div className="card" style={{ padding: "14px 16px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Cpu size={13} style={{ color: "#14ff72" }} />
            <span className="section-label">CPU — {CPUS.length} modelos</span>
          </div>
          <div onClick={() => { setShowCpuList(!showCpuList); setShowGpuList(false); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: selectedCpu ? "rgba(20,255,114,0.06)" : "rgba(255,255,255,0.04)", borderRadius: 9, border: `1px solid ${selectedCpu ? "rgba(20,255,114,0.25)" : "rgba(255,255,255,0.08)"}`, cursor: "pointer" }}>
            {selectedCpu ? (
              <div>
                <div style={{ fontSize: 11.5, color: "#fff", fontWeight: 700 }}>{selectedCpu.name}</div>
                <div style={{ fontSize: 9, color: tierColor[selectedCpu.tier]?.text }}>{tierLabel[selectedCpu.tier]}{selectedCpu.tag ? ` · ${selectedCpu.tag}` : ""} · Score {selectedCpu.score}</div>
              </div>
            ) : <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Selecciona tu CPU...</span>}
            <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          </div>
          {showCpuList && (
            <div style={{ position: "absolute", left: 16, right: 16, top: "calc(100% - 4px)", zIndex: 50, background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
              <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <input autoFocus value={cpuQ} onChange={e => setCpuQ(e.target.value)} placeholder="Buscar (ej: i9, Ryzen 9, 9800X3D)..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fff", outline: "none", border: "none" }} />
              </div>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {filteredCpus.map(c => <ItemRow key={c.name} item={c} onClick={() => { setSelectedCpu(c); setShowCpuList(false); setCpuQ(""); }} />)}
                {filteredCpus.length === 0 && <div style={{ padding: "16px", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Sin resultados</div>}
              </div>
            </div>
          )}
        </div>

        {/* GPU */}
        <div className="card" style={{ padding: "14px 16px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Microchip size={13} style={{ color: "#d926ff" }} />
            <span className="section-label">GPU — {GPUS.length} modelos</span>
          </div>
          <div onClick={() => { setShowGpuList(!showGpuList); setShowCpuList(false); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: selectedGpu ? "rgba(217,38,255,0.06)" : "rgba(255,255,255,0.04)", borderRadius: 9, border: `1px solid ${selectedGpu ? "rgba(217,38,255,0.25)" : "rgba(255,255,255,0.08)"}`, cursor: "pointer" }}>
            {selectedGpu ? (
              <div>
                <div style={{ fontSize: 11.5, color: "#fff", fontWeight: 700 }}>{selectedGpu.name}</div>
                <div style={{ fontSize: 9, color: tierColor[selectedGpu.tier]?.text }}>{tierLabel[selectedGpu.tier]}{selectedGpu.tag ? ` · ${selectedGpu.tag}` : ""} · Score {selectedGpu.score}</div>
              </div>
            ) : <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Selecciona tu GPU...</span>}
            <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          </div>
          {showGpuList && (
            <div style={{ position: "absolute", left: 16, right: 16, top: "calc(100% - 4px)", zIndex: 50, background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
              <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <input autoFocus value={gpuQ} onChange={e => setGpuQ(e.target.value)} placeholder="Buscar (ej: RTX 4090, RX 9070, 5060 Ti)..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fff", outline: "none", border: "none" }} />
              </div>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {filteredGpus.map(g => <ItemRow key={g.name} item={g} onClick={() => { setSelectedGpu(g); setShowGpuList(false); setGpuQ(""); }} />)}
                {filteredGpus.length === 0 && <div style={{ padding: "16px", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Sin resultados</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Resolution ── */}
      <div className="card" style={{ padding: "12px 16px", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", flexShrink: 0 }}>Resolución</span>
          <div style={{ display: "flex", gap: 6, flex: 1 }}>
            {["1080p", "1440p", "4K"].map(r => (
              <button key={r} onClick={() => setResolution(r)} style={{ flex: 1, padding: "7px", borderRadius: 7, fontSize: 11.5, fontWeight: 700, cursor: "pointer", background: resolution === r ? "rgba(20,255,114,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${resolution === r ? "rgba(20,255,114,0.4)" : "rgba(255,255,255,0.07)"}`, color: resolution === r ? "#14ff72" : "rgba(255,255,255,0.4)", transition: "all 0.12s" }}>{r}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main analysis ── */}
      {result ? (
        <>
          {/* ── Balance bar ── */}
          <div className="card" style={{ padding: "18px 20px", marginBottom: 10, border: `1px solid ${color}22`, background: `linear-gradient(135deg,${color}04,transparent)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#14ff72", letterSpacing: "0.1em", textTransform: "uppercase" }}>CPU</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: result.type === "CPU" ? "#ff4444" : "#14ff72", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{animCpuUtil}%</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Utilización</div>
              </div>
              <div style={{ flex: 1, margin: "0 16px" }}>
                <div style={{ textAlign: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: "0.04em" }}>
                    {result.type === "balanced" ? "✅ BALANCEADO" : `⚠️ CUELLO: ${result.type}`}
                  </span>
                </div>
                {/* Tug-of-war bar */}
                <div style={{ position: "relative", height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, height: "100%",
                    width: `${animate ? result.cpuUtil : 0}%`,
                    background: result.type === "CPU" ? "linear-gradient(90deg,#ff444499,#ff4444)" : "linear-gradient(90deg,#14ff7299,#14ff72)",
                    borderRadius: "99px 0 0 99px",
                    transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: result.type === "CPU" ? "0 0 10px #ff444488" : "0 0 10px #14ff7288",
                  }} />
                  <div style={{
                    position: "absolute", right: 0, top: 0, height: "100%",
                    width: `${animate ? result.gpuUtil : 0}%`,
                    background: result.type === "GPU" ? "linear-gradient(270deg,#ff444499,#ff4444)" : "linear-gradient(270deg,#d926ff99,#d926ff)",
                    borderRadius: "0 99px 99px 0",
                    transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: result.type === "GPU" ? "0 0 10px #ff444488" : "0 0 10px #d926ff88",
                  }} />
                </div>
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "JetBrains Mono, monospace", letterSpacing: "-0.05em" }}>{animPct}%</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {result.severity === "high" ? "severo" : result.severity === "medium" ? "moderado" : "mínimo"}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#d926ff", letterSpacing: "0.1em", textTransform: "uppercase" }}>GPU</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: result.type === "GPU" ? "#ff4444" : "#d926ff", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>{animGpuUtil}%</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Utilización</div>
              </div>
            </div>

            {/* CPU vs GPU score bars */}
            {[
              { label: selectedCpu.name, score: selectedCpu.score, color: result.type === "CPU" ? "#ff4444" : "#14ff72", grad: result.type === "CPU" ? "linear-gradient(90deg,#ff444470,#ff4444)" : "linear-gradient(90deg,#14ff7270,#14ff72)", icon: "CPU" },
              { label: selectedGpu.name, score: selectedGpu.score, color: result.type === "GPU" ? "#ff4444" : "#d926ff", grad: result.type === "GPU" ? "linear-gradient(90deg,#ff444470,#ff4444)" : "linear-gradient(90deg,#d926ff70,#d926ff)", icon: "GPU" },
            ].map((bar, i) => (
              <div key={i} style={{ marginBottom: i === 0 ? 8 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
                  <span style={{ color: bar.color, fontWeight: 700, fontSize: 9, letterSpacing: "0.06em" }}>{bar.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "72%", textAlign: "right" }}>{bar.label}</span>
                  <span style={{ color: bar.color, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, flexShrink: 0 }}>{bar.score}</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: animate ? `${Math.min(100, (bar.score / 120) * 100)}%` : "0%", background: bar.grad, borderRadius: 99, transition: "width 1s cubic-bezier(0.22,1,0.36,1) 0.1s", boxShadow: `0 0 6px ${bar.color}55` }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── FPS estimator ── */}
          <div className="card" style={{ padding: "16px 18px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <Gamepad2 size={13} style={{ color: "#14ff72" }} />
              <span className="section-label">FPS estimados a {resolution}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>valores aproximados</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {GAME_FPS_BASE.map(game => {
                const fps = estimateFPS(game, selectedCpu.score, selectedGpu.score, resolution);
                const quality = fps >= 144 ? "#14ff72" : fps >= 60 ? "#ffaa00" : "#ff4444";
                const label = fps >= 144 ? "144+" : fps >= 60 ? "smooth" : "bajo";
                return (
                  <div key={game.name} style={{ padding: "10px 8px", borderRadius: 9, background: "rgba(255,255,255,0.025)", border: `1px solid rgba(255,255,255,0.06)`, textAlign: "center", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{game.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: quality, fontFamily: "JetBrains Mono, monospace", lineHeight: 1, letterSpacing: "-0.04em" }}>
                      {fps}
                    </div>
                    <div style={{ fontSize: 8, color: quality, fontWeight: 700, letterSpacing: "0.06em", marginTop: 2, textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", marginTop: 3, lineHeight: 1.3 }}>{game.name}</div>
                  </div>
                );
              })}
              {/* Pine Opti boost card */}
              <div style={{ padding: "10px 8px", borderRadius: 9, background: "rgba(20,255,114,0.05)", border: "1px solid rgba(20,255,114,0.15)", textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>⚡</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#14ff72", fontFamily: "JetBrains Mono, monospace", lineHeight: 1, letterSpacing: "-0.04em" }}>+15%</div>
                <div style={{ fontSize: 8, color: "#14ff72", fontWeight: 700, letterSpacing: "0.06em", marginTop: 2, textTransform: "uppercase" }}>con Pine</div>
                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", marginTop: 3, lineHeight: 1.3 }}>Optimizaciones</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: upgradeCard ? "1fr 1fr" : "1fr", gap: 10, marginBottom: 0 }}>
            {/* Upgrade path */}
            {upgradeCard && (
              <div className="card" style={{ padding: "16px 18px", background: `rgba(${upgradeCard.component === "CPU" ? "20,255,114" : "217,38,255"},0.04)`, border: `1px solid rgba(${upgradeCard.component === "CPU" ? "20,255,114" : "217,38,255"},0.18)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <TrendingUp size={13} style={{ color: upgradeCard.component === "CPU" ? "#14ff72" : "#d926ff" }} />
                  <span className="section-label">Upgrade recomendado</span>
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {upgradeCard.component} actual
                </div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginBottom: 8, lineHeight: 1.4, wordBreak: "break-word" }}>{upgradeCard.current}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <ArrowRight size={11} style={{ color: upgradeCard.component === "CPU" ? "#14ff72" : "#d926ff", flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.4, wordBreak: "break-word" }}>{upgradeCard.upgrade}</div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, background: upgradeCard.component === "CPU" ? "rgba(20,255,114,0.1)" : "rgba(217,38,255,0.1)", border: `1px solid rgba(${upgradeCard.component === "CPU" ? "20,255,114" : "217,38,255"},0.25)` }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: upgradeCard.component === "CPU" ? "#14ff72" : "#d926ff", fontFamily: "JetBrains Mono, monospace" }}>+{upgradeCard.gain}%</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>FPS estimado</span>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="card" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Zap size={12} style={{ color: "#14ff72" }} />
                <span className="section-label">Recomendaciones</span>
              </div>
              {recs.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 10.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, marginBottom: 5 }}>
                  <span style={{ color: "#14ff72", flexShrink: 0, marginTop: 1, fontSize: 12 }}>›</span>{r}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.15 }}>⚖️</div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, marginBottom: 10 }}>
            Selecciona tu <strong style={{ color: "#14ff72" }}>CPU</strong> y <strong style={{ color: "#d926ff" }}>GPU</strong> para ver el análisis completo
          </p>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", lineHeight: 1.8 }}>
            {CPUS.length} CPUs · {GPUS.length} GPUs · Estimación de FPS por juego · Upgrade path<br />
            RTX 50xx · RX 9000 · Ryzen 9000 · Core Ultra 200
          </div>
        </div>
      )}
    </div>
  );
}
