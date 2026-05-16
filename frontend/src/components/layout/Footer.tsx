"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Banknote, QrCode, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";
import { FlipLink } from "@/components/ui/flip-links";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#11100D] text-[#A89F91] font-ui flex flex-col">
      {/* Newsletter Section */}
      <div className="bg-[#181613] border-b border-[#2A2621]">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex gap-6 items-center">
            <div className="w-[2px] h-16 bg-[var(--color-brand-gold)]"></div>
            <div>
              <h3 className="font-script text-3xl text-[var(--color-brand-gold)] mb-1 uppercase tracking-wider">JOIN OUR NEWSLETTER</h3>
              <p className="font-script italic text-[17px] text-[#A89F91]">Get updates on new products and special offers.</p>
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center bg-[#23201D] rounded-full p-1 pl-6 shadow-inner flex-1 max-w-md">
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent border-none outline-none text-[#E8E1D5] placeholder:text-[#6B6356] w-full text-sm tracking-wide font-ui"
            />
            <button className="bg-[var(--color-brand-red)] hover:bg-[#A33B32] text-white font-bold uppercase tracking-widest text-[12px] px-8 py-3.5 rounded-full transition-colors ml-2 shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col pr-0 lg:pr-8">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/Logo2.svg"
                alt="Anand Arts Logo"
                width={60}
                height={60}
                className="rounded-lg"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
              />
            </div>
            <p className="font-script italic text-xl leading-relaxed text-[#A89F91] mb-8">
              Creating beautiful handcrafted temple art and metal crafts with traditional techniques.
            </p>

            <div className="flex flex-col gap-3 mb-10 mt-2">
              <h4 className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-gold)] mb-2">FOLLOW OUR JOURNEY</h4>

              {/* Desktop View (FlipLinks) */}
              <div className="hidden md:flex flex-col gap-3">
                <FlipLink href="https://www.instagram.com/reel/DKQBl6PzG9D/?utm_source=ig_web_copy_link" className="text-xl md:text-2xl text-[#8B8375] hover:text-[var(--color-brand-gold)]">Instagram</FlipLink>
                <FlipLink href="https://www.facebook.com/Anandsingh9268/" className="text-xl md:text-2xl text-[#8B8375] hover:text-[var(--color-brand-gold)]">Facebook</FlipLink>
                <FlipLink href="https://wa.me/918431838722" className="text-xl md:text-2xl text-[#8B8375] hover:text-[var(--color-brand-gold)]">WhatsApp</FlipLink>
                <FlipLink href="https://pinterest.com/anandarts" className="text-xl md:text-2xl text-[#8B8375] hover:text-[var(--color-brand-gold)]">Pinterest</FlipLink>
              </div>

              {/* Mobile View (Icons) */}
              <div className="flex md:hidden gap-6 mt-2">
                <a href="https://www.instagram.com/reel/DKQBl6PzG9D/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1F1C18] flex items-center justify-center text-[#8B8375] hover:bg-[var(--color-brand-gold)] hover:text-[#11100D] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="https://www.facebook.com/Anandsingh9268/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1F1C18] flex items-center justify-center text-[#8B8375] hover:bg-[var(--color-brand-gold)] hover:text-[#11100D] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="https://wa.me/918431838722" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1F1C18] flex items-center justify-center text-[#8B8375] hover:bg-[var(--color-brand-gold)] hover:text-[#11100D] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.46-1.761-1.633-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </a>

              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-gold-dim)] mb-8">COLLECTIONS</h4>
            <ul className="flex flex-col gap-4 text-[13px]">
              <li><Link href="/collections?category=Divine+Gods" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Divine Gods
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/collections?category=Divine+Goddess" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Divine Goddess
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/collections?category=Copper" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Copper
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/collections?category=Miniature" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Miniature
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/collections?category=Vintage" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Vintage
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/collections?category=Brass" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Brass
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-gold-dim)] mb-8">CUSTOMER CARE</h4>
            <ul className="flex flex-col gap-4 text-[13px]">
              <li><Link href="/account" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                My Account
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/track-order" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Track order
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/about" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/blogs" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Blogs
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/legal/return-and-exchange" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Return & Exchange
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/legal/refund-policy" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Refund Policy
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/legal/shipping-policy" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Shipping Policy
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/legal/terms-of-service" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Terms & Condition
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:text-[var(--color-brand-gold)] transition-all relative group w-fit">
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
            </ul>
          </div>

          {/* Content & Map */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-gold-dim)] mb-8">VISIT & CONTACT</h4>

            <p className="text-[13px] leading-relaxed mb-6">
              2/4, 10th 'A, Laxmi Narayanpuram,<br />
              Srirampura, Bengaluru, Karnataka 560021
            </p>

            <p className="text-[13px] leading-relaxed mb-2">
              <span className="font-bold text-[var(--color-brand-gold)]">WhatsApp / Phone:</span> <a href="tel:+918754262271" className="hover:text-[var(--color-brand-gold)] transition-colors">+91 87542 62271</a>
            </p>
            <p className="text-[13px] leading-relaxed mb-8">
              <span className="font-bold text-[var(--color-brand-gold)]">Email:</span> <a href="mailto:anandartsandmetalcraft@gmail.com" className="hover:text-[var(--color-brand-gold)] transition-colors">anandartsandmetalcraft@gmail.com</a>
            </p>
            <p className="text-[13px] leading-relaxed mb-8">
              Mon - Sat: 10:00 AM - 7:00 PM<br />
              Sun: By Appointment Only
            </p>

            {/* Live Mini Map Section */}
            <div className="relative w-full h-[120px] rounded-[30px] overflow-hidden border border-white/5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6799390946994!2d77.56150577507681!3d12.992311387324941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17d776f4570d%3A0x10daf66b402a1476!2sAnand%20Arts%20And%20Metal%20Craft!5e0!3m2!1sen!2sin!4v1775375304235!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.7) invert(0.9)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mini Map Bengaluru"
                className="group-hover:filter-none group-hover:brightness-100 transition-all duration-700"
              ></iframe>
              <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                <div className="bg-[var(--color-brand-gold)] w-8 h-8 rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                  <MapPin size={16} className="text-black" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal / Secondary Links */}
      <div className="border-t border-[#2A2621]">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#6B6356]">
            © {new Date().getFullYear()} Anand Arts. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4 text-[#8B8375]">
            <div className="h-[1px] w-8 bg-[#2A2621]"></div>
            <span className="italic font-ui font-semibold">Made with devotion in India <span className="text-[var(--color-brand-gold)] ml-1">IN</span></span>
            <div className="h-[1px] w-8 bg-[#2A2621]"></div>
          </div>

          <div className="flex gap-4 text-[#6B6356]">
            <Banknote size={16} />
            <QrCode size={16} />
            <CreditCard size={16} />
          </div>
        </div>
      </div>
    </footer>
  );
}
