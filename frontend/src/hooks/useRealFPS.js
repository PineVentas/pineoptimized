import { useEffect, useState, useRef } from "react";

export function useRealFPS() {
  const [fps, setFps] = useState(null);
  const frameRef  = useRef(0);
  const lastRef   = useRef(performance.now());
  const rafRef    = useRef(null);

  useEffect(() => {
    const tick = (now) => {
      frameRef.current++;
      const elapsed = now - lastRef.current;
      if (elapsed >= 500) {
        const currentFps = Math.round((frameRef.current / elapsed) * 1000);
        setFps(currentFps);
        frameRef.current = 0;
        lastRef.current  = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return fps;
}
