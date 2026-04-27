import Reveal from "./reveal";

export default function TrustQuoteSection() {
  return (
    <Reveal className="py-24">
      <div className="relative max-w-[780px] mx-auto px-6 text-center">
        <div className="relative inline-block">
          <div className="absolute inset-x-[-80px] top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-rule to-transparent" />
          <span className="relative inline-block bg-page px-6">
            <span className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-ink-dim">
              The TeeSQL difference
            </span>
          </span>
        </div>
        <p className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.1] text-ink-strong tracking-[-0.025em] text-center mt-14">
          Policy is a <em className="italic text-ink-mute">promise</em>.
          <br />
          Hardware is <em className="italic text-mint">proof</em>.
        </p>
      </div>
    </Reveal>
  );
}
