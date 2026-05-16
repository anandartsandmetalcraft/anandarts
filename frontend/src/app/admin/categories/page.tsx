"use client";
import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, LayoutGrid, FileText, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";
import { getCategoriesList, upsertCategory, deleteCategory } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CATEGORY_IMAGE_OPTIONS = [
  { label: "Divine Gods", value: "/Divine_god.webp" },
  { label: "Divine Goddesses", value: "/Divine_godess.webp" },
  { label: "Divine Sets", value: "/Divine_set.webp" },
  { label: "Brass", value: "/Brass.webp" },
  { label: "Logo / Placeholder", value: "/Logo3.png" },
];

function normalizeImagePath(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `/${path}`;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    const res = await getCategoriesList();
    if (res.success) {
      setCategories(res.categories);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (category: any = null) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    // Auto-generate slug if not provided/editing
    const slug = editingCategory?.slug || (data.name as string).toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const payload = {
      ...data,
      image:
        (data.imagePreset as string) === "__custom__"
          ? ((data.image as string) || undefined)
          : ((data.imagePreset as string) || (editingCategory?.image ?? undefined)),
      id: editingCategory?.id,
      slug,
      sortOrder: parseInt(data.sortOrder as string) || 0,
    };

    const res = await upsertCategory(payload);
    if (res.success) {
      toast.success(editingCategory ? "Category updated." : "Category created.");
      handleCloseModal();
      fetchCategories();
    } else {
      toast.error(res.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will fail if products are linked.")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      toast.success(res.message);
      fetchCategories();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
             <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Classifications</p>
          </div>
          <h2 className="font-display text-4xl font-bold text-[#0F172A]">Categories</h2>
          <p className="font-ui text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Organize your product catalog into professional collections.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-2xl bg-[#0F172A] px-6 py-4 font-ui text-[10px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-black active:scale-[0.98]"
        >
           <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 flex items-center max-w-md">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-none bg-slate-50/50 px-14 py-4 rounded-2xl font-ui text-[13px] font-medium outline-none placeholder:text-slate-300 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest focus:ring-0 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-[32px] bg-white border border-slate-100 animate-pulse" />
          ))
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
             <LayoutGrid size={48} className="mx-auto text-slate-200 mb-4" strokeWidth={1} />
             <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-slate-400">No categories found</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <motion.div 
              key={category.id} 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="absolute top-6 right-6 flex gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                 <button onClick={() => handleOpenModal(category)} className="h-10 w-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-[#0F172A] hover:text-white flex items-center justify-center shadow-lg transition-all" title="Edit Category">
                   <Edit size={16} />
                 </button>
                 <button onClick={() => handleDelete(category.id)} className="h-10 w-10 rounded-xl bg-white border border-slate-100 text-rose-300 hover:bg-rose-500 hover:text-white flex items-center justify-center shadow-lg transition-all" title="Delete Category">
                   <Trash2 size={16} />
                 </button>
              </div>

              <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-50 mb-6 border border-slate-100">
                {category.image ? (
                  <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={32} className="text-slate-200" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                   <h3 className="font-display text-xl font-bold text-[#0F172A]">{category.name}</h3>
                   <span className="bg-slate-50 text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md border border-slate-100">
                     S{category.sortOrder}
                   </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">{category.description || "No description provided."}</p>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#D4AF37]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
                        {category._count?.products || 0} Products
                      </span>
                   </div>
                   <Check size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Upsert Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
               <div className="bg-[#0F172A] p-8 text-white relative">
                  <h3 className="font-display text-2xl font-bold">{editingCategory ? "Edit Category" : "Build Category"}</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">Configure your product classification</p>
                  <button onClick={handleCloseModal} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Display Name</label>
                    <input 
                      required
                      name="name"
                      defaultValue={editingCategory?.name}
                      placeholder="e.g. Sculptures"
                      className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none focus:ring-2 ring-[#D4AF37]/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Description</label>
                    <textarea 
                      name="description"
                      defaultValue={editingCategory?.description}
                      placeholder="Brief overview of items in this category..."
                      rows={3}
                      className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none resize-none focus:ring-2 ring-[#D4AF37]/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Thumbnail Source</label>
                      <select
                        name="imagePreset"
                        defaultValue={
                          CATEGORY_IMAGE_OPTIONS.find(
                            (option) => normalizeImagePath(editingCategory?.image) === option.value
                          )?.value || "__custom__"
                        }
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none focus:ring-2 ring-[#D4AF37]/20 transition-all"
                      >
                        <option value="__custom__">Custom path</option>
                        {CATEGORY_IMAGE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Custom Path</label>
                      <input 
                        name="image"
                        defaultValue={editingCategory?.image || ""}
                        placeholder="/your-image.webp"
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none focus:ring-2 ring-[#D4AF37]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Sort Position</label>
                      <input 
                        type="number"
                        name="sortOrder"
                        defaultValue={editingCategory?.sortOrder || 0}
                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none focus:ring-2 ring-[#D4AF37]/20 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-[#0F172A] text-white py-5 rounded-3xl font-ui text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {isSubmitting ? "Processing..." : editingCategory ? "Commit Changes" : "Create Category"}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
