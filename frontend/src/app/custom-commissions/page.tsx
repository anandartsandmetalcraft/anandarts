import React from "react";
import Link from "next/link";
import CommissionWizard from "@/components/commission/CommissionWizard";

export const metadata = {
  title: "Custom Commissions | Anand Arts",
  description: "Create custom temple idols and metal crafts designed specifically for you.",
};

export default function CustomCommissionPage() {
  return (
    <main className="min-h-screen bg-[#11100D] pt-32 pb-24 selection:bg-[var(--color-brand-gold)] selection:text-[#11100D]">
      
      {/* Background Stylized Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-brand-gold)] opacity-[0.02] rounded-full blur-[120px]"></div>
        {/* Subtle grid line to simulate the background pattern from reference */}
        <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-[#2A2621]/30"></div>
        <div className="absolute top-0 bottom-0 right-1/4 w-[1px] bg-[#2A2621]/30"></div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center max-w-2xl mb-16 md:mb-24 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 font-ui text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#A89F91] mb-8">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors text-white/50">HOME</Link>
            <span className="text-[var(--color-brand-gold)] text-[14px]">✦</span>
            <span className="text-[#A89F91]">CUSTOM COMMISSIONS</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] text-[var(--color-brand-gold)] mb-6 drop-shadow-sm">
            Made for You Alone
          </h1>
          <p className="font-script text-xl md:text-2xl text-[#A89F91] leading-relaxed mb-8">
            Create custom temple idols and metal crafts designed specifically for you. Our skilled artisans can make unique pieces according to your requirements and specifications.
          </p>
          <div className="flex gap-3 justify-center text-[var(--color-brand-gold-dim)] text-xs opacity-70">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <CommissionWizard />
      </div>
    </main>
  );
}
