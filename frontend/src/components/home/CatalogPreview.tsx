"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getFeedProducts } from "@/actions/products";
import { formatCouponDiscount } from "@/lib/coupons";

export default function CatalogPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (scrollRef.current) {
      const items = scrollRef.current.querySelectorAll(".slider-item");
      gsap.fromTo(
        items,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scrollRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await getFeedProducts({ limit: 6, tag: "New Arrival" });
      setProducts(result);
    };

    loadProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-[var(--color-brand-cream-dark)] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="font-ui text-[12px] uppercase tracking-[0.1em] text-[var(--color-brand-slate)] mb-2 block">Curated Selection</span>
            <h2 className="font-script text-4xl text-[var(--color-brand-gold)]">New Arrivals</h2>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Link href="/collections" className="font-ui text-[13px] font-semibold uppercase tracking-widest text-[var(--color-brand-red)] hover:text-[var(--color-brand-gold)] border-b border-transparent hover:border-[var(--color-brand-gold)] transition-all mr-6">
              View All Pieces →
            </Link>
            <button onClick={scrollLeft} className="w-10 h-10 rounded-full border border-[var(--color-brand-slate)]/20 flex items-center justify-center text-[var(--color-brand-slate)] hover:bg-[var(--color-brand-slate)] hover:text-[var(--color-brand-cream)] transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={scrollRight} className="w-10 h-10 rounded-full border border-[var(--color-brand-slate)]/20 flex items-center justify-center text-[var(--color-brand-slate)] hover:bg-[var(--color-brand-slate)] hover:text-[var(--color-brand-cream)] transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8 pt-4 -mx-6 px-6 md:-mx-12 md:px-12"
        >
          {products.map((p) => (
            <Link
              href={`/product/${p.id}`}
              key={p.id}
              className="slider-item relative group overflow-hidden rounded-sm shrink-0 snap-start w-[280px] md:w-[320px] h-[400px] shadow-lg cursor-pointer bg-[var(--color-brand-cream)] block"
            >
              {p.coupon && (
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md text-[var(--color-brand-char)] font-ui text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg">
                  {p.coupon.code} • {formatCouponDiscount(p.coupon.discount)}
                </div>
              )}

              <Image
                src={p.img}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.08] transition-transform duration-[400ms] cubic-bezier(0.25,0.46,0.45,0.94)"
              />

              {typeof p.stock === "number" && (
                p.stock <= 0 ? (
                  <div className="absolute top-4 left-4 bg-black/70 text-white font-ui text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm z-20">
                    Out of stock
                  </div>
                ) : p.stock <= 2 ? (
                  <div className="absolute top-4 left-4 bg-[var(--color-brand-red)] text-white font-ui text-[10px] font-extrabold uppercase tracking-widest px-3 py-2 rounded-sm z-20">
                    Low stock alert â€¢ only {p.stock} left
                  </div>
                ) : null
              )}

              <button className="absolute top-4 right-4 z-20 p-2 bg-white/40 backdrop-blur-md rounded-full text-[var(--color-brand-slate)] hover:text-[var(--color-brand-red)] hover:bg-white transition-colors duration-300">
                <Heart size={18} strokeWidth={2} />
              </button>

              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[var(--color-brand-char)]/90 via-[var(--color-brand-char)]/50 to-transparent flex flex-col items-start z-10 transition-transform duration-300">
                <h3 className="font-display text-xl text-[var(--color-brand-cream)] mb-1 group-hover:text-[var(--color-brand-gold-light)] transition-colors">{p.name}</h3>
                <span className="font-ui text-[14px] text-[var(--color-brand-cream)]/80">₹{(p.price / 100).toLocaleString("en-IN")}</span>

                <div className="overflow-hidden w-full mt-4 h-0 group-hover:h-[40px] transition-all duration-300 ease-out flex gap-2">
                  <button className="flex-1 border border-[var(--color-brand-gold-light)] text-[var(--color-brand-gold-light)] hover:bg-[var(--color-brand-gold-light)] hover:text-[var(--color-brand-char)] font-ui text-[10px] uppercase font-bold tracking-widest h-[40px] rounded-sm transition-colors flex items-center justify-center">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-[var(--color-brand-red)] text-white hover:bg-[#A33B32] font-ui text-[10px] uppercase font-bold tracking-widest h-[40px] rounded-sm transition-all flex items-center justify-center shadow-lg">
                    Buy Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/collections" className="inline-block font-ui text-[13px] font-semibold uppercase tracking-widest text-[var(--color-brand-red)] border border-[var(--color-brand-red)] px-8 py-3 rounded-full">
            View All Pieces
          </Link>
        </div>
      </div>
    </section>
  );
}
