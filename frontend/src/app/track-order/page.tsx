"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, Calendar, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { trackOrderAction } from "@/actions/tracking";
import { toast } from "sonner";
import Link from "next/link";
import { OrderTracking } from "@/components/ui/order-tracking";

type TrackingStep = {
  status: string;
  location: string;
  date: string;
  description: string;
  isCompleted: boolean;
};

export default function TrackOrderPage() {
  const [activeTab, setActiveTab] = useState<"order" | "tracking">("tracking");
  const [inputValue, setInputValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  // Read URL parameters for auto-fill from email links
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam) {
      setInputValue(idParam);
      setActiveTab("order");
    }
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    setIsPending(true);
    setTrackingResult(null);

    try {
      const result = await trackOrderAction({ type: activeTab, value: inputValue });
      if (result.error) {
        toast.error(result.error);
      } else {
        setTrackingResult(result);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="relative min-h-screen pt-20">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/tracking_background_1776865616885.png')` }}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Tracking Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20 w-full max-w-[540px]"
          >
            <div className="mb-10">
              <h1 className="font-display text-4xl text-[var(--color-brand-char)] uppercase tracking-tight mb-4">
                Track Your <br /> <span className="text-[var(--color-brand-gold)]">Order</span>
              </h1>
              <p className="text-sm text-[#8B8375] font-ui">
                Enter your details below to see the real-time status of your order.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-black/5 mb-8 relative">
              <button
                onClick={() => setActiveTab("order")}
                className={`flex-1 pb-4 font-ui text-[11px] font-bold uppercase tracking-widest transition-colors relative z-10 ${activeTab === 'order' ? 'text-black' : 'text-[#8B8375]'}`}
              >
                Order Number
              </button>
              <button
                onClick={() => setActiveTab("tracking")}
                className={`flex-1 pb-4 font-ui text-[11px] font-bold uppercase tracking-widest transition-colors relative z-10 ${activeTab === 'tracking' ? 'text-black' : 'text-[#8B8375]'}`}
              >
                Tracking Number
              </button>

              {/* Active Tab Indicator */}
              <motion.div
                className="absolute bottom-0 h-0.5 bg-black"
                animate={{
                  left: activeTab === 'order' ? '0%' : '50%',
                  width: '50%'
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            </div>

            <form onSubmit={handleTrack} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={activeTab === 'order' ? "e.g. AA-2024-1234" : "e.g. 1234567890"}
                  className="w-full bg-[#FDF5E6]/50 border border-black/5 rounded-2xl px-6 py-4 font-ui text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]/20 transition-all"
                />
                {activeTab === 'tracking' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8375]">
                    <Truck size={18} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#3D2B1F] hover:bg-[#2A1D15] text-white py-5 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Track Your Order
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-[#A89F91] uppercase tracking-[0.1em] font-bold">
                Powered by <span className="text-[var(--color-brand-gold)]">Shiprocket</span>
              </p>
            </div>
          </motion.div>

          {/* Results Area */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {trackingResult && trackingResult.success ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20"
                >
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
                    <div>
                      <h3 className="font-display text-2xl text-[var(--color-brand-char)] uppercase tracking-widest">{trackingResult.data.currentStatus || 'In Transit'}</h3>
                      <p className="text-[10px] text-[#8B8375] font-bold uppercase tracking-widest mt-1">AWB: {trackingResult.data.awb}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <CheckCircle2 size={24} />
                    </div>
                  </div>
                  <div className="space-y-8">
                    {/* New Order Tracking Component */}
                    <div className="pt-4">
                      {trackingResult.data.scans && trackingResult.data.scans.length > 0 ? (
                        <OrderTracking 
                          steps={trackingResult.data.scans.slice(0, 5).map((scan: any) => ({
                            name: scan.activity,
                            timestamp: `${scan.location} • ${scan.date}`,
                            isCompleted: true
                          }))}
                        />
                      ) : (
                        <div className="flex items-center gap-4 text-[#8B8375] py-8">
                          <AlertCircle size={16} />
                          <p className="text-xs font-bold uppercase tracking-widest">Detailed scans will appear once courier partner updates.</p>
                        </div>
                      )}
                    </div>


                    <div className="pt-6 border-t border-black/5 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-[#8B8375] font-bold uppercase tracking-widest">Expected Delivery</p>
                        <p className="font-display text-lg text-[var(--color-brand-char)]">{trackingResult.data.edd || 'Calculated Soon'}</p>
                      </div>
                      <Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] hover:underline">Need Help?</Link>
                    </div>
                  </div>
                </motion.div>
              ) : trackingResult && trackingResult.status ? (
                <motion.div
                  key="preparing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package size={32} className="text-amber-600" />
                    </div>
                    <h3 className="font-display text-2xl text-[var(--color-brand-char)] uppercase tracking-widest mb-4">{trackingResult.status}</h3>
                    <p className="text-sm text-[#8B8375] leading-relaxed max-w-sm mx-auto">
                      {trackingResult.message}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden lg:flex flex-col items-center justify-center text-white/60 p-12 text-center"
                >
                  <Truck size={64} strokeWidth={1} className="mb-6 opacity-30" />
                  <p className="font-display text-2xl uppercase tracking-widest mb-2">Track in Real-Time</p>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60">Across 29,000+ Pin Codes in India</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}
