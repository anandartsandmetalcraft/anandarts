  "use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Minus, Plus, ChevronRight, ChevronLeft, ChevronDown, MapPin, ShieldCheck, CreditCard, Truck, Share2, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/constants/products";

import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { useRouter } from "next/navigation";
import { formatCouponDiscount } from "@/lib/coupons";
import { pushRecentlyViewedId } from "@/lib/recentlyViewed";
import { DeliveryEstimator } from "./DeliveryEstimator";
import PaymentTrustStrip from "@/components/shared/PaymentTrustStrip";

export default function ProductDetails({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("dimensions");
  const modalPointersRef = useRef(new Map<number, { x: number; y: number }>());
  const lastPinchDistanceRef = useRef<number | null>(null);
  const lastDragPointRef = useRef<{ x: number; y: number } | null>(null);

  const { addItem } = useCartStore();
  const { setIsCartOpen } = useUIStore();
  const router = useRouter();

  const stockCount = typeof product.stock === "number" ? product.stock : null;
  const isOutOfStock = stockCount !== null && stockCount <= 0;
  const isLowStock = stockCount !== null && stockCount > 0 && stockCount <= 2;

  const whatsappHref = useMemo(() => {
    const phone = "919481200456";
    const message = `Hi Anand Arts, I am interested in a custom commission for "${product.name}". Please share options and price.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [product.name]);

  useEffect(() => {
    if (stockCount === null) return;
    if (stockCount <= 0) {
      setQty(1);
      return;
    }
    setQty((prev) => Math.min(Math.max(1, prev), stockCount));
  }, [stockCount]);

  useEffect(() => {
    pushRecentlyViewedId(product.id);
  }, [product.id]);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, qty);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, qty);
    router.push("/checkout");
  };

  const images = product.thumbnails && product.thumbnails.length > 0
    ? [product.img, ...product.thumbnails]
    : [product.img];
  const formattedPrice = `Rs.${(product.price / 100).toLocaleString("en-IN")}`;
  const shouldClampDescription = Boolean(product.description && product.description.length > 180);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const nextImg = () => setActiveImgIdx((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  const resetModalZoom = () => {
    setModalZoom(1);
    setModalOffset({ x: 0, y: 0 });
    modalPointersRef.current.clear();
    lastPinchDistanceRef.current = null;
    lastDragPointRef.current = null;
  };
  const openMobileImageModal = () => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    resetModalZoom();
    setIsModalOpen(true);
  };
  const showNextModalImg = () => {
    resetModalZoom();
    nextImg();
  };
  const showPrevModalImg = () => {
    resetModalZoom();
    prevImg();
  };
  const getPointerDistance = () => {
    const points = Array.from(modalPointersRef.current.values());
    if (points.length < 2) return null;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  };
  const handleModalPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    modalPointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (modalPointersRef.current.size === 1) {
      lastDragPointRef.current = { x: e.clientX, y: e.clientY };
    }

    if (modalPointersRef.current.size === 2) {
      lastPinchDistanceRef.current = getPointerDistance();
    }
  };
  const handleModalPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!modalPointersRef.current.has(e.pointerId)) return;

    modalPointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (modalPointersRef.current.size >= 2) {
      const nextDistance = getPointerDistance();
      if (nextDistance && lastPinchDistanceRef.current) {
        const scaleDelta = nextDistance / lastPinchDistanceRef.current;
        setModalZoom((prev) => Math.min(4, Math.max(1, prev * scaleDelta)));
      }
      lastPinchDistanceRef.current = nextDistance;
      return;
    }

    if (modalZoom > 1 && lastDragPointRef.current) {
      const dx = e.clientX - lastDragPointRef.current.x;
      const dy = e.clientY - lastDragPointRef.current.y;
      setModalOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastDragPointRef.current = { x: e.clientX, y: e.clientY };
    }
  };
  const handleModalPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    modalPointersRef.current.delete(e.pointerId);
    lastPinchDistanceRef.current = modalPointersRef.current.size >= 2 ? getPointerDistance() : null;
    lastDragPointRef.current = modalPointersRef.current.size === 1 ? Array.from(modalPointersRef.current.values())[0] : null;
  };
  const toggleModalZoom = () => {
    if (modalZoom > 1) {
      resetModalZoom();
    } else {
      setModalZoom(2.5);
      setModalOffset({ x: 0, y: 0 });
    }
  };

  const Accordion = ({ title, id, content }: { title: string, id: string, content: React.ReactNode }) => (
    <div className="border-b border-black/5">
      <button
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-ui text-sm font-bold uppercase tracking-widest text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-gold)] transition-colors">
          {title}
        </span>
        <motion.div animate={{ rotate: openSection === id ? 180 : 0 }}>
          <ChevronDown size={18} className="text-[#8B8375]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {openSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 pt-2 font-ui text-sm text-[#4A453E] leading-relaxed">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );

  return (
    <div className="max-w-[1320px] mx-auto px-6 pb-32 pt-8 md:px-12 md:pb-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-4 mb-8 font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375]">
        <Link href="/" className="hover:text-[var(--color-brand-char)] transition-colors">Home</Link>
        <ChevronRight size={10} className="text-black/10" />
        <Link href="/collections" className="hover:text-[var(--color-brand-char)] transition-colors">Collections</Link>
        <ChevronRight size={10} className="text-black/10" />
        <Link href={`/collections?category=${encodeURIComponent(product.category)}`} className="hover:text-[var(--color-brand-char)] transition-colors">{product.category}</Link>
        <div className="hidden sm:flex items-center gap-4">
          <ChevronRight size={10} className="text-black/10" />
          <span className="text-[var(--color-brand-char)] truncate max-w-[200px]">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Left Column: Interactive Gallery */}
        <div className="space-y-6">
          <div className="relative group">
            {/* Main Image Container */}
            <div
              className="aspect-square relative rounded-3xl overflow-hidden bg-white shadow-2xl cursor-zoom-in md:cursor-crosshair border border-black/5"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onClick={openMobileImageModal}
            >
              <Image
                src={images[activeImgIdx]}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-200 ease-out ${isZooming && activeImgIdx === 0 ? 'md:scale-[2.5] scale-100' : 'scale-100'}`}
                style={isZooming && activeImgIdx === 0 ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
              />

              {/* Navigation Arrows */}
              <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow-lg backdrop-blur transition-all hover:bg-white md:left-4 md:opacity-0 md:group-hover:opacity-100">
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow-lg backdrop-blur transition-all hover:bg-white md:right-4 md:opacity-0 md:group-hover:opacity-100">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImgIdx === idx ? 'border-[var(--color-brand-gold)] shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="flex flex-col">
          <div className="space-y-1 mb-8">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B8375]">
              SKU: AA-HER-{product.id}00MS
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-brand-char)] leading-[1.1]">
              {product.name} ({product.size})
            </h1>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                {product.compareAt && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    className="font-ui text-[18px] md:text-[20px] text-[#8B8375] line-through decoration-[var(--color-brand-gold)] decoration-1"
                  >Rs.{(product.compareAt / 100).toLocaleString("en-IN")}</motion.span>
                )}
                <span className="font-display text-5xl md:text-6xl text-[var(--color-brand-char)] tracking-tight">Rs.{(product.price / 100).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-ui text-[9px] text-[#8B8375] font-bold uppercase tracking-[0.2em] bg-black/5 px-4 py-2 rounded-full inline-block">
                  Taxes Included
                </span>
                {product.stock && product.stock > 0 && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0BB197] animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#0BB197]">In Stock</span>
                  </div>
                )}
              </div>
            </div>

            {(product as any).coupon && (
              <div className="inline-flex items-center gap-2 bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/20 text-[var(--color-brand-char)] px-4 py-2 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-widest">
                Use code {(product as any).coupon.code} - {formatCouponDiscount((product as any).coupon.discount)}
              </div>
            )}


            {/* Delivery Estimator */}
            <DeliveryEstimator weightGrams={(product as any).weight_grams || 1000} />
          </div>

          {/* Product Story */}
          {product.description && (
            <div className="mb-10 space-y-4">
              <h3 className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)]">The Story</h3>
              <p
                className={`max-w-xl font-ui text-base leading-relaxed text-[#4A453E] italic transition-all ${!isDescriptionExpanded && shouldClampDescription ? "line-clamp-4" : ""}`}
              >
                {product.description}
              </p>
              {shouldClampDescription && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-brand-char)] underline underline-offset-4 transition-colors hover:text-[var(--color-brand-gold)]"
                >
                  {isDescriptionExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="flex flex-col gap-6 mb-12">
            {(isLowStock || isOutOfStock) && (
              <div
                className={`inline-flex items-center gap-2 self-start px-4 py-2 rounded-full font-ui text-[10px] font-extrabold uppercase tracking-widest ${isOutOfStock
                  ? "bg-black/70 text-white"
                  : "bg-[var(--color-brand-red)] text-white"
                  }`}
              >
                {isOutOfStock ? "Out of stock" : `Low stock alert - only ${stockCount} left`}
              </div>
            )}
            <div className="space-y-3">
              <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375]">Quantity</label>
              <div className="inline-flex items-center gap-4 bg-white border border-black/5 rounded-full p-1.5 pr-5 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black text-black hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-black/5 disabled:hover:text-black disabled:cursor-not-allowed"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-display text-lg">{qty}</span>
                  <button
                    disabled={isOutOfStock || (stockCount !== null && qty >= stockCount)}
                    onClick={() => setQty((prev) => (stockCount !== null ? Math.min(stockCount, prev + 1) : prev + 1))}
                    className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black text-black hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-black/5 disabled:hover:text-black disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden max-w-lg flex-col gap-3 md:flex">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-4 border border-[var(--color-brand-char)] font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-char)] hover:bg-[var(--color-brand-char)] hover:text-white transition-all rounded-full disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--color-brand-char)] disabled:cursor-not-allowed"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-4 bg-[var(--color-brand-char)] font-ui text-[11px] font-bold uppercase tracking-widest text-white hover:bg-black transition-all rounded-full shadow-lg disabled:opacity-40 disabled:hover:bg-[var(--color-brand-char)] disabled:cursor-not-allowed"
              >
                Buy it Now
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 border border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/5 text-[var(--color-brand-char)] font-ui text-[10px] sm:text-[11px] font-bold uppercase tracking-widest rounded-full shadow-sm hover:bg-[var(--color-brand-gold)] hover:text-white transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp for Custom Commission
              </a>
            </div>

            <PaymentTrustStrip compact className="max-w-lg rounded-3xl border border-black/5 bg-white p-5 shadow-sm" />

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3 py-4 px-6 bg-green-50 border border-green-100 rounded-3xl">
                <div className="mt-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <ShieldCheck size={12} strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="font-ui text-[13px] font-bold text-green-800">Store Pickup Available</span>
                  <span className="font-ui text-[11px] text-green-700/70">Ready for curation at Srirampura, Bengaluru.</span>
                  <button
                    onClick={() => setIsStoreInfoOpen(true)}
                    className="mt-2 font-ui text-[10px] font-bold uppercase tracking-widest text-green-800 underline underline-offset-4 hover:text-green-600 transition-colors self-start"
                  >
                    View store information
                  </button>
                </div>
              </div>
            </div>

            {/* Store Info Drawer */}
            <AnimatePresence>
              {isStoreInfoOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsStoreInfoOpen(false)}
                    className="fixed inset-0 bg-[#11100D]/40 backdrop-blur-sm z-[100]"
                  />
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--color-brand-cream)] shadow-2xl z-[101] p-8"
                  >
                    <div className="flex justify-between items-center mb-10 pb-4 border-b border-black/10">
                      <h3 className="font-display text-2xl text-[var(--color-brand-char)]">Sanctuary Details</h3>
                      <button onClick={() => setIsStoreInfoOpen(false)} className="text-[#8B8375] hover:text-black">
                        <X size={24} />
                      </button>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)]">The Physical Sanctuary</span>
                        <p className="font-ui text-sm text-[var(--color-brand-char)] font-bold">Anand Arts & Metal Craft</p>
                        <p className="font-ui text-sm text-[#4A453E] leading-relaxed">
                          2/4, 10th 'A, Laxmi Narayanpuram,<br />
                          Srirampura, Bengaluru,<br />
                          Karnataka 560021, India
                        </p>

                        <div className="h-40 rounded-2xl overflow-hidden border border-black/5 bg-[#FDFBF7]">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6799390946994!2d77.56150577507681!3d12.992311387324941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17d776f4570d%3A0x10daf66b402a1476!2sAnand%20Arts%20And%20Metal%20Craft!5e0!3m2!1sen!2sin!4v1775375304235!5m2!1sen!2sin"
                            width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.9)' }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>

                        <a
                          href="https://maps.app.goo.gl/r6N7yGv3i7ZkGzE99"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 border-2 border-[var(--color-brand-char)] text-[var(--color-brand-char)] font-ui text-[11px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-2 hover:bg-[var(--color-brand-char)] hover:text-white transition-all shadow-sm"
                        >
                          <MapPin size={16} /> VIEW ON GOOGLE MAPS
                        </a>
                      </div>

                      <div className="space-y-2">
                        <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)]">Contact Support</span>
                        <p className="font-ui text-sm text-[var(--color-brand-char)] font-bold">+91 87542 62271</p>
                        <p className="font-ui text-xs text-[#8B8375]">Customer Support: 10AM - 8PM</p>
                      </div>

                      <div className="pt-8 border-t border-black/5">
                        <button
                          onClick={() => setIsStoreInfoOpen(false)}
                          className="w-full py-4 bg-[var(--color-brand-char)] text-white font-ui text-[11px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg"
                        >
                          CLOSE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>


          {/* Technical Details Accordion */}
          <div className="space-y-1">
            <Accordion
              id="shipping"
              title="Shipping & Returns"
              content="Nationwide delivery available. Every order is packed with special care to ensure it arrives in perfect condition. 7-day easy returns."
            />
            <Accordion
              id="dimensions"
              title="Dimensions & Weight"
              content={
                <ul className="space-y-2 font-mono">
                  <li>- Height: {product.size}</li>
                  {product.material && <li>- Material: Grade-A Sacred {product.material}</li>}
                  <li>- Finish: Traditional Hand-Polished Antiquity</li>
                  <li>- Certification: Hallmark of Ancient Artisanship</li>
                </ul>
              }
            />
            <Accordion
              id="care"
              title="Care Instructions"
              content="Clean with a soft, dry lint-free cloth. For brass items, traditional cleaning methods are recommended to maintain their shine."
            />
          </div>

          <button
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: product.name,
                    text: `Discover this beautifully handcrafted ${product.name} at Anand Arts`,
                    url: window.location.href,
                  });
                } catch (err) {
                  console.log("Error sharing:", err);
                }
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("The product link has been copied to your clipboard.");
              }
            }}
            className="mt-8 flex items-center gap-3 font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B8375] hover:text-[var(--color-brand-char)] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-black transition-all">
              <Share2 size={14} />
            </div>
            <span className="border-b border-transparent group-hover:border-black transition-all">Share this Product</span>
          </button>

        </div>
      </div>

      {/* Full Screen Image Modal for Mobile Zoom */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex flex-col bg-black md:hidden"
          >
            <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
              <span className="rounded-full bg-white/10 px-4 py-2 font-ui text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur">
                {activeImgIdx + 1} / {images.length}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur">
                <X size={20} />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrevModalImg}
                  className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={showNextModalImg}
                  className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div
              className="flex flex-1 touch-none select-none items-center justify-center overflow-hidden"
              onPointerDown={handleModalPointerDown}
              onPointerMove={handleModalPointerMove}
              onPointerUp={handleModalPointerEnd}
              onPointerCancel={handleModalPointerEnd}
              onDoubleClick={toggleModalZoom}
            >
              <div
                className="relative h-full w-full"
                style={{
                  transform: `translate3d(${modalOffset.x}px, ${modalOffset.y}px, 0) scale(${modalZoom})`,
                  transition: modalPointersRef.current.size ? "none" : "transform 180ms ease-out",
                }}
              >
                <Image
                  src={images[activeImgIdx]}
                  alt={product.name}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-8 w-full px-4 text-center">
              <span className="rounded-full bg-white/10 px-4 py-2 font-ui text-[10px] font-bold uppercase tracking-widest text-white/75 backdrop-blur">
                Pinch or double tap to zoom
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-[120] border-t border-black/5 bg-[var(--color-brand-cream)]/95 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3 rounded-[28px] border border-black/5 bg-white px-3 py-3 shadow-[0_-10px_35px_rgba(26,18,8,0.08)]">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 rounded-[18px] border border-[var(--color-brand-char)] px-4 py-3 text-center font-ui text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-brand-char)] transition-all hover:bg-[var(--color-brand-char)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--color-brand-char)]"
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 rounded-[18px] bg-[var(--color-brand-gold)] px-4 py-3 text-center font-ui text-[11px] font-bold uppercase tracking-[0.08em] text-[#1A1208] shadow-sm transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="block">Buy Now</span>
            <span className="mt-0.5 block text-[12px] tracking-normal">{formattedPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
