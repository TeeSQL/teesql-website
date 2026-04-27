import { ReactNode } from "react";
import ArchDiagram from "./arch-diagram";
import Reveal from "./reveal";
import SectionEyebrow from "./section-eyebrow";

type Layer = { num: string; title: string; tag: string; desc: ReactNode };

const LAYERS: Layer[] = [
  {
    num: "01",
    title: "Intel TDX",
    tag: "hardware",
    desc: "The foundation. Intel Trust Domain Extensions create a Confidential Virtual Machine where memory is encrypted by the CPU itself. Nothing outside the VM \u2014 not the hypervisor, not the host OS, not the cloud provider \u2014 can read what\u2019s inside.",
  },
  {
    num: "02",
    title: "dstack",
    tag: "orchestration",
    desc: (
      <>
        The open-source confidential computing framework built by{" "}
        <ExtLink href="https://phala.network">Phala</ExtLink>
        , now a{" "}
        <ExtLink href="https://www.linuxfoundation.org">Linux Foundation</ExtLink>
        {" "}project.{" "}
        <ExtLink href="https://github.com/Dstack-TEE/dstack">dstack</ExtLink>
        {" "}handles CVM lifecycle, remote attestation, and key management. Independently audited by{" "}
        <ExtLink href="https://www.zksecurity.xyz">zkSecurity</ExtLink>.
      </>
    ),
  },
  {
    num: "03",
    title: "KMS",
    tag: "key management",
    desc: "Encryption keys are derived inside a dedicated TEE instance. Keys are bound to your application\u2019s attested identity \u2014 they never exist in plaintext outside enclave memory, and no human ever holds them.",
  },
  {
    num: "04",
    title: "Sidecar",
    tag: "access control",
    desc: "Runs inside the CVM alongside PostgreSQL. Handles RA-TLS termination, attestation verification, connection authorization, metrics, and encrypted backup export. Postgres never faces the network directly.",
  },
  {
    num: "05",
    title: "Mutual RA-TLS",
    tag: "connection protocol",
    desc: "Every connection is a mutual Remote Attestation TLS handshake. Your app proves it\u2019s running in a TEE. The database proves the same back. Three RTMR measurements are verified before any SQL flows.",
  },
];

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink-strong underline decoration-rule underline-offset-4 hover:decoration-mint hover:text-mint transition-colors"
    >
      {children}
    </a>
  );
}

function LayerRow({ num, title, tag, desc }: Layer) {
  return (
    <div className="flex gap-6 py-7 border-b border-rule last:border-b-0 group">
      <div className="font-mono text-[0.78rem] text-mint font-semibold pt-0.5 shrink-0 w-10 tracking-[0.05em]">
        {num}
      </div>
      <div>
        <h3 className="font-sans text-[1.1rem] font-semibold text-ink mb-2 tracking-[-0.01em]">
          {title}{" "}
          <span className="font-mono text-[0.64rem] text-ink-dim font-normal tracking-[0.08em] uppercase bg-page border border-rule rounded px-2 py-0.5 ml-2 align-middle">
            {tag}
          </span>
        </h3>
        <p className="text-[0.95rem] text-ink-body leading-[1.75]">{desc}</p>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <Reveal>
      <section id="how" className="py-20">
        <div className="max-w-[860px] mx-auto px-6">
          <SectionEyebrow className="mb-3">How it works</SectionEyebrow>
          <h2 className="font-sans text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold text-ink mb-3 tracking-[-0.03em]">
            Five components. One trust boundary.
          </h2>
          <p className="text-base text-ink-body max-w-[540px] mb-12 leading-[1.75]">
            TEESQL is a stack of open-source and hardware-enforced layers. Each one does one job.
          </p>

          <div className="flex flex-col">
            {LAYERS.map((layer) => (
              <LayerRow key={layer.num} {...layer} />
            ))}
          </div>

          <ArchDiagram />
        </div>
      </section>
    </Reveal>
  );
}
