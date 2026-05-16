"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const posts = [
  { id: 1, tag: "Iconography", title: "Decoding the Symbols of Nataraja", excerpt: "Explore the cosmic dance of Shiva and the meaning behind the drum, the fire, and the dwarf of ignorance.", img: "https://images.unsplash.com/photo-1614725965646-95fc13c32fd2?auto=format&fit=crop&w=600&q=80" },
  { id: 2, tag: "Care Guide", title: "How to Maintain Patina on Bronze", excerpt: "Preserving the life and luster of your Antique Bronze murthis with traditional natural methods.", img: "https://images.unsplash.com/photo-1600096956795-f9a888c30dd4?auto=format&fit=crop&w=600&q=80" },
  { id: 3, tag: "Temple Art", title: "The Lost Wax Casting Process", excerpt: "A journey into the Chola-era technique still used by our master artisans today.", img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80" },
];

export default function BlogTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.blog-card');
      gsap.fromTo(cards, 
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  return (
    <section className="py-24 bg-[var(--color-brand-cream)] border-t border-[var(--color-brand-slate)]/10">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="font-ui text-[12px] uppercase tracking-[0.1em] text-[var(--color-brand-slate)] mb-2 block">Journal</span>
            <h2 className="font-display text-4xl text-[var(--color-brand-char)]">Tales from the Workshop</h2>
          </div>
          <a href="/blog" className="hidden sm:inline-block font-ui text-[13px] font-semibold uppercase tracking-widest text-[var(--color-brand-red)] hover:text-[var(--color-brand-gold)] border-b border-transparent hover:border-[var(--color-brand-gold)] transition-all">
            Read Journal →
          </a>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="blog-card group cursor-pointer">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm mb-6">
                <Image 
                  src={post.img} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-[1.05] transition-transform duration-700" 
                />
              </div>
              <span className="font-ui text-[11px] uppercase tracking-wider text-[var(--color-brand-gold)] mb-3 block">{post.tag}</span>
              <h3 className="font-display text-2xl text-[var(--color-brand-char)] mb-3 group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="font-body text-[var(--color-brand-slate)]/80 text-[15px] leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <span className="font-ui text-[12px] font-semibold uppercase tracking-widest text-[var(--color-brand-gold)] group-hover:text-[var(--color-brand-char)] transition-colors">
                Read More →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
