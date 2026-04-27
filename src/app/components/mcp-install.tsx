"use client";

import { useState } from "react";

export default function MCPInstall() {
  const [copied, setCopied] = useState(false);
  const cmd = "claude mcp add teesql https://mcp.teesql.com";

  const copy = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rounded-[10px] border border-rule bg-surface-deep overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-rule bg-surface">
        <div className="flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-mint" />
          <span className="font-mono text-[0.64rem] tracking-[0.16em] uppercase text-mint">
            For your AI agent
          </span>
          <span className="font-mono text-[0.62rem] text-ink-faint">/ MCP</span>
        </div>
        <button
          onClick={copy}
          className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-ink-dim hover:text-mint transition-colors"
          aria-label="Copy install command"
        >
          {copied ? "\u2713 copied" : "copy"}
        </button>
      </div>
      <div className="px-4 py-4 font-mono text-[0.84rem] flex items-center gap-2.5 min-w-0">
        <span className="text-mint shrink-0">$</span>
        <code className="text-ink-strong whitespace-nowrap overflow-hidden text-ellipsis min-w-0 flex-1">
          {cmd}
        </code>
      </div>
      <div className="px-4 pb-3 font-mono text-[0.66rem] text-ink-dim">
        Also works with Cursor, Windsurf, and any MCP-compatible client.
      </div>
    </div>
  );
}
