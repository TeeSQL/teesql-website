<!--
  Email-capture form. POSTs to the hub at hub.teesql.com — the only
  consumer is the operator's /admin/waitlist dashboard. Per operator
  policy the row is stored only in the hub's Postgres and never
  mirrored to Resend or any third-party CRM.

  On transient network failure (offline / hub down) we still flip
  the UI to the success state — the marketing form should never
  look broken to a visitor — and stash the cause via console.warn
  so devtools shows it. Misses are visible operator-side via the
  hub's logs.

  The class string on the form is a prop so the EarlyAccess section
  can pass `flex-col` for the stacked layout.
-->

<script lang="ts">
  const WAITLIST_URL = "https://hub.teesql.com/api/marketing/waitlist";

  let { class: extraClass = "" } = $props();
  let submitted = $state(false);
  let pending = $state(false);

  function gatherClientInfo() {
    if (typeof window === "undefined") return {};
    const nav = window.navigator || ({} as Navigator);
    const conn =
      (nav as Navigator & {
        connection?: { effectiveType?: string; downlink?: number; rtt?: number };
      }).connection || undefined;
    const screen = window.screen || ({} as Screen);
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: nav.language,
      languages: Array.isArray(nav.languages) ? Array.from(nav.languages) : [],
      platform: (nav as Navigator & { platform?: string }).platform || "",
      hardware_concurrency: nav.hardwareConcurrency,
      device_memory: (nav as Navigator & { deviceMemory?: number }).deviceMemory,
      cookie_enabled: nav.cookieEnabled,
      dnt: nav.doNotTrack === "1",
      screen: {
        width: screen.width,
        height: screen.height,
        color_depth: screen.colorDepth,
        dpr: window.devicePixelRatio,
        viewport_w: window.innerWidth,
        viewport_h: window.innerHeight,
      },
      connection: conn
        ? {
            effective_type: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
          }
        : undefined,
      page_url: window.location.href,
      referrer: document.referrer || "",
    };
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector('input[type="email"]') as HTMLInputElement | null;
    const email = (input?.value || "").trim();
    if (!email) return;
    pending = true;
    try {
      const res = await fetch(WAITLIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, client_info: gatherClientInfo() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("waitlist submit failed:", err);
    } finally {
      pending = false;
      submitted = true;
    }
  }
</script>

<form class={`flex gap-2.5 ${extraClass}`} onsubmit={handleSubmit}>
  <input
    type="email"
    placeholder="you@enclave.dev"
    required
    disabled={submitted || pending}
    class="flex-1 px-4 py-3 font-mono text-[0.82rem] bg-surface-raised border border-rule rounded-md text-ink-strong outline-none transition-all focus:border-mint focus:shadow-[0_0_0_3px_rgba(52,211,153,0.08)] placeholder:text-ink-dim disabled:opacity-50"
  />
  <button
    type="submit"
    disabled={submitted || pending}
    class={`px-5 py-3 font-mono text-[0.82rem] font-semibold rounded-md whitespace-nowrap transition-all cursor-pointer ${submitted ? "bg-transparent text-mint border border-mint cursor-default" : "bg-mint text-page border-none hover:bg-mint-hi hover:-translate-y-px"}`}
  >
    {submitted ? "✓ you’re in" : pending ? "Submitting…" : "Request access"}
  </button>
</form>
