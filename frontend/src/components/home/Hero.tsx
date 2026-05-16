"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Ram Lalla",
    subtitle: "Pran Pratishtha",
    description: "A divine representation of Lord Rama, meticulously handcrafted in golden brass to commemorate the Pran Pratishtha. This sacred masterpiece brings the eternal aura of Ayodhya to your home sanctuary.",
    image: "/Heroimg.webp",
    cta: "Shop The Collection",
    link: "/collections?category=Brass",
    theme: "dark",
    desktopObjectFit: "contain",
    bgColor: "#F3EAD8"
  },
  {
    id: 2,
    title: "Lakshmi",
    subtitle: "Pran Pratishtha",
    description: "A divine representation of Goddess Lakshmi, meticulously handcrafted in golden brass to commemorate the Pran Pratishtha. This sacred masterpiece brings the eternal aura of Ayodhya to your home sanctuary.",
    image: "/idol.png",
    cta: "Shop The Collection",
    link: "/collections?category=Brass",
    theme: "dark",
    desktopObjectFit: "contain",
    bgColor: "#F3EAD8"
  },
  {
    id: 3,
    title: "Goddess Mariamman",
    subtitle: "",
    description: "A divine representation of Goddess Mariamman, meticulously handcrafted in golden brass to commemorate the Pran Pratishtha. This sacred masterpiece brings the eternal aura of Ayodhya to your home sanctuary.",
    image: "/heroimg2.webp",
    cta: "Shop The Collection",
    link: "/collections?category=Brass",
    theme: "dark",
    desktopObjectFit: "contain",
    bgColor: "#F3EAD8"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isContainDesktop = HERO_SLIDES[current].desktopObjectFit === "contain";

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-slide
  useEffect(() => {
    timerRef.current = setInterval(slideNext, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slideNext]);

  const variants: Variants = {
    enter: (direction: number) => ({
      x: prefersReducedMotion ? 0 : (direction > 0 ? "100%" : "-100%"),
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30, duration: prefersReducedMotion ? 0 : undefined },
        opacity: { duration: prefersReducedMotion ? 0 : 0.8 },
        scale: { duration: prefersReducedMotion ? 0 : 1.2, ease: "easeOut" }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: prefersReducedMotion ? 0 : (direction < 0 ? "20%" : "-20%"),
      opacity: 0,
      transition: {
        x: { duration: prefersReducedMotion ? 0 : 0.6 },
        opacity: { duration: prefersReducedMotion ? 0 : 0.4 }
      }
    })
  };

  return (
    <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-[#1A1208]">



      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: HERO_SLIDES[current].bgColor || '#1A1208' }}>
            {isContainDesktop && (
              <Image
                src={HERO_SLIDES[current].image}
                alt=""
                fill
                sizes="100vw"
                loading="lazy"
                className="object-cover object-center scale-110 blur-2xl opacity-60"
              />
            )}
            <Image
              src={HERO_SLIDES[current].image}
              alt={HERO_SLIDES[current].title}
              fill
              sizes="100vw"
              loading="lazy"
              className={`transition-all duration-700 object-cover object-center ${isContainDesktop ? "md:object-contain md:object-center" : ""}`}
            />
            {/* Dynamic Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent`} />
            <div className="absolute inset-0 bg-black/20" />

            {/* Texture Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#1A1208] to-transparent" />
          </div>

          {/* Content Layer */}
          <div className="relative h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-center pt-24 md:pt-0">
            <div className="max-w-2xl space-y-3 md:space-y-6">
              <motion.div
                initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0 : 0.8 }}
                className="flex items-center gap-3 md:gap-4"
              >
                <div className="w-8 md:w-12 h-px bg-[var(--color-brand-gold)]" />
                <span className="font-ui text-[10px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-[var(--color-brand-gold)] font-bold">
                  {HERO_SLIDES[current].subtitle}
                </span>
              </motion.div>

              <motion.h1
                initial={{ y: prefersReducedMotion ? 0 : 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.6, duration: prefersReducedMotion ? 0 : 0.8 }}
                className="font-script text-5xl md:text-8xl lg:text-[120px] text-white leading-none tracking-tight font-light"
              >
                {HERO_SLIDES[current].title}
              </motion.h1>

              <motion.p
                initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.8, duration: prefersReducedMotion ? 0 : 0.8 }}
                className="font-body text-sm md:text-xl text-white/70 max-w-lg leading-relaxed italic"
              >
                {HERO_SLIDES[current].description}
              </motion.p>

              <motion.div
                initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 1, duration: prefersReducedMotion ? 0 : 0.8 }}
                className="pt-4 md:pt-8 flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center"
              >
                <Link
                  href={HERO_SLIDES[current].link}
                  className="group relative flex items-center gap-3 md:gap-4 bg-white px-6 py-3 md:px-8 md:py-4 rounded-full text-[#1A1208] font-ui font-bold uppercase tracking-widest text-[11px] md:text-[13px] hover:bg-[var(--color-brand-gold)] hover:text-white transition-all shadow-2xl"
                >
                  {HERO_SLIDES[current].cta}
                  <span className="bg-[#1A1208] text-white p-1 rounded-full group-hover:bg-white group-hover:text-[#1A1208] transition-colors">
                    <ArrowRight size={12} className="md:w-[14px] md:h-[14px]" />
                  </span>
                </Link>

                <Link
                  href="/collections"
                  className="font-ui text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center gap-3 group px-2 py-1"
                >
                  Browse Catalog
                  <div className="w-6 md:w-8 h-px bg-white/20 group-hover:w-10 md:group-hover:w-12 group-hover:bg-[var(--color-brand-gold)] transition-all" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Matching Shilpashastra style */}
      <div className="absolute inset-x-0 bottom-12 z-30 max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-none">

        {/* Left Arrows */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={slidePrev}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={slideNext}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Center Indicators */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${current === idx ? "w-12 bg-[var(--color-brand-gold)]" : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Right Label (Current/Total) */}
        <div className="hidden md:flex items-center gap-4 text-white/40 font-ui text-[12px] font-bold tracking-[0.3em] uppercase">
          <span>{String(current + 1).padStart(2, '0')}</span>
          <div className="w-8 h-px bg-white/20" />
          <span>{String(HERO_SLIDES.length).padStart(2, '0')}</span>
        </div>

      </div>

      {/* Ornate Border Detail (Bottom) */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-brand-gold)]/30 to-transparent" />

      {/* Texture Overlay (Grain) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />

    </section>
  );
}
