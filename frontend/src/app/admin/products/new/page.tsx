import React from "react";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminCategories } from "@/actions/adminCategories";
import { getCouponsList } from "@/actions/coupons";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
 
export default async function NewProductPage() {
  const [{ categories, error }, coupons] = await Promise.all([getAdminCategories(), getCouponsList()]);
 
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
           <Link href="/admin/products" className="inline-flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] hover:text-black mb-4 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Products
           </Link>
           <h2 className="font-display text-4xl text-[var(--color-brand-char)]">Add Product</h2>
           <p className="font-ui text-sm text-[#8B8375] mt-2 max-w-xl">Create a new product listing with images, pricing, and stock details.</p>
        </div>
      </div>
 
      {error ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 font-ui text-sm text-rose-700">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 font-ui text-sm text-amber-800">
          No categories found. Create a category first in{" "}
          <Link href="/admin/categories" className="font-bold underline underline-offset-4">
            Categories
          </Link>
          .
        </div>
      ) : (
        <ProductForm categories={categories} coupons={coupons} />
      )}
    </div>
  );
}
