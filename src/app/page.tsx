"use client";

import { useCallback, useRef } from "react";

import BackgroundDecorations from "./components/background-decorations";
import ComparisonSection from "./components/comparison-section";
import EarlyAccessSection from "./components/early-access-section";
import FAQSection from "./components/faq-section";
import FinalCTASection from "./components/final-cta-section";
import HeroSection from "./components/hero-section";
import HowItWorksSection from "./components/how-it-works-section";
import NavBar from "./components/nav-bar";
import SiteFooter from "./components/site-footer";
import TrustDemoSection from "./components/trust-demo-section";
import TrustQuoteSection from "./components/trust-quote-section";
import WhatYouGetSection from "./components/what-you-get-section";

export default function LandingPage() {
  const earlyInputRef = useRef<HTMLInputElement>(null);

  const scrollToWl = useCallback(() => {
    const el = document.getElementById("early-access");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => earlyInputRef.current?.focus(), 600);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-page text-ink-body font-sans leading-[1.7] overflow-x-clip w-full max-w-[100vw]">
      <BackgroundDecorations />

      <NavBar onCtaClick={scrollToWl} />

      <HeroSection />

      <TrustDemoSection />

      <TrustQuoteSection />

      <HowItWorksSection />

      <ComparisonSection />

      <WhatYouGetSection />

      <EarlyAccessSection inputRef={earlyInputRef} />

      <FAQSection />

      <FinalCTASection onCtaClick={scrollToWl} />

      <SiteFooter />
    </div>
  );
}
