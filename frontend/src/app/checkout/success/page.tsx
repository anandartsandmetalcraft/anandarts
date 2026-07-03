import React from "react";
import { getOrderById } from "@/actions/orders";
import { CheckCircle2, MapPin, Calendar, CreditCard, ShoppingBag, ArrowRight, Truck, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-[var(--color-brand-cream)] flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-md bg-white border border-black/5 p-10 rounded-3xl shadow-sm">
          <h1 className="font-display text-2xl text-[var(--color-brand-char)] mb-4 uppercase tracking-widest">No Order Found</h1>
          <p className="font-ui text-xs text-[#8B8375] mb-8 leading-relaxed">No order identifier was found. Please check your account dashboard.</p>
          <Link href="/collections" className="inline-block bg-[var(--color-brand-char)] hover:bg-black text-white font-ui text-[10px] font-bold uppercase tracking-widest py-5 px-10 rounded-full shadow-md transition-all">Go to Collections</Link>
        </div>
      </div>
    );
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-[var(--color-brand-cream)] flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-md bg-white border border-black/5 p-10 rounded-3xl shadow-sm">
          <h1 className="font-display text-2xl text-[var(--color-brand-char)] mb-4 uppercase tracking-widest">Order Not Found</h1>
          <p className="font-ui text-xs text-[#8B8375] mb-8 leading-relaxed">We could not retrieve details for this order. It might belong to another user session.</p>
          <Link href="/collections" className="inline-block bg-[var(--color-brand-char)] hover:bg-black text-white font-ui text-[10px] font-bold uppercase tracking-widest py-5 px-10 rounded-full shadow-md transition-all">Go to Collections</Link>
        </div>
      </div>
    );
  }

  const isStorePickup = order.notes === "STORE_PICKUP";

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[var(--color-brand-cream)]">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Success Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mb-6 border border-emerald-100 shadow-sm animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <span className="font-ui text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-brand-gold)] mb-3 block">
            Auspicious Acquisition
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-brand-char)] uppercase tracking-tight mb-4">
            Order Placed Successfully
          </h1>
          <p className="font-ui text-xs text-[#8B8375] max-w-md mx-auto leading-relaxed">
            Thank you for supporting traditional Indian heritage. Your order has been registered, and our master curators are preparing your items.
          </p>
        </div>

        {/* Glassmorphic Order Summary Card */}
        <div className="bg-white border border-black/5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(26,18,8,0.05)] overflow-hidden mb-8">
          {/* Header Strip */}
          <div className="bg-[#11100D] text-white p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5">
            <div>
              <p className="font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-[#A89F91] mb-1">Order Number</p>
              <h2 className="font-ui text-base font-bold uppercase tracking-wider text-[var(--color-brand-gold-light)]">
                {order.orderNumber}
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-[#A89F91] mb-1">Status</p>
                <span className={`inline-block font-ui text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${order.status === "PAID" || order.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-[#A89F91] mb-1">Total Paid</p>
                <span className="font-display text-xl text-[var(--color-brand-gold-light)]">
                  ₹{(order.total / 100).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-8 md:p-10 space-y-8">
            
            {/* Split Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Delivery / Pickup Address */}
              <div className="space-y-3">
                <h3 className="font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-char)] flex items-center gap-2 border-b border-black/5 pb-2">
                  <MapPin size={14} className="text-[var(--color-brand-gold)]" /> 
                  {isStorePickup ? "Pickup Location" : "Delivery Address"}
                </h3>
                {isStorePickup ? (
                  <div className="text-xs text-[#8B8375] leading-relaxed">
                    <p className="font-bold text-[var(--color-brand-char)]">Anand Arts & Metal Craft</p>
                    <p>No. 12, 1st Cross, Srirampura</p>
                    <p>Bengaluru, Karnataka 560021</p>
                    <p className="mt-2 text-[var(--color-brand-gold)]">Store Hours: 10:00 AM - 8:30 PM</p>
                  </div>
                ) : (
                  <div className="text-xs text-[#8B8375] leading-relaxed">
                    {order.address ? (
                      <>
                        <p className="font-bold text-[var(--color-brand-char)]">{order.address.firstName} {order.address.lastName}</p>
                        <p>{order.address.houseNo}, {order.address.street}</p>
                        {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                        <p>{order.address.city}, {order.address.state} - {order.address.postalCode}</p>
                        <p className="mt-1">Phone: {order.address.phone}</p>
                      </>
                    ) : (
                      <p>No shipping address provided.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Fulfilment Timeline / Details */}
              <div className="space-y-3">
                <h3 className="font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-char)] flex items-center gap-2 border-b border-black/5 pb-2">
                  <Truck size={14} className="text-[var(--color-brand-gold)]" /> Fulfilment Timeline
                </h3>
                <div className="text-xs text-[#8B8375] space-y-2">
                  <p className="flex items-center gap-2">
                    <Calendar size={12} className="text-[#8B8375]" />
                    <span>Ordered on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck size={12} className="text-[#8B8375]" />
                    {isStorePickup ? (
                      <span>Ready for Pickup: <strong>1-2 business days</strong></span>
                    ) : (
                      <span>Estimated Delivery: <strong>5-7 business days</strong></span>
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={12} className="text-[#8B8375]" />
                    <span>Receipt/invoice sent to customer email</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-4">
              <h3 className="font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-char)] border-b border-black/5 pb-2">
                Purchased Pieces
              </h3>
              <div className="divide-y divide-black/5">
                {order.items.map((item: any) => (
                  <div key={item.id} className="py-4 flex items-center gap-4 group">
                    <div className="w-16 h-20 bg-[#FAF9F6] rounded-xl overflow-hidden relative border border-black/5 shrink-0">
                      {item.product?.images?.[0]?.url || item.product?.img ? (
                        <Image
                          src={item.product?.images?.[0]?.url || item.product?.img}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-black/5 flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)] line-clamp-1">{item.name}</h4>
                      <p className="font-ui text-[10px] text-[#8B8375] mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-ui text-xs font-bold text-[var(--color-brand-char)]">₹{(item.total / 100).toLocaleString("en-IN")}</p>
                      <p className="font-ui text-[9px] text-[#8B8375] mt-0.5">₹{(item.price / 100).toLocaleString("en-IN")} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Calculations split */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-black/5 space-y-3">
              <div className="flex justify-between items-center text-xs text-[#8B8375]">
                <span>Base Subtotal</span>
                <span>₹{(order.subtotal / 100).toLocaleString("en-IN")}</span>
              </div>
              {order.isGiftWrapped && (
                <div className="flex justify-between items-center text-xs text-[#8B8375]">
                  <span>Premium Gift Wrapping</span>
                  <span>₹{(order.giftWrapFee / 100).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-[#8B8375]">
                <span>GST Tax (5%)</span>
                <span>₹{(order.tax / 100).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#8B8375]">
                <span>Shipping Fee</span>
                <span>{order.shippingCharge === 0 ? "Free" : `₹${(order.shippingCharge / 100).toLocaleString("en-IN")}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between items-center text-xs text-green-600">
                  <span>Discount Applied</span>
                  <span>-₹{(order.discount / 100).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-bold text-[var(--color-brand-char)] pt-3 border-t border-black/10">
                <span>Total Amount Paid</span>
                <span>₹{(order.total / 100).toLocaleString("en-IN")}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Secondary Trust Strip & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <Link 
            href="/collections" 
            className="w-full sm:w-auto text-center font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375] hover:text-black py-4 px-8 border border-black/10 rounded-full transition-all"
          >
            Continue Browsing
          </Link>
          <Link 
            href={`/track-order?orderId=${order.id}`} 
            className="w-full sm:w-auto text-center font-ui text-[10px] font-bold uppercase tracking-[0.2em] bg-[var(--color-brand-char)] hover:bg-black text-white py-4 px-10 rounded-full shadow-lg flex items-center justify-center gap-2 group transition-all"
          >
            Track Order status
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </main>
  );
}
