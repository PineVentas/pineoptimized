import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Cpu, Microchip, MemoryStick, Monitor, Zap, Gamepad2, ChevronRight, RefreshCw, CheckCircle2, AlertTriangle, Rocket, Gauge, Battery, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const CPU_MODELS = [
  { label: "— Detectar automáticamente —", value: null, cores: null, threads: null },
  // Intel 14th Gen
  { label: "Intel Core i9-14900K / KS", value: "i9-14900K", cores: 24, threads: 32, tier: "flagship" },
  { label: "Intel Core i7-14700K / KF", value: "i7-14700K", cores: 20, threads: 28, tier: "high" },
  { label: "Intel Core i5-14600K / KF", value: "i5-14600K", cores: 14, threads: 20, tier: "high" },
  { label: "Intel Core i5-14400F", value: "i5-14400F", cores: 10, threads: 16, tier: "mid" },
  { label: "Intel Core i3-14100F", value: "i3-14100F", cores: 4, threads: 8, tier: "entry" },
  // Intel 13th Gen
  { label: "Intel Core i9-13900K / KS", value: "i9-13900K", cores: 24, threads: 32, tier: "flagship" },
  { label: "Intel Core i7-13700K / KF", value: "i7-13700K", cores: 16, threads: 24, tier: "high" },
  { label: "Intel Core i5-13600K / KF", value: "i5-13600K", cores: 14, threads: 20, tier: "high" },
  { label: "Intel Core i5-13400F", value: "i5-13400F", cores: 10, threads: 16, tier: "mid" },
  { label: "Intel Core i3-13100F", value: "i3-13100F", cores: 4, threads: 8, tier: "entry" },
  // Intel 12th Gen
  { label: "Intel Core i9-12900K / KS", value: "i9-12900K", cores: 16, threads: 24, tier: "flagship" },
  { label: "Intel Core i7-12700K / KF", value: "i7-12700K", cores: 12, threads: 20, tier: "high" },
  { label: "Intel Core i5-12600K / KF", value: "i5-12600K", cores: 10, threads: 16, tier: "high" },
  { label: "Intel Core i5-12400F", value: "i5-12400F", cores: 6, threads: 12, tier: "mid" },
  { label: "Intel Core i3-12100F", value: "i3-12100F", cores: 4, threads: 8, tier: "entry" },
  // Intel 10th-11th Gen
  { label: "Intel Core i9-10900K", value: "i9-10900K", cores: 10, threads: 20, tier: "high" },
  { label: "Intel Core i7-10700K", value: "i7-10700K", cores: 8, threads: 16, tier: "mid" },
  { label: "Intel Core i5-10400F", value: "i5-10400F", cores: 6, threads: 12, tier: "mid" },
  { label: "Intel Core i5-11400F", value: "i5-11400F", cores: 6, threads: 12, tier: "mid" },
  // AMD Ryzen 7000 series
  { label: "AMD Ryzen 9 7950X / 7950X3D", value: "R9-7950X", cores: 16, threads: 32, tier: "flagship" },
  { label: "AMD Ryzen 9 7900X / 7900X3D", value: "R9-7900X", cores: 12, threads: 24, tier: "flagship" },
  { label: "AMD Ryzen 7 7800X3D", value: "R7-7800X3D", cores: 8, threads: 16, tier: "high" },
  { label: "AMD Ryzen 7 7700X / 7700", value: "R7-7700X", cores: 8, threads: 16, tier: "high" },
  { label: "AMD Ryzen 5 7600X / 7600", value: "R5-7600X", cores: 6, threads: 12, tier: "mid" },
  { label: "AMD Ryzen 5 7500F", value: "R5-7500F", cores: 6, threads: 12, tier: "mid" },
  // AMD Ryzen 5000 series
  { label: "AMD Ryzen 9 5950X", value: "R9-5950X", cores: 16, threads: 32, tier: "flagship" },
  { label: "AMD Ryzen 9 5900X", value: "R9-5900X", cores: 12, threads: 24, tier: "flagship" },
  { label: "AMD Ryzen 7 5800X3D", value: "R7-5800X3D", cores: 8, threads: 16, tier: "high" },
  { label: "AMD Ryzen 7 5800X / 5700X", value: "R7-5800X", cores: 8, threads: 16, tier: "high" },
  { label: "AMD Ryzen 5 5600X / 5600", value: "R5-5600X", cores: 6, threads: 12, tier: "mid" },
  { label: "AMD Ryzen 5 5500", value: "R5-5500", cores: 6, threads: 12, tier: "mid" },
  { label: "AMD Ryzen 5 3600", value: "R5-3600", cores: 6, threads: 12, tier: "mid" },
  { label: "AMD Ryzen 7 3700X", value: "R7-3700X", cores: 8, threads: 16, tier: "mid" },
  // AMD Budget
  { label: "AMD Ryzen 5 4600G (iGPU)", value: "R5-4600G", cores: 6, threads: 12, tier: "mid" },
  { label: "AMD Ryzen 5 3400G (iGPU)", value: "R5-3400G", cores: 4, threads: 8, tier: "entry" },
  // Older
  { label: "Intel Core i7-9700K", value: "i7-9700K", cores: 8, threads: 8, tier: "mid" },
  { label: "Intel Core i5-9600K", value: "i5-9600K", cores: 6, threads: 6, tier: "mid" },
  { label: "Intel Core i7-8700K", value: "i7-8700K", cores: 6, threads: 12, tier: "mid" },
  { label: "Intel Core i5-8400", value: "i5-8400", cores: 6, threads: 6, tier: "entry" },
  { label: "AMD Ryzen 5 2600", value: "R5-2600", cores: 6, threads: 12, tier: "entry" },
  { label: "Intel Core i3-10100F", value: "i3-10100F", cores: 4, threads: 8, tier: "entry" },
  { label: "Intel Pentium / Celeron (legacy)", value: "pentium", cores: 2, threads: 4, tier: "legacy" },
];

const GPU_MODELS = [
  { label: "— Detectar vía WebGL —", value: null },
  // NVIDIA RTX 50 series
  { label: "NVIDIA GeForce RTX 5090", value: "RTX 5090", tier: "flagship", vram: 32 },
  { label: "NVIDIA GeForce RTX 5080", value: "RTX 5080", tier: "flagship", vram: 16 },
  { label: "NVIDIA GeForce RTX 5070 Ti", value: "RTX 5070 Ti", tier: "flagship", vram: 16 },
  { label: "NVIDIA GeForce RTX 5070", value: "RTX 5070", tier: "high", vram: 12 },
  { label: "NVIDIA GeForce RTX 5060 Ti", value: "RTX 5060 Ti", tier: "high", vram: 16 },
  { label: "NVIDIA GeForce RTX 5060", value: "RTX 5060", tier: "mid", vram: 8 },
  // NVIDIA RTX 40 series
  { label: "NVIDIA GeForce RTX 4090", value: "RTX 4090", tier: "flagship", vram: 24 },
  { label: "NVIDIA GeForce RTX 4080 Super / 4080", value: "RTX 4080", tier: "flagship", vram: 16 },
  { label: "NVIDIA GeForce RTX 4070 Ti Super / Ti", value: "RTX 4070 Ti", tier: "high", vram: 16 },
  { label: "NVIDIA GeForce RTX 4070 Super / 4070", value: "RTX 4070", tier: "high", vram: 12 },
  { label: "NVIDIA GeForce RTX 4060 Ti", value: "RTX 4060 Ti", tier: "mid", vram: 16 },
  { label: "NVIDIA GeForce RTX 4060", value: "RTX 4060", tier: "mid", vram: 8 },
  { label: "NVIDIA GeForce RTX 4050 (Laptop)", value: "RTX 4050", tier: "entry", vram: 6 },
  // NVIDIA RTX 30 series
  { label: "NVIDIA GeForce RTX 3090 Ti / 3090", value: "RTX 3090", tier: "high", vram: 24 },
  { label: "NVIDIA GeForce RTX 3080 Ti / 3080", value: "RTX 3080", tier: "high", vram: 12 },
  { label: "NVIDIA GeForce RTX 3070 Ti / 3070", value: "RTX 3070", tier: "mid", vram: 8 },
  { label: "NVIDIA GeForce RTX 3060 Ti", value: "RTX 3060 Ti", tier: "mid", vram: 8 },
  { label: "NVIDIA GeForce RTX 3060", value: "RTX 3060", tier: "mid", vram: 12 },
  { label: "NVIDIA GeForce RTX 3050", value: "RTX 3050", tier: "entry", vram: 8 },
  // NVIDIA RTX 20 series
  { label: "NVIDIA GeForce RTX 2080 Ti", value: "RTX 2080 Ti", tier: "high", vram: 11 },
  { label: "NVIDIA GeForce RTX 2080 Super / 2080", value: "RTX 2080", tier: "high", vram: 8 },
  { label: "NVIDIA GeForce RTX 2070 Super / 2070", value: "RTX 2070", tier: "mid", vram: 8 },
  { label: "NVIDIA GeForce RTX 2060 Super / 2060", value: "RTX 2060", tier: "entry", vram: 8 },
  // NVIDIA GTX 16 series
  { label: "NVIDIA GeForce GTX 1660 Ti / Super", value: "GTX 1660 Ti", tier: "entry", vram: 6 },
  { label: "NVIDIA GeForce GTX 1660", value: "GTX 1660", tier: "entry", vram: 6 },
  { label: "NVIDIA GeForce GTX 1650 Super / 1650", value: "GTX 1650", tier: "entry", vram: 4 },
  // NVIDIA GTX 10 series (legacy)
  { label: "NVIDIA GeForce GTX 1080 Ti", value: "GTX 1080 Ti", tier: "mid", vram: 11 },
  { label: "NVIDIA GeForce GTX 1080", value: "GTX 1080", tier: "mid", vram: 8 },
  { label: "NVIDIA GeForce GTX 1070 Ti / 1070", value: "GTX 1070", tier: "mid", vram: 8 },
  { label: "NVIDIA GeForce GTX 1060 6GB", value: "GTX 1060", tier: "entry", vram: 6 },
  { label: "NVIDIA GeForce GTX 1050 Ti", value: "GTX 1050 Ti", tier: "legacy", vram: 4 },
  // AMD RX 9000 series
  { label: "AMD Radeon RX 9070 XT / 9070", value: "RX 9070 XT", tier: "high", vram: 16 },
  { label: "AMD Radeon RX 9060 XT / 9060", value: "RX 9060 XT", tier: "mid", vram: 16 },
  // AMD RX 7000 series
  { label: "AMD Radeon RX 7900 XTX", value: "RX 7900 XTX", tier: "flagship", vram: 24 },
  { label: "AMD Radeon RX 7900 XT / GRE", value: "RX 7900 XT", tier: "high", vram: 20 },
  { label: "AMD Radeon RX 7800 XT", value: "RX 7800 XT", tier: "high", vram: 16 },
  { label: "AMD Radeon RX 7700 XT / 7700", value: "RX 7700 XT", tier: "mid", vram: 12 },
  { label: "AMD Radeon RX 7600 XT / 7600", value: "RX 7600 XT", tier: "mid", vram: 16 },
  // AMD RX 6000 series
  { label: "AMD Radeon RX 6950 XT / 6900 XT", value: "RX 6900 XT", tier: "high", vram: 16 },
  { label: "AMD Radeon RX 6800 XT / 6800", value: "RX 6800 XT", tier: "high", vram: 16 },
  { label: "AMD Radeon RX 6750 XT / 6700 XT", value: "RX 6700 XT", tier: "mid", vram: 12 },
  { label: "AMD Radeon RX 6650 XT / 6600 XT", value: "RX 6600 XT", tier: "entry", vram: 8 },
  { label: "AMD Radeon RX 6500 XT", value: "RX 6500 XT", tier: "entry", vram: 4 },
  // AMD RX 5000 series
  { label: "AMD Radeon RX 5700 XT / 5700", value: "RX 5700 XT", tier: "mid", vram: 8 },
  { label: "AMD Radeon RX 5600 XT", value: "RX 5600 XT", tier: "entry", vram: 6 },
  { label: "AMD Radeon RX 5500 XT", value: "RX 5500 XT", tier: "entry", vram: 8 },
  // Intel Arc
  { label: "Intel Arc B580 / B570", value: "Arc B580", tier: "mid", vram: 12 },
  { label: "Intel Arc A770 / A750", value: "Arc A770", tier: "mid", vram: 16 },
  { label: "Intel Arc A580", value: "Arc A580", tier: "mid", vram: 8 },
  { label: "Intel Arc A380", value: "Arc A380", tier: "entry", vram: 6 },
  // Integrated
  { label: "Intel UHD / Iris Xe (integrada)", value: "Intel UHD", tier: "integrated", vram: 0 },
  { label: "AMD Radeon Graphics (iGPU Ryzen)", value: "AMD iGPU", tier: "integrated", vram: 0 },
];

// ── Hardware detection helpers ──────────────────────────────────────────────

function detectGPU() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { name: "Desconocida", vendor: "Desconocido", tier: "entry" };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return { name: "GPU Integrada / Desconocida", vendor: "Desconocido", tier: "entry" };
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "";
    const vendor   = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)   || "";
    return { name: renderer, vendor, tier: classifyGPU(renderer) };
  } catch {
    return { name: "Desconocida", vendor: "Desconocido", tier: "entry" };
  }
}

function classifyGPU(name) {
  const n = name.toUpperCase();
  // RTX 50 series flagship
  if (/(RTX\s*5090|RTX\s*5080|RTX\s*5070\s*TI)/.test(n)) return "flagship";
  // RTX 40 flagship
  if (/(RTX\s*4090|RTX\s*4080)/.test(n)) return "flagship";
  // RX 7900 XTX
  if (/(RX\s*7900\s*XTX)/.test(n)) return "flagship";
  // RTX 50 high / RX 9000
  if (/(RTX\s*5070|RTX\s*5060\s*TI|RX\s*9070)/.test(n)) return "high";
  // RTX 40 high / RX 7900 / RTX 30 high
  if (/(RTX\s*4070|RTX\s*3090|RTX\s*3080|RX\s*7900|RX\s*7800|RX\s*6800|RTX\s*2080\s*TI)/.test(n)) return "high";
  // RTX 50 mid / RX 9060 / Arc B
  if (/(RTX\s*5060|RX\s*9060|ARC\s*B)/.test(n)) return "mid";
  // RTX 40 mid / RTX 30 mid / RX 7700 / RX 6700
  if (/(RTX\s*4060|RTX\s*3070|RTX\s*3060|RX\s*7[67]00|RX\s*6[67]00|GTX\s*1080|RTX\s*2070|RTX\s*2080|ARC\s*A)/.test(n)) return "mid";
  // Entry
  if (/(GTX\s*1660|GTX\s*1650|RX\s*580|RX\s*570|RTX\s*2060|GTX\s*1070|RTX\s*3050|RX\s*5[567]00|RX\s*6[45]00)/.test(n)) return "entry";
  // Legacy
  if (/(GTX\s*9[0-9]{2}|GTX\s*10[0-5]0|GTX\s*1060|GTX\s*970|RX\s*4[0-9]{2})/.test(n)) return "legacy";
  // Integrated
  if (/(IRIS|UHD|INTEGRATED|INTEL\s*HD|VEGA\s*[0-9]|RADEON\s*GRAPHICS)/.test(n)) return "integrated";
  return "entry";
}

function classifyCPU(cores, threads) {
  if (cores >= 16) return "flagship";
  if (cores >= 12) return "high";
  if (cores >= 8)  return "mid";
  if (cores >= 6)  return "entry";
  return "legacy";
}

function classifyRAM(gb) {
  if (gb >= 32) return "flagship";
  if (gb >= 16) return "high";
  if (gb >= 8)  return "mid";
  return "entry";
}

// ── Recommendation engine ───────────────────────────────────────────────────

const TIER_ORDER = { flagship: 5, high: 4, mid: 3, entry: 2, integrated: 1, legacy: 0 };

function getOverallTier(gpu, cpu, ram) {
  const scores = [
    TIER_ORDER[gpu.tier] ?? 2,
    TIER_ORDER[cpu] ?? 2,
    TIER_ORDER[ram] ?? 2,
  ];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 4.2) return "flagship";
  if (avg >= 3.3) return "high";
  if (avg >= 2.3) return "mid";
  if (avg >= 1.3) return "entry";
  return "legacy";
}

const GAME_RECS = {
  flagship: [
    { id: "cs2",      reason: "Tu hardware maneja CS2 a 400+ FPS fácilmente." },
    { id: "valorant", reason: "GPU flagship = resolución 4K o 1440p 360Hz sin problema." },
    { id: "cod",      reason: "Warzone con Ray Tracing activado y 144+ FPS garantizados." },
  ],
  high: [
    { id: "valorant", reason: "Alto rendimiento ideal para Valorant competitivo a 240Hz." },
    { id: "fortnite", reason: "Fortnite con DX12 y Epic settings a 144+ FPS." },
    { id: "apex",     reason: "Apex Legends a 1080p/1440p con configuración alta." },
  ],
  mid: [
    { id: "apex",    reason: "Tu PC maneja Apex Legends bien a 1080p Medium/High." },
    { id: "pubg",    reason: "PUBG a 1080p Ultra/High con frames estables." },
    { id: "lol",     reason: "LoL funciona perfecto — GPU no es el limitante aquí." },
  ],
  entry: [
    { id: "lol",       reason: "LoL está optimizado para hardware de gama entrada." },
    { id: "free-fire", reason: "Free Fire en emulador con buena optimización." },
    { id: "roblox",    reason: "Roblox a 1080p Medium sin problemas." },
  ],
  legacy: [
    { id: "free-fire", reason: "Free Fire (emulador) a ajustes bajos para más FPS." },
    { id: "roblox",    reason: "Roblox a ajustes bajos todavía funciona bien." },
  ],
  integrated: [
    { id: "free-fire", reason: "GPU integrada: Free Fire emulado a ajustes bajos." },
    { id: "roblox",    reason: "Roblox funciona con GPU integrada a ajustes mínimos." },
  ],
};

const POWER_RECS = {
  flagship: { id: "ultimate", name: "Máximo Rendimiento",     color: "#14ff72", icon: Rocket, reason: "Tu hardware de gama alta merece el plan sin límites." },
  high:     { id: "ultimate", name: "Máximo Rendimiento",     color: "#14ff72", icon: Rocket, reason: "Hardware potente — exprime cada FPS con el plan Ultimate." },
  mid:      { id: "high",     name: "Alto Rendimiento",       color: "#ffd166", icon: Gauge,  reason: "Equilibrio perfecto para tu hardware de gama media." },
  entry:    { id: "high",     name: "Alto Rendimiento",       color: "#ffd166", icon: Gauge,  reason: "Mejor relación rendimiento/temperatura para gama entrada." },
  legacy:   { id: "balanced", name: "Equilibrado",            color: "#00ccff", icon: Battery, reason: "Hardware antiguo — el plan equilibrado es más estable." },
  integrated: { id: "balanced", name: "Equilibrado",          color: "#00ccff", icon: Battery, reason: "GPU integrada — el plan equilibrado evita el sobrecalentamiento." },
};

const GAME_INFO = {
  "cs2":      { name: "Counter-Strike 2",       color: "#ff8c00", gradient: "from-amber-500 via-orange-500 to-red-500" },
  "valorant": { name: "Valorant",               color: "#ff4655", gradient: "from-rose-500 via-red-600 to-rose-700" },
  "cod":      { name: "COD: Warzone / MW3",     color: "#4caf50", gradient: "from-green-700 via-green-500 to-emerald-400" },
  "fortnite": { name: "Fortnite",               color: "#a855f7", gradient: "from-purple-500 via-fuchsia-500 to-pink-500" },
  "apex":     { name: "Apex Legends",           color: "#ff4444", gradient: "from-red-600 via-orange-500 to-amber-400" },
  "pubg":     { name: "PUBG: Battlegrounds",    color: "#f59e0b", gradient: "from-amber-600 via-yellow-500 to-amber-400" },
  "lol":      { name: "League of Legends",      color: "#06b6d4", gradient: "from-cyan-500 via-blue-500 to-indigo-600" },
  "free-fire":{ name: "Free Fire (Emulador)",   color: "#f97316", gradient: "from-orange-500 via-red-500 to-pink-500" },
  "roblox":   { name: "Roblox",                 color: "#ef4444", gradient: "from-red-500 via-red-600 to-rose-700" },
};

const TIER_META = {
  flagship:   { label: "FLAGSHIP",   color: "#d926ff", bg: "rgba(217,38,255,0.1)",  border: "rgba(217,38,255,0.3)" },
  high:       { label: "HIGH-END",   color: "#14ff72", bg: "rgba(20,255,114,0.08)", border: "rgba(20,255,114,0.25)" },
  mid:        { label: "MID-RANGE",  color: "#00ccff", bg: "rgba(0,204,255,0.08)",  border: "rgba(0,204,255,0.25)" },
  entry:      { label: "ENTRY",      color: "#ffd166", bg: "rgba(255,209,102,0.08)", border: "rgba(255,209,102,0.25)" },
  legacy:     { label: "LEGACY",     color: "#ff4444", bg: "rgba(255,68,68,0.08)",  border: "rgba(255,68,68,0.25)" },
  integrated: { label: "INTEGRADA",  color: "#8b8b8b", bg: "rgba(139,139,139,0.08)", border: "rgba(139,139,139,0.25)" },
};

// ── Scan animation phases ───────────────────────────────────────────────────

const SCAN_PHASES = [
  { pct: 15, label: "Detectando procesador..." },
  { pct: 35, label: "Analizando memoria RAM..." },
  { pct: 55, label: "Escaneando GPU vía WebGL..." },
  { pct: 75, label: "Calculando tier del sistema..." },
  { pct: 90, label: "Generando recomendaciones..." },
  { pct: 100, label: "¡Análisis completo!" },
];

// ── Main component ──────────────────────────────────────────────────────────

export default function MiPC() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [scanPct, setScanPct] = useState(0);
  const [hw, setHw] = useState(null);
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [showCPUDropdown, setShowCPUDropdown] = useState(false);
  const [showGPUDropdown, setShowGPUDropdown] = useState(false);

  const runScan = useCallback(() => {
    setScanning(true);
    setHw(null);
    setPhase(0);
    setScanPct(0);
    setShowCPUDropdown(false);
    setShowGPUDropdown(false);

    const delays = [0, 300, 600, 900, 1200, 1600];
    const timers = SCAN_PHASES.map((p, i) =>
      setTimeout(() => { setPhase(i); setScanPct(p.pct); }, delays[i])
    );

    setTimeout(() => {
      const detectedThreads = navigator.hardwareConcurrency || 4;
      const detectedCores   = Math.max(1, Math.floor(detectedThreads / 2));
      const ramGB           = navigator.deviceMemory || 4;
      const detectedGpu     = detectGPU();

      let threads, cores, cpuName, cpuTier;
      if (selectedCPU) {
        threads  = selectedCPU.threads;
        cores    = selectedCPU.cores;
        cpuName  = selectedCPU.label;
        cpuTier  = selectedCPU.tier;
      } else {
        threads  = detectedThreads;
        cores    = detectedCores;
        cpuName  = null;
        cpuTier  = classifyCPU(detectedCores, detectedThreads);
      }

      let gpu;
      if (selectedGPU) {
        gpu = { name: selectedGPU.value, vendor: selectedGPU.value.includes("AMD") || selectedGPU.value.startsWith("RX") ? "Advanced Micro Devices" : selectedGPU.value.includes("Intel") || selectedGPU.value.includes("Arc") ? "Intel Corporation" : "NVIDIA Corporation", tier: selectedGPU.tier, vram: selectedGPU.vram, manual: true };
      } else {
        gpu = detectedGpu;
      }

      const ramTier = classifyRAM(ramGB);
      const overall = getOverallTier(gpu, cpuTier, ramTier);

      setHw({ threads, cores, ramGB, gpu, cpuTier, ramTier, overall, cpuName, cpuManual: !!selectedCPU });
      setScanning(false);
      toast.success("Hardware analizado correctamente");
    }, 2000);

    return () => timers.forEach(clearTimeout);
  }, [selectedCPU, selectedGPU]);

  useEffect(() => { runScan(); }, []);

  const gameRecs  = hw ? (GAME_RECS[hw.overall]  || GAME_RECS.entry)  : [];
  const powerRec  = hw ? (POWER_RECS[hw.overall] || POWER_RECS.entry) : null;
  const tierMeta  = hw ? (TIER_META[hw.overall]  || TIER_META.entry)  : null;

  const gpuTierMeta = hw ? (TIER_META[hw.gpu.tier] || TIER_META.entry) : null;
  const cpuTierMeta = hw ? (TIER_META[hw.cpuTier]  || TIER_META.entry) : null;
  const ramTierMeta = hw ? (TIER_META[hw.ramTier]  || TIER_META.entry) : null;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px" }} className="page-enter">

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg,rgba(20,255,114,0.2),rgba(20,255,114,0.06))",
            border: "1px solid rgba(20,255,114,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Monitor size={18} style={{ color: "#14ff72" }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>Mi PC</h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Detección de hardware · Recomendaciones automáticas
            </p>
          </div>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 9, cursor: scanning ? "not-allowed" : "pointer",
            background: scanning ? "rgba(255,255,255,0.04)" : "rgba(20,255,114,0.1)",
            border: `1px solid ${scanning ? "rgba(255,255,255,0.08)" : "rgba(20,255,114,0.3)"}`,
            color: scanning ? "rgba(255,255,255,0.3)" : "#14ff72",
            fontSize: 12, fontWeight: 700, transition: "all 0.13s",
          }}
        >
          <RefreshCw size={13} style={{ animation: scanning ? "spin 1s linear infinite" : "none" }} />
          {scanning ? "Escaneando..." : "Re-escanear"}
        </button>
      </div>

      {/* ── Manual CPU/GPU selector ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {/* CPU Selector */}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
            Procesador (manual)
          </div>
          <button
            onClick={() => { setShowCPUDropdown(v => !v); setShowGPUDropdown(false); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 9, cursor: "pointer",
              background: selectedCPU ? "rgba(20,255,114,0.08)" : "rgba(11,15,26,0.9)",
              border: `1px solid ${selectedCPU ? "rgba(20,255,114,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: selectedCPU ? "#14ff72" : "rgba(255,255,255,0.4)",
              fontSize: 11, fontWeight: selectedCPU ? 700 : 400, textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
              {selectedCPU ? selectedCPU.label : "— Detectar automáticamente —"}
            </span>
            <ChevronDown size={12} style={{ flexShrink: 0, marginLeft: 8, color: "rgba(255,255,255,0.3)", transform: showCPUDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {showCPUDropdown && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, marginTop: 4,
              background: "rgba(8,12,22,0.98)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              maxHeight: 260, overflowY: "auto",
            }}>
              {CPU_MODELS.map((cpu, i) => (
                <button key={i} onClick={() => { setSelectedCPU(cpu.value ? cpu : null); setShowCPUDropdown(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "8px 14px",
                    background: "transparent", border: "none", cursor: "pointer",
                    fontSize: 11, color: cpu.value ? (cpu.tier === "flagship" ? "#d926ff" : cpu.tier === "high" ? "#14ff72" : cpu.tier === "mid" ? "#00ccff" : cpu.tier === "entry" ? "#ffd166" : "rgba(255,255,255,0.4)") : "rgba(255,255,255,0.25)",
                    borderBottom: i < CPU_MODELS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(20,255,114,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {cpu.label}
                  {cpu.tier && <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.5 }}>· {cpu.cores}C/{cpu.threads}T</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPU Selector */}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
            Tarjeta Gráfica (manual)
          </div>
          <button
            onClick={() => { setShowGPUDropdown(v => !v); setShowCPUDropdown(false); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 9, cursor: "pointer",
              background: selectedGPU ? "rgba(217,38,255,0.08)" : "rgba(11,15,26,0.9)",
              border: `1px solid ${selectedGPU ? "rgba(217,38,255,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: selectedGPU ? "#d926ff" : "rgba(255,255,255,0.4)",
              fontSize: 11, fontWeight: selectedGPU ? 700 : 400, textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
              {selectedGPU ? selectedGPU.label : "— Detectar vía WebGL —"}
            </span>
            <ChevronDown size={12} style={{ flexShrink: 0, marginLeft: 8, color: "rgba(255,255,255,0.3)", transform: showGPUDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {showGPUDropdown && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, marginTop: 4,
              background: "rgba(8,12,22,0.98)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              maxHeight: 260, overflowY: "auto",
            }}>
              {GPU_MODELS.map((gpu, i) => (
                <button key={i} onClick={() => { setSelectedGPU(gpu.value ? gpu : null); setShowGPUDropdown(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "8px 14px",
                    background: "transparent", border: "none", cursor: "pointer",
                    fontSize: 11, color: gpu.value ? (gpu.tier === "flagship" ? "#d926ff" : gpu.tier === "high" ? "#14ff72" : gpu.tier === "mid" ? "#00ccff" : gpu.tier === "entry" ? "#ffd166" : gpu.tier === "integrated" ? "#8b8b8b" : "rgba(255,255,255,0.4)") : "rgba(255,255,255,0.25)",
                    borderBottom: i < GPU_MODELS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(217,38,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {gpu.label}
                  {gpu.vram > 0 && <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.5 }}>· {gpu.vram}GB VRAM</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {(selectedCPU || selectedGPU) && (
        <div style={{ marginBottom: 14, padding: "8px 14px", borderRadius: 8, background: "rgba(20,255,114,0.05)", border: "1px solid rgba(20,255,114,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "rgba(20,255,114,0.8)" }}>
            ⚙️ Selección manual activa — haz clic en Re-escanear para aplicar
          </span>
          <button onClick={() => { setSelectedCPU(null); setSelectedGPU(null); }} style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
            Limpiar
          </button>
        </div>
      )}

      {/* ── Scan progress ── */}
      {scanning && (
        <div className="card" style={{ padding: "24px 28px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#14ff72", boxShadow: "0 0 8px #14ff72", animation: "blink 1s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.04em" }}>
              {SCAN_PHASES[phase]?.label}
            </span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
            <div style={{
              height: "100%", width: `${scanPct}%`,
              background: "linear-gradient(90deg,#14ff72,#00ccff)",
              borderRadius: 99,
              boxShadow: "0 0 12px rgba(20,255,114,0.6)",
              transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
            }} />
          </div>
          <div style={{ fontSize: 10, color: "#14ff72", fontFamily: "JetBrains Mono, monospace", opacity: 0.7 }}>{scanPct}%</div>
        </div>
      )}

      {/* ── Content after scan ── */}
      {hw && !scanning && (
        <>
          {/* ── Overall tier banner ── */}
          <div className="card" style={{
            padding: "18px 24px", marginBottom: 16,
            background: tierMeta.bg,
            border: `1px solid ${tierMeta.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <CheckCircle2 size={20} style={{ color: tierMeta.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                  Sistema clasificado como{" "}
                  <span style={{ color: tierMeta.color }}>{tierMeta.label}</span>
                </div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                  Basado en CPU ({hw.threads} hilos), RAM ({hw.ramGB} GB) y GPU detectada
                </div>
              </div>
            </div>
            <div style={{
              padding: "5px 14px", borderRadius: 99,
              background: tierMeta.bg, border: `1px solid ${tierMeta.border}`,
              fontSize: 10, fontWeight: 800, color: tierMeta.color,
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>
              {tierMeta.label}
            </div>
          </div>

          {/* ── Hardware cards grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>

            {/* CPU */}
            <div className="card" style={{ padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(20,255,114,0.1)", border: "1px solid rgba(20,255,114,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={14} style={{ color: "#14ff72" }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Procesador</div>
                  <div style={{ fontSize: 10, color: cpuTierMeta.color, fontWeight: 700, letterSpacing: "0.06em" }}>{cpuTierMeta.label}</div>
                </div>
              </div>
              {hw.cpuName && (
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 6 }}>
                  {hw.cpuName.replace("— Detectar automáticamente — · ", "")}
                </div>
              )}
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
                {hw.threads}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginLeft: 4 }}>hilos lógicos</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
                {hw.cpuManual ? `${hw.cores} núcleos físicos` : `~${hw.cores} núcleos físicos detectados`}
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (hw.threads / 32) * 100)}%`, background: `linear-gradient(90deg,${cpuTierMeta.color}70,${cpuTierMeta.color})`, borderRadius: 99, transition: "width 0.9s ease" }} />
              </div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                {hw.threads >= 16 ? "Ideal para multitarea y streaming" : hw.threads >= 8 ? "Buen rendimiento en gaming" : "Suficiente para juegos optimizados"}
              </div>
            </div>

            {/* RAM */}
            <div className="card" style={{ padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(0,204,255,0.1)", border: "1px solid rgba(0,204,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MemoryStick size={14} style={{ color: "#00ccff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Memoria RAM</div>
                  <div style={{ fontSize: 10, color: ramTierMeta.color, fontWeight: 700, letterSpacing: "0.06em" }}>{ramTierMeta.label}</div>
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
                {hw.ramGB}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginLeft: 4 }}>GB RAM</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace", marginBottom: 12 }}>
                {hw.ramGB >= 32 ? "Alta capacidad · Streaming OK" : hw.ramGB >= 16 ? "Suficiente para gaming y más" : "Mínimo recomendado para gaming"}
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (hw.ramGB / 64) * 100)}%`, background: `linear-gradient(90deg,${ramTierMeta.color}70,${ramTierMeta.color})`, borderRadius: 99, transition: "width 0.9s ease" }} />
              </div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                {hw.ramGB >= 32 ? "Perfecto para cualquier juego moderno" : hw.ramGB >= 16 ? "Excelente para gaming competitivo" : "Considera actualizar para mejor rendimiento"}
              </div>
            </div>

            {/* GPU */}
            <div className="card" style={{ padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(217,38,255,0.1)", border: "1px solid rgba(217,38,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Microchip size={14} style={{ color: "#d926ff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Tarjeta Gráfica</div>
                  <div style={{ fontSize: 10, color: gpuTierMeta.color, fontWeight: 700, letterSpacing: "0.06em" }}>{gpuTierMeta.label}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 6, wordBreak: "break-word" }}>
                {hw.gpu.name.length > 40 ? hw.gpu.name.substring(0, 38) + "…" : hw.gpu.name}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
                {hw.gpu.vendor || "Proveedor desconocido"}
              </div>
              {hw.gpu.vram > 0 && (
                <div style={{ fontSize: 10, color: "rgba(20,255,114,0.6)", fontFamily: "JetBrains Mono, monospace", marginBottom: 6 }}>
                  {hw.gpu.vram} GB VRAM
                </div>
              )}
              {hw.gpu.manual && (
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginBottom: 6 }}>Selección manual</div>
              )}
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(TIER_ORDER[hw.gpu.tier] ?? 2) / 5 * 100}%`, background: `linear-gradient(90deg,${gpuTierMeta.color}70,${gpuTierMeta.color})`, borderRadius: 99, transition: "width 0.9s ease" }} />
              </div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                {hw.gpu.tier === "integrated" ? "GPU integrada — rendimiento limitado" : `Detectada vía WebGL — ${gpuTierMeta.label}`}
              </div>
            </div>
          </div>

          {/* ── Two-column bottom ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Game profile recommendations */}
            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Gamepad2 size={14} style={{ color: "#14ff72" }} />
                <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Perfiles de juego recomendados
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {gameRecs.map((rec, i) => {
                  const info = GAME_INFO[rec.id];
                  if (!info) return null;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => navigate("/juegos")}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 10, cursor: "pointer", width: "100%", textAlign: "left",
                        background: i === 0 ? `${info.color}10` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${i === 0 ? `${info.color}35` : "rgba(255,255,255,0.07)"}`,
                        transition: "all 0.13s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${info.color}14`; e.currentTarget.style.borderColor = `${info.color}50`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? `${info.color}10` : "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = i === 0 ? `${info.color}35` : "rgba(255,255,255,0.07)"; }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          {i === 0 && (
                            <span style={{ fontSize: 8, fontWeight: 800, background: `${info.color}20`, border: `1px solid ${info.color}40`, color: info.color, padding: "1px 6px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
                              #1 RECOMENDADO
                            </span>
                          )}
                          <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "#fff" : "rgba(255,255,255,0.7)" }}>{info.name}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.45 }}>{rec.reason}</div>
                      </div>
                      <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Power plan + warnings */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Power plan */}
              {powerRec && (
                <div className="card" style={{
                  padding: "18px 20px",
                  background: `${powerRec.color}08`,
                  border: `1px solid ${powerRec.color}25`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Zap size={14} style={{ color: powerRec.color }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                      Plan de energía recomendado
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${powerRec.color}15`, border: `1px solid ${powerRec.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <powerRec.icon size={18} style={{ color: powerRec.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{powerRec.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{powerRec.reason}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/power-plan")}
                    style={{
                      width: "100%", padding: "9px", borderRadius: 8, cursor: "pointer",
                      background: `${powerRec.color}12`, border: `1px solid ${powerRec.color}30`,
                      color: powerRec.color, fontSize: 12, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      transition: "all 0.13s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${powerRec.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${powerRec.color}12`; }}
                  >
                    <Zap size={12} />
                    Ir a Plan de Energía
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}

              {/* Hardware tips */}
              <div className="card" style={{ padding: "16px 18px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <AlertTriangle size={13} style={{ color: "#ffd166" }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Consejos para tu hardware
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    hw.ramGB < 16 && "Considera actualizar a 16 GB RAM para gaming moderno.",
                    hw.gpu.tier === "integrated" && "GPU integrada detectada — los juegos pesados pueden ir lentos.",
                    hw.gpu.tier === "legacy" && "GPU legacy — prioriza juegos optimizados y ajustes bajos.",
                    hw.threads < 8 && "Pocos núcleos detectados — cierra apps en segundo plano.",
                    hw.ramGB >= 16 && hw.gpu.tier !== "integrated" && "Tu hardware está bien configurado para gaming competitivo.",
                    hw.overall === "flagship" && "Hardware premium — exprime cada FPS con las optimizaciones de Pine Opti.",
                  ].filter(Boolean).slice(0, 4).map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                      <span style={{ color: "#14ff72", flexShrink: 0, marginTop: 2 }}>›</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Note about detection ── */}
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", lineHeight: 1.55, margin: 0 }}>
              La detección usa APIs del navegador (hardwareConcurrency, deviceMemory, WebGL). Los valores de RAM y núcleos pueden estar redondeados por privacidad del navegador. Para lectura exacta del hardware, usa la versión .exe de Pine Opti.
            </p>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
