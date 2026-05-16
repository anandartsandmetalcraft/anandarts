"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, User, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { ExpandingSearchDock } from "@/components/ui/expanding-search-dock-shadcnui";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { isCartOpen, setIsCartOpen, isAuthOpen, setIsAuthOpen } = useUIStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const router = useRouter();
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const isDarkHero = pathname === '/';
  const useLightText = !isScrolled && isDarkHero;

  const navStyle = {
    backgroundColor: isScrolled ? "rgba(253, 245, 230, 0.88)" : "rgba(253, 245, 230, 0)",
    backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
  };

  const logoSize = isScrolled ? 36 : 56;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? "-translate-y-[40px]" : "translate-y-0"
          }`}
      >
        {/* Announcement Bar */}
        <div
          className="bg-[#11100D] border-b border-white/5 py-2.5 overflow-hidden select-none"
          style={{ "--duration": "30s", "--gap": "0px" } as React.CSSProperties}
        >
          <div className="flex whitespace-nowrap animate-marquee">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <p className="font-ui text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-brand-gold)]">
                  For express delivery contact <span className="text-white ml-2">+91 84318 38722</span>
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]/40" />
              </div>
            ))}
          </div>
        </div>

        <motion.header
          style={navStyle}
          className={`flex items-center justify-between px-4 md:px-12 transition-all duration-500 ${isScrolled ? "py-4 border-b border-[var(--color-brand-gold)]/20 shadow-xl" : "py-8"
            }`}
        >
          {/* Logo */}
          <motion.div className="origin-left flex-shrink-1 min-w-0">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/Logo.png"
                alt="Anand Arts Logo"
                width={logoSize}
                height={logoSize}
                className="rounded-lg transition-all duration-300"
                priority={true}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
              />
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 md:translate-x-12">
            {["Collections", "Custom Commissions", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className={`font-ui text-[13px] tracking-[0.08em] uppercase hover:text-[var(--color-brand-gold)] transition-colors relative group ${!useLightText ? 'text-[var(--color-brand-slate)]' : 'text-[var(--color-brand-cream)] drop-shadow-sm'}`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <ExpandingSearchDock
              onSearch={(query) => {
                console.log("Searching for:", query);
                router.push(`/collections?search=${encodeURIComponent(query)}`);
              }}
              placeholder="Search products..."
            />
            <button
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
              className={`hover:text-[var(--color-brand-gold)] transition-colors relative group ${!useLightText ? 'text-[var(--color-brand-slate)]' : 'text-[var(--color-brand-cream)] drop-shadow-sm'}`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {hasMounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-brand-red)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              aria-label="User"
              onClick={() => isLoggedIn ? router.push('/account') : setIsAuthOpen(true)}
              className={`hidden md:flex hover:text-[var(--color-brand-gold)] transition-all items-center gap-2 group ${!useLightText ? 'text-[var(--color-brand-slate)]' : 'text-[var(--color-brand-cream)] drop-shadow-sm'}`}
            >
              <User size={20} strokeWidth={1.5} />
              <span className="hidden lg:block font-ui text-[10px] uppercase font-bold tracking-widest transition-opacity group-hover:opacity-100 opacity-60">
                {!hasMounted ? 'Loading...' : isLoggedIn ? 'Account' : 'Login'}
              </span>
            </button>

            <button
              aria-label="Menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden ${!useLightText ? 'text-[var(--color-brand-slate)]' : 'text-[var(--color-brand-cream)] drop-shadow-sm'}`}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </motion.header>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Mobile Sliding Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#11100D]/60 backdrop-blur-sm z-[90] md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: "anticipate" }}
              className="fixed inset-y-0 right-0 w-[85vw] max-w-[400px] bg-[var(--color-brand-cream)] shadow-[0_0_40px_rgba(0,0,0,0.5)] z-[100] md:hidden flex flex-col"
            >
              {/* Header Box */}
              <div className="flex items-center justify-between p-6 border-b border-[#2A2621]/10">
                <span className="font-display text-2xl text-[var(--color-brand-char)] uppercase tracking-widest">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-brand-char)] hover:text-[var(--color-brand-red)] transition-colors p-2"
                >
                  <X size={28} strokeWidth={1.5} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col flex-1 overflow-y-auto pt-6 pb-12">
                <div className="space-y-1">
                  {/* Divine God Items Accordion */}
                  <div className="border-b border-black/5">
                    <button
                      onClick={() => toggleCategory('divine')}
                      className="w-full flex items-center justify-between px-8 py-5 hover:bg-black/5 transition-colors group"
                    >
                      <span className="font-ui text-lg uppercase tracking-[0.1em] text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-gold)] font-bold">Divine Categories</span>
                      <motion.div animate={{ rotate: openCategories.includes('divine') ? 180 : 0 }}>
                        <ChevronDown size={20} className="text-[var(--color-brand-gold)]" strokeWidth={1.5} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openCategories.includes('divine') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-[#FDF5E6]/50"
                        >
                          {["Divine Gods", "Divine Goddess", "Divine Sets"].map((sub) => (
                            <Link
                              key={sub}
                              href={`/collections?category=${sub}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-12 py-4 font-ui text-sm uppercase tracking-widest text-[#8B8375] hover:text-[var(--color-brand-red)] transition-colors border-l-2 border-transparent hover:border-[var(--color-brand-red)]"
                            >
                              {sub}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Standard Categories */}
                  {[
                    "Copper",
                    "Miniature",
                    "Vintage",
                    "Brass",
                  ].map((item) => (
                    <div key={item} className="border-b border-black/5">
                      <Link
                        href={`/collections?category=${item}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-8 py-5 hover:bg-black/5 transition-colors group"
                      >
                        <span className="font-ui text-base uppercase tracking-[0.05em] text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-gold)]">{item}</span>
                      </Link>
                    </div>
                  ))}

                  {/* Spacer and Footer Nav */}
                  <div className="pt-8 px-8 flex flex-col gap-6">
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-ui text-sm uppercase tracking-widest text-[#8B8375] font-bold hover:text-black">About Us</Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-ui text-sm uppercase tracking-widest text-[#8B8375] font-bold hover:text-black">Contact</Link>
                  </div>
                </div>
              </nav>

              {/* Bottom Actions Area */}
              <div className="bg-[#11100D] p-8 mt-auto flex flex-col gap-8 rounded-tl-3xl">

                {/* Auth Login/Logout */}
                {isLoggedIn ? (
                  <div className="flex flex-col gap-6 border-b border-[#2A2621] pb-6">
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-[#E8E1D5] hover:text-[var(--color-brand-gold)] transition-colors font-ui text-sm uppercase tracking-widest font-bold"
                    >
                      <User size={20} className="text-[var(--color-brand-gold)]" />
                      <span>{user?.firstName}&apos;s Profile</span>
                    </Link>
                    <button
                      onClick={async () => {
                        logout();
                        await signOut({ callbackUrl: '/' });
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 text-[var(--color-brand-red)] hover:text-white transition-colors font-ui text-[10px] uppercase tracking-[0.2em] font-bold"
                    >
                      <span>LOGOUT</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                    className="cursor-pointer flex items-center gap-4 text-[#E8E1D5] hover:text-[var(--color-brand-gold)] transition-colors font-ui text-sm uppercase tracking-widest font-bold border-b border-[#2A2621] pb-6"
                  >
                    <User size={20} />
                    <span>Login / Register</span>
                  </div>
                )}

                {/* Social Media (Instagram / Facebook ONLY) */}
                <div className="flex items-center justify-between">
                  <span className="font-script italic text-[#A89F91] text-lg">Follow us</span>
                  <div className="flex gap-4">
                    <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-[#2A2621] flex items-center justify-center hover:bg-[var(--color-brand-gold)] hover:text-[#11100D] hover:border-transparent transition-all text-[#8B8375]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </a>
                    <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-[#2A2621] flex items-center justify-center hover:bg-[var(--color-brand-gold)] hover:text-[#11100D] hover:border-transparent transition-all text-[#8B8375]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    </a>
                  </div>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
