import React from "react";
import Schema from "@/components/shared/Schema";
import { Metadata } from "next";
import HeritageBlogSection from "@/components/home/HeritageBlogSection";
import SupplyChainComparison from "@/components/home/SupplyChainComparison";
import TrustCounter from "@/components/home/TrustCounter";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Our Heritage & Story | South Indian Temple Art Studio",
  description: "Discover Anand Arts, a Bengaluru temple-art studio preserving South Indian brass, bronze, copper, panchaloha, and wood craftsmanship for sacred spaces.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  keywords: ["South Indian temple art", "temple art Bengaluru", "handcrafted brass idols", "artisan metal craft India"],
};

export default function AboutPage() {
  const aboutSchema = {
    "@type": "AboutPage",
    "name": "Our Heritage - Anand Arts",
    "url": `${siteUrl}/about`
  };

  return (
    <main className="bg-[var(--color-brand-cream)] pt-24 pb-0">
      <Schema type="WebPage" data={aboutSchema} />
      
      {/* Hero Header */}
      <div className="bg-[#11100D] text-[var(--color-brand-cream)] py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14)_0,transparent_24%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08)_0,transparent_18%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.1)_0,transparent_22%)] mix-blend-overlay pointer-events-none"></div>
        <div className="max-w-[1320px] mx-auto text-center relative z-10 flex flex-col items-center">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-brand-gold)] mb-4 block">
            Crafting Since 1990
          </span>
          <h1 className="font-display text-4xl md:text-[56px] text-[#E8E1D5] mb-6">
            The Heritage of Anand Arts
          </h1>
          <p className="font-script text-lg md:text-xl text-[#A89F91] max-w-2xl mx-auto italic">
            "A story of devotion, fire, and metal passed down through three decades of mastery."
          </p>
        </div>
      </div>

      <HeritageBlogSection />
      <SupplyChainComparison />
      <TrustCounter />
    </main>
  );
}
