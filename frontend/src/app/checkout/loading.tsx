import React from "react";
import { Skeleton } from "@/components/shared/Skeleton";

export default function CheckoutLoading() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[var(--color-brand-cream)]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        
        {/* Header and Stepper Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div>
            <Skeleton width={120} height={14} className="mb-4 rounded" />
            <Skeleton width={200} height={36} className="rounded-md" />
          </div>
          {/* Stepper bubbles */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton width={40} height={40} variant="circular" />
              <Skeleton width={50} height={10} className="rounded" />
            </div>
            <div className="w-12 h-[2px] bg-black/10 mt-[-16px]" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton width={40} height={40} variant="circular" />
              <Skeleton width={50} height={10} className="rounded" />
            </div>
          </div>
        </div>

        {/* Form and Summary Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* Left Column: Form Details Skeletons */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-black/5 flex gap-4">
                <Skeleton width={48} height={48} className="rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton width={120} height={14} className="rounded" />
                  <Skeleton width={150} height={10} className="rounded" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-black/5 flex gap-4">
                <Skeleton width={48} height={48} className="rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton width={120} height={14} className="rounded" />
                  <Skeleton width={150} height={10} className="rounded" />
                </div>
              </div>
            </div>

            {/* Address fields Skeleton container */}
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 space-y-6">
              <Skeleton width={180} height={24} className="mb-4 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton width={100} height={12} className="rounded" />
                <Skeleton className="w-full h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 space-y-8">
              <Skeleton width={140} height={22} className="rounded" />
              
              {/* Product row item skeletons */}
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Skeleton width={80} height={96} className="rounded-xl shrink-0" />
                    <div className="space-y-2 flex-1 py-1">
                      <Skeleton width="80%" height={14} className="rounded" />
                      <Skeleton width={60} height={12} className="rounded" />
                      <Skeleton width={80} height={20} className="rounded-lg mt-2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Price summary metrics skeleton */}
              <div className="space-y-4 pt-6 border-t border-black/5">
                <div className="flex justify-between">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton width={60} height={12} className="rounded" />
                </div>
                <div className="flex justify-between">
                  <Skeleton width={70} height={12} className="rounded" />
                  <Skeleton width={50} height={12} className="rounded" />
                </div>
                <div className="flex justify-between">
                  <Skeleton width={60} height={12} className="rounded" />
                  <Skeleton width={40} height={12} className="rounded" />
                </div>
                <div className="flex justify-between pt-4 border-t border-black/10">
                  <Skeleton width={90} height={16} className="rounded" />
                  <Skeleton width={80} height={20} className="rounded" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
