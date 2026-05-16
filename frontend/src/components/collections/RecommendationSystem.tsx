"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

import { getFeedProducts } from "@/actions/products";

export default function RecommendationSystem() {
  const { addItem } = useCartStore();
  const { setIsCartOpen } = useUIStore();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      // Fetch 4 products from the DB (newest first)
      const result = await getFeedProducts({ limit: 4 });
      setProducts(result);
    };
    loadProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    addItem(
      {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        img: prod.img,
        category: prod.category,
      } as any,
      1
    );
    setIsCartOpen(true);
  };

  // Don't render the section if there are no products
  if (products.length === 0) return null;

  return (
    <section className="relative py-24 px-6 md:px-12 max-w-[1320px] mx-auto border-t border-black/5 mt-16 bg-white/50 rounded-[48px] z-10 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-px bg-[var(--color-brand-gold)]" />
            <span className="font-ui text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-red)]">
              Handpicked Just For You
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-brand-char)] drop-shadow-sm">
            Recommended for You
          </h2>
        </div>
        <Link
          href="/collections"
          className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)] hover:text-[var(--color-brand-red)] transition-all underline underline-offset-8 decoration-[var(--color-brand-gold)]"
        >
          VIEW ALL PRODUCTS
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12 pt-4 -mx-6 px-6 md:-mx-12 md:px-12">
        {products.map((prod, idx) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start group relative"
          >
            <div className="aspect-[3/4] relative overflow-hidden rounded-3xl bg-[#E8E1D5] mb-6 shadow-xl">
              <Image
                src={prod.img || "/placeholder.jpg"}
                alt={prod.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />

              {/* Glassmorphism Overlays */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

              {prod.tag && (
                <div className="absolute top-4 left-4 bg-[var(--color-brand-gold)] text-[#11100D] font-ui text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-lg z-10">
                  {prod.tag}
                </div>
              )}

              <div className="absolute inset-x-4 bottom-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex gap-2">
                <button
                  onClick={(e) => handleAddToCart(e, prod)}
                  className="flex-1 bg-white/90 backdrop-blur-md text-[var(--color-brand-char)] border border-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] hover:text-white font-ui text-[9px] font-bold uppercase tracking-widest py-3 rounded-sm shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} /> Cart
                </button>
                <Link
                  href={`/product/${prod.id}`}
                  className="flex-1 bg-[var(--color-brand-red)] text-white hover:bg-[#A33B32] font-ui text-[9px] font-bold uppercase tracking-widest py-3 rounded-sm shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={14} /> Details
                </Link>
              </div>
            </div>

            <div className="space-y-2 text-center group">
              <p className="font-ui text-[10px] uppercase font-bold tracking-widest text-[#8B8375] opacity-60">
                {prod.category}
              </p>
              <h3 className="font-display text-xl text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-1">
                {prod.name}
              </h3>
              <div className="flex flex-col items-center">
                {prod.compareAt && (
                  <span className="font-ui text-[10px] text-[#8B8375] line-through opacity-60">
                    ₹{(prod.compareAt / 100).toLocaleString("en-IN")}
                  </span>
                )}
                <p className="font-display text-lg text-[var(--color-brand-gold)]">
                  ₹{(prod.price / 100).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
