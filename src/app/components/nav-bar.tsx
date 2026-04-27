"use client";

import { useEffect, useState } from "react";
import PrimaryButton from "./primary-button";

export default function NavBar({ onCtaClick }: { onCtaClick: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleCta = () => {
    close();
    onCtaClick();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 max-xl:px-4 py-3.5 flex items-center justify-between gap-3 bg-page/[0.96] backdrop-blur-[20px] border-b border-rule">
        <a href="#" className="flex items-center gap-3 no-underline leading-none">
          <span className="font-serif text-[1.4rem] text-ink tracking-[-0.01em]">
            Tee<span className="text-mint">SQL</span>
          </span>
        </a>

        <div className="flex gap-7 items-center max-xl:hidden">
          <a
            href="#how"
            className="font-mono text-[0.78rem] text-ink-dim no-underline hover:text-ink-strong transition-colors"
          >
            How it works
          </a>
          <a
            href="#docs"
            className="font-mono text-[0.78rem] text-ink-dim no-underline hover:text-ink-strong transition-colors"
          >
            Docs
          </a>
          <PrimaryButton size="sm" onClick={onCtaClick}>
            Request access
          </PrimaryButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="hidden max-xl:inline-flex items-center justify-center w-9 h-9 rounded-md border border-rule text-ink-strong hover:border-mint transition-colors"
        >
          <span className="relative w-4 h-4 block">
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current rounded transition-all duration-200 ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px]"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current rounded top-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current rounded transition-all duration-200 ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[3px]"
              }`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div
          className="hidden max-xl:block fixed inset-0 z-[99] bg-page/[0.98] backdrop-blur-[20px] pt-20"
          onClick={close}
        >
          <div
            className="px-6 py-8 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="#how"
              onClick={close}
              className="font-mono text-[0.95rem] text-ink-strong no-underline py-4 border-b border-rule"
            >
              How it works
            </a>
            <a
              href="#docs"
              onClick={close}
              className="font-mono text-[0.95rem] text-ink-strong no-underline py-4 border-b border-rule"
            >
              Docs
            </a>
            <div className="pt-6">
              <PrimaryButton onClick={handleCta} className="w-full">
                Request access
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
