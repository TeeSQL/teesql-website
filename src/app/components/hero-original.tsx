"use client";

import { useEffect, useRef } from "react";

export default function HeroOriginal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 220;
    let raf = 0;
    let firstTime = 0;

    const draw = (t: number) => {
      if (!firstTime) firstTime = t;
      const elapsed = t - firstTime;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.max(1, Math.floor(rect.width * dpr));
      const targetH = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = rect.height * 0.42;
      const ry = rx * 0.82;

      const k = 4.5 + 2.5 * Math.sin(elapsed * 0.00018);
      const rotation = elapsed * 0.00003;
      const kFrac = k - Math.floor(k);
      const sharpness = 1 - 2 * Math.min(kFrac, 1 - kFrac);

      const xs = new Float32Array(N);
      const ys = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + rotation;
        xs[i] = cx + Math.cos(a) * rx;
        ys[i] = cy + Math.sin(a) * ry;
      }

      ctx.strokeStyle = "rgba(200, 205, 213, 0.025)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, rotation, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(200, 205, 213, 0.12)";
      for (let i = 0; i < N; i += 2) {
        ctx.beginPath();
        ctx.arc(xs[i], ys[i], 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      const baseAlpha = 0.038 + 0.032 * sharpness;
      ctx.strokeStyle = `rgba(52, 211, 153, ${baseAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let n = 0; n < N; n++) {
        const target = (n * k) % N;
        const ti = Math.floor(target);
        const tf = target - ti;
        const i1 = ti % N;
        const i2 = (ti + 1) % N;
        const tx = xs[i1] * (1 - tf) + xs[i2] * tf;
        const ty = ys[i1] * (1 - tf) + ys[i2] * tf;
        ctx.moveTo(xs[n], ys[n]);
        ctx.lineTo(tx, ty);
      }
      ctx.stroke();

      if (sharpness > 0.6) {
        const overlayAlpha = 0.06 * (sharpness - 0.6);
        ctx.strokeStyle = `rgba(52, 211, 153, ${overlayAlpha})`;
        ctx.beginPath();
        for (let n = 0; n < N; n++) {
          const target = (n * k) % N;
          const ti = Math.floor(target);
          const tf = target - ti;
          const i1 = ti % N;
          const i2 = (ti + 1) % N;
          const tx = xs[i1] * (1 - tf) + xs[i2] * tf;
          const ty = ys[i1] * (1 - tf) + ys[i2] * tf;
          ctx.moveTo(xs[n], ys[n]);
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
      }

      const navInset = 64;
      const fadeBand = 24;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, rect.width, navInset);
      const fade = ctx.createLinearGradient(0, navInset, 0, navInset + fadeBand);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, navInset, rect.width, fadeBand);
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
