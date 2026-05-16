"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Eye, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { getFeedProducts } from "@/actions/products";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { formatCouponDiscount } from "@/lib/coupons";

export default function BestsellersRail() {
  const { addItem } = useCartStore();
  const { setIsCartOpen } = useUIStore();
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      // Get 8 items tagged as 'Best Seller'
      const result = await getFeedProducts({ limit: 8 });
      setBestsellers(result);
    };

    loadProducts();
  }, []);

  const [addedId, setAddedId] = useState<string | number | null>(null);

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    addItem(prod, 1);
    setIsCartOpen(true);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1320px] mx-auto overflow-hidden">
      <div className="flex flex-col items-center mb-20 text-center">
         <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-brand-gold)] block mb-4">Most Cherished Sanctuaries</span>
         <h2 className="font-display text-4xl md:text-6xl text-[var(--color-brand-char)] uppercase tracking-tight mb-6">
            Bestsellers
         </h2>
         <div className="flex items-center gap-6">
            <Link 
               href="/collections"
               className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B8375] hover:text-[var(--color-brand-red)] transition-all border-b border-[#2A2621]/20 pb-1"
            >
               VIEW ALL PRODUCTS
            </Link>
            <div className="hidden md:flex gap-2">
               <button 
                  onClick={() => scroll("left")}
                  className="w-10 h-10 rounded-full border border-[#2A2621]/10 flex items-center justify-center text-[var(--color-brand-char)] hover:bg-[var(--color-brand-char)] hover:text-white transition-all"
               >
                  <ChevronLeft size={18} />
               </button>
               <button 
                  onClick={() => scroll("right")}
                  className="w-10 h-10 rounded-full border border-[#2A2621]/10 flex items-center justify-center text-[var(--color-brand-char)] hover:bg-[var(--color-brand-char)] hover:text-white transition-all"
               >
                  <ChevronRight size={18} />
               </button>
            </div>
         </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-4 pb-12 min-h-[400px] scroll-smooth"
      >
         {bestsellers.length === 0 ? (
            <div className="w-full flex items-center justify-center text-[var(--color-brand-slate)] opacity-40 italic font-ui text-sm">
               Loading curated artifacts...
            </div>
         ) : bestsellers.map((prod, idx) => (
            <motion.div 
               key={prod.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ delay: idx * 0.1, duration: 0.6 }}
               className="flex-shrink-0 w-[300px] md:w-[380px] snap-start group"
            >
               <div className="aspect-square relative overflow-hidden rounded-[32px] bg-[#E8E1D5] mb-8 shadow-xl">
                  <Image 
                    src={prod.img || "/placeholder.jpg"} 
                    alt={prod.name} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  
                  <div className="absolute top-4 left-4 right-4 flex flex-col items-start gap-2 z-10 pointer-events-none">
                    {prod.tag && (
                      <div className="bg-[var(--color-brand-gold)] text-[#11100D] font-ui text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto">
                        {prod.tag}
                      </div>
                    )}
                    {prod.coupon && (
                      <div className="bg-white/90 backdrop-blur-md text-[var(--color-brand-char)] font-ui text-[9px] font-bold uppercase px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto">
                        {prod.coupon.code} • {formatCouponDiscount(prod.coupon.discount)}
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 pointer-events-none z-0" />
                  
                  {/* Invisible link overlay for entire image tapping */}
                  <Link href={`/product/${prod.id}`} className="absolute inset-0 z-10" aria-label={`View ${prod.name}`} />
                  
                  <div className="absolute inset-x-4 bottom-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex gap-2">
                     <button 
                       onClick={(e) => handleAddToCart(e, prod)}
                       className={`flex-1 bg-white/90 backdrop-blur-md border border-[var(--color-brand-gold)] font-ui text-[9px] font-bold uppercase tracking-widest py-3 rounded-sm shadow-xl transition-all flex items-center justify-center gap-2 ${addedId === prod.id ? 'bg-[#8B0000] text-white border-none' : 'text-[var(--color-brand-char)] hover:bg-[var(--color-brand-gold)] hover:text-white'}`}
                     >
                       {addedId === prod.id ? "✓ Added!" : <><ShoppingBag size={14} /> Add to Cart</>}
                     </button>
                     <Link 
                        href={`/product/${prod.id}`} 
                        className="flex-1 bg-[var(--color-brand-red)] text-white hover:bg-[#A33B32] font-ui text-[9px] font-bold uppercase tracking-widest py-3 rounded-sm shadow-xl transition-all flex items-center justify-center gap-2"
                     >
                        <Eye size={14} /> View Details
                     </Link>
                  </div>
               </div>

               <div className="space-y-3 px-2">
                  <p className="font-ui text-[11px] uppercase font-bold tracking-widest text-[#8B8375] opacity-60">
                     {prod.category} • {prod.material}
                  </p>
                  <Link href={`/product/${prod.id}`}>
                     <h3 className="font-display text-2xl text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-1">
                        {prod.name}
                     </h3>
                  </Link>
                  {prod.description && (
                    <p className="font-ui text-[10px] text-[#8B8375] line-clamp-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {prod.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {prod.compareAt && (
                          <span className="font-ui text-[14px] text-[#8B8375] line-through opacity-60 decoration-[var(--color-brand-gold)]">
                            ₹{(prod.compareAt / 100).toLocaleString("en-IN")}
                          </span>
                        )}
                        <p className="font-display text-xl text-[var(--color-brand-char)]">
                           ₹{(prod.price / 100).toLocaleString("en-IN")}
                        </p>
                      </div>
                     <span className="h-px w-8 bg-black/5" />
                     <p className="font-ui text-[10px] uppercase font-bold tracking-widest text-[#8B8375]">
                        {prod.size}
                     </p>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>
    </section>
  );
}
