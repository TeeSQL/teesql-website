"use client";

import { useEffect, useRef, useState } from "react";

export default function Comparison() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
      <div className="p-7 rounded-lg bg-surface-raised border border-rule">
        <div className="font-mono text-[0.66rem] tracking-[0.14em] uppercase text-ink-dim mb-4">
          Every other managed Postgres
        </div>
        <div className="font-mono text-[0.95rem] bg-page px-3 py-2.5 rounded inline-block mb-5 border border-rule">
          <span className="text-ink-body">GRANT </span>
          <span className="text-danger font-semibold">ALL</span>
          <span className="text-ink-body"> TO operator;</span>
        </div>
        <p className="text-[0.95rem] leading-[1.65] text-ink-dim">
          The operator holds your data in the clear.
          <br />
          Security model: &ldquo;trust us.&rdquo;
        </p>
      </div>

      <div className="p-7 rounded-lg bg-mint/[0.06] border border-mint/[0.22] relative overflow-hidden">
        <div
          className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-mint blur-[80px] transition-opacity duration-1000 ${shown ? "opacity-[0.08]" : "opacity-0"}`}
        />
        <div className="font-mono text-[0.66rem] tracking-[0.14em] uppercase text-mint mb-4 relative">
          TEESQL
        </div>
        <div className="font-mono text-[0.95rem] bg-mint/[0.05] px-3 py-2.5 rounded inline-block mb-5 border border-mint/[0.18] relative">
          <span className="text-ink-strong">GRANT </span>
          <span className="inline-block min-w-[3.2ch]">
            <span
              className={`transition-all duration-700 delay-500 ${shown ? "opacity-100 text-mint" : "opacity-0"}`}
            >
              NONE
            </span>
          </span>
          <span className="text-ink-strong"> TO operator;</span>
        </div>
        <p className="text-[0.95rem] leading-[1.65] text-ink-strong relative">
          The operator is cryptographically blind.
          <br />
          Enforced by silicon, not policy.
        </p>
      </div>
    </div>
  );
}
