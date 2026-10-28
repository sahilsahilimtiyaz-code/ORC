"use client";
import { useEffect, useRef } from "react";

/* ============================================================================
   Rotating Earth globe — real NASA Blue Marble equirect texture, rendered as a
   per-pixel orthographic sphere on canvas. Auto-rotates, drag to spin with
   inertia, atmosphere rim glow, optional faction pins. Pauses when hidden or
   offscreen; honors prefers-reduced-motion (static, drag still active).
   ========================================================================== */

type Faction = { id: string; label: string; lat: number; lon: number };

export default function Globe({
  factions = [],
  selectedId,
  onSelect,
  size = 460,
  className = "",
}: {
  factions?: Faction[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ theta: -Math.PI / 2.2, vel: 0.0, dragging: false, lastX: 0, picked: "" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // low-power, transparent-friendly context; keep the per-pixel sphere loop
    // inside a fixed pixel budget so phone CPUs hold 30fps: DPR capped at 1.25,
    // canvas side capped at 520px regardless of layout.
    const ctx = canvas.getContext("2d", {
      alpha: true,
      powerPreference: "low-power",
    }) as CanvasRenderingContext2D | null;
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(1.25, window.devicePixelRatio || 1);
    const fit = Math.min(size, canvas.parentElement?.clientWidth || size, 520);
    const W = Math.round(fit * dpr);
    const H = W;
    canvas.width = W;
    canvas.height = H;
    const css = Math.round(W / dpr);
    canvas.style.width = `${css}px`;
    canvas.style.height = `${css}px`;

    const img = new Image();
    img.src = "/textures/earth.jpg";
    img.decoding = "async";

    let tex: ImageData | null = null;
    let stop = false;
    let visible = true;
    const st = stateRef.current;

    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = 1024;
      off.height = 512;
      const octx = off.getContext("2d")!;
      octx.drawImage(img, 0, 0, 1024, 512);
      tex = octx.getImageData(0, 0, 1024, 512);
    };

    // Precompute sphere geometry for every pixel (constant per size).
    const N = W * H;
    const sx = new Float32Array(N); // sphere x
    const sy = new Float32Array(N); // sphere y
    const sz = new Float32Array(N); // sphere z
    const inside = new Uint8Array(N);
    {
      const R = W / 2 - 6;
      for (let py = 0; py < H; py++) {
        const y = (py - H / 2) / R;
        for (let px = 0; px < W; px++) {
          const x = (px - W / 2) / R;
          const r2 = x * x + y * y;
          const i = py * W + px;
          if (r2 <= 1) {
            inside[i] = 1;
            sx[i] = x;
            sy[i] = y;
            sz[i] = Math.sqrt(1 - r2);
          }
        }
      }
    }

    const buf = ctx.createImageData(W, H);
    const d32 = new Uint32Array(buf.data.buffer);
    const TDW = 1024;
    const TDH = 512;
    const tdata = () => (tex ? tex.data : null);

    const render = () => {
      const td = tdata();
      const R = W / 2 - 6;
      const cx = W / 2;
      const cy = H / 2;
      const th = st.theta;
      const cosT = Math.cos(th);
      const sinT = Math.sin(th);
      // light dir (normalized): upper-left-front
      const Lx = -0.5, Ly = 0.42, Lz = 0.76;
      for (let i = 0; i < N; i++) {
        if (!inside[i]) continue;
        const x = sx[i], y = sy[i], z = sz[i];
        // sphere coordinates rotated around Y by theta
        const xr = x * cosT + z * sinT;
        const zr = -x * sinT + z * cosT;
        let r = 0, g = 0, b = 0;
        const ndl = xr * Lx + y * Ly + zr * Lz;
        if (td) {
          const lat = Math.asin(y);
          const lon = Math.atan2(xr, zr);
          let u = ((lon + Math.PI) / (Math.PI * 2)) % 1;
          if (u < 0) u += 1;
          const v = 0.5 - lat / Math.PI;
          const ti = ((Math.min(TDH - 1, (v * TDH) | 0) * TDW + Math.min(TDW - 1, (u * TDW) | 0)) << 2);
          // shading: soft ambient + lambert
          let li = 0.16 + 0.94 * Math.max(0, ndl);
          if (li > 1) li = 1;
          r = td[ti] * li;
          g = td[ti + 1] * li;
          b = td[ti + 2] * li;
          // small specular on oceans (blueish texels catch light)
          if (b > r && b > 40 && ndl > 0) {
            const sp = Math.pow(Math.max(0, ndl), 24) * 96;
            r += sp * 0.55; g += sp * 0.65; b += sp * 0.9;
          }
        }
        // atmosphere rim (view-facing), teal-blue with a gold breath
        const rim = Math.pow(1 - z, 2.4);
        r += rim * 40;
        g += rim * 86;
        b += rim * 128;
        const a = z < 0.985 ? 255 : 0;
        d32[i] = ((a << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0)) >>> 0;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.putImageData(buf, 0, 0);

      // selectable faction pins, front-facing only
      for (const f of factions) {
        const lat = (f.lat * Math.PI) / 180;
        const lon = (f.lon * Math.PI) / 180;
        const x = Math.cos(lat) * Math.sin(lon);
        const y = -Math.sin(lat);
        const z = Math.cos(lat) * Math.cos(lon);
        const xr = x * cosT + z * sinT;
        const zr = -x * sinT + z * cosT;
        if (zr <= 0.12) continue; // back side
        const px = cx + xr * R;
        const py = cy + y * R;
        const sel = f.id === selectedId;
        ctx.beginPath();
        if (sel) {
          ctx.arc(px, py, 9, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(240,215,140,0.85)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.arc(px, py, sel ? 4.4 : 3.4, 0, Math.PI * 2);
        ctx.fillStyle = sel ? "#f0d78c" : "rgba(212,175,55,0.9)";
        ctx.shadowColor = "rgba(240,215,140,0.9)";
        ctx.shadowBlur = sel ? 14 : 7;
        (ctx as any).fill();
        ctx.shadowBlur = 0;
        st.picked = sel ? f.id : "";
      }

      // thin gold equator halo
      ctx.beginPath();
      ctx.arc(cx, cy, R + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212,175,55,0.32)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    let raf = 0;
    let last = 0;
    let lastFrame = 0;
    const loop = (t: number) => {
      if (stop) return;
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        last = t;
        return;
      }
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      if (!tex || t - lastFrame < 33) return; // ~30fps
      lastFrame = t;
      if (!reduced && !st.dragging) {
        st.theta += (0.14 * dt) + st.vel * dt;
        st.vel *= 0.95;
      }
      render();
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver((es) => {
      visible = es[0]?.isIntersecting ?? true;
    }, { threshold: 0.05 });
    io.observe(canvas);

    // drag to spin (pointer + touch)
    const down = (e: PointerEvent) => {
      st.dragging = true;
      st.lastX = e.clientX;
      st.vel = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!st.dragging) return;
      const dx = e.clientX - st.lastX;
      st.lastX = e.clientX;
      st.theta += dx / 240;
      st.vel = dx * 0.12;
      if (tex) render();
    };
    const up = () => {
      st.dragging = false;
    };
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });

    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [size, factions, selectedId]);

  return (
    <canvas
      ref={canvasRef}
      className={`mx-auto block cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`}
      aria-label="Rotating globe of Earth"
      role="img"
    />
  );
}
