import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  if (variant === "text") {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-4 rounded`}
            style={{
              width: i === lines - 1 && lines > 1 ? "60%" : "100%",
              height: "1rem"
            }}
          />
        ))}
      </div>
    );
  }

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (variant === "circular") {
    return (
      <div
        className={`${baseClasses} rounded-full ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} rounded ${className}`}
      style={style}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="group block">
      <div className="relative aspect-[4/5] bg-gray-100 mb-3 md:mb-4 overflow-hidden rounded-sm">
        <Skeleton className="w-full h-full" />
        {/* Tag skeleton */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4">
          <Skeleton width={60} height={20} className="rounded" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center px-1">
        <Skeleton width={80} height={12} className="mb-2" />
        <Skeleton width={120} height={16} className="mb-2" />
        <Skeleton width={60} height={14} />
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Admin Dashboard Skeleton
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <Skeleton width={200} height={32} />
          <Skeleton width={120} height={40} className="rounded-xl" />
        </div>
        <Skeleton width={300} height={24} />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Skeleton width={40} height={40} variant="circular" />
              <Skeleton width={60} height={20} />
            </div>
            <Skeleton width={80} height={28} className="mb-2" />
            <Skeleton width={100} height={16} />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <Skeleton width={150} height={24} className="mb-6" />
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <Skeleton width={150} height={24} className="mb-6" />
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Admin Products Table Skeleton
export function AdminProductsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="group transition-colors">
          <td className="px-8 py-6">
            <div className="flex items-center gap-6">
              <Skeleton width={64} height={80} className="rounded-xl" />
              <div className="space-y-2">
                <Skeleton width={120} height={18} />
                <Skeleton width={80} height={10} />
              </div>
            </div>
          </td>
          <td className="px-8 py-6">
            <div className="space-y-2">
              <Skeleton width={60} height={14} />
              <Skeleton width={40} height={12} />
            </div>
          </td>
          <td className="px-8 py-6">
            <Skeleton width={80} height={20} />
          </td>
          <td className="px-8 py-6">
            <div className="flex items-center gap-2">
              <Skeleton width={8} height={8} variant="circular" />
              <Skeleton width={50} height={14} />
            </div>
          </td>
          <td className="px-8 py-6">
            <Skeleton width={70} height={24} className="rounded-full" />
          </td>
          <td className="px-8 py-6">
            <Skeleton width={80} height={24} className="rounded-full" />
          </td>
          <td className="px-8 py-6">
            <div className="flex gap-2">
              <Skeleton width={32} height={32} className="rounded-xl" />
              <Skeleton width={32} height={32} className="rounded-xl" />
              <Skeleton width={32} height={32} className="rounded-xl" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}