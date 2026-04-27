<!--
  "claude mcp add teesql ..." block with a copy button. Tiny island —
  one piece of state (copied: boolean) plus a clipboard call.
-->

<script lang="ts">
  const cmd = "claude mcp add teesql https://mcp.teesql.com";
  let copied = $state(false);

  function copy() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(cmd);
    copied = true;
    setTimeout(() => (copied = false), 1600);
  }
</script>

<div class="rounded-[10px] border border-rule bg-surface-deep overflow-hidden">
  <div class="flex items-center justify-between px-4 py-2.5 border-b border-rule bg-surface">
    <div class="flex items-center gap-2">
      <span class="w-[5px] h-[5px] rounded-full bg-mint"></span>
      <span class="font-mono text-[0.64rem] tracking-[0.16em] uppercase text-mint">
        For your AI agent
      </span>
      <span class="font-mono text-[0.62rem] text-ink-faint">/ MCP</span>
    </div>
    <button
      type="button"
      onclick={copy}
      aria-label="Copy install command"
      class="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-ink-dim hover:text-mint transition-colors"
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  </div>
  <div class="px-4 py-4 font-mono text-[0.84rem] flex items-center gap-2.5 min-w-0">
    <span class="text-mint shrink-0">$</span>
    <code class="text-ink-strong whitespace-nowrap overflow-hidden text-ellipsis min-w-0 flex-1">
      {cmd}
    </code>
  </div>
  <div class="px-4 pb-3 font-mono text-[0.66rem] text-ink-dim">
    Also works with Cursor, Windsurf, and any MCP-compatible client.
  </div>
</div>
