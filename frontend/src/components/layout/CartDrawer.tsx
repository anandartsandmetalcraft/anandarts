"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ShieldCheck, Lock, CreditCard, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { FREE_SHIPPING_THRESHOLD_PAISE, calculateGiftWrapFeePaise, remainingForFreeShippingPaise } from "@/lib/shipping";
import { getFeedProducts } from "@/actions/products";
import PaymentTrustStrip from "@/components/shared/PaymentTrustStrip";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, addItem, removeItem, updateQuantity, getTotalItems, getTotalPrice, isGiftWrapped, setGiftWrapped } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const { setIsAuthOpen } = useUIStore();
  const router = useRouter();

  const [feedProducts, setFeedProducts] = useState<any[]>([]);

  const handleCheckout = () => {
    onClose();
    if (isLoggedIn) {
      router.push("/checkout");
    } else {
      setIsAuthOpen(true);
    }
  };

  const cartSubtotalPaise = getTotalPrice();
  const totalQuantity = getTotalItems();
  const giftWrapFeePaise = calculateGiftWrapFeePaise({ isGiftWrapped, totalQuantity });
  const remainingForFree = remainingForFreeShippingPaise(cartSubtotalPaise);
  const progressPercent = Math.min(100, (cartSubtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100);

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      const result = await getFeedProducts({ limit: 8 });
      setFeedProducts(result);
    };

    void load();
  }, [isOpen]);

  const suggestions = useMemo(() => {
    const cartIds = new Set(items.map((i) => String(i.id)));
    const available = (feedProducts || []).filter((p) => !cartIds.has(String(p.id)));

    if (remainingForFree > 0) {
      const near = available
        .filter((p) => typeof p.price === "number" && p.price > 0 && p.price <= remainingForFree + 100_000)
        .sort((a, b) => Math.abs(remainingForFree - a.price) - Math.abs(remainingForFree - b.price));
      return near.slice(0, 3);
    }

    return available.slice(0, 3);
  }, [feedProducts, items, remainingForFree]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "anticipate" }}
            className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-[var(--color-brand-cream)] shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[var(--color-brand-char)]" />
                <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--color-brand-char)]">Your Cart</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              {items.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-brand-cream-dark)] flex items-center justify-center mb-8">
                    <ShoppingBag size={40} strokeWidth={1} className="text-black/20" />
                  </div>
                  <h3 className="font-display text-2xl text-[var(--color-brand-char)] mb-4">Your cart is currently empty</h3>
                  <p className="font-ui text-sm text-[#8B8375] mb-10 leading-relaxed">
                    Explore our collection of handcrafted temple art and pieces to find what fits your home.
                  </p>
                  <Link
                    href="/collections"
                    onClick={onClose}
                    className="w-full bg-[var(--color-brand-char)] text-[var(--color-brand-cream)] font-ui text-xs font-bold uppercase tracking-widest py-4 rounded-full hover:bg-[var(--color-brand-slate)] transition-all flex items-center justify-center gap-3 shadow-lg group"
                  >
                    Browse Products
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ) : (
                /* Items List */
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-black/5 group"
                    >
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-ui text-xs font-bold uppercase tracking-wider text-[var(--color-brand-char)] line-clamp-1">{item.name}</h4>
                            <button onClick={() => removeItem(item.id)} className="text-[#8B8375] hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="font-ui text-[10px] text-[#8B8375] uppercase tracking-widest">{item.material} / {item.size}</p>
                          <p className="font-display text-base text-[var(--color-brand-char)] mt-1">₹{(item.price / 100).toLocaleString("en-IN")}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center border border-black/10 rounded-full h-8 px-2 bg-gray-50/50">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-black">
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-ui text-[11px] font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-black">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Checkout & Trust */}
            {items.length > 0 && (
              <div className="p-8 bg-white border-t border-black/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">

                {/* Shipping Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-ui text-[10px] font-bold text-[#8B8375]">
                      {remainingForFree > 0
                        ? `Add ₹${(remainingForFree / 100).toLocaleString("en-IN")} more to get FREE SHIPPING!`
                        : "You've unlocked FREE SHIPPING!"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className={`h-full ${remainingForFree > 0 ? 'bg-[var(--color-brand-gold)]' : 'bg-green-500'}`}
                    />
                  </div>
                </div>

                {/* Bundle Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mb-6 rounded-2xl border border-black/5 bg-gray-50/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-ui text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-brand-char)]">
                        {remainingForFree > 0 ? "Add a piece to unlock free shipping" : "You might also like"}
                      </span>
                      {remainingForFree > 0 && (
                        <span className="font-ui text-[10px] font-bold text-[#8B8375]">
                          Need {(remainingForFree / 100).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {suggestions.map((p) => {
                        const isSuggestionOut = typeof p.stock === "number" && p.stock <= 0;
                        return (
                          <div key={p.id} className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-black/5 flex-shrink-0">
                              <Image src={p.img || "/placeholder.jpg"} alt={p.name} fill sizes="48px" className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-ui text-[11px] font-bold text-[var(--color-brand-char)] truncate">{p.name}</p>
                              <p className="font-ui text-[10px] text-[#8B8375]">
                                {(Number(p.price || 0) / 100).toLocaleString("en-IN")}
                              </p>
                            </div>
                            <button
                              disabled={isSuggestionOut}
                              onClick={() => addItem(p, 1)}
                              className="px-4 py-2 rounded-full bg-white border border-black/10 font-ui text-[10px] font-extrabold uppercase tracking-widest hover:bg-[var(--color-brand-char)] hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black disabled:cursor-not-allowed"
                            >
                              {isSuggestionOut ? "Out" : "Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Gift Wrap */}
                <label className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-black/5 bg-gray-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftWrapped}
                    onChange={(e) => setGiftWrapped(e.target.checked)}
                    className="w-4 h-4 accent-[var(--color-brand-char)]"
                  />
                  <div className="flex flex-col">
                    <span className="font-ui text-[11px] font-bold text-[var(--color-brand-char)]">Add Gift Wrap (Optional)</span>
                    <span className="font-ui text-[10px] text-[#8B8375]"> Only for ₹99 per item</span>
                  </div>
                </label>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-ui text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8B8375]">Order Subtotal</span>
                  <span className="font-display text-2xl text-[var(--color-brand-char)]">₹{((cartSubtotalPaise + giftWrapFeePaise) / 100).toLocaleString("en-IN")}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[var(--color-brand-char)] text-white font-ui text-xs font-bold uppercase tracking-[0.2em] py-5 rounded-full shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 group mb-4"
                >
                  {isLoggedIn ? "PROCEED TO CHECKOUT" : "LOGIN TO CHECKOUT"}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375]">Taxes & shipping calculated at checkout</p>
              </div>
            )}

            {/* Bottom Info */}
            <div className={`p-8 border-t border-black/5 ${items.length > 0 ? "bg-gray-50" : "bg-white"}`}>
              <PaymentTrustStrip compact />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
