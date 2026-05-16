"use client";

import React, { useState } from "react";
import { MapPin, Truck, AlertCircle, Loader2 } from "lucide-react";
import { estimateDeliveryAction } from "@/actions/delivery";

interface DeliveryEstimatorProps {
  weightGrams?: number;
}

export function DeliveryEstimator({ weightGrams = 1000 }: DeliveryEstimatorProps) {
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
    formattedDate?: string;
    estimatedDays?: string;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await estimateDeliveryAction(pincode, weightGrams);
      setResult(response);
    } catch (err) {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FDF5E6]/30 border border-black/5 rounded-2xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Truck size={18} className="text-[var(--color-brand-gold)]" />
        <h4 className="font-ui text-[11px] font-bold uppercase tracking-widest text-black">
          Check Delivery Time
        </h4>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-black/30">
            <MapPin size={16} />
          </div>
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[0-9]+$/.test(val)) {
                setPincode(val);
              }
            }}
            placeholder="Enter PIN Code"
            className="w-full bg-white border border-black/10 rounded-xl py-3 pl-10 pr-4 font-ui text-sm focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={pincode.length !== 6 || isLoading}
          className="bg-black text-white px-6 py-3 rounded-xl font-ui text-[11px] font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-[var(--color-brand-gold)] transition-colors flex items-center justify-center min-w-[100px]"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Check"}
        </button>
      </form>

      {result && (
        <div className="mt-4 pt-4 border-t border-black/5">
          {result.success ? (
            <div className="flex items-start gap-3 text-green-700">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Truck size={14} />
              </div>
              <div>
                <p className="font-ui text-sm font-semibold">
                  Delivery by {result.formattedDate}
                </p>
                <p className="font-ui text-xs opacity-80 mt-0.5">
                  Usually takes {result.estimatedDays} days
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-red-600">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p className="font-ui text-sm">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
