<!--
  Looping fake terminal that shows an attestation verify run, then a
  psql query. Each step is one of:
    t=0  pause `d` ms
    t=1  type a command character-by-character (`p` flips to red prompt)
    t=2  emit a static line in `c`-color
    t=3  blank line
  After running through all steps, idle for 4.5s and start over so the
  hero stays alive. The body auto-scrolls to bottom on every line emit
  but uses overflow-anchor:none so the page itself doesn't jump.
-->

<script lang="ts">
  import { onMount } from "svelte";

  type Step =
    | { t: 0; d: number }
    | { t: 1; p: number; s: string; d: number }
    | { t: 2; c: string; s: string }
    | { t: 3 };

  const TERM_STEPS: Step[] = [
    { t: 1, p: 0, s: "$ teesql attest --verify", d: 30 },
    { t: 0, d: 380 },
    { t: 2, c: "m", s: "→ requesting attestation quote..." },
    { t: 0, d: 480 },
    { t: 2, c: "ok", s: "✓ quote signed by Intel TDX" },
    { t: 0, d: 220 },
    { t: 2, c: "ok", s: "✓ RTMR1  guest kernel       verified" },
    { t: 0, d: 200 },
    { t: 2, c: "ok", s: "✓ RTMR2  boot parameters    verified" },
    { t: 0, d: 200 },
    { t: 2, c: "ok", s: "✓ RTMR3  application layer  verified" },
    { t: 0, d: 240 },
    { t: 2, c: "ok", s: "✓ dstack runtime            v0.5.3" },
    { t: 0, d: 200 },
    { t: 2, c: "ok", s: "✓ image digest              matches build" },
    { t: 0, d: 700 },
    { t: 3 },
    { t: 2, c: "p", s: "ATTESTED — this database is running in a verified TEE." },
    { t: 0, d: 950 },
    { t: 3 },
    { t: 1, p: 0, s: '$ psql "postgres://attested.teesql.io/mydb"', d: 26 },
    { t: 0, d: 380 },
    { t: 1, p: 0, s: "teesql=# SELECT 'hello, sealed world';", d: 30 },
    { t: 0, d: 280 },
    { t: 2, c: "r", s: "       ?column?       " },
    { t: 2, c: "r", s: "──────────────────────" },
    { t: 2, c: "r", s: " hello, sealed world  " },
    { t: 2, c: "r", s: "(1 row)" },
  ];

  function colorClass(c: string): string {
    switch (c) {
      case "p": return "text-mint font-semibold";
      case "c": return "text-ink-strong";
      case "m": return "text-ink-faint";
      case "r": return "text-ink-body";
      case "ok": return "text-mint";
      case "e": return "text-danger";
      default: return "text-ink-body";
    }
  }

  let lines = $state<{ html: string; cls: string }[]>([]);
  let body: HTMLDivElement | null = $state(null);

  onMount(() => {
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
        const idx = lines.length - 1;
        lines[idx] = { html: parts.join(""), cls: lines[idx].cls };
        if (body) body.scrollTop = body.scrollHeight;
        await sleep(delay + Math.random() * 12);
        if (cancelled) return;
      }
    }

    async function run() {
      while (!cancelled) {
        lines = [];
        for (const step of TERM_STEPS) {
          if (cancelled) return;
          if (step.t === 0) {
            await sleep(step.d);
          } else if (step.t === 1) {
            const cls = step.p ? "text-danger" : "text-mint";
            lines = [...lines, { html: "", cls }];
            await typeText(step.s, step.d);
            const idx = lines.length - 1;
            lines[idx] = {
              html: step.s,
              cls: step.p ? "text-danger" : "text-ink-strong",
            };
          } else if (step.t === 2) {
            lines = [...lines, { html: step.s, cls: colorClass(step.c) }];
          } else if (step.t === 3) {
            lines = [...lines, { html: "", cls: "" }];
          }
          if (body) body.scrollTop = body.scrollHeight;
        }
        await sleep(4500);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  });
</script>

<div>
  <div class="rounded-[10px] border border-rule overflow-hidden bg-surface-deep shadow-[0_0_80px_-25px_rgba(52,211,153,0.25)]">
    <div class="flex items-center px-3 py-2 bg-surface-bar gap-1.5 border-b border-rule">
      <div class="w-[9px] h-[9px] rounded-full bg-[#ff5f57]"></div>
      <div class="w-[9px] h-[9px] rounded-full bg-[#febc2e]"></div>
      <div class="w-[9px] h-[9px] rounded-full bg-[#28c840]"></div>
      <div class="flex-1 text-center font-mono text-[0.68rem] text-ink-dim">
        teesql shell
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-[6px] h-[6px] rounded-full bg-mint animate-[pulse_2s_ease-in-out_infinite]"></span>
        <span class="font-mono text-[0.6rem] text-mint tracking-[0.12em]">
          LIVE
        </span>
      </div>
    </div>
    <div
      bind:this={body}
      class="p-5 font-mono text-[0.76rem] leading-[1.95] h-[340px] overflow-y-auto scrollbar-none [overflow-anchor:none] [overscroll-behavior:contain]"
    >
      {#each lines as line, i (i)}
        <div class={line.cls}>{line.html || " "}</div>
      {/each}
      <span class="inline-block w-[7px] h-[13px] bg-mint align-middle animate-[blink_1s_step-end_infinite]"></span>
    </div>
  </div>
</div>
