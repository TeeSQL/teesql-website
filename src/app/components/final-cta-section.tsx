"use client";

import PrimaryButton from "./primary-button";
import Reveal from "./reveal";

export default function FinalCTASection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <Reveal className="text-center py-24 pb-16">
      <div className="max-w-[780px] mx-auto px-6">
        <h2 className="font-sans text-[clamp(1.7rem,3.4vw,2.2rem)] font-semibold text-ink mb-3 tracking-[-0.03em]">
          Close the last trust gap in your stack.
        </h2>
        <p className="text-[1rem] text-ink-body mb-8 max-w-[480px] mx-auto leading-[1.65]">
          Your compute is attested. Your database should be too.
        </p>
        <PrimaryButton onClick={onCtaClick} className="inline-flex items-center gap-2">
          Request early access
          <span aria-hidden>{"\u2192"}</span>
        </PrimaryButton>
      </div>
    </Reveal>
  );
}
