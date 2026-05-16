"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

const FEATURED_CATEGORY_ORDER = [
  "Divine Gods",
  "Divine Goddess",
  "Divine Sets",
  "Copper",
  "Miniature",
  "Vintage",
  "Brass",
];

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "divine gods": "/Divine_god.webp",
  "divine goddess": "/Divine_godess.webp",
  "divine sets": "/Divine_set.webp",
  brass: "/Brass.webp",
  copper: "/hero_bg.png",
  miniature: "/Divine_set.webp", // Reusing existing image for now
  vintage: "/Divine_set.webp",   // Reusing existing image for now
};

function normalizePublicPath(path: string) {
  if (!path) return path;
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `/${path}`;
}

interface CategoryBarProps {
  initialCategories: any[];
}

export default function CategoryBar({ initialCategories }: CategoryBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCat = searchParams.get("category") || "All";

  const categories = [
    { id: "All", name: "All Products", slug: "All", image: null },
    ...FEATURED_CATEGORY_ORDER.map((name) => {
      const match = initialCategories.find(
        (category) => category.name?.toLowerCase() === name.toLowerCase()
      );

      return (
        match ?? {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          slug: name,
          image: DEFAULT_CATEGORY_IMAGES[name.toLowerCase()] ?? null,
        }
      );
    }).map((category) => ({
      ...category,
      image: normalizePublicPath(
        category.image ||
          DEFAULT_CATEGORY_IMAGES[category.name?.toLowerCase?.() ?? ""] ||
          ""
      ) || null,
    })),
  ];

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "All") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-[72px] z-40 w-full overflow-x-auto border-b border-black/5 bg-white/80 py-4 backdrop-blur-md no-scrollbar md:py-6">
      <div className="mx-auto max-w-[1320px] px-6 md:px-12">
        <div className="flex min-w-max items-center justify-between gap-8 md:min-w-0 md:justify-center md:gap-12">
          {categories.map((cat) => {
            const isActive = activeCat === cat.slug;

            return (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group flex flex-col items-center gap-3 rounded-2xl px-4 py-2 outline-none transition-all hover:bg-[var(--color-brand-gold)]/5 ${
                  isActive ? "bg-[var(--color-brand-gold)]/8" : ""
                }`}
              >
                <div
                  className={`relative h-12 w-12 overflow-hidden rounded-full bg-[var(--color-brand-gold)]/10 shadow-inner ring-1 ring-black/5 transition-all md:h-16 md:w-16 ${
                    isActive ? "scale-110 shadow-lg ring-[var(--color-brand-gold)]/40" : ""
                  }`}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="64px"
                      loading="lazy"
                      decoding="async"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center border border-dashed border-[var(--color-brand-gold)]/35 bg-white/70 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-gold)]">
                      Add
                    </div>
                  )}
                </div>
                <span
                  className={`font-ui text-[10px] font-bold uppercase tracking-[0.15em] transition-colors md:text-[11px] ${
                    isActive
                      ? "text-[var(--color-brand-red)]"
                      : "text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-red)]"
                  }`}
                >
                  {cat.name}
                </span>
                <div
                  className={`h-0.5 bg-[var(--color-brand-red)] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
