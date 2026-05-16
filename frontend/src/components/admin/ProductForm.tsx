"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  Check,
  Loader2,
  Package,
  UploadCloud,
  ChevronDown,
  Tag,
  FileText,
  Palette,
  Megaphone,
  X,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { upsertProduct } from "@/actions/adminProducts";

const BADGE_OPTIONS = [
  { value: "", label: "No Badge" },
  { value: "Best Seller", label: "Best Seller" },
  { value: "New Arrival", label: "New Arrival" },
  { value: "Limited", label: "Limited" },
  { value: "Featured", label: "Featured" },
  { value: "Masterpiece", label: "Masterpiece" },
];

const MATERIALS = ["Brass", "Bronze", "Copper", "Silver",  "Antique"];

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  coupons: any[];
}

type ProductImageItem = {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  fileName?: string;
  id: string;
  isUploading?: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ initialData, categories, coupons }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ProductImageItem[]>(
    initialData?.images?.length
      ? initialData.images.map((img: any, index: number) => ({
          id: img.id || Math.random().toString(36).substring(7),
          url: img.url,
          isPrimary: img.isPrimary ?? index === 0,
          sortOrder: img.sortOrder ?? index,
        }))
      : []
  );

  const isUploadingImages = images.some(img => img.isUploading);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(initialData?.material || "");
  const [selectedBadge, setSelectedBadge] = useState<string>(initialData?.tag || "");
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>(initialData?.couponCode || "");
  const attachedCoupon = coupons.find((coupon) => coupon.code === selectedCouponCode);

  const addImages = async (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith("image/");
      const hasValidExt = /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name);
      return isImage || hasValidExt;
    });

    if (accepted.length === 0) {
      toast.error("No valid images selected. Please use JPG, PNG, WebP or GIF.");
      return;
    }

    console.log(`[ProductForm] Processing ${accepted.length} images...`);

    // 1. Create local previews immediately
    const mappedImages: (ProductImageItem | null)[] = accepted.map((file, index) => {
      try {
        const id = `temp-${Math.random().toString(36).substring(7)}`;
        const item: ProductImageItem = {
          id,
          url: URL.createObjectURL(file),
          fileName: file.name,
          isPrimary: images.length === 0 && index === 0,
          sortOrder: images.length + index,
          isUploading: true,
        };
        return item;
      } catch (e) {
        console.error("[ProductForm] Failed to create object URL:", e);
        return null;
      }
    });

    const tempImages = mappedImages.filter((img): img is ProductImageItem => img !== null);

    if (tempImages.length === 0) return;

    setImages((prev) => [...prev, ...tempImages]);

    try {
      // 2. Upload to Cloudinary
      const uploadData = new FormData();
      accepted.forEach((file) => uploadData.append("files", file));

      const response = await fetch("/api/uploads/product-images", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Image upload failed.");
      }

      // 3. Update with real URLs
      const uploadedFiles = result.files || [];
      
      setImages((prev) => 
        prev.map((img) => {
          const match = tempImages.find(t => t.id === img.id);
          if (match) {
            const indexInTemp = tempImages.indexOf(match);
            const realFile = uploadedFiles[indexInTemp];
            if (realFile) {
              return {
                ...img,
                url: realFile.url,
                isUploading: false
              };
            }
          }
          return img;
        })
      );

      toast.success(`${uploadedFiles.length} images uploaded successfully.`);
    } catch (error: any) {
      console.error("[ProductForm] Upload error:", error);
      toast.error(error?.message || "Unable to upload images.");
      // Note: We no longer remove tempImages automatically so the user sees the 'blank' or 'error' state
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      await addImages(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);
    const name = String(data.name || "");

    const payload = {
      ...data,
      id: initialData?.id,
      slug: initialData?.slug || slugify(name),
      price: Math.round(Number(data.price) * 100),
      compareAt: data.compareAt ? Math.round(Number(data.compareAt) * 100) : undefined,
      stock: parseInt(String(data.stock || "0"), 10),
      isActive: data.status === "Published",
      tag: selectedBadge || undefined,
      material: selectedMaterial || null,
      heightInInches: data.heightInInches ? parseFloat(String(data.heightInInches)) : undefined,
      couponCode: selectedCouponCode || null,
      images: images.map((img, index) => ({
        url: img.url,
        isPrimary: images.some(i => i.isPrimary) ? img.isPrimary : index === 0,
        sortOrder: img.sortOrder ?? index,
      })),
    };

    const res = await upsertProduct(payload as any);

    if (res.success) {
      toast.success("Product saved successfully.");
      router.push("/admin/products");
    } else {
      toast.error(res.error);
      setIsSubmitting(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const setPrimaryImage = (idx: number) => {
    setImages((prev) =>
      prev.map((image, imageIndex) => ({
        ...image,
        isPrimary: imageIndex === idx,
        sortOrder: imageIndex,
      }))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-24">
      <div className="lg:col-span-8 space-y-10">
        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Product Information</h3>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Match what customers see on the store</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Product Title</label>
              <input
                required
                name="name"
                defaultValue={initialData?.name}
                className="w-full border border-slate-200 px-6 py-4 rounded-2xl font-display text-xl outline-none focus:ring-2 ring-blue-500/10 transition-all"
                placeholder="Enter product title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Product Description</label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-slate-400">
                  <button type="button" className="p-2 hover:bg-white rounded"><FileText size={14} /></button>
                  <button type="button" className="p-2 hover:bg-white rounded"><Tag size={14} /></button>
                  <button type="button" className="p-2 hover:bg-white rounded"><Palette size={14} /></button>
                </div>
                <textarea
                  required
                  name="description"
                  defaultValue={initialData?.description}
                  rows={8}
                  className="w-full px-6 py-6 font-ui text-sm outline-none resize-none leading-relaxed"
                  placeholder="Describe the heritage, craftsmanship, and finish..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Category</label>
                <div className="relative">
                  <select
                    required
                    name="categoryId"
                    defaultValue={initialData?.categoryId}
                    className="w-full border border-slate-200 px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Primary Material</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial("")}
                    className={`px-5 py-3 rounded-xl font-ui text-[11px] font-bold transition-all border ${!selectedMaterial
                        ? "bg-slate-400 border-slate-400 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    None
                  </button>
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMaterial(m)}
                      className={`px-5 py-3 rounded-xl font-ui text-[11px] font-bold transition-all border ${selectedMaterial === m
                          ? "bg-[#0BB197] border-[#0BB197] text-white shadow-md"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Price</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    required
                    type="number"
                    step="1"
                    min="1"
                    name="price"
                    defaultValue={initialData?.price ? initialData.price / 100 : ""}
                    className="w-full border border-slate-200 pl-10 pr-6 py-4 rounded-2xl font-ui text-sm outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Original Price</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    name="compareAt"
                    defaultValue={initialData?.compareAt ? initialData.compareAt / 100 : ""}
                    className="w-full border border-slate-200 pl-10 pr-6 py-4 rounded-2xl font-ui text-sm outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  defaultValue={initialData?.stock ?? 0}
                  className="w-full border border-slate-200 px-6 py-4 rounded-2xl font-ui text-sm outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Dimensions / Size (Display Text)</label>
                <input
                  required
                  name="size"
                  defaultValue={initialData?.size}
                  className="w-full border border-slate-200 px-6 py-4 rounded-2xl font-ui text-sm outline-none"
                  placeholder='1-2"'
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Height (Inches - Numeric)</label>
                <input
                  type="number"
                  step="0.1"
                  name="heightInInches"
                  defaultValue={initialData?.heightInInches}
                  className="w-full border border-slate-200 px-6 py-4 rounded-2xl font-ui text-sm outline-none"
                  placeholder="e.g. 1.5"
                />
                <p className="text-[9px] text-slate-400 ml-1">Required for accurate range filtering (e.g. 1-3 inches)</p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Weight</label>
                <input
                  name="weight"
                  defaultValue={initialData?.weight}
                  className="w-full border border-slate-200 px-6 py-4 rounded-2xl font-ui text-sm outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Product Media</h3>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {images.length > 0 ? `${images.length} Image${images.length > 1 ? 's' : ''} Selected` : 'Drag, drop, or choose files from your device'}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.length) {
                  await addImages(e.target.files);
                  e.target.value = "";
                }
              }}
            />

            {/* Image Preview Gallery - MOVED ABOVE DROPZONE */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {images.map((img, idx) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative group rounded-[32px] border overflow-hidden transition-all duration-500 ${
                      img.isPrimary 
                        ? "border-[var(--color-brand-gold)] shadow-[0_15px_40px_rgba(212,175,55,0.15)] ring-2 ring-[var(--color-brand-gold)]/20" 
                        : "border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200"
                    }`}
                  >
                    {/* Cancel/Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-4 right-4 z-30 h-9 w-9 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 scale-90 group-hover:scale-100 shadow-lg"
                    >
                      <X size={16} />
                    </button>

                    <div className="aspect-square relative overflow-hidden bg-slate-50">
                      <img 
                        src={img.url} 
                        alt={`Product ${idx + 1}`} 
                        className={`w-full h-full object-cover transition-all duration-1000 ${img.isUploading ? "blur-md scale-110 opacity-60" : "group-hover:scale-110"}`}
                        onError={(e) => {
                          // Handle failed image loads (like revoked ObjectURLs)
                          (e.target as any).src = "https://placehold.co/400x400/E8E1D5/666?text=Artifact+Preview";
                        }}
                      />
                      
                      {img.isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="flex flex-col items-center gap-3">
                             <div className="relative">
                                <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-[#0BB197] animate-spin" />
                                <UploadCloud size={14} className="absolute inset-0 m-auto text-[#0BB197]" />
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 drop-shadow-sm">Optimizing...</span>
                          </div>
                        </div>
                      )}

                      {img.isPrimary && !img.isUploading && (
                        <div className="absolute bottom-4 left-4 z-10 bg-[var(--color-brand-gold)] text-[#11100D] font-ui text-[9px] font-extrabold uppercase px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                          <Star size={12} fill="currentColor" /> Primary
                        </div>
                      )}
                    </div>

                    {!img.isUploading && (
                      <div className="p-5 bg-white/90 backdrop-blur-md flex items-center justify-between border-t border-slate-50/50">
                         <div className="min-w-0 flex-1 mr-4">
                            <p className="font-ui text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 truncate">
                              {img.fileName || "Artifact View"}
                            </p>
                         </div>
                         {!img.isPrimary && (
                           <button
                             type="button"
                             onClick={() => setPrimaryImage(idx)}
                             className="shrink-0 font-ui text-[9px] font-bold uppercase tracking-widest text-[#0BB197] hover:text-[#099c85] transition-colors bg-[#0BB197]/5 px-3 py-2 rounded-lg"
                           >
                             Set Primary
                           </button>
                         )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[40px] py-20 text-center transition-all cursor-pointer group ${
                isDragging ? "border-[#0BB197] bg-[#0BB197]/5 scale-[0.98]" : "border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex flex-col items-center gap-6">
                <div className={`w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center transition-all duration-500 ${isDragging ? "scale-110 shadow-xl text-[#0BB197]" : "text-slate-400 group-hover:shadow-md"}`}>
                  {isUploadingImages ? <Loader2 size={36} className="animate-spin text-[#0BB197]" /> : <UploadCloud size={36} className="group-hover:text-slate-600 transition-colors" />}
                </div>
                <div className="max-w-xs mx-auto">
                  <h4 className="font-display text-xl font-bold text-[#0F172A] mb-2">Select Masterpiece Images</h4>
                  <p className="text-xs text-slate-400 leading-relaxed px-4">
                    Drag and drop your artifacts here. Images are automatically optimized and served via Cloudinary CDN.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Megaphone size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Product Highlight</h3>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Use store badges like New Arrival or Best Seller</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Badge / Tag</label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((option) => (
                  <button
                    key={option.value || "none"}
                    type="button"
                    onClick={() => setSelectedBadge(option.value)}
                    className={`px-5 py-3 rounded-xl font-ui text-[11px] font-bold transition-all border ${selectedBadge === option.value
                        ? "bg-[#0BB197] border-[#0BB197] text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Attach Coupon</label>
                <div className="relative">
                  <select
                    value={selectedCouponCode}
                    onChange={(e) => setSelectedCouponCode(e.target.value)}
                    className="w-full border border-slate-200 px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none bg-white"
                  >
                    <option value="">No Coupon Attached</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.id} value={coupon.code}>
                        {coupon.code} - {coupon.discount} ({coupon.status})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                {attachedCoupon && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800 leading-relaxed">
                    Attached coupon: <span className="font-bold uppercase">{attachedCoupon.code}</span> will display on the product card and apply at checkout until{" "}
                    {new Date(attachedCoupon.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-xs text-slate-500 leading-relaxed">
                  Create the coupon in the Coupons page first, then attach it here. The product card will show the code and the customer can redeem it at checkout.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-display font-bold text-[#0F172A]">Publish</h3>
          </div>
          <div className="p-7 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Status</label>
              <select
                name="status"
                defaultValue={initialData?.isActive !== false ? "Published" : "Draft"}
                className="w-full border border-slate-200 px-5 py-3.5 rounded-xl font-ui text-sm outline-none bg-white"
              >
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Visibility</label>
              <select name="visibility" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl font-ui text-sm outline-none bg-white">
                <option>Public</option>
                <option>Hidden</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Publish Date & Time</label>
              <div className="relative">
                <input type="datetime-local" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl font-ui text-xs outline-none bg-white" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-display font-bold text-[#0F172A]">Product Notes</h3>
          </div>
          <div className="p-7 space-y-4">
            <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500 leading-relaxed">
              Keep the product record aligned with the storefront. Use tags like New Arrival or Best Seller so the customer-facing sections update automatically.
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5 text-xs text-amber-800 leading-relaxed">
              Coupon code applies only when it is attached here and the customer enters the same code at checkout. Expired coupons will show a coupon expired message.
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-display font-bold text-[#0F172A]">Save</h3>
          </div>
          <div className="p-7">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImages}
              className="w-full bg-[#0BB197] text-white px-12 py-4 rounded-2xl font-ui text-sm font-bold shadow-lg hover:shadow-xl hover:bg-[#099c85] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              {isSubmitting ? "Processing..." : isUploadingImages ? "Uploading Images..." : "Submit Product"}
            </button>
          </div>
        </section>
      </div>
    </form>
  );
}
