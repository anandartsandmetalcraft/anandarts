
"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getCategories } from "@/actions/products";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
};

export default function FeaturedCollections() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      // Only show categories that have at least 1 product and are valid
      setCategories(
        (cats as CategoryItem[]).filter(
          (c) => c._count && c._count.products > 0
        )
      );
    };
    loadCategories();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current || categories.length === 0) return;
    
    const items = sectionRef.current.querySelectorAll('.collection-item');
    
    gsap.fromTo(items,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "power3.out",
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // Don't render the section at all if there are no categories with products
  if (categories.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-32 bg-[var(--color-brand-cream)] overflow-hidden border-t border-[var(--color-brand-gold)]/10">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[var(--color-brand-gold)]" />
              <span className="font-ui text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)]">Signature Series</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-brand-char)] leading-tight">
              Featured <span className="italic font-light text-[var(--color-brand-gold-light)]">Collections</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-[var(--color-brand-char)]/10 flex items-center justify-center text-[var(--color-brand-char)] hover:bg-[var(--color-brand-char)] hover:text-white transition-all shadow-sm"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-[var(--color-brand-char)]/10 flex items-center justify-center text-[var(--color-brand-char)] hover:bg-[var(--color-brand-char)] hover:text-white transition-all shadow-sm"
              aria-label="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
            <Link 
              href="/collections" 
              className="ml-4 font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-red)] hover:text-[var(--color-brand-gold)] transition-colors hidden sm:block"
            >
              Explore All →
            </Link>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 md:-mx-12 md:px-12 pb-12"
        >
          {categories.map((cat, i) => (
            <Link 
              href={`/collections?category=${encodeURIComponent(cat.slug)}`}
              key={cat.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
              className="collection-item group relative flex-shrink-0 w-[300px] md:w-[380px] aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out will-change-transform shadow-2xl border border-white/10 snap-start bg-[var(--color-brand-char)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {cat.image ? (
                <Image 
                  src={cat.image} 
                  alt={cat.name} 
                  fill 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-1000 opacity-80 group-hover:opacity-100" 
                />
              ) : (
                /* Gradient placeholder when no category image exists */
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-char)] via-[#2A2621] to-[#11100D]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-char)] via-[var(--color-brand-char)]/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute inset-0 p-8 z-20 flex flex-col justify-end transform-gpu" style={{ transform: "translateZ(50px)" }}>
                <span className="font-ui text-[10px] tracking-[0.4em] uppercase text-[var(--color-brand-gold-light)] mb-3 block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {cat._count.products} {cat._count.products === 1 ? "Piece" : "Pieces"}
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-white mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {cat.name}
                </h3>
                
                <div className="w-12 h-1 bg-[var(--color-brand-gold)] transform origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
                
                <div className="mt-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                  <span className="inline-flex items-center gap-3 text-white font-ui text-[11px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-3 rounded-full hover:bg-[var(--color-brand-gold)] hover:text-black transition-all">
                    Discover Now <ChevronRight size={14} />
                  </span>
                </div>
              </div>

              {/* Texture Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
