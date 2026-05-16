"use client";

import React from "react";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider
} from "@/components/ui/image-comparison";

export default function FinishingComparison() {
  return (
    <section className="py-24 bg-[var(--color-brand-cream)] overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl text-[var(--color-brand-char)] uppercase tracking-tight mb-4">
          Masterful <span className="text-[#8B8375]">Finishes</span>
        </h2>
        <p className="font-ui text-sm text-[#8B8375] mb-16 max-w-2xl mx-auto leading-relaxed">
          Experience the difference between our traditional Antique finish and the radiant Copper finish. Slide to compare the masterful patinas applied by our artisans.
        </p>
        
        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-[3px] md:border-4 border-white">
          <ImageComparison className="aspect-[4/5] sm:aspect-video w-full" enableHover>
            <ImageComparisonImage
              src="/Divine_god.webp"
              alt="Antique Dark Finishing"
              position="left"
            />
            <ImageComparisonImage
              src="/Brass.webp"
              alt="Bright Copper Finishing"
              position="right"
            />
            <ImageComparisonSlider className="w-1 bg-[var(--color-brand-gold)] backdrop-blur-sm shadow-[0_0_15px_rgba(184,134,11,0.5)]">
              <div className="absolute top-1/2 left-1/2 w-10 h-10 md:w-12 md:h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-[var(--color-brand-gold)]">
                <div className="flex gap-1">
                  <div className="w-1 h-3 md:h-4 rounded-full bg-[var(--color-brand-gold)]/40"></div>
                  <div className="w-1 h-3 md:h-4 rounded-full bg-[var(--color-brand-gold)]/40"></div>
                </div>
              </div>
            </ImageComparisonSlider>
          </ImageComparison>

          {/* Responsive Labels */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-6 md:py-3 rounded-full border border-white/20 pointer-events-none transition-all">
            <span className="text-white font-ui text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Antique</span>
          </div>
          <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-6 md:py-3 rounded-full border border-white/20 pointer-events-none transition-all">
            <span className="text-white font-ui text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Copper</span>
          </div>
        </div>
      </div>
    </section>
  );
}
