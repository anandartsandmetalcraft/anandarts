import React from "react";
import { Skeleton } from "@/components/shared/Skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-36 pb-24">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 items-center mb-8">
          <Skeleton width={60} height={12} className="rounded" />
          <span className="text-gray-300">/</span>
          <Skeleton width={80} height={12} className="rounded" />
          <span className="text-gray-300">/</span>
          <Skeleton width={120} height={12} className="rounded" />
        </div>

        {/* Product Details Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* Left Column: Product Image Gallery Skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] w-full bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
              <Skeleton className="w-full h-full" />
            </div>
            {/* Gallery Thumbnails Skeleton */}
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-20 h-24 bg-white border border-black/5 rounded-xl overflow-hidden shrink-0">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details Content Skeleton */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4 border-b border-black/5 pb-8">
              {/* Category tag */}
              <Skeleton width={100} height={14} className="rounded" />
              {/* Name */}
              <Skeleton width="80%" height={36} className="rounded-md" />
              {/* Reviews/Trust snippet */}
              <div className="flex gap-4 items-center">
                <Skeleton width={120} height={16} className="rounded" />
                <div className="w-px h-4 bg-black/10" />
                <Skeleton width={80} height={16} className="rounded" />
              </div>
              {/* Price */}
              <Skeleton width={140} height={40} className="rounded-md mt-4" />
            </div>

            {/* Finishing & Material Skeletons */}
            <div className="space-y-6 border-b border-black/5 pb-8">
              <div className="space-y-3">
                <Skeleton width={120} height={14} className="rounded" />
                <div className="flex gap-3">
                  <Skeleton width={80} height={36} className="rounded-xl" />
                  <Skeleton width={90} height={36} className="rounded-xl" />
                  <Skeleton width={80} height={36} className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton width={120} height={16} className="rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton width={80} height={12} className="rounded" />
                  <Skeleton width={100} height={16} className="rounded" />
                </div>
              </div>
            </div>

            {/* Action Buttons Skeletons */}
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                {/* Quantity */}
                <Skeleton width={120} height={52} className="rounded-full" />
                {/* Add to Cart */}
                <Skeleton width="100%" height={52} className="rounded-full" />
              </div>
              {/* WhatsApp Enquiry */}
              <Skeleton width="100%" height={52} className="rounded-full" />
            </div>
            
            {/* Description Tab skeleton */}
            <div className="space-y-3">
              <Skeleton width={140} height={18} className="rounded" />
              <Skeleton variant="text" lines={4} />
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
