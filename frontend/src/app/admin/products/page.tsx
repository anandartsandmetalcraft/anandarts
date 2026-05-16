"use client";
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, LayoutGrid, List, MoreVertical, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { deleteProduct, getAdminProducts, setProductStock } from "@/actions/adminProducts";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AdminProductsTableSkeleton } from "@/components/shared/Skeleton";

function ProductActionsMenu({
  product,
  onDelete,
  onStockChanged,
}: {
  product: any;
  onDelete: (id: string, name: string) => void;
  onStockChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isOutOfStock = Number(product.stock ?? 0) <= 0;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (root.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const toggleStock = async () => {
    const nextStock = isOutOfStock
      ? (() => {
          const raw = window.prompt("Enter stock quantity", "1");
          if (raw === null) return null;
          const parsed = Number.parseInt(raw, 10);
          if (!Number.isFinite(parsed) || parsed < 1) return NaN;
          return parsed;
        })()
      : 0;

    if (nextStock === null) return;
    if (Number.isNaN(nextStock)) {
      toast.error("Please enter a valid stock quantity (1 or more).");
      return;
    }

    const res = await setProductStock({ id: String(product.id), stock: nextStock });
    if ((res as any)?.success) {
      toast.success(isOutOfStock ? "Marked as in stock." : "Marked as out of stock.");
      onStockChanged();
      setOpen(false);
      return;
    }
    toast.error((res as any)?.error || "Failed to update stock.");
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#0F172A] text-white hover:bg-black transition-all shadow-sm"
        aria-label="Product actions"
      >
        <Edit size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden z-50">
          <button
            onClick={toggleStock}
            className="w-full px-4 py-3 text-left font-ui text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
          >
            {isOutOfStock ? "Mark in stock" : "Mark out of stock"}
          </button>
          <Link
            href={`/admin/products/edit/${product.id}`}
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-3 text-left font-ui text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50"
          >
            Edit product
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              onDelete(String(product.id), String(product.name || "this product"));
            }}
            className="w-full px-4 py-3 text-left font-ui text-[11px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const deferredSearch = useDeferredValue(search);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchProducts = async () => {
    setIsLoading(true);
    setLoadError(null);
    // Fetch a large-ish set for client-side filtering or handle server-side
    const res = await getAdminProducts({ search: deferredSearch, page: 1, limit: 200 });
    if ((res as any).error) {
      setLoadError((res as any).error);
      setProducts([]);
      setTotal(0);
    } else {
      setProducts((res as any).products || []);
      setTotal((res as any).total || 0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [deferredSearch]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category?.name).filter(Boolean)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (categoryFilter !== "All" && product.category.name !== categoryFilter) return false;
      if (tagFilter !== "All" && product.tag !== tagFilter) return false;
      if (statusFilter !== "All") {
        const active = statusFilter === "Active";
        if (product.isActive !== active) return false;
      }
      const priceValue = product.price / 100;
      if (minPrice !== "" && priceValue < Number(minPrice)) return false;
      if (maxPrice !== "" && priceValue > Number(maxPrice)) return false;
      return true;
    });
  }, [products, categoryFilter, tagFilter, statusFilter, minPrice, maxPrice]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const clearFilters = () => {
    setCategoryFilter("All");
    setTagFilter("All");
    setStatusFilter("All");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const handleDelete = async (id: string, name?: string) => {
    if (!confirm(`Delete "${name || "this product"}"? This will remove it from the storefront too.`)) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success(res.message || "Product retired from catalog.");
      fetchProducts();
    } else {
      toast.error(res.error);
    }
  };

  const handleMarkedOutOfStock = async () => {
    await fetchProducts();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
             <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Product Inventory</p>
          </div>
          <h2 className="font-display text-4xl font-bold text-[#0F172A]">Products</h2>
          <p className="font-ui text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Manage your store inventory and product details.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-[#0F172A] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-[#0F172A] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
              >
                <LayoutGrid size={18} />
              </button>
           </div>
           <Link 
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-2xl bg-[#0F172A] px-6 py-4 font-ui text-[10px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-black active:scale-[0.98]"
          >
             <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Filter Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-[40px] border border-slate-200 bg-white p-7 shadow-sm sticky top-8">
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#D4AF37]" />
                <p className="font-display text-lg font-bold text-[#0F172A]">Refine</p>
              </div>
              <button onClick={clearFilters} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#0F172A] transition-colors">
                Reset
              </button>
            </div>

            <div className="space-y-8 mt-8">
              <div>
                <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Collection</p>
                <div className="space-y-1.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`w-full group text-left rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-between ${categoryFilter === category ? "bg-[#0F172A] text-white shadow-md scale-[1.02]" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Status & Visibility</p>
                <div className="grid grid-cols-1 gap-2">
                  {['All', 'Active', 'Inactive'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border ${statusFilter === status ? 'bg-slate-50 border-[#0F172A] text-[#0F172A]' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Price Range</p>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min Price"
                      className="w-full bg-slate-50/50 border border-slate-100 pl-8 pr-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max Price"
                      className="w-full bg-slate-50/50 border border-slate-100 pl-8 pr-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product List Content */}
        <div className="space-y-6">
          {/* Search Table Action Bar */}
          <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2 items-center">
            <div className="relative flex-1 group w-full">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="text"
                placeholder="Search products by name, material or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none bg-slate-50/50 px-14 py-4 rounded-2xl font-ui text-[13px] font-medium outline-none placeholder:text-slate-300 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest focus:ring-0 transition-all"
              />
            </div>
            <button className="h-full px-6 py-4 rounded-2xl bg-white border border-slate-100 text-[#0F172A] font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shrink-0 group">
               <SlidersHorizontal size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Filters
            </button>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div 
                key="list"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50 font-ui text-[9px] uppercase tracking-[0.25em] text-slate-400">
                        <th className="px-8 py-7">Product</th>
                        <th className="px-8 py-7">Details</th>
                        <th className="px-8 py-7">Price</th>
                        <th className="px-8 py-7">Stock</th>
                        <th className="px-8 py-7">Status</th>
                        <th className="px-8 py-7 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-data">
                      {isLoading ? (
                        <AdminProductsTableSkeleton />
                      ) : loadError ? (
                        <tr>
                          <td colSpan={6} className="py-16 px-8">
                            <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 font-ui text-sm text-rose-700">
                              {loadError}
                            </div>
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4">
                               <LayoutGrid size={48} strokeWidth={1} className="text-slate-100" />
                               <p className="font-ui text-[10px] uppercase font-bold tracking-[0.3em] text-slate-300">No products found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedProducts.map((product) => (
                          <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-18 bg-slate-100 rounded-xl overflow-hidden shadow-sm relative group-hover:shadow-md transition-all">
                                  <Image src={product.images?.[0]?.url || "/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div>
                                  <p className="font-display text-lg font-bold text-[#0F172A] leading-tight">{product.name}</p>
                                  <p className="font-ui text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold mt-1.5">{product.category.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 max-w-xs">
                              <p className="text-xs font-bold text-slate-600 line-clamp-1">{product.material} • {product.size}</p>
                              {product.description && (
                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed italic">{product.description}</p>
                              )}
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-lg font-bold text-[#0F172A]">₹{(product.price / 100).toLocaleString("en-IN")}</p>
                              {product.compareAt && (
                                <p className="text-[10px] text-rose-400 line-through font-bold opacity-60">₹{(product.compareAt / 100).toLocaleString("en-IN")}</p>
                              )}
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                                <span className="text-xs font-bold text-slate-700">{product.stock} Units</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-ui text-[9px] font-bold uppercase tracking-widest ${product.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                {product.isActive ? <Eye size={12} strokeWidth={2.5} /> : <EyeOff size={12} strokeWidth={2.5} />}
                                {product.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-2">
                                <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#0F172A] hover:text-white transition-all shadow-sm">
                                  <Eye size={16} />
                                </a>
                                <ProductActionsMenu
                                  product={product}
                                  onDelete={handleDelete}
                                  onStockChanged={handleMarkedOutOfStock}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                 {filteredProducts.map((product, i) => (
                    <div key={product.id} className="group rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm hover:shadow-xl transition-all">
                       <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100 mb-5">
                          <Image src={product.images?.[0]?.url || "/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 right-4">
                             <div className={`px-3 py-1.5 rounded-full font-ui text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${product.isActive ? 'bg-white/80 text-emerald-700' : 'bg-black/50 text-white'}`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                             </div>
                          </div>
                       </div>
                       <div className="px-2">
                          <p className="font-ui text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1">{product.category.name}</p>
                          <h4 className="font-display text-xl font-bold text-[#0F172A] mb-4 truncate">{product.name}</h4>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                             <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Price</p>
                                <p className="text-lg font-bold text-[#0F172A]">₹{(product.price / 100).toLocaleString("en-IN")}</p>
                             </div>
                              <div className="flex gap-2">
                                 <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#0F172A] hover:text-white transition-all">
                                   <Eye size={16} />
                                 </a>
                                 <ProductActionsMenu
                                   product={product}
                                   onDelete={handleDelete}
                                   onStockChanged={handleMarkedOutOfStock}
                                 />
                              </div>
                          </div>
                       </div>
                    </div>
                 ))}
                 {filteredProducts.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                       <LayoutGrid size={48} strokeWidth={1} className="text-slate-100" />
                       <p className="font-ui text-[10px] uppercase font-bold tracking-[0.3em] text-slate-300 mt-4">No products found</p>
                    </div>
                 )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2 pb-10 mt-12 bg-white rounded-[32px] p-6 border border-slate-50">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
               Showing <span className="text-[#0F172A]">{Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-[#0F172A]">{Math.min(filteredProducts.length, currentPage * itemsPerPage)}</span> of {filteredProducts.length} Pieces
            </span>
            <div className="flex items-center gap-2">
               {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-ui text-[11px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#0F172A] text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
               ))}
               <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-6 py-3 bg-slate-50 rounded-xl font-ui text-[10px] font-bold uppercase tracking-widest text-[#0F172A] disabled:opacity-20 hover:bg-slate-100 transition-all ml-4"
               >
                  Next Page
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
