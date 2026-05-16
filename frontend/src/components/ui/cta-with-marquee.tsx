"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";

interface MarqueeProps {
  children: ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
  speed?: number;
}

function Marquee({
  children,
  pauseOnHover = false,
  reverse = false,
  className,
  speed = 40,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:1rem] [gap:var(--gap)]",
        className
      )}
      style={
        {
          "--duration": `${speed}s`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[var(--gap)] animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[var(--gap)] animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}

const images = [
  "/Divine_god.webp",
  "/Divine_godess.webp",
  "/Divine_set.webp",
  "/Brass.webp",
];

const images2 = [
  "/idol.png",
  "/hero_bg.png",
  "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1590732488857-e23348633364?w=400&h=400&fit=crop",
];

function ScrambleButton({ text = "Read More", href = "/about" }: { text?: string, href?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = text;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const maxIterations = originalText.length;

    const interval = setInterval(() => {
      setDisplayText(() =>
        originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
       );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <Link href={href}>
      <button
        onMouseEnter={scramble}
        className="px-8 py-3 bg-[var(--color-brand-red)] text-white rounded-full font-semibold hover:bg-[var(--color-brand-gold)] transition-colors uppercase tracking-widest text-sm"
      >
        {displayText}
      </button>
    </Link>
  );
}

export function HeritageMarquee() {
  return (
    <div className="min-h-[80vh] bg-[var(--color-brand-cream)] text-[var(--color-brand-slate)] flex items-center overflow-hidden relative py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-[var(--color-brand-gold)]" />
                  <span className="font-ui text-sm uppercase tracking-[0.3em] text-[var(--color-brand-gold)] font-bold">Our Heritage</span>
               </div>
               <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-tight">
                Authentic Craft <br />
                <span className="text-[var(--color-brand-red)]">Generations of Art</span>
              </h2>
            </div>
            
            <div className="space-y-4 text-[var(--color-brand-slate)]/80">
              <p className="text-xl font-body italic">
                "Each artifact is a legacy of Srirampura's master craftsmen, carved with precision and blessed with devotion."
              </p>
              <p className="text-lg">
                Since 1978, Anand Arts has preserved the sacred traditions of temple woodcraft, bringing the soul of South Indian heritage into your home.
              </p>
            </div>
            <ScrambleButton text="Our Full Story" />
          </div>

          {/* Right Marquee Grid */}
          <div className="space-y-6 overflow-hidden py-10">
            <Marquee speed={30} reverse className="[--gap:1.5rem]">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-56 h-72 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl border-4 border-white"
                >
                  <Image
                    src={src}
                    alt={`Heritage Artifact ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </Marquee>
            <Marquee speed={35} className="[--gap:1.5rem]">
              {images2.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-56 h-72 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl border-4 border-white"
                >
                  <Image
                    src={src}
                    alt={`Heritage Artifact ${idx + 5}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
}
