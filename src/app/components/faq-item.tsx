"use client";

import { useState } from "react";

export default function FaqItem({
  q,
  children,
}: {
  q: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-rule py-5 cursor-pointer first:border-t"
      onClick={() => setOpen(!open)}
    >
      <div className="font-sans text-base font-medium text-ink flex justify-between items-center">
        {q}
        <span className="font-mono text-lg text-ink-dim">{open ? "\u2212" : "+"}</span>
      </div>
      <div
        className={`text-[0.92rem] text-ink-dim leading-[1.75] overflow-hidden transition-all duration-400 ${open ? "max-h-[400px] pt-3" : "max-h-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
