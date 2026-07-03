"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, Check, X, ArrowUpDown, Sparkles } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { getProducts, getCategories } from "@/actions/products";
import { ProductGridSkeleton } from "@/components/shared/Skeleton";
import { formatCouponDiscount } from "@/lib/coupons";

const materialsList = ["All", "Brass", "Bronze", "Copper", "Silver", "Antique"];
const sizeRanges = [
  { label: "All", min: 0, max: 999 },
  { label: "1-3\"", min: 1, max: 3 },
  { label: "3-6\"", min: 3, max: 6 },
  { label: "6-12\"", min: 6, max: 12 },
  { label: "12-24\"", min: 12, max: 24 },
  { label: "24-36\"", min: 24, max: 36 },
  { label: "Life Size", min: 36, max: 999 }
];
const priceRanges = [
  { label: "All", min: 0, max: 99999999 },
  { label: "Under ₹1,500", min: 0, max: 150000 },
  { label: "₹1,500 - ₹3,000", min: 150001, max: 300000 },
  { label: "₹3,000 - ₹8,000", min: 300001, max: 800000 },
  { label: "₹8,000 - ₹20,000", min: 800001, max: 2000000 },
  { label: "₹20,000 - ₹50,000", min: 2000001, max: 5000000 },
  { label: "₹50,000 - ₹1,00,000", min: 5000001, max: 10000000 },
  { label: "Over ₹1,00,000", min: 10000001, max: 99999999 }
];
const sortMap: Record<string, string> = {
  "Featured": "featured",
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  "Newest": "newest"
};
const sorts = Object.keys(sortMap);

export default function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMaterial, setActiveMaterial] = useState("All");
  const [activeSize, setActiveSize] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState("All");
  const [activeSort, setActiveSort] = useState("Featured");
  const [activeSearch, setActiveSearch] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 18;

  // Fetch initial categories
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setDbCategories(cats);
    };
    loadCategories();
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      const range = priceRanges.find(r => r.label === activePriceRange);

      const sortMap: any = {
        "Featured": "newest",
        "Price: Low to High": "price_asc",
        "Price: High to Low": "price_desc",
        "Newest": "newest"
      };

      const result = await getProducts({
        category: activeCategory === "All" ? undefined : activeCategory.toLowerCase(),
        material: activeMaterial === "All" ? undefined : activeMaterial,
        size: activeSize === "All" ? undefined : activeSize,
        minPrice: range?.min,
        maxPrice: range?.max,
        sort: sortMap[activeSort],
        search: activeSearch || undefined,
        page,
        limit
      });

      if (page === 1) {
        setProducts(result.products);
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = result.products.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
      }
      setTotalCount(result.total);
      setIsLoading(false);
    };

    const syncProducts = () => {
      void fetchItems();
    };

    syncProducts();
    const interval = window.setInterval(syncProducts, 30000);
    window.addEventListener("focus", syncProducts);
    document.addEventListener("visibilitychange", syncProducts);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", syncProducts);
      document.removeEventListener("visibilitychange", syncProducts);
    };
  }, [activeCategory, activeMaterial, activeSize, activePriceRange, activeSort, activeSearch, page]);

  // Sync URL params to internal state
  useEffect(() => {
    // 1. Category (matches name or slug)
    const featuredNames = ["Divine Gods", "Divine Goddess", "Divine Sets", "Copper", "Miniature", "Vintage", "Brass"];
    const dbMatch = dbCategories.find(c =>
      c.slug.toLowerCase() === urlCategory.toLowerCase() ||
      c.name.toLowerCase() === urlCategory.toLowerCase()
    );
    const featuredMatch = featuredNames.find(f => f.toLowerCase() === urlCategory.toLowerCase());

    if (urlCategory === 'All') {
      setActiveCategory("All");
    } else if (dbMatch) {
      setActiveCategory(dbMatch.name);
    } else if (featuredMatch) {
      setActiveCategory(featuredMatch);
    } else {
      setActiveCategory("All");
    }

    // 2. Material
    const urlMaterial = searchParams.get('material');
    if (urlMaterial) {
      setActiveMaterial(urlMaterial);
    } else if (materialsList.includes(urlCategory)) {
      setActiveMaterial(urlCategory);
    } else {
      setActiveMaterial("All");
    }

    // 3. Size (Numeric Range)
    const urlMinH = searchParams.get('minHeight');
    const urlMaxH = searchParams.get('maxHeight');
    if (urlMinH || urlMaxH) {
      const match = sizeRanges.find(r => String(r.min) === urlMinH && String(r.max) === urlMaxH);
      if (match) setActiveSize(match.label);
      else setActiveSize("All");
    } else {
      setActiveSize("All");
    }

    // 4. Price
    const urlMin = searchParams.get('minPrice');
    const urlMax = searchParams.get('maxPrice');
    if (urlMin || urlMax) {
      const match = priceRanges.find(r => String(r.min) === urlMin && String(r.max) === urlMax);
      if (match) setActivePriceRange(match.label);
      else setActivePriceRange("All");
    } else {
      setActivePriceRange("All");
    }

    // 5. Search & Sort
    setActiveSearch(searchParams.get('search') || "");
    const sort = searchParams.get('sort');
    if (sort) {
      const label = Object.keys(sortMap).find(k => sortMap[k] === sort);
      if (label) setActiveSort(label);
    }

    setPage(1);
  }, [urlCategory, dbCategories, searchParams]);

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") params.delete(key);
    else params.set(key, value);
    if (key === 'category') params.delete('material'); // Reset material fallback if category is explicitly set
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const updatePriceURL = (range: any) => {
    const params = new URLSearchParams(searchParams.toString());
    if (range.label === "All") {
      params.delete('minPrice');
      params.delete('maxPrice');
    } else {
      params.set('minPrice', String(range.min));
      params.set('maxPrice', String(range.max));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const updateSizeURL = (range: any) => {
    const params = new URLSearchParams(searchParams.toString());
    if (range.label === "All") {
      params.delete('minHeight');
      params.delete('maxHeight');
    } else {
      params.set('minHeight', String(range.min));
      params.set('maxHeight', String(range.max));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
    setPage(1);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-12">

      {/* Mobile Top Bar (Filter Toggle & Sort) */}
      <div className="md:hidden flex justify-between items-center mb-6 gap-2">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)] bg-white px-4 py-3.5 rounded-sm shadow-sm border border-black/10"
        >
          <Filter size={16} /> Filters
        </button>

        {/* Mobile quick sort toggle */}
        <button
          onClick={() => {
            const nextIdx = (sorts.indexOf(activeSort) + 1) % sorts.length;
            setActiveSort(sorts[nextIdx]);
          }}
          className="flex-1 flex items-center justify-center gap-2 font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)] bg-white px-4 py-3.5 rounded-sm shadow-sm border border-black/10"
        >
          <ArrowUpDown size={16} /> Sort
        </button>
      </div>

      {/* Mobile Active Search Indicator */}
      {activeSearch && (
        <div className="md:hidden flex items-center justify-between bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-char)] px-4 py-2 rounded-sm text-xs font-bold font-ui mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[var(--color-brand-gold)]" />
            <span>Search: "{activeSearch}"</span>
          </div>
          <button onClick={() => setActiveSearch("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

        {/* Sidebar Filters */}
        <div className={`fixed inset-0 z-50 bg-[var(--color-brand-cream)] overflow-y-auto px-6 py-8 md:p-0 md:bg-transparent md:static md:block md:w-[260px] flex-shrink-0 transition-transform duration-300 ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

          <div className="flex justify-between items-center mb-8 md:hidden border-b border-black/5 pb-4">
            <h3 className="font-display text-2xl text-[var(--color-brand-char)] flex items-center gap-2">
              <Filter size={20} /> Advanced Filters
            </h3>
            <button onClick={() => setIsMobileFilterOpen(false)} aria-label="Close filters">
              <X size={24} className="text-[var(--color-brand-char)]" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Category Filter */}
            <div>
              <h4 className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-brand-char)] mb-5 border-b border-black/10 pb-3">
                Categories
              </h4>
              <div className="flex flex-col gap-3">
                {(() => {
                  const featuredNames = ["Divine Gods", "Divine Goddess", "Divine Sets", "Copper", "Miniature", "Vintage", "Brass"];
                  const allCats = [...dbCategories];

                  // Ensure all featured names exist in the list
                  featuredNames.forEach(name => {
                    if (!allCats.find(c => c.name.toLowerCase() === name.toLowerCase())) {
                      allCats.push({ id: name.toLowerCase().replace(/\s+/g, '-'), name, slug: name });
                    }
                  });

                  return allCats.sort((a, b) => {
                    const idxA = featuredNames.indexOf(a.name);
                    const idxB = featuredNames.indexOf(b.name);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return 0;
                  }).map((cat: any) => {
                    const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => { updateURL('category', cat.slug); setPage(1); }}
                        className="flex items-center gap-3 cursor-pointer group w-full text-left outline-none"
                      >
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${isSelected ? 'bg-[var(--color-brand-char)] border-[var(--color-brand-char)]' : 'border-black/20 group-hover:border-black/50 bg-white'}`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`font-ui text-sm transition-colors ${isSelected ? 'text-[var(--color-brand-char)] font-bold' : 'text-black/60 group-hover:text-black/80'}`}>
                          {cat.name}
                        </span>
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h4 className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-brand-char)] mb-5 border-b border-black/10 pb-3">
                Materials
              </h4>
              <div className="flex flex-col gap-3">
                {materialsList.map(mat => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => { updateURL('material', mat); setPage(1); }}
                    className="flex items-center gap-3 cursor-pointer group w-full text-left outline-none"
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeMaterial === mat ? 'border-[var(--color-brand-gold)] border-[4px]' : 'border-black/20 group-hover:border-black/50 bg-white'}`}>
                    </div>
                    <span className={`font-ui text-sm transition-colors ${activeMaterial === mat ? 'text-[var(--color-brand-char)] font-bold' : 'text-black/60 group-hover:text-black/80'}`}>
                      {mat}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions Filter */}
            <div>
              <h4 className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-brand-char)] mb-5 border-b border-black/10 pb-3">
                Dimensions
              </h4>
              <div className="flex flex-wrap gap-2">
                {sizeRanges.map(rng => (
                  <button
                    key={rng.label}
                    onClick={() => { updateSizeURL(rng); setPage(1); }}
                    className={`px-3 py-1.5 font-ui text-[11px] uppercase tracking-wide border rounded transition-colors ${activeSize === rng.label ? 'bg-[var(--color-brand-char)] border-[var(--color-brand-char)] text-[var(--color-brand-gold-light)] font-bold' : 'bg-transparent border-black/20 text-black/60 hover:border-black/50'}`}
                  >
                    {rng.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-brand-char)] mb-5 border-b border-black/10 pb-3">
                Price Range
              </h4>
              <div className="flex flex-col gap-3">
                {priceRanges.map(rng => (
                  <button
                    key={rng.label}
                    type="button"
                    onClick={() => { updatePriceURL(rng); setPage(1); }}
                    className="flex items-center gap-3 cursor-pointer group w-full text-left outline-none"
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activePriceRange === rng.label ? 'border-[var(--color-brand-gold)] border-[4px]' : 'border-black/20 group-hover:border-black/50 bg-white'}`}>
                    </div>
                    <span className={`font-ui text-sm transition-colors ${activePriceRange === rng.label ? 'text-[var(--color-brand-char)] font-bold' : 'text-black/60 group-hover:text-black/80'}`}>
                      {rng.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => { clearFilters(); if (window.innerWidth < 768) setIsMobileFilterOpen(false); }}
              className="w-full py-4 bg-white border border-[#2A2621]/20 font-ui text-[11px] font-bold uppercase tracking-widest text-[#2A2621] hover:bg-black/5 transition-colors rounded-sm shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="flex-1">

          {/* Top Bar (Desktop) */}
          <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-black/5">
            <div className="flex items-center gap-4">
              <span className="font-ui text-sm text-[var(--color-brand-slate)]">{totalCount} Products</span>
              {activeSearch && (
                <div className="flex items-center gap-2 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-char)] px-3 py-1 rounded-full text-xs font-bold font-ui">
                  <Sparkles size={14} className="text-[var(--color-brand-gold)]" />
                  Search results for: "{activeSearch}"
                  <button onClick={() => setActiveSearch("")} className="hover:text-[var(--color-brand-red)] transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-ui text-xs uppercase tracking-widest text-black/50 font-bold">Sort By:</span>
              <div className="relative group">
                <button className="flex items-center gap-2 font-ui text-sm text-[var(--color-brand-char)] font-medium">
                  {activeSort} <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                  {sorts.map(sort => (
                    <button
                      key={sort}
                      onClick={() => { updateURL('sort', sortMap[sort]); setPage(1); }}
                      className={`w-full text-left px-4 py-3 font-ui text-sm transition-colors ${activeSort === sort ? 'bg-[var(--color-brand-cream)] font-bold text-[var(--color-brand-char)]' : 'hover:bg-black/5 text-black/70'}`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {isLoading ? (
            <div className="space-y-16">
              <ProductGridSkeleton count={12} />
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-16">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-12">
                {products.map(product => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group block">
                    <div className="relative aspect-[4/5] bg-[#E8E1D5] mb-3 md:mb-4 overflow-hidden rounded-sm shadow-sm group-hover:shadow-md transition-shadow">
                      {/* Tags: stacked flex column top-left, avoids overlap on mobile */}
                      {(product.tag || product.coupon) && (
                        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col items-start gap-1">
                          {product.tag && (
                            <div className="bg-[var(--color-brand-char)] text-[var(--color-brand-gold-light)] text-[7px] md:text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 md:px-3 md:py-1.5 rounded-[2px] shadow-sm max-w-[90px] md:max-w-none truncate">
                              {product.tag}
                            </div>
                          )}
                          {product.coupon && (
                            <div className="bg-white/90 backdrop-blur-md text-[var(--color-brand-char)] text-[7px] md:text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 md:px-3 md:py-1.5 rounded-[2px] shadow-sm max-w-[90px] md:max-w-none truncate">
                              {product.coupon.code} • {formatCouponDiscount(product.coupon.discount)}
                            </div>
                          )}
                        </div>
                      )}

                      <Image
                        src={product.images?.[0]?.url || product.img || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:opacity-0"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                      />

                      {product.images && product.images.length > 1 && (
                        <Image
                          src={product.images[1].url}
                          alt={`${product.name} alternate`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover transition-all duration-1000 ease-out scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                        />
                      )}

                      <div className="absolute inset-x-1 md:inset-x-2 bottom-2 md:bottom-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 flex gap-1 md:gap-1.5">
                        <button className="flex-[1.2] border border-[var(--color-brand-gold)] text-[var(--color-brand-char)] bg-[var(--color-brand-cream)]/80 backdrop-blur-md font-ui text-[7px] md:text-[9px] uppercase font-bold tracking-widest py-2.5 rounded-sm hover:bg-[var(--color-brand-gold)] hover:text-white transition-all shadow-lg flex items-center justify-center">
                          Add to Cart
                        </button>
                        <button className="flex-1 bg-[var(--color-brand-red)] text-white font-ui text-[7px] md:text-[9px] uppercase font-bold tracking-widest py-2.5 rounded-sm hover:bg-[#A33B32] transition-colors shadow-lg flex items-center justify-center">
                          Buy Now
                        </button>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-char)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex flex-col items-center text-center px-1">
                      <span className="font-ui text-[9px] md:text-[10px] uppercase tracking-widest text-[#8B8375] mb-1 flex items-center gap-1.5 flex-wrap justify-center line-clamp-1">
                        <span className="w-1 h-1 rounded-full bg-[#8B8375] hidden sm:block"></span>
                        {product.material ? `${product.material} • ` : ''}{product.size}
                      </span>
                      <h3 className="font-display text-[14px] md:text-[18px] text-[var(--color-brand-char)] mb-1 group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="font-ui text-[10px] text-[#8B8375] line-clamp-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        {product.compareAt && (
                          <span className="font-ui text-[12px] md:text-[14px] text-[#8B8375] line-through opacity-60 decoration-[var(--color-brand-gold)]">
                            ₹{(product.compareAt / 100).toLocaleString("en-IN")}
                          </span>
                        )}
                        <p className="font-ui text-sm md:text-base text-[var(--color-brand-char)] font-bold">
                          ₹{(product.price / 100).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination Reveal */}
              {products.length < totalCount && (
                <div className="flex flex-col items-center pt-8 border-t border-black/5">
                  <p className="font-ui text-[10px] uppercase font-bold tracking-[0.3em] text-black/30 mb-8">
                    Viewing {products.length} of {totalCount} Products
                  </p>
                  <button
                    onClick={() => {
                      setPage(prev => prev + 1);
                    }}
                    disabled={isLoading}
                    className="relative px-12 py-5 bg-[var(--color-brand-char)] text-white font-ui text-[12px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black transition-all shadow-2xl disabled:opacity-50 overflow-hidden group"
                  >
                    <span className={isLoading ? 'opacity-0' : 'opacity-100'}>Load More Products</span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full py-24 md:py-32 flex flex-col items-center justify-center text-center bg-white/50 border border-black/5 border-dashed rounded-lg px-4">
              <p className="font-script text-2xl text-black/40 mb-4">No products found.</p>
              <p className="font-ui text-sm text-black/50 max-w-md">Try adjusting your filters or browse our full collection to find what you're looking for.</p>
              <button
                onClick={clearFilters}
                className="mt-8 border border-[var(--color-brand-gold)] text-[var(--color-brand-char)] px-6 py-3 uppercase text-xs tracking-widest font-bold hover:bg-[var(--color-brand-gold)] transition-colors cursor-pointer rounded-sm"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
