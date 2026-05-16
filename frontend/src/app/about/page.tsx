import React from "react";
import Image from "next/image";
import Schema from "@/components/shared/Schema";
import { Metadata } from "next";
import HeritageBlogSection from "@/components/home/HeritageBlogSection";
import SupplyChainComparison from "@/components/home/SupplyChainComparison";
import TrustCounter from "@/components/home/TrustCounter";

export const metadata: Metadata = {
  title: "Our Heritage & Story",
  description: "Discover the 30-year legacy of Anand Arts, our direct-to-consumer manufacturing model, and our community of 20,000+ devotees.",
};

export default function AboutPage() {
  const aboutSchema = {
    "@type": "AboutPage",
    "name": "Our Heritage - Anand Arts",
    "url": "https://anandarts.com/about"
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

      {/* Narrative Section - Additional Addons */}
      <div className="bg-white py-24 border-t border-black/5">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
               <Image 
                src="https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=80" 
                alt="Workshop" 
                fill 
                className="object-cover" 
               />
            </div>
            <div>
               <h3 className="font-display text-3xl text-[var(--color-brand-char)] mb-6">Ethical Sourcing & Artisan Welfare</h3>
               <p className="font-ui text-lg text-[#8B8375] leading-relaxed mb-8">
                 By owning the entire manufacture-to-customer cycle, we ensure that every rupee you pay directly supports the artisans' livelihood. We don't just create art; we sustain the families of over 40 traditional metalworkers.
               </p>
               <div className="flex flex-wrap gap-4">
                 {["100% Recyclable Packaging", "Fair Wage Certified", "Lineage Preservation"].map((tag) => (
                   <span key={tag} className="px-4 py-2 bg-[var(--color-brand-cream)] text-[var(--color-brand-gold)] font-ui text-[10px] font-bold uppercase tracking-widest rounded-full border border-[var(--color-brand-gold)]/10">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

