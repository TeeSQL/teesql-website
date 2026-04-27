"use client";

import { useEffect, useRef, useState } from "react";

export default function ArchLine() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-[2px] bg-rule relative overflow-visible">
      <div
        className={`h-full bg-mint shadow-[0_0_8px_rgba(52,211,153,0.15)] transition-all duration-[1500ms] ease-out ${go ? "w-full" : "w-0"}`}
      />
      <div className="absolute -right-px -top-1 border-[5px] border-transparent border-l-[6px] border-l-mint" />
    </div>
  );
}
