"use client";

import { useState } from "react";

export default function WaitlistForm({
  className = "",
  inputRef,
}: {
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className={`flex gap-2.5 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        ref={inputRef}
        type="email"
        placeholder="you@enclave.dev"
        required
        disabled={submitted}
        className="flex-1 px-4 py-3 font-mono text-[0.82rem] bg-surface-raised border border-rule rounded-md text-ink-strong outline-none transition-all focus:border-mint focus:shadow-[0_0_0_3px_rgba(52,211,153,0.08)] placeholder:text-ink-dim disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={submitted}
        className={`px-5 py-3 font-mono text-[0.82rem] font-semibold rounded-md whitespace-nowrap transition-all cursor-pointer ${
          submitted
            ? "bg-transparent text-mint border border-mint cursor-default"
            : "bg-mint text-page border-none hover:bg-mint-hi hover:-translate-y-px"
        }`}
      >
        {submitted ? "\u2713 you\u2019re in" : "Request access"}
      </button>
    </form>
  );
}
