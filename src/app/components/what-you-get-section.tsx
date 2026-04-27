import Reveal from "./reveal";
import SectionEyebrow from "./section-eyebrow";

type Feature = { n: string; t: string; d: string };

const FEATURES: Feature[] = [
  {
    n: "01",
    t: "PostgreSQL 17, unmodified",
    d: "Tables, indexes, joins, transactions, extensions. psql works. Your ORM works. Your migrations work.",
  },
  {
    n: "02",
    t: "Automated backups",
    d: "Backups are encrypted inside the TEE before export. The storage layer is untrusted and that\u2019s the point.",
  },
  {
    n: "03",
    t: "HA & automated failover",
    d: "Primary/secondary replication with leader election. If the primary goes down, the secondary promotes automatically.",
  },
  {
    n: "04",
    t: "Multi-environment deployment",
    d: "Deploy on Phala Cloud, iExec, Secret Network, bare metal, or cloud TDX instances.",
  },
];

function FeatureCell({ n, t, d }: Feature) {
  return (
    <div className="bg-surface-soft p-7 hover:bg-surface-raised transition-colors">
      <div className="font-mono text-[0.72rem] text-mint mb-3 font-semibold tracking-[0.06em]">{n}</div>
      <h3 className="font-sans text-[1.05rem] font-semibold text-ink mb-2 tracking-[-0.01em]">{t}</h3>
      <p className="text-[0.9rem] text-ink-mute leading-[1.7]">{d}</p>
    </div>
  );
}

export default function WhatYouGetSection() {
  return (
    <Reveal>
      <section className="py-24">
        <div className="max-w-[860px] mx-auto px-6">
          <SectionEyebrow className="mb-3">What you get</SectionEyebrow>
          <h2 className="font-sans text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold text-ink mb-3 tracking-[-0.03em]">
            Still just Postgres.
          </h2>
          <p className="text-base text-ink-body max-w-[540px] mb-12 leading-[1.75]">
            Same wire protocol, same driver, same queries. The trust model is the only thing that changed.
          </p>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-px bg-rule border border-rule rounded-lg overflow-hidden">
            {FEATURES.map((f) => (
              <FeatureCell key={f.n} {...f} />
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
