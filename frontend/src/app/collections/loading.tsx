import React from "react";
import { ProductGridSkeleton, Skeleton } from "@/components/shared/Skeleton";

export default function CollectionsLoading() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-24 pb-24 border-t border-black/5">
      {/* Hero Header Skeleton */}
      <div className="bg-[#11100D] py-16 md:py-24 px-6 text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Skeleton width={50} height={10} className="rounded opacity-20" />
          <Skeleton width={10} height={10} variant="circular" className="opacity-20" />
          <Skeleton width={80} height={10} className="rounded opacity-20" />
        </div>
        <Skeleton width={120} height={12} className="mb-4 rounded opacity-20" />
        <Skeleton width={280} height={40} className="mb-6 rounded-md opacity-20" />
        <Skeleton width={400} height={20} className="rounded opacity-20" />
      </div>

      {/* CategoryBar Skeleton */}
      <div className="border-b border-black/5 bg-white/80 py-6">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex gap-4 overflow-x-auto no-scrollbar">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} width={100} height={36} className="rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Product Catalog Grid Loader */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <Skeleton width={150} height={24} className="rounded" />
          <div className="flex gap-3">
            <Skeleton width={120} height={40} className="rounded-xl" />
            <Skeleton width={140} height={40} className="rounded-xl" />
          </div>
        </div>
        <ProductGridSkeleton count={6} />
      </div>
    </main>
  );
}
