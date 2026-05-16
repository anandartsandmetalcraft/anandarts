"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

export default function CustomCommissions() {
   const sectionRef = useRef<HTMLElement>(null);
   const titleRef = useRef<HTMLHeadingElement>(null);

   useEffect(() => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      // Ambient breathing background
      gsap.to(sectionRef.current, {
         backgroundSize: "200% 200%",
         duration: 8,
         repeat: -1,
         yoyo: true,
         ease: "sine.inOut"
      });

   }, []);

   return (
      <section
         ref={sectionRef}
         className="relative py-32 bg-[var(--color-brand-char)] text-center overflow-hidden"
         style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, #2a1b12 0%, #1A1208 100%)",
            backgroundSize: "100% 100%"
         }}
      >
         <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14)_0,transparent_22%),radial-gradient(circle_at_75%_30%,rgba(255,255,255,0.08)_0,transparent_16%),radial-gradient(circle_at_50%_75%,rgba(255,255,255,0.1)_0,transparent_20%)] mix-blend-overlay pointer-events-none"></div>

         <div className="relative z-10 max-w-[800px] mx-auto px-6 flex flex-col items-center">
            <span className="text-[var(--color-brand-gold)] text-2xl mb-8">✦</span>

            <h2 ref={titleRef} className="font-display text-4xl md:text-[52px] text-[var(--color-brand-gold-light)] leading-[1.2] mb-6">
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-brand-gold-light)] via-[#fff] to-[var(--color-brand-gold-light)] animate-[shimmer_3s_infinite_linear]">
                  Commission Your Sacred Piece
               </span>
            </h2>

            <p className="font-body text-lg md:text-xl text-[var(--color-brand-cream)]/70 max-w-[560px] leading-relaxed mb-12">
               Have a specific deity, size, or material in mind? Our master artisans craft bespoke pieces to your exact vision — from intimate home idols to grand temple installations.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
               <Link href="/custom-commissions" className="bg-[var(--color-brand-red)] text-white font-ui text-[14px] font-semibold uppercase tracking-wider px-8 py-4 rounded-sm hover:scale-[1.03] transition-transform duration-300 w-full sm:w-auto text-center inline-block">
                  Start Your Commission
               </Link>
               <a href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20a%20custom%20commission%20from%20Anand%20Arts." target="_blank" rel="noopener noreferrer" className="border border-[var(--color-brand-gold)] text-[var(--color-brand-gold-light)] font-ui text-[14px] font-semibold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-char)] transition-colors duration-300 w-full sm:w-auto text-center inline-block">
                  Chat on WhatsApp
               </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 font-ui text-[12px] uppercase tracking-widest text-[var(--color-brand-gold-dim)]">
               <span>100+ Custom Orders Completed</span>
               <span className="hidden md:inline">·</span>
               <span>4–8 Week Delivery</span>
               <span className="hidden md:inline">·</span>
               <span>Direct Artisan Consultation</span>
            </div>
         </div>
      </section>
   );
}
