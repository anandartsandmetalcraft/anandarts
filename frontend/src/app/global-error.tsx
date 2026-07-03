"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home, Hammer } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to production monitoring (Sentry/Logtail would go here)
    console.error("[PRODUCTION_FATAL_ERROR]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center px-6 py-24 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0F172A]/5 rounded-full blur-[120px]" />

          <div className="max-w-2xl w-full text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Branded Icon */}
              <div className="relative w-32 h-32 mx-auto mb-12">
                <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-[40px] rotate-12" />
                <div className="absolute inset-0 bg-[#0F172A]/5 rounded-[40px] -rotate-6" />
                <div className="relative inset-0 w-full h-full bg-white border border-[#D4AF37]/20 rounded-[40px] flex items-center justify-center shadow-2xl backdrop-blur-sm">
                  <AlertTriangle size={48} className="text-[#D4AF37]" strokeWidth={1.2} />
                </div>
              </div>

              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-4">
                Anand Arts · Concierge Notification
              </p>
              
              <h1 className="font-display text-4xl md:text-6xl text-[#0F172A] mb-8 font-bold leading-tight">
                System <br /> Interruption
              </h1>
              
              <p className="font-ui text-base md:text-lg text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
                Our digital forge has encountered a critical anomaly. We’ve logged this instance for our craftsmen to address immediately.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={() => reset()}
                  className="w-full sm:w-auto flex items-center justify-center gap-4 bg-[#0F172A] text-white font-ui text-[11px] font-bold uppercase tracking-[0.2em] px-12 py-6 rounded-2xl shadow-2xl hover:bg-[#1E293B] transition-all active:scale-[0.98] group"
                >
                  <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                  Reload System
                </button>
                
                <Link 
                  href="/"
                  className="w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-[#0F172A] border border-slate-200 font-ui text-[11px] font-bold uppercase tracking-[0.2em] px-12 py-6 rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  <Home size={16} />
                  Return Home
                </Link>
              </div>

              {error.digest && (
                <div className="mt-16 pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-[#D4AF37]/40">
                    <Hammer size={12} />
                    <span className="font-ui text-[9px] font-bold uppercase tracking-[0.2em]">Reference Code: {error.digest}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}
