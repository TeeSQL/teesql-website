export default function SectionEyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-[0.7rem] tracking-[0.16em] uppercase text-mint flex items-center gap-2 ${className}`}
    >
      <span className="w-6 h-px bg-mint" />
      {children}
    </div>
  );
}
