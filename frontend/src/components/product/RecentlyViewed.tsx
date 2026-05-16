"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { getProductsByIds } from "@/actions/products";
import { getRecentlyViewedIds } from "@/lib/recentlyViewed";

export default function RecentlyViewed({ currentId }: { currentId: string | number }) {
  const [products, setProducts] = useState<any[]>([]);

  const ids = useMemo(() => {
    const all = getRecentlyViewedIds();
    const filtered = all.filter((id) => id !== String(currentId));
    return filtered.slice(0, 4);
  }, [currentId]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }

    const load = async () => {
      const result = await getProductsByIds(ids);
      const order = new Map(ids.map((id, idx) => [id, idx]));
      setProducts([...result].sort((a, b) => (order.get(String(a.id)) ?? 0) - (order.get(String(b.id)) ?? 0)).slice(0, 4));
    };

    void load();
  }, [ids]);

  if (products.length === 0) return null;

  return (
    <section className="max-w-[1320px] mx-auto px-6 md:px-12 pt-24 border-t border-black/5 mt-24">
      <div className="flex items-end justify-between mb-10 gap-6">
        <div>
          <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#8B8375] mb-2 block">Continue Exploring</span>
          <h2 className="font-display text-3xl md:text-4xl text-[var(--color-brand-char)]">Recently Viewed</h2>
        </div>
        <Link
          href="/collections"
          className="font-ui text-sm font-bold uppercase tracking-widest text-[var(--color-brand-red)] hover:text-[var(--color-brand-gold)] transition-colors"
        >
          View All â†’
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => {
          const image = product.images?.[0]?.url ?? product.img ?? "/placeholder.jpg";
          return (
            <Link href={`/product/${product.id}`} key={product.id} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#E8E1D5] mb-4">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <h3 className="font-display text-lg text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="font-ui text-sm text-[#8B8375] mb-1">{product.material}</p>
              <p className="font-ui text-base font-bold text-[var(--color-brand-char)]">
                â‚¹{(Number(product.price || 0) / 100).toLocaleString("en-IN")}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

