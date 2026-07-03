"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Ruler, ShieldCheck, Sparkles, X } from "lucide-react";

const PROMPT_SESSION_KEY = "anand-arts-custom-commission-prompt-shown";
const WHATSAPP_MESSAGE =
  "Hi Anand Arts team, I would like to discuss a custom commission. I have a preferred design/size/material in mind. Please guide me.";
const WHATSAPP_HREF = `https://wa.me/918431838722?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function LoginOfferPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(PROMPT_SESSION_KEY) === "true") {
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(PROMPT_SESSION_KEY, "true");
      setIsVisible(true);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, []);

  const closePrompt = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center px-3 py-5 sm:px-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePrompt}
            className="absolute inset-0 bg-[#11100D]/78 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[92vh] w-full max-w-[430px] overflow-hidden rounded-[26px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.65)] lg:grid lg:max-w-5xl lg:grid-cols-[0.86fr_1.14fr] lg:rounded-[30px]"
          >
            <button
              type="button"
              onClick={closePrompt}
              aria-label="Close custom commission prompt"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black/45 transition-colors hover:bg-black hover:text-white md:right-6 md:top-6"
            >
              <X size={21} strokeWidth={1.7} />
            </button>

            <div className="relative hidden min-h-[620px] overflow-hidden bg-[#1A1208] p-10 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,0.18),transparent_34%),radial-gradient(circle_at_20%_82%,rgba(150,46,36,0.18),transparent_32%)]" />
              <div className="relative z-10 flex w-full max-w-[340px] flex-col items-center text-center">
                <Image
                  src="/Logo3.png"
                  alt="Anand Arts"
                  width={94}
                  height={94}
                  className="rounded-2xl border border-white/10 bg-white shadow-2xl"
                  priority
                />
                <p className="mt-8 font-ui text-sm leading-relaxed text-[#E8E1D5]/70">
                  Your idea, our artisanship. We create custom temple art, idols, and sacred pieces as per your preferred design.
                </p>

                <div className="mt-10 grid w-full gap-4">
                  {[
                    { icon: Palette, title: "Preferred Design", text: "Share a reference, sketch, deity, posture, or finish." },
                    { icon: Ruler, title: "Made to Size", text: "Choose the height, material, and placement need." },
                    { icon: ShieldCheck, title: "Trusted Work", text: "1000+ custom orders crafted as customers required." },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/6 p-4 text-left">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/16 text-[#D4AF37]">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-ui text-[11px] font-bold uppercase tracking-[0.16em] text-white">{item.title}</h3>
                        <p className="mt-1 font-ui text-xs leading-relaxed text-white/52">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto px-5 pb-6 pt-14 sm:px-8 lg:px-14 lg:py-16">
              <div className="lg:hidden">
                <Image src="/Logo3.png" alt="Anand Arts" width={46} height={46} className="rounded-xl border border-black/5" />
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1.5 text-[#8B6B16] lg:mt-0 lg:px-4 lg:py-2">
                <Sparkles size={15} />
                <span className="font-ui text-[9px] font-bold uppercase tracking-[0.18em] lg:text-[10px]">Custom Commissions</span>
              </div>

              <h2 className="mt-5 max-w-xl font-display text-[32px] leading-[1.08] text-[#11100D] sm:text-4xl lg:mt-6 lg:text-5xl">
                Have a custom idol or design in mind?
              </h2>
              <p className="mt-4 max-w-xl font-ui text-sm leading-relaxed text-[#5F574D] sm:text-base lg:mt-5 lg:text-lg">
                We create temple art, idols, and sacred pieces as per your preferred design, size, material, posture, and finish.
              </p>

              <div className="mt-5 grid gap-2 lg:mt-7 lg:grid-cols-3 lg:gap-3">
                {["1000+ custom orders completed", "Direct artisan guidance", "Design, size & material options"].map((label) => (
                  <div key={label} className="rounded-2xl border border-black/5 bg-[#FAF7F0] px-4 py-3">
                    <p className="font-ui text-[11px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#4A3322]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8">
                <Link
                  href="/custom-commissions"
                  onClick={closePrompt}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[#11100D] px-6 py-4 text-center font-ui text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-xl transition-colors hover:bg-[#8B1E1E] sm:text-[12px]"
                >
                  Start Custom Commission
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closePrompt}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-6 py-4 font-ui text-[11px] font-bold uppercase tracking-[0.16em] text-[#136C3A] transition-colors hover:bg-[#25D366] hover:text-white sm:text-[12px]"
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0" />
                  WhatsApp Us
                </a>
              </div>

              <p className="mt-5 border-t border-black/5 pt-4 text-center font-ui text-[10px] leading-relaxed text-[#8B8375] lg:mt-7 lg:pt-5 lg:text-[11px]">
                Custom work depends on design, material, size, and artisan availability.{" "}
                <Link href="/legal/terms-of-service" onClick={closePrompt} className="font-bold text-[#4A3322] underline underline-offset-4">
                  View custom commission terms
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
