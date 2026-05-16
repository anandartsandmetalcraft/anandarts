"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const reviews = [
  { 
    id: 1, 
    text: "I bought 8 idols from Anand Arts And Metal Craft. All the vigrahas were excellent, very well done, well finished and crafted. Lots of attention was paid to details. Excellent product and equally good customer service.", 
    name: "Ramchandra Panduranga", 
    location: "Bengaluru", 
    rotate: "-1deg" 
  },
  { 
    id: 2, 
    text: "I ordered the Vigraha from here and it was made better than I had imagined. It is difficult to do such fine carving in such a small Vigraha, but their team did it. Heartfelt gratitude to the team.", 
    name: "Rajvansh Gupta", 
    location: "Verified Buyer", 
    rotate: "0deg" 
  },
  { 
    id: 3, 
    text: "We bought an Andal thirumeni from here, the finishing is perfect. She is extremely beautiful and lively. The cost is also very nominal. Keep going with your good work.", 
    name: "Hari Krishnan", 
    location: "Verified Buyer", 
    rotate: "1.5deg" 
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.test-card');
      gsap.fromTo(cards, 
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }
  }, []);

  return (
    <section className="py-24 bg-[var(--color-brand-cream)] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="font-ui text-[12px] uppercase tracking-[0.1em] text-[var(--color-brand-char)]/60 mb-2 block">Google Reviews</span>
          <h2 className="font-script text-4xl md:text-5xl text-[var(--color-brand-char)]">Voices of Devotion</h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div 
              key={r.id} 
              className="test-card bg-white p-8 md:p-10 rounded-sm shadow-xl border border-[var(--color-brand-gold)]/10 hover:-translate-y-2 transition-transform duration-300 relative group"
              style={{ transform: `rotate(${r.rotate})` }}
            >
              <div className="flex gap-1 text-[var(--color-brand-gold)] mb-6 text-sm">
                ✦ ✦ ✦ ✦ ✦
              </div>
              <p className="font-body italic text-[var(--color-brand-slate)] text-base md:text-lg mb-8 leading-relaxed min-h-[120px]">
                &quot;{r.text}&quot;
              </p>
              
              <div className="pt-6 border-t border-black/5">
                <h4 className="font-ui font-semibold text-[14px] text-[var(--color-brand-char)] mb-0.5">{r.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-ui text-[11px] uppercase tracking-wider text-[var(--color-brand-gold)] font-bold">{r.location}</span>
                  <div className="w-1 h-1 rounded-full bg-black/10" />
                  <span className="font-ui text-[11px] text-[var(--color-brand-slate)]/50 italic">Verified Google Review</span>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <div className="w-8 h-px bg-[var(--color-brand-gold)] rotate-45 translate-x-4 -translate-y-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

