export default function SiteFooter() {
  return (
    <footer className="py-10 border-t border-rule">
      <div className="max-w-[860px] mx-auto px-6">
        <div className="flex justify-between items-center flex-wrap gap-4 max-md:flex-col max-md:items-center max-md:text-center">
          <div className="font-mono text-[0.72rem] text-ink-dim inline-flex items-center flex-wrap gap-x-1.5 gap-y-1 max-md:justify-center">
            <span className="whitespace-nowrap">&copy; 2026 TEESQL &middot;</span>
            <span className="inline-flex items-center gap-x-1.5 whitespace-nowrap">
              <span>Built on</span>
              <a
                href="https://github.com/Dstack-TEE/dstack"
                target="_blank"
                rel="noopener"
                aria-label="dstack"
                className="inline-flex items-center align-middle opacity-90 hover:opacity-100 transition-opacity duration-200 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dstack-logo.svg"
                  alt="dstack"
                  className="h-[14px] w-auto translate-y-[1px] group-hover:translate-y-0 transition-transform duration-200"
                />
              </a>
              <span>&middot;</span>
            </span>
            <span className="whitespace-nowrap">Running inside Intel TDX</span>
          </div>
          <div className="flex gap-6 max-md:justify-center">
            <a
              href="https://github.com/TeeSQL"
              target="_blank"
              rel="noopener"
              className="font-mono text-[0.72rem] text-ink-dim no-underline hover:text-mint transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:hello@teesql.com"
              className="font-mono text-[0.72rem] text-ink-dim no-underline hover:text-mint transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
