"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, ShoppingBag, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[var(--color-brand-gold)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--color-brand-red)]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Large 404 Text */}
          <h1 className="font-display text-[120px] md:text-[180px] leading-none text-[var(--color-brand-char)] opacity-5 select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            404
          </h1>

          {/* Icon/Graphic */}
          <div className="relative mb-12">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[40px] shadow-2xl mx-auto flex items-center justify-center border border-black/5"
            >
              <Compass size={64} strokeWidth={1} className="text-[var(--color-brand-gold)]" />
            </motion.div>
            
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[var(--color-brand-char)] text-white text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-lg">
              Lost In Craft
            </div>
          </div>

          <h2 className="font-display text-4xl md:text-5xl text-[var(--color-brand-char)] mb-6">
            Page Not Found
          </h2>
          
          <p className="font-ui text-sm md:text-base text-[#8B8375] mb-12 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let us help you find your way back.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--color-brand-char)] text-white font-ui text-xs font-bold uppercase tracking-widest px-10 py-5 rounded-full shadow-xl hover:bg-black transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return Home
            </Link>
            
            <Link 
              href="/collections"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-[var(--color-brand-char)] border border-black/10 font-ui text-xs font-bold uppercase tracking-widest px-10 py-5 rounded-full shadow-lg hover:bg-gray-50 transition-all"
            >
              <ShoppingBag size={16} />
              Browse Collections
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-black/5 flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-black/20 mb-2">Support</span>
              <Link href="/contact" className="font-ui text-xs font-bold text-[var(--color-brand-char)] hover:text-[var(--color-brand-gold)] transition-colors underline underline-offset-4">Contact Team</Link>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-black/20 mb-2">Location</span>
              <Link href="/legal" className="font-ui text-xs font-bold text-[var(--color-brand-char)] hover:text-[var(--color-brand-gold)] transition-colors underline underline-offset-4">Sitemap & Policies</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
