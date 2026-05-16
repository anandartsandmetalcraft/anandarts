"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
   Truck,
   ShieldCheck,
   MapPin,
   CreditCard,
   ShoppingBag,
   ChevronRight,
   ArrowLeft,
   CheckCircle2,
   Lock,
   Loader2,
   AlertCircle,
   Plus,
   Minus,
   Trash2,
   Gift,
   Info,
   Globe,
   Smartphone
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { createOrder } from "@/actions/orders";
import { processOrderPayment, simulatePaymentSuccess } from "@/actions/payments";
import { getUserAddresses, createAddress } from "@/actions/addresses";
import { validateCoupon } from "@/actions/coupons";
import { parseCouponDiscount } from "@/lib/coupons";
import {
   FREE_SHIPPING_THRESHOLD_PAISE,
   GIFT_WRAP_FEE_PAISE,
   calculateGiftWrapFeePaise,
   calculateShippingChargePaise,
   isRemotePincode,
   remainingForFreeShippingPaise,
} from "@/lib/shipping";

const INDIAN_STATES = [
   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
   "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
   "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
   "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
   "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
   "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
   "Ladakh", "Lakshadweep", "Puducherry"
];

type CheckoutStep = "shipping" | "payment" | "success";

export default function CheckoutPage() {
   const { isLoggedIn, user } = useAuthStore();
   const { items, getTotalPrice, clearCart, isGiftWrapped, updateQuantity, removeItem, setGiftWrapped } = useCartStore();
   const { setIsAuthOpen } = useUIStore();
   const router = useRouter();

   const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
   const [shippingMode, setShippingMode] = useState<"delivery" | "pickup">("delivery");
   const [isProcessing, setIsProcessing] = useState(false);
   const [orderNumber, setOrderNumber] = useState("");
   const [orderDbId, setOrderDbId] = useState("");
   const [hasMounted, setHasMounted] = useState(false);

   const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
   const [isEditingAddress, setIsEditingAddress] = useState(false);
   const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | null>(null);
   const [couponCode, setCouponCode] = useState("");
   const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
   const [isCouponLoading, setIsCouponLoading] = useState(false);
   const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
   const giftWrapFeePaise = calculateGiftWrapFeePaise({ isGiftWrapped, totalQuantity });

   const [shipping, setShipping] = useState({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      houseNo: user?.houseNo || "",
      street: user?.street || "",
      landmark: "",
      city: user?.city || "",
      state: "",
      postalCode: user?.postalCode || "",
      country: "India",
   });

   // Fetch saved addresses
   useEffect(() => {
      if (isLoggedIn) {
         const fetchAddresses = async () => {
            const addr = await getUserAddresses();
            setSavedAddresses(addr);
            if (addr.length > 0) {
               setSelectedAddressId(addr[0].id);
            }
         };
         fetchAddresses();
      }
   }, [isLoggedIn]);

   // Sync state if user registers/authenticates on page
   useEffect(() => {
      if (user && !shipping.firstName) {
         setShipping({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            houseNo: user.houseNo || "",
            street: user.street || "",
            landmark: "",
            city: user.city || "",
            state: "",
            postalCode: user.postalCode || "",
            country: "India",
         });
      }
   }, [user]);

   useEffect(() => {
      setHasMounted(true);
   }, []);

   // Initial Auth Guard
   useEffect(() => {
      if (!isLoggedIn) {
         setIsAuthOpen(true);
      }
   }, [isLoggedIn, setIsAuthOpen]);

   const handleSaveAddress = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);

      if (shippingMode === "pickup") {
         setIsProcessing(false);
         setCurrentStep("payment");
         return;
      }

      if (!selectedAddressId) {
         const result = await createAddress({
            ...shipping,
            isDefault: true
         } as any);

         if (result.success) {
            setSelectedAddressId(result.address!.id);
            setSavedAddresses([result.address]);
         } else {
            toast.error(result.error || "Failed to save address.");
            setIsProcessing(false);
            return;
         }
      }

      setIsProcessing(false);
      setCurrentStep("payment");
   };

   const handleApplyCoupon = async () => {
      if (!couponCode) return;
      setIsCouponLoading(true);
      const result = await validateCoupon(couponCode);
      setIsCouponLoading(false);

      if (result.success) {
         setAppliedCoupon(result);
         toast.success(`Coupon Applied: ${result.title}`);
      } else {
         setAppliedCoupon(null);
         toast.error(result.error || "Invalid coupon.");
      }
   };

   const handlePlaceOrder = async () => {
      if (shippingMode === "delivery" && !selectedAddressId) {
         toast.error("Please select a shipping address.");
         return;
      }
      if (!paymentMethod) {
         toast.error("Please select a payment method.");
         return;
      }

      setIsProcessing(true);

      const orderResult = await createOrder(
         items.map(i => ({ productId: i.id as string, quantity: i.quantity })),
         {
            addressId: shippingMode === "pickup" ? undefined : selectedAddressId,
            couponCode: couponCode || undefined,
            notes: shippingMode === "pickup" ? "STORE_PICKUP" : undefined,
            isGiftWrapped: isGiftWrapped
         } as any
      );

      if (!orderResult.success) {
         toast.error(orderResult.error || "Order failed.");
         setIsProcessing(false);
         return;
      }

      setOrderNumber(orderResult.orderNumber!);
      setOrderDbId(orderResult.orderId!);

      const paymentResult = await processOrderPayment(orderResult.orderId!);

      if (paymentResult.success && paymentResult.url) {
         window.location.href = paymentResult.url;
      } else {
         toast.error(paymentResult.error || "Payment gateway failed.");
         setIsProcessing(false);
      }
   };

   if (!hasMounted) return null;

   if (!isLoggedIn) {
      return (
         <div className="min-h-screen pt-40 pb-20 bg-[var(--color-brand-cream)] flex flex-col items-center justify-center text-center px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
               <Lock size={60} className="mx-auto text-[var(--color-brand-gold)] mb-6 opacity-30" />
               <h1 className="font-display text-3xl text-[var(--color-brand-char)] mb-4 uppercase tracking-widest">Authentication Required</h1>
               <p className="font-ui text-sm text-[#8B8375] mb-8 leading-relaxed">Please log in to proceed.</p>
               <button onClick={() => setIsAuthOpen(true)} className="w-full bg-[var(--color-brand-char)] text-white font-ui text-xs font-bold uppercase tracking-widest py-5 rounded-full shadow-xl">Login to Continue</button>
            </motion.div>
         </div>
      );
   }

   if (items.length === 0) {
      return (
         <div className="min-h-screen pt-40 pb-20 bg-[var(--color-brand-cream)] flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag size={60} className="mx-auto text-[#8B8375] mb-6 opacity-20" />
            <h1 className="font-display text-3xl text-[var(--color-brand-char)] mb-4 uppercase tracking-widest">Your Cart is Empty</h1>
            <Link href="/collections" className="bg-[var(--color-brand-char)] text-white px-10 py-5 rounded-full font-ui text-xs font-bold uppercase tracking-widest">Shop Now</Link>
         </div>
      );
   }

   return (
      <main className="min-h-screen pt-32 pb-24 bg-[var(--color-brand-cream)]">
         <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
               <div>
                  <Link href="/collections" className="inline-flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] hover:text-black mb-4"><ArrowLeft size={14} /> Continue Perusing</Link>
                  <h1 className="font-display text-4xl md:text-5xl text-[var(--color-brand-char)] uppercase tracking-tight">Checkout</h1>
               </div>
               <div className="flex items-center gap-4 md:gap-8">
                  <div className={`flex flex-col items-center gap-2 ${currentStep === 'shipping' ? 'text-[var(--color-brand-char)]' : 'text-[#8B8375]'}`}>
                     <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${currentStep === 'shipping' ? 'border-[var(--color-brand-char)] bg-[var(--color-brand-char)] text-white' : 'border-black/10 text-black/20'}`}><MapPin size={18} /></div>
                     <span className="font-ui text-[9px] font-bold uppercase tracking-widest">Shipping</span>
                  </div>
                  <div className="w-12 md:w-20 h-[2px] bg-black/10 mt-[-18px]" />
                  <div className={`flex flex-col items-center gap-2 ${currentStep === 'payment' ? 'text-[var(--color-brand-char)]' : 'text-[#8B8375]'}`}>
                     <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${currentStep === 'payment' ? 'border-[var(--color-brand-char)] bg-[var(--color-brand-char)] text-white' : 'border-black/10 text-black/20'}`}><CreditCard size={18} /></div>
                     <span className="font-ui text-[9px] font-bold uppercase tracking-widest">Payment</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
               <div className="lg:col-span-7 xl:col-span-8">
                  <AnimatePresence mode="wait">
                     {currentStep === "shipping" && (
                        <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button onClick={() => setShippingMode("delivery")} className={`p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${shippingMode === 'delivery' ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-cream-dark)]/20 shadow-sm' : 'border-black/5 hover:border-black/10'}`}>
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${shippingMode === 'delivery' ? 'bg-[var(--color-brand-char)] text-white' : 'bg-[#11100D]/5 text-[#8B8375]'}`}><Truck size={20} /></div>
                                 <div className="text-left"><p className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)]">Doorstep Delivery</p><p className="font-ui text-[10px] text-[#8B8375]">Premium insured shipping</p></div>
                              </button>
                              <button onClick={() => setShippingMode("pickup")} className={`p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${shippingMode === 'pickup' ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-cream-dark)]/20 shadow-sm' : 'border-black/5 hover:border-black/10'}`}>
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${shippingMode === 'pickup' ? 'bg-[var(--color-brand-char)] text-white' : 'bg-[#11100D]/5 text-[#8B8375]'}`}><ShoppingBag size={20} /></div>
                                 <div className="text-left"><p className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)]">Pick up from Store</p><p className="font-ui text-[10px] text-[#8B8375]">Srirampura, Bengaluru</p></div>
                              </button>
                           </div>

                           {shippingMode === "pickup" ? (
                              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-black/5 text-center">
                                 <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"><MapPin size={32} /></div>
                                 <h2 className="font-display text-2xl text-[var(--color-brand-char)] mb-4 uppercase tracking-widest">Store Pickup Selected</h2>
                                 <p className="font-ui text-sm text-[#8B8375] mb-8 max-w-sm mx-auto leading-relaxed">Visit our studio at:<br /><strong className="text-[var(--color-brand-char)]">Anand Arts & Metal Craft</strong><br />No. 12, 1st Cross, Srirampura, Bengaluru, Karnataka 560021</p>
                                 <a href="https://www.google.com/maps/dir/?api=1&destination=Anand+Arts+Metal+Craft+Srirampura+Bengaluru" target="_blank" rel="noopener noreferrer" className="mb-8 inline-flex items-center gap-2 px-8 py-3 bg-[#FAF9F6] border border-black/10 rounded-full font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-char)] hover:bg-black hover:text-white transition-all shadow-sm"><MapPin size={14} /> Get Directions</a>
                                 <div className="p-4 bg-amber-50 rounded-2xl flex items-center gap-4 text-left border border-amber-100"><AlertCircle className="text-amber-500 shrink-0" size={20} /><p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider leading-relaxed">Please bring your Order ID and a Photo ID for verification.</p></div>
                              </div>
                           ) : (
                              <>
                                 {!isEditingAddress && selectedAddressId ? (
                                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-black/5">
                                       <div className="flex items-center justify-between mb-8"><h2 className="font-display text-2xl text-[var(--color-brand-char)] uppercase tracking-widest">Delivering To</h2><button onClick={() => setIsEditingAddress(true)} className="font-ui text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline">Change Address</button></div>
                                       <div className="p-8 bg-[#FAF9F6] rounded-2xl border border-black/5 relative">
                                          <div className="absolute top-6 right-6 w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={20} /></div>
                                          {(() => {
                                             const addr = savedAddresses.find(a => a.id === selectedAddressId);
                                             if (!addr) return null;
                                             return (
                                                <div className="space-y-1">
                                                   <p className="font-ui text-sm font-bold uppercase tracking-widest text-[var(--color-brand-char)]">{addr.firstName} {addr.lastName}</p>
                                                   <p className="font-ui text-sm text-[#8B8375]">{addr.houseNo}, {addr.street}</p>
                                                   <p className="font-ui text-sm text-[#8B8375]">{addr.city}, {addr.postalCode}</p>
                                                   <p className="font-ui text-xs font-bold text-[var(--color-brand-char)] mt-2">{addr.country}</p>
                                                   {addr.country !== "India" && (
                                                      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3"><Info className="text-blue-500 shrink-0 mt-0.5" size={16} /><p className="text-[10px] text-blue-800 font-medium leading-relaxed"><strong>International Delivery:</strong> Our logistics team will contact you at <strong>+91 91108 55462</strong> to finalize shipping details.</p></div>
                                                    )}
                                                </div>
                                             );
                                          })()}
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-black/5">
                                       <h2 className="font-display text-2xl text-[var(--color-brand-char)] mb-10 flex items-center gap-4 uppercase tracking-widest">Shipping Details <div className="h-[1px] flex-1 bg-black/10" /></h2>
                                       <form onSubmit={handleSaveAddress} className="space-y-6">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">First Name</label><input required type="text" value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Last Name</label><input required type="text" value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Phone</label><input required type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">House No.</label><input required type="text" value={shipping.houseNo} onChange={(e) => setShipping({ ...shipping, houseNo: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Street</label><input required type="text" value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Landmark</label><input type="text" value={shipping.landmark} onChange={(e) => setShipping({ ...shipping, landmark: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">City</label><input required type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                             <div className="space-y-2">
                                                <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">State</label>
                                                {shipping.country === "India" ? (
                                                   <select value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none">{INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                                                ) : (
                                                   <input required type="text" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" />
                                                )}
                                             </div>
                                             <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">ZIP</label><input required type="text" value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none" /></div>
                                          </div>
                                          <div className="space-y-2"><label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Country</label><select value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className="w-full bg-[#FAF9F6] border border-black/5 px-6 py-4 rounded-2xl outline-none"><option value="India">India 🇮🇳</option><option value="USA">USA 🇺🇸</option><option value="UK">UK 🇬🇧</option><option value="Other">Other</option></select></div>
                                       </form>
                                    </div>
                                 )}
                              </>
                           )}

                           <div className="pt-4 flex justify-end">
                              <button onClick={handleSaveAddress} disabled={isProcessing} className="bg-[var(--color-brand-char)] text-white font-ui text-xs font-bold uppercase tracking-[0.2em] px-12 py-5 rounded-full shadow-2xl hover:bg-black transition-all group flex items-center gap-3 disabled:opacity-50">{isProcessing ? 'Processing...' : 'Continue to Payment'}<ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></button>
                           </div>
                        </motion.div>
                     )}

                     {currentStep === "payment" && (
                        <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-black/5 animate-in fade-in slide-in-from-right-5">
                           <h2 className="font-display text-2xl text-[var(--color-brand-char)] mb-10 flex items-center gap-4 uppercase tracking-widest">Select Payment <div className="h-[1px] flex-1 bg-black/10" /></h2>
                           <div className="space-y-4">
                              <button onClick={() => setPaymentMethod("upi")} className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-cream-dark)]/20 shadow-sm' : 'border-black/5 hover:border-black/10'}`}>
                                 <div className="flex items-center gap-4"><div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Smartphone size={20} /></div><div className="text-left"><p className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-char)]">UPI / G-Pay / PhonePe</p><p className="font-ui text-[9px] text-[#8B8375]">Fast & Secure with QR Code</p></div></div>
                                 <CheckCircle2 size={20} className={paymentMethod === 'upi' ? 'text-[var(--color-brand-gold)]' : 'text-transparent'} />
                              </button>
                              <button onClick={() => setPaymentMethod("card")} className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-cream-dark)]/20 shadow-sm' : 'border-black/5 hover:border-black/10'}`}>
                                 <div className="flex items-center gap-4"><div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><CreditCard size={20} /></div><div className="text-left"><p className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-char)]">Credit / Debit Card</p><p className="font-ui text-[9px] text-[#8B8375]">Visa, Mastercard, RuPay</p></div></div>
                                 <CheckCircle2 size={20} className={paymentMethod === 'card' ? 'text-[var(--color-brand-gold)]' : 'text-transparent'} />
                              </button>
                              <button onClick={() => setPaymentMethod("netbanking")} className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'netbanking' ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-cream-dark)]/20 shadow-sm' : 'border-black/5 hover:border-black/10'}`}>
                                 <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div><div className="text-left"><p className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-char)]">Net Banking</p><p className="font-ui text-[9px] text-[#8B8375]">All major Indian banks</p></div></div>
                                 <CheckCircle2 size={20} className={paymentMethod === 'netbanking' ? 'text-[var(--color-brand-gold)]' : 'text-transparent'} />
                              </button>
                           </div>
                           <div className="mt-10 p-6 bg-[#FAF9F6] rounded-3xl border border-black/5 text-center">
                              <p className="font-ui text-[10px] text-[#8B8375] uppercase tracking-widest leading-relaxed">Redirection to Cashfree Secure Gateway. <br /><span className="font-bold text-[var(--color-brand-char)]">Safe and encrypted processing guaranteed.</span></p>
                           </div>
                           <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                              <button onClick={() => setCurrentStep("shipping")} className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] hover:text-black flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
                              <button onClick={handlePlaceOrder} disabled={isProcessing || !paymentMethod} className="w-full sm:w-auto bg-[var(--color-brand-char)] text-white font-ui text-xs font-bold uppercase tracking-[0.2em] px-12 py-5 rounded-full shadow-2xl hover:bg-black transition-all group flex items-center gap-3 disabled:opacity-50">{isProcessing ? 'Connecting...' : 'Pay & Place Order'}<Lock size={16} /></button>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <div className="lg:col-span-5 xl:col-span-4">
                  <div className="sticky top-32 space-y-6">
                     <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-black/5">
                        <h3 className="font-display text-xl text-[var(--color-brand-char)] mb-8 uppercase tracking-widest">Order Summary</h3>
                        <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {items.map((item) => (
                              <div key={item.id} className="flex gap-4 group">
                                 <div className="w-20 h-24 bg-[#FAF9F6] rounded-xl overflow-hidden relative border border-black/5 shrink-0">
                                    <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-brand-char)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</div>
                                 </div>
                                 <div className="flex-1 py-1">
                                    <h4 className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-char)] line-clamp-1">{item.name}</h4>
                                    <p className="font-ui text-[10px] text-[#8B8375] mt-1">₹{(item.price / 100).toLocaleString("en-IN")}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                       <div className="flex items-center border border-black/5 rounded-lg overflow-hidden bg-[#FAF9F6]">
                                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 hover:bg-black/5 transition-colors"><Minus size={10} /></button>
                                          <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-black/5 transition-colors"><Plus size={10} /></button>
                                       </div>
                                       <button onClick={() => removeItem(item.id)} className="text-[#8B8375] hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-black/5">
                           <div className="flex justify-between items-center"><span className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375]">Subtotal</span><span className="font-ui text-[12px] font-bold text-[var(--color-brand-char)]">₹{(getTotalPrice() / 100).toLocaleString("en-IN")}</span></div>
                           <div className="flex justify-between items-center">
                              <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375]">Shipping</span>
                              {(() => {
                                 const activeAddress = savedAddresses.find(a => a.id === selectedAddressId) || shipping;
                                 const pin = activeAddress?.postalCode || "";
                                 const cost = calculateShippingChargePaise({ subtotalPaise: getTotalPrice(), isStorePickup: shippingMode === "pickup", postalCode: pin });
                                 return <span className={`font-ui text-[12px] font-bold ${cost === 0 ? 'text-green-600 uppercase' : 'text-[var(--color-brand-char)]'}`}>{cost === 0 ? 'Free' : `₹${(cost / 100).toLocaleString("en-IN")}`}</span>;
                              })()}
                           </div>
                           {isGiftWrapped && <div className="flex justify-between items-center"><span className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375]">Gift Wrap</span><span className="font-ui text-[12px] font-bold text-[var(--color-brand-char)]">₹{(giftWrapFeePaise / 100).toLocaleString("en-IN")}</span></div>}
                           <div className="flex justify-between items-center pt-6 border-t border-black/10">
                              <span className="font-display text-xl text-[var(--color-brand-char)] uppercase tracking-widest">Total</span>
                              <span className="font-display text-2xl text-[var(--color-brand-char)]">₹{((getTotalPrice() + giftWrapFeePaise + calculateShippingChargePaise({ subtotalPaise: getTotalPrice(), isStorePickup: shippingMode === "pickup", postalCode: (savedAddresses.find(a => a.id === selectedAddressId) || shipping).postalCode || "" })) / 100).toLocaleString("en-IN")}</span>
                           </div>
                           <div className="mt-8 pt-8 border-t border-black/5 flex flex-col items-center gap-4">
                              <div className="flex items-center gap-2 px-6 py-2 bg-blue-50 rounded-full border border-blue-100">
                                 <ShieldCheck size={14} className="text-blue-600" />
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-blue-800">Secured by Cashfree Payments</span>
                              </div>
                              <div className="flex gap-4 items-center transition-all duration-300">
                                 {/* Visa */}
                                 <svg width="32" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-auto">
                                   <path d="M18.83 29.86l2.9-17.91h4.63l-2.9 17.91h-4.63zm18.31-17.51c-1.07-.41-2.76-.85-4.82-.85-5.32 0-9.06 2.82-9.09 6.87-.03 2.99 2.68 4.65 4.73 5.65 2.1 1.03 2.81 1.68 2.8 2.6-.02 1.4-1.68 2.04-3.23 2.04-2.15 0-3.41-.34-5.23-1.14l-.74-.35-.79 4.88c1.31.6 3.75 1.12 6.27 1.15 5.66 0 9.32-2.8 9.37-7.14.04-2.38-1.42-4.18-4.54-5.67-1.89-.95-3.05-1.59-3.04-2.56.01-.88.99-1.82 3.12-1.82 1.77-.03 3.06.38 4.04.81l.48.23.88-5.55zm7.32.4c-1.05 0-1.94.61-2.35 1.58l-8.23 19.52h4.86l.97-2.68h5.95l.56 2.68h4.29L44.46 12.75zm-3.66 12.98l1.9-5.18 1.08 5.18h-2.98zM8.3 12.75L3.71 25.13l-.48-2.45c-.83-2.81-3.41-5.84-6.3-7.37L1 29.86h4.89l7.28-17.11H8.3z" fill="#11100D"/>
                                 </svg>
                                 {/* Mastercard */}
                                 <svg width="24" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-auto">
                                   <circle cx="7" cy="12" r="7" fill="#11100D" fillOpacity="0.7"/>
                                   <circle cx="17" cy="12" r="7" fill="#11100D" fillOpacity="0.5"/>
                                 </svg>
                                 {/* UPI */}
                                 <svg width="32" height="20" viewBox="0 0 40 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-auto">
                                   <path d="M6.08 0l-2.01 7.23h2.36l2.01-7.23H6.08zm8.62 0l-2.01 7.23h2.36l2.01-7.23h-2.36zm8.62 0l-2.01 7.23h2.36l2.01-7.23h-2.36z" fill="#11100D"/>
                                   <path d="M3.7 10.5h32.6v1.5H3.7v-1.5z" fill="#11100D"/>
                                 </svg>
                              </div>

                              {/* Demo Checkout - Visible only for testing/client demo */}
                              {process.env.NEXT_PUBLIC_ALLOW_TEST_PAYMENTS === "true" && (
                                 <button
                                    onClick={async () => {
                                       if (!orderDbId) {
                                          toast.error("Please click 'Pay & Place Order' first to create the order draft");
                                          return;
                                       }
                                       setIsProcessing(true);
                                       try {
                                          toast.success("Demo Mode: Simulating Payment Success...");
                                          // Small delay to feel real
                                          setTimeout(() => {
                                             window.location.href = `/checkout/success?orderId=${orderDbId}`;
                                          }, 2000);
                                       } catch (err) {
                                          toast.error("Demo checkout failed");
                                       } finally {
                                          setIsProcessing(false);
                                       }
                                    }}
                                    type="button"
                                    className="w-full mt-4 border-2 border-dashed border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] font-ui text-[10px] font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-[var(--color-brand-gold)] hover:text-white transition-all duration-300 shadow-lg"
                                 >
                                    ⚡ Run Client Demo (Simulate Success)
                                 </button>
                              )}
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#11100D] rounded-3xl p-8 text-white">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--color-brand-gold)]"><ShieldCheck size={20} /></div>
                           <div><h4 className="font-ui text-[10px] font-bold uppercase tracking-widest opacity-80">Quality Guarantee</h4><p className="text-[10px] opacity-40">100% Authentic Handcrafted Products</p></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
}
