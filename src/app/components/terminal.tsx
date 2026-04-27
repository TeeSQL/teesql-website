"use client";

import { useEffect, useRef, useState } from "react";

type Step =
  | { t: 0; d: number }
  | { t: 1; p: number; s: string; d: number }
  | { t: 2; c: string; s: string }
  | { t: 3 };


const TERM_STEPS: Step[] = [
  { t: 1, p: 0, s: "$ teesql attest --verify", d: 30 },
  { t: 0, d: 380 },
  { t: 2, c: "m", s: "\u2192 requesting attestation quote..." },
  { t: 0, d: 480 },
  { t: 2, c: "ok", s: "\u2713 quote signed by Intel TDX" },
  { t: 0, d: 220 },
  { t: 2, c: "ok", s: "\u2713 RTMR1  guest kernel       verified" },
  { t: 0, d: 200 },
  { t: 2, c: "ok", s: "\u2713 RTMR2  boot parameters    verified" },
  { t: 0, d: 200 },
  { t: 2, c: "ok", s: "\u2713 RTMR3  application layer  verified" },
  { t: 0, d: 240 },
  { t: 2, c: "ok", s: "\u2713 dstack runtime            v0.5.3" },
  { t: 0, d: 200 },
  { t: 2, c: "ok", s: "\u2713 image digest              matches build" },
  { t: 0, d: 700 },
  { t: 3 },
  { t: 2, c: "p", s: "ATTESTED \u2014 this database is running in a verified TEE." },
  { t: 0, d: 950 },
  { t: 3 },
  { t: 1, p: 0, s: '$ psql "postgres://attested.teesql.io/mydb"', d: 26 },
  { t: 0, d: 380 },
  { t: 1, p: 0, s: "teesql=# SELECT 'hello, sealed world';", d: 30 },
  { t: 0, d: 280 },
  { t: 2, c: "r", s: "       ?column?       " },
  { t: 2, c: "r", s: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500" },
  { t: 2, c: "r", s: " hello, sealed world  " },
  { t: 2, c: "r", s: "(1 row)" },
];

function colorClass(c: string) {
  switch (c) {
    case "p":
      return "text-mint font-semibold";
    case "c":
      return "text-ink-strong";
    case "m":
      return "text-ink-faint";
    case "r":
      return "text-ink-body";
    case "ok":
      return "text-mint";
    case "e":
      return "text-danger";
    default:
      return "text-ink-body";
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<{ html: string; cls: string }[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const id = setTimeout(r, ms);
        if (cancelled) clearTimeout(id);
      });

    async function typeText(text: string, delay: number) {
      const parts: string[] = [];
      for (let i = 0; i < text.length; i++) {
        parts.push(text[i]);
        setLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            html: parts.join(""),
            cls: next[next.length - 1].cls,
          };
          return next;
        });
        if (bodyRef.current)
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        await sleep(delay + Math.random() * 12);
        if (cancelled) return;
      }
    }

    async function run() {
      while (!cancelled) {
        setLines([]);

        for (const step of TERM_STEPS) {
          if (cancelled) return;
          if (step.t === 0) {
            await sleep(step.d);
          } else if (step.t === 1) {
            const cls = step.p ? "text-danger" : "text-mint";
            setLines((prev) => [...prev, { html: "", cls }]);
            await typeText(step.s, step.d);
            setLines((prev) => {
              const next = [...prev];
              next[next.length - 1] = {
                html: step.s,
                cls: step.p ? "text-danger" : "text-ink-strong",
              };
              return next;
            });
          } else if (step.t === 2) {
            setLines((prev) => [
              ...prev,
              { html: step.s, cls: colorClass(step.c) },
            ]);
          } else if (step.t === 3) {
            setLines((prev) => [...prev, { html: "", cls: "" }]);
          }
          if (bodyRef.current)
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }

        await sleep(4500);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="rounded-[10px] border border-rule overflow-hidden bg-surface-deep shadow-[0_0_80px_-25px_rgba(52,211,153,0.25)]">
        <div className="flex items-center px-3 py-2 bg-surface-bar gap-1.5 border-b border-rule">
          <div className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]" />
          <div className="w-[9px] h-[9px] rounded-full bg-[#febc2e]" />
          <div className="w-[9px] h-[9px] rounded-full bg-[#28c840]" />
          <div className="flex-1 text-center font-mono text-[0.68rem] text-ink-dim">
            teesql shell
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-[6px] h-[6px] rounded-full bg-mint animate-[pulse_2s_ease-in-out_infinite]" />
            <span className="font-mono text-[0.6rem] text-mint tracking-[0.12em]">
              LIVE
            </span>
          </div>
        </div>
        <div
          ref={bodyRef}
          className="p-5 font-mono text-[0.76rem] leading-[1.95] h-[340px] overflow-y-auto scrollbar-none [overflow-anchor:none] [overscroll-behavior:contain]"
        >
          {lines.map((l, i) => (
            <div key={i} className={l.cls}>
              {l.html || "\u00A0"}
            </div>
          ))}
          <span className="inline-block w-[7px] h-[13px] bg-mint align-middle animate-[blink_1s_step-end_infinite]" />
        </div>
      </div>
    </div>
  );
}
