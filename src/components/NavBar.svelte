<!--
  Sticky top nav. Desktop: logo / links / "Request access" button.
  Mobile (xl breakpoint and below): logo / hamburger that toggles a
  fullscreen sheet with the same links + button stacked vertically.

  Interactivity that actually justifies a Svelte island:
    - open/close state for the sheet
    - ESC closes
    - body overflow:hidden while open so the page underneath can't scroll
    - clicking outside the inner column closes the sheet

  CTA buttons all use href="#early-access" plus a `focus-on-arrival`
  helper that runs on hashchange — keeps NavBar from needing to know
  about the email input or expose a callback prop.
-->

<script lang="ts">
  import { onMount } from "svelte";

  let open = $state(false);

  $effect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open = false;
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  });

  const close = () => (open = false);

  // Listen for hashchange→#early-access so the email input gets focus
  // after the smooth scroll lands. Mirrors the React page's
  // setTimeout(focus, 600) trick. Lives here because NavBar is the
  // only piece that's globally hydrated on every page.
  onMount(() => {
    const focusEarlyAccess = () => {
      if (location.hash !== "#early-access") return;
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          "#early-access input[type=email]",
        );
        input?.focus();
      }, 600);
    };
    window.addEventListener("hashchange", focusEarlyAccess);
    // Also handle the case where the page loads with the hash already set.
    focusEarlyAccess();
    return () => window.removeEventListener("hashchange", focusEarlyAccess);
  });
</script>

<nav
  class="fixed top-0 left-0 right-0 z-[100] px-8 max-xl:px-4 py-3.5 flex items-center justify-between gap-3 bg-page/[0.96] backdrop-blur-[20px] border-b border-rule"
>
  <a href="#" class="flex items-center gap-3 no-underline leading-none">
    <span class="font-serif text-[1.4rem] text-ink tracking-[-0.01em]">
      Tee<span class="text-mint">SQL</span>
    </span>
  </a>

  <div class="flex gap-7 items-center max-xl:hidden">
    <a
      href="#how"
      class="font-mono text-[0.78rem] text-ink-dim no-underline hover:text-ink-strong transition-colors"
    >
      How it works
    </a>
    <a
      href="#docs"
      class="font-mono text-[0.78rem] text-ink-dim no-underline hover:text-ink-strong transition-colors"
    >
      Docs
    </a>
    <a
      href="#early-access"
      class="font-mono font-semibold rounded-md bg-mint text-page hover:bg-mint-hi transition-all hover:-translate-y-px cursor-pointer inline-flex items-center justify-center px-3 py-1.5 text-[0.74rem] no-underline"
    >
      Request access
    </a>
  </div>

  <button
    type="button"
    aria-label={open ? "Close menu" : "Open menu"}
    aria-expanded={open}
    onclick={() => (open = !open)}
    class="hidden max-xl:inline-flex items-center justify-center w-9 h-9 rounded-md border border-rule text-ink-strong hover:border-mint transition-colors"
  >
    <span class="relative w-4 h-4 block">
      <span
        class={`absolute left-0 right-0 h-[1.5px] bg-current rounded transition-all duration-200 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px]"}`}
      ></span>
      <span
        class={`absolute left-0 right-0 h-[1.5px] bg-current rounded top-1/2 -translate-y-1/2 transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
      ></span>
      <span
        class={`absolute left-0 right-0 h-[1.5px] bg-current rounded transition-all duration-200 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[3px]"}`}
      ></span>
    </span>
  </button>
</nav>

{#if open}
  <div
    role="presentation"
    class="hidden max-xl:block fixed inset-0 z-[99] bg-page/[0.98] backdrop-blur-[20px] pt-20"
    onclick={close}
  >
    <div
      class="px-6 py-8 flex flex-col gap-1"
      role="presentation"
      onclick={(e) => e.stopPropagation()}
    >
      <a
        href="#how"
        onclick={close}
        class="font-mono text-[0.95rem] text-ink-strong no-underline py-4 border-b border-rule"
      >
        How it works
      </a>
      <a
        href="#docs"
        onclick={close}
        class="font-mono text-[0.95rem] text-ink-strong no-underline py-4 border-b border-rule"
      >
        Docs
      </a>
      <div class="pt-6">
        <a
          href="#early-access"
          onclick={close}
          class="w-full font-mono font-semibold rounded-md bg-mint text-page hover:bg-mint-hi transition-all hover:-translate-y-px cursor-pointer inline-flex items-center justify-center px-6 py-3 text-[0.82rem] no-underline"
        >
          Request access
        </a>
      </div>
    </div>
  </div>
{/if}
