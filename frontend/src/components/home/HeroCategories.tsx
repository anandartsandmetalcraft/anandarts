"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    name: "Divine Gods",
    href: "/collections?category=Divine+Gods",
    color: "bg-[#E6F0F9]", // Light blue
    image: "/Divine_god.webp",
  },
  {
    name: "Divine Goddess",
    href: "/collections?category=Divine+Goddess",
    color: "bg-[#F9F6EE]", // Off-white/cream
    image: "/Divine_godess.webp",
  },
  {
    name: "Divine Sets",
    href: "/collections?category=Divine+Sets",
    color: "bg-[#F3E5F5]", // Light purple
    image: "/Divine_set.webp",
  },
  {
    name: "Brass Idols",
    href: "/collections?category=Brass",
    color: "bg-[#FFF8E1]", // Light yellow/gold
    image: "/Brass.webp",
  },
  {
    name: "Copper",
    href: "/collections?category=Copper",
    color: "bg-[#FBE9E7]", // Light copper/red
    image: "/Divine_set.webp", // Reusing until copper image is available
  },
  {
    name: "Miniature",
    href: "/collections?category=Miniature",
    color: "bg-[#E0F7FA]", // Light cyan
    image: "/Divine_god.webp", // Reusing
  },
  {
    name: "Vintage",
    href: "/collections?category=Vintage",
    color: "bg-[#FFF0F5]", // Lavender blush
    image: "/Divine_godess.webp", // Reusing
  }
];

export default function HeroCategories() {
  return (
    <section className="w-full bg-white pt-[130px] pb-4">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-row overflow-x-auto hide-scrollbar gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 justify-start lg:justify-center snap-x pb-4">
          {CATEGORIES.map((category, idx) => (
            <Link 
              key={idx} 
              href={category.href}
              className="flex flex-col items-center gap-3 min-w-[85px] sm:min-w-[96px] md:min-w-[110px] lg:min-w-[120px] snap-center group"
            >
              <div className={`w-[85px] h-[85px] sm:w-[96px] sm:h-[96px] md:w-[110px] md:h-[110px] lg:w-[120px] lg:h-[120px] rounded-[24px] ${category.color} flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 relative`}>
                {category.image && (
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    width={110} 
                    height={110}
                    className="object-cover w-full h-full rounded-[24px] transition-transform duration-300 group-hover:scale-110 drop-shadow-md mix-blend-multiply" 
                  />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] md:text-[13px] font-medium text-[#11100D] text-center leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
