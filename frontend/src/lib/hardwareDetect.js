// Real-time browser-based hardware detection.
// Uses WebGL for GPU + navigator APIs for CPU threads, RAM, network, storage.
export async function detectHardware() {
  let renderer = "", vendor = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
      } else {
        renderer = gl.getParameter(gl.RENDERER) || "";
        vendor = gl.getParameter(gl.VENDOR) || "";
      }
    }
  } catch (e) { /* noop */ }

  let storage_quota_mb = 0, storage_usage_mb = 0;
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      storage_quota_mb = Math.round((est.quota || 0) / 1024 / 1024);
      storage_usage_mb = Math.round((est.usage || 0) / 1024 / 1024);
    } catch (e) { /* noop */ }
  }

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};

  let is_laptop = false;
  try {
    if ("getBattery" in navigator) {
      const battery = await navigator.getBattery();
      // Si tiene batería, es muy probable que sea laptop
      is_laptop = battery !== null;
    }
  } catch (e) { /* noop */ }

  return {
    gpu_renderer: renderer,
    gpu_vendor: vendor,
    cpu_threads: navigator.hardwareConcurrency || 4,
    ram_gb: navigator.deviceMemory || 8,
    platform: navigator.platform || "Win32",
    user_agent: navigator.userAgent || "",
    is_laptop: is_laptop,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      color_depth: window.screen.colorDepth,
      pixel_depth: window.screen.pixelDepth,
      device_pixel_ratio: window.devicePixelRatio,
    },
    connection: {
      effective_type: conn.effectiveType || "4g",
      downlink: conn.downlink || 0,
      rtt: conn.rtt || 0,
      save_data: conn.saveData || false,
    },
    storage_quota_mb,
    storage_usage_mb,
  };
}
