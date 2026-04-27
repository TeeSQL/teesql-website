import Reveal from "./reveal";
import SectionEyebrow from "./section-eyebrow";
import Terminal from "./terminal";

export default function TrustDemoSection() {
  return (
    <>
      <section id="trust" className="scroll-mt-20" />
      <Reveal className="py-20">
        <div className="max-w-[820px] mx-auto px-6">
          <div className="flex items-baseline justify-between mb-5 max-md:flex-col max-md:items-start max-md:gap-1">
            <SectionEyebrow>
              Trust, demonstrated
              <span className="text-rule">/</span>
              <span className="text-ink-dim">live attestation</span>
            </SectionEyebrow>
            <div className="font-mono text-[0.66rem] text-ink-dim">
              $ teesql attest --verify
            </div>
          </div>
          <Terminal />
        </div>
      </Reveal>
    </>
  );
}
