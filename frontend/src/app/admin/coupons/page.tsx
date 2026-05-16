"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  ChevronDown,
  Check,
  X,
  Activity,
  PieChart,
  Loader2,
  Package,
} from "lucide-react";
import { toast } from "sonner";

import { getCategories } from "@/actions/products";
import { deleteCoupon, getCouponsList, upsertCoupon } from "@/actions/coupons";
import { formatCouponDiscount, isCouponExpired } from "@/lib/coupons";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CouponProduct {
  id: string;
  name: string;
  slug: string;
}

interface Coupon {
  id: string;
  title: string;
  code: string;
  productType: string;
  startDate: string | Date;
  endDate: string | Date;
  discount: string;
  status: string;
  products?: CouponProduct[];
}

function toInputDate(value: string | Date) {
  return new Date(value).toISOString().slice(0, 10);
}

function getCouponStatus(coupon: Coupon) {
  return isCouponExpired(coupon) ? "EXPIRED" : (coupon.status || "ACTIVE").toUpperCase();
}

export default function AdminCouponsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    const [cats, promoCoupons] = await Promise.all([getCategories(), getCouponsList()]);
    setCategories(cats);
    setCoupons(promoCoupons as Coupon[]);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredCoupons = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return coupons.filter((coupon) => {
      if (!query) return true;
      const productNames = (coupon.products || []).map((product) => product.name).join(" ");
      return [coupon.title, coupon.code, coupon.productType, productNames]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [coupons, searchQuery]);

  const handleOpenModal = (coupon: Coupon | null = null) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this coupon from the catalog? Products using it will be detached.")) {
      return;
    }

    const res = await deleteCoupon(id);
    if (res.success) {
      toast.success("Coupon removed successfully.");
      await loadData();
    } else {
      toast.error(res.error || "Failed to remove coupon.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const res = await upsertCoupon({
      id: editingCoupon?.id,
      title: String(data.title || ""),
      code: String(data.code || "").toUpperCase(),
      productType: String(data.productType || "all"),
      startDate: String(data.startDate || ""),
      endDate: String(data.endDate || ""),
      discount: String(data.discount || ""),
      status: String(data.status || "ACTIVE"),
    });

    if (res.success) {
      toast.success(editingCoupon ? "Coupon updated." : "Coupon published.");
      setIsModalOpen(false);
      setEditingCoupon(null);
      await loadData();
    } else {
      toast.error(res.error || "Failed to save coupon.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-6 md:flex-row justify-between items-start md:items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-[var(--color-brand-gold)]/10 rounded-lg text-[var(--color-brand-gold)]">
              <Tag size={20} />
            </div>
            <span className="font-ui text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-gold)]">Promotion Manager</span>
          </div>
          <h2 className="font-display text-4xl text-[var(--color-brand-char)]">Coupons & Rewards</h2>
          <p className="font-ui text-sm text-[#8B8375] mt-2 max-w-xl">
            Create promo codes here, then attach them to products from the product form.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-ui text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Coupons", value: coupons.filter((c) => getCouponStatus(c) === "ACTIVE").length, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Attached Products", value: coupons.reduce((sum, coupon) => sum + (coupon.products?.length || 0), 0), icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Promotions", value: coupons.length, icon: PieChart, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Expired", value: coupons.filter((c) => getCouponStatus(c) === "EXPIRED").length, icon: X, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} p-6 rounded-[24px] border border-black/5 shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
              <span className="font-ui text-[9px] font-black uppercase tracking-widest text-black/40">{s.label}</span>
              <s.icon size={16} className={s.color} />
            </div>
            <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-brand-gold)] transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search by coupon code, title, or product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-[var(--color-brand-gold)] focus:ring-4 focus:ring-[var(--color-brand-gold)]/5 transition-all shadow-sm"
        />
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[#0F172A]">
                <th className="p-6 font-ui text-[10px] font-black uppercase tracking-widest">Discount</th>
                <th className="p-6 font-ui text-[10px] font-black uppercase tracking-widest">Coupon Title</th>
                <th className="p-6 font-ui text-[10px] font-black uppercase tracking-widest">Code</th>
                <th className="p-6 font-ui text-[10px] font-black uppercase tracking-widest">Attached Product</th>
                <th className="p-6 font-ui text-[10px] font-black uppercase tracking-widest text-center">Dates</th>
                <th className="p-6 font-ui text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                <th className="p-6 font-ui text-[10px] font-black uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-ui text-xs uppercase tracking-widest">
                    Loading coupons...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-ui text-xs uppercase tracking-widest">
                    No coupons found.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  const firstProduct = coupon.products?.[0];
                  const productCount = coupon.products?.length || 0;

                  return (
                    <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <span className="font-display text-lg font-bold text-[#0F172A]">{formatCouponDiscount(coupon.discount)}</span>
                      </td>
                      <td className="p-6 font-ui text-sm font-semibold text-slate-600">{coupon.title}</td>
                      <td className="p-6">
                        <span className="bg-white border border-slate-100 text-[#0F172A] px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-wider uppercase shadow-sm">{coupon.code}</span>
                      </td>
                      <td className="p-6 font-ui text-xs font-bold text-slate-500">
                        {productCount > 0 ? (
                          <div className="space-y-1">
                            <p>{firstProduct?.name}</p>
                            {productCount > 1 && <p className="text-slate-400">+{productCount - 1} more</p>}
                          </div>
                        ) : (
                          <span className="text-amber-600">Not attached yet</span>
                        )}
                      </td>
                      <td className="p-6 font-ui text-[11px] text-slate-500 text-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-emerald-500 font-bold">{new Date(coupon.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                          <span className="text-rose-400 font-bold opacity-60 italic">{new Date(coupon.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span
                          className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                            status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-rose-50 text-rose-500 border-rose-100"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2 text-[10px] font-black uppercase tracking-widest">
                          <button
                            onClick={() => handleOpenModal(coupon)}
                            className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-[#0F172A] hover:text-white transition-all shadow-sm"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="h-10 w-10 flex items-center justify-center bg-slate-50 text-rose-300 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <form onSubmit={handleSave} className="relative bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h3 className="font-display text-3xl font-bold text-[#0F172A]">{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-gold)] mt-2">Promotion details</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors bg-white shadow-sm border border-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 grid grid-cols-2 gap-8">
              <div className="col-span-1 space-y-2">
                <label className="font-ui text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Coupon Title</label>
                <input required name="title" defaultValue={editingCoupon?.title} type="text" placeholder="e.g. Navaratri Special" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-ui text-sm outline-none focus:bg-white focus:ring-2 ring-[var(--color-brand-gold)]/20 transition-all font-bold" />
              </div>

              <div className="col-span-1 space-y-2">
                <label className="font-ui text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Target Collection</label>
                <div className="relative">
                  <select name="productType" defaultValue={editingCoupon?.productType || "all"} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-ui text-sm outline-none focus:bg-white focus:ring-2 ring-[var(--color-brand-gold)]/20 transition-all appearance-none cursor-pointer font-bold">
                    <option value="all">Universal / All Items</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="font-ui text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Redemption Code</label>
                <div className="relative">
                  <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-brand-gold)]" size={18} />
                  <input required name="code" defaultValue={editingCoupon?.code} type="text" placeholder="ENTER CODE NAME (e.g. CODE100)" className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-mono font-black text-lg outline-none focus:bg-white focus:ring-2 ring-[var(--color-brand-gold)]/20 transition-all uppercase tracking-[0.2em] text-[#0F172A]" />
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="font-ui text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Validity Starts</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required name="startDate" defaultValue={editingCoupon ? toInputDate(editingCoupon.startDate) : ""} type="date" className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-ui text-sm outline-none focus:bg-white focus:ring-2 ring-[var(--color-brand-gold)]/20 transition-all font-bold" />
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="font-ui text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Validity Expires</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required name="endDate" defaultValue={editingCoupon ? toInputDate(editingCoupon.endDate) : ""} type="date" className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-ui text-sm outline-none focus:bg-white focus:ring-2 ring-[var(--color-brand-gold)]/20 transition-all font-bold" />
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="font-ui text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Amount / Ratio (%)</label>
                <input required name="discount" defaultValue={editingCoupon?.discount} type="text" placeholder="e.g. 100 or 15%" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-ui text-sm outline-none focus:bg-white focus:ring-2 ring-[var(--color-brand-gold)]/20 transition-all font-bold" />
              </div>

              <div className="col-span-1 space-y-2">
                <label className="font-ui text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Current Status</label>
                <div className="relative">
                  <select name="status" defaultValue={editingCoupon?.status || "ACTIVE"} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-ui text-sm outline-none focus:bg-white focus:ring-2 ring-[var(--color-brand-gold)]/20 transition-all appearance-none cursor-pointer font-bold">
                    <option value="ACTIVE">ACTIVE & REVEALED</option>
                    <option value="INACTIVE">INACTIVE / ARCHIVED</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 font-ui text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Discard Changes
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="px-12 py-5 bg-[#0F172A] text-white rounded-[24px] font-ui text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isSubmitting ? "Syncing..." : editingCoupon ? "Save Configuration" : "Publish Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
