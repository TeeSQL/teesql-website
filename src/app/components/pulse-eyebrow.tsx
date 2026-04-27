export default function PulseEyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-[0.7rem] tracking-[0.18em] uppercase text-mint inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="w-[7px] h-[7px] bg-mint rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
      {children}
    </div>
  );
}
