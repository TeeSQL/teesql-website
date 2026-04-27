import ArchLine from "./arch-line";

const FACTS: [string, string][] = [
  ["Data at rest", "AES-256-GCM \u00B7 KMS-derived key"],
  ["Data in memory", "Intel TDX hardware encryption"],
  ["Backups", "Encrypted inside TEE before export"],
  ["Wire protocol", "Standard PostgreSQL \u2014 your driver works"],
];

export default function ArchDiagram() {
  return (
    <div className="bg-gradient-to-br from-surface-raised to-surface border border-rule rounded-[12px] p-8 pt-10 mt-12 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-mint blur-[100px] opacity-[0.05]" />

      <div className="flex items-center justify-center max-md:flex-col max-md:gap-4 relative">
        <div className="border-[1.5px] border-rule rounded-lg p-5 bg-page min-w-[180px] hover:border-mint transition-colors max-md:w-full">
          <div className="font-mono text-[0.78rem] font-semibold text-ink-strong mb-2">Your App (CVM)</div>
          <div className="font-mono text-[0.68rem] text-ink-dim leading-[1.7]">
            RA-TLS client cert
            <br />
            RTMR 1+2+3 verified
          </div>
        </div>
        <div className="flex flex-col items-center px-5 shrink-0 min-w-[140px] max-md:px-2 max-md:py-2 max-md:min-w-0">
          <div className="font-mono text-[0.72rem] font-semibold text-mint mb-2 whitespace-nowrap">
            mutual RA-TLS :5433
          </div>
          <ArchLine />
          <div className="font-mono text-[0.65rem] text-ink-dim mt-1.5 whitespace-nowrap">
            both sides prove TEE identity
          </div>
        </div>
        <div className="border-[1.5px] border-rule rounded-lg p-5 bg-page min-w-[180px] hover:border-mint transition-colors max-md:w-full">
          <div className="font-mono text-[0.78rem] font-semibold text-ink-strong mb-2">TEESQL (CVM)</div>
          <div className="font-mono text-[0.68rem] text-ink-dim leading-[1.7]">
            sidecar &rarr; PostgreSQL 17
            <br />
            locked-down kernel
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3 gap-x-6 pt-7 mt-7 border-t border-rule relative">
        {FACTS.map(([k, v]) => (
          <div key={k} className="font-mono text-[0.72rem]">
            <span className="text-mint font-medium">{k}</span>
            <br />
            <span className="text-ink-dim">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
