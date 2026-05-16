"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  MessageSquare,
  Palette,
  Phone,
  User,
  Sparkles,
  Diamond,
  Gem,
  Hammer,
  MapPin,
  Flame,
  Droplet,
  Ruler
} from "lucide-react";

/**
 * Premium Commission Wizard — WhatsApp Redirect Flow
 * ────────────────────────────────────────────────────────────────
 * Redesigned for a truly majestic, pro-level UI.
 * Features: glassmorphism, dynamic glow effects, premium typography,
 * smooth transitions, and a highly polished interaction model.
 * ────────────────────────────────────────────────────────────────
 */

const OWNER_WHATSAPP = "919876543210"; 

const STEPS = [
  { id: "vision", label: "The Vision", icon: MessageSquare },
  { id: "craft", label: "The Craft", icon: Hammer },
  { id: "contact", label: "The Patron", icon: User },
];

const MATERIALS = [
  { id: "Brass", name: "Brass", desc: "Classic & enduring", icon: Flame },
  { id: "Bronze (Panchaloha)", name: "Panchaloha", desc: "Five sacred metals", icon: Gem },
  { id: "Copper", name: "Copper", desc: "Rich & traditional", icon: Droplet },
  { id: "Stone", name: "Stone", desc: "Hand-carved granite", icon: Diamond },
  { id: "Silver", name: "Silver", desc: "Pure & pristine", icon: Sparkles },
  { id: "Wood", name: "Wood", desc: "Warm & intricate", icon: Palette }
];

const SIZES = ['6 - 12"', '12 - 18"', '18 - 24"', '24 - 36"', "Life Size"];
const BUDGETS = ["Under ₹25,000", "₹25,000 – ₹1,00,000", "₹1,00,000 – ₹5,00,000", "₹5,00,000+"];
const IDOL_TYPES = [
  "Ganesh", "Shiva", "Hanuman", "Krishna", "Lakshmi",
  "Saraswati", "Durga", "Nandi", "Nataraja", "Other",
];

export default function CommissionWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Vision
  const [idolType, setIdolType] = useState("");
  const [customIdolType, setCustomIdolType] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Craft
  const [material, setMaterial] = useState("Brass");
  const [dimensions, setDimensions] = useState('12 - 18"');
  const [finish, setFinish] = useState("");

  // Step 3: Contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("Under ₹25,000");
  const [city, setCity] = useState("");

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const canProceed = () => {
    if (currentStep === 0) {
      return (idolType && idolType !== "Other") || (idolType === "Other" && customIdolType.length > 2) ? description.length > 5 : false;
    }
    if (currentStep === 1) {
      return material && dimensions;
    }
    if (currentStep === 2) {
      return name.trim() && phone.trim().length >= 10;
    }
    return true;
  };

  const handleSubmit = () => {
    const idol = idolType === "Other" ? customIdolType : idolType;

    const message = [
      `🙏 *New Sacred Commission Request*`,
      ``,
      `*✧ The Vision*`,
      `*Deity/Form:* ${idol}`,
      `*Details:* ${description}`,
      ``,
      `*✧ The Craft*`,
      `*Material:* ${material}`,
      `*Size:* ${dimensions}`,
      finish ? `*Finish:* ${finish}` : null,
      `*Budget:* ${budget}`,
      ``,
      `*✧ The Patron*`,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      city ? `*Location:* ${city}` : null,
      ``,
      `_Submitted via Anand Arts Gallery_`,
    ]
      .filter(Boolean)
      .join("\n");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Calculate progress for the connecting line
  const progressPercent = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto relative z-10">
      
      {/* ── Premium Stepper ── */}
      <div className="flex justify-between items-center mb-16 md:mb-24 relative px-2 md:px-8">
        {/* Track Background */}
        <div className="absolute top-1/2 left-8 right-8 h-px bg-white/10 -translate-y-1/2 -z-10" />
        {/* Track Progress */}
        <div 
          className="absolute top-1/2 left-8 h-[2px] bg-gradient-to-r from-[var(--color-brand-gold)] to-amber-200 -translate-y-1/2 -z-10 transition-all duration-700 ease-in-out" 
          style={{ width: `calc(${progressPercent}% - 4rem)` }}
        />
        
        {STEPS.map((step, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = currentStep > idx;
          
          return (
            <div key={idx} className="flex flex-col items-center gap-4 relative">
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
                  isActive
                    ? "bg-[#11100D] border-[2px] border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                    : isCompleted
                    ? "bg-[var(--color-brand-gold)] border border-[var(--color-brand-gold)] text-[#11100D]"
                    : "bg-[#1A1814] border border-white/10 text-white/30"
                }`}
              >
                {/* Glow behind active step */}
                {isActive && (
                  <div className="absolute inset-0 bg-[var(--color-brand-gold)]/20 rounded-full blur-md -z-10 animate-pulse" />
                )}
                {isCompleted ? <CheckCircle2 size={24} /> : <step.icon size={22} strokeWidth={isActive ? 2 : 1.5} />}
              </div>
              <span
                className={`absolute top-20 text-center w-32 font-ui text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${
                  isActive ? "text-[var(--color-brand-gold)]" : isCompleted ? "text-white/80" : "text-white/30"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Main Glass Card ── */}
      <div className="relative mt-8 md:mt-0">
        {/* Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[80%] max-h-[80%] bg-[var(--color-brand-gold)]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="bg-[#161410]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Top shimmering edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-gold)]/50 to-transparent opacity-50" />
          
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-brand-gold)]/10 to-transparent opacity-50 rounded-bl-full pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-[420px]"
            >
              {/* ── STEP 1: THE VISION ── */}
              {currentStep === 0 && (
                <div className="space-y-12">
                  <div className="space-y-3 max-w-2xl">
                    <h2 className="font-display text-4xl md:text-5xl text-white drop-shadow-md">
                      Define the Vision
                    </h2>
                    <p className="font-ui text-sm md:text-base text-white/50 leading-relaxed">
                      Select the sacred form and describe the essence of your piece. You can share reference sketches or temple photographs directly with our artisan on WhatsApp later.
                    </p>
                  </div>

                  <div className="space-y-10">
                    {/* Idol Type Selection */}
                    <div className="space-y-5">
                      <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] flex items-center gap-2">
                        <Sparkles size={14} className="text-[var(--color-brand-gold)]" /> Form of Deity
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {IDOL_TYPES.map((type) => {
                          const isSelected = idolType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setIdolType(type)}
                              className={`relative overflow-hidden py-4 px-3 rounded-2xl border transition-all duration-300 font-ui text-[11px] font-bold uppercase tracking-wider group ${
                                isSelected
                                  ? "border-[var(--color-brand-gold)] bg-gradient-to-b from-[var(--color-brand-gold)]/10 to-transparent text-[var(--color-brand-gold)] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                                  : "bg-[#0D0C0A] border-white/5 text-white/40 hover:border-white/20 hover:text-white/80"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute inset-0 bg-[var(--color-brand-gold)]/10 blur-xl"></div>
                              )}
                              <span className="relative z-10">{type}</span>
                            </button>
                          );
                        })}
                      </div>
                      
                      <AnimatePresence>
                        {idolType === "Other" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="relative group"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-brand-gold)]/0 via-[var(--color-brand-gold)]/30 to-[var(--color-brand-gold)]/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-sm"></div>
                            <input
                              type="text"
                              value={customIdolType}
                              onChange={(e) => setCustomIdolType(e.target.value)}
                              placeholder="Please specify the deity or subject..."
                              className="relative w-full bg-[#0D0C0A] border border-white/10 rounded-2xl px-6 py-5 text-base text-white focus:outline-none focus:border-[var(--color-brand-gold)]/60 transition-all placeholder:text-white/20 shadow-inner"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Description */}
                    <div className="space-y-5">
                      <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)]">
                        Detailed Description
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-brand-gold)]/0 via-[var(--color-brand-gold)]/30 to-[var(--color-brand-gold)]/0 rounded-3xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-sm"></div>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe the posture, ornaments, specific mudras, or any traditional style (e.g., Chola bronze style, Antique finish, 4-armed standing position)..."
                          className="relative w-full bg-[#0D0C0A] border border-white/10 rounded-3xl px-6 py-6 text-sm md:text-base text-white focus:outline-none focus:border-[var(--color-brand-gold)]/60 transition-all placeholder:text-white/20 resize-none leading-relaxed shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: THE CRAFT ── */}
              {currentStep === 1 && (
                <div className="space-y-12">
                  <div className="space-y-3 max-w-2xl">
                    <h2 className="font-display text-4xl md:text-5xl text-white drop-shadow-md">
                      Material & Scale
                    </h2>
                    <p className="font-ui text-sm md:text-base text-white/50 leading-relaxed">
                      Choose the physical attributes. Our Master Artisans will advise if the chosen material suits your specific vision during consultation.
                    </p>
                  </div>

                  <div className="space-y-12">
                    {/* Material */}
                    <div className="space-y-5">
                      <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] flex items-center gap-2">
                        <Hammer size={14} /> Sacred Material
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {MATERIALS.map((opt) => {
                          const isSelected = material === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setMaterial(opt.id)}
                              className={`relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 flex flex-col items-start gap-4 group text-left ${
                                isSelected
                                  ? "border-[var(--color-brand-gold)] bg-gradient-to-br from-[var(--color-brand-gold)]/10 to-transparent shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                                  : "bg-[#0D0C0A] border-white/5 hover:border-white/20"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-gold)]/10 blur-2xl rounded-full"></div>
                              )}
                              <div className={`p-3 rounded-2xl transition-colors ${isSelected ? "bg-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)]" : "bg-white/5 text-white/40 group-hover:text-white/80"}`}>
                                <opt.icon size={20} strokeWidth={1.5} />
                              </div>
                              <div>
                                <span className={`block font-ui text-xs font-bold uppercase tracking-widest mb-1 transition-colors ${isSelected ? "text-[var(--color-brand-gold)]" : "text-white/70 group-hover:text-white"}`}>
                                  {opt.name}
                                </span>
                                <span className="block font-script text-sm text-white/40">
                                  {opt.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Size */}
                    <div className="space-y-5">
                      <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] flex items-center gap-2">
                        <Ruler size={14} /> Dimensions
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {SIZES.map((opt) => {
                          const isSelected = dimensions === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setDimensions(opt)}
                              className={`py-5 rounded-2xl border transition-all duration-300 font-ui text-[11px] font-bold uppercase tracking-wider ${
                                isSelected
                                  ? "border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                                  : "bg-[#0D0C0A] border-white/5 text-white/40 hover:border-white/20 hover:text-white/80"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Finish */}
                    <div className="space-y-5">
                      <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)]">
                        Preferred Finish <span className="text-white/30 lowercase tracking-normal">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-brand-gold)]/0 via-[var(--color-brand-gold)]/30 to-[var(--color-brand-gold)]/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-sm"></div>
                        <input
                          type="text"
                          value={finish}
                          onChange={(e) => setFinish(e.target.value)}
                          placeholder="e.g., Antique Patina, High Polish, 24k Gold Gilt..."
                          className="relative w-full bg-[#0D0C0A] border border-white/10 rounded-2xl px-6 py-5 text-base text-white focus:outline-none focus:border-[var(--color-brand-gold)]/60 transition-all placeholder:text-white/20 shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: THE PATRON ── */}
              {currentStep === 2 && (
                <div className="space-y-12">
                  <div className="space-y-3 max-w-2xl">
                    <h2 className="font-display text-4xl md:text-5xl text-white drop-shadow-md">
                      The Patron
                    </h2>
                    <p className="font-ui text-sm md:text-base text-white/50 leading-relaxed">
                      Provide your details to initiate a direct conversation with our Master Artisan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] flex items-center gap-2">
                          <User size={14} /> Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your honorable name"
                          className="w-full bg-transparent border-b border-white/10 py-3 text-xl text-white focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors placeholder:text-white/15"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] flex items-center gap-2">
                          <Phone size={14} /> WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-transparent border-b border-white/10 py-3 text-xl text-white focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors placeholder:text-white/15"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] flex items-center gap-2">
                          <MapPin size={14} /> Location <span className="text-white/30 lowercase tracking-normal text-xs ml-1">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City, Country"
                          className="w-full bg-transparent border-b border-white/10 py-3 text-base text-white focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors placeholder:text-white/15"
                        />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <label className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] flex items-center gap-2">
                        Budget Range
                      </label>
                      <div className="space-y-3">
                        {BUDGETS.map((opt) => {
                          const isSelected = budget === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setBudget(opt)}
                              className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 ${
                                isSelected
                                  ? "bg-[var(--color-brand-gold)]/10 border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                  : "bg-[#0D0C0A] border-white/5 text-white/40 hover:bg-white/5 hover:text-white/70"
                              }`}
                            >
                              <span className="font-ui text-xs md:text-sm font-bold uppercase tracking-widest">
                                {opt}
                              </span>
                              {isSelected && <CheckCircle2 size={18} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-[#0D0C0A]/80 border border-[var(--color-brand-gold)]/20 rounded-3xl p-6 md:p-8 relative overflow-hidden mt-8">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-brand-gold)]" />
                    <h4 className="font-ui text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-gold)] mb-5 flex items-center gap-2">
                      <Sparkles size={12} /> Order Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-white/30 font-ui text-[9px] uppercase tracking-widest mb-1">Subject</p>
                        <p className="text-white font-script text-lg">{idolType === "Other" ? customIdolType : idolType || "—"}</p>
                      </div>
                      <div>
                        <p className="text-white/30 font-ui text-[9px] uppercase tracking-widest mb-1">Material</p>
                        <p className="text-white font-script text-lg">{MATERIALS.find(m => m.id === material)?.name || material}</p>
                      </div>
                      <div>
                        <p className="text-white/30 font-ui text-[9px] uppercase tracking-widest mb-1">Scale</p>
                        <p className="text-white font-script text-lg">{dimensions}</p>
                      </div>
                      <div>
                        <p className="text-white/30 font-ui text-[9px] uppercase tracking-widest mb-1">Investment</p>
                        <p className="text-[var(--color-brand-gold-light)] font-ui text-sm font-bold">{budget}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Footer Navigation ── */}
          <div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 py-3 ${
                currentStep === 0
                  ? "opacity-0 pointer-events-none"
                  : "text-white/40 hover:text-[var(--color-brand-gold)]"
              }`}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="relative group overflow-hidden rounded-full p-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-gold)] via-amber-200 to-[var(--color-brand-gold)] opacity-70 group-hover:opacity-100 transition-opacity duration-500"></span>
                <div className="relative bg-[#161410] px-10 py-4 rounded-full flex items-center gap-3 transition-colors group-hover:bg-[#11100D]">
                  <span className="text-[var(--color-brand-gold)] group-hover:text-amber-200 transition-colors font-ui text-[11px] font-bold uppercase tracking-[0.2em]">
                    Next Step
                  </span>
                  <ArrowRight size={14} className="text-[var(--color-brand-gold)] group-hover:text-amber-200 transition-colors group-hover:translate-x-1 duration-300" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="group bg-[#25D366] text-[#0A3F1B] font-ui text-[12px] font-extrabold uppercase tracking-[0.2em] px-8 md:px-12 py-4 md:py-5 rounded-full hover:bg-[#20bd59] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all duration-300 flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Trust Footer ── */}
      <div className="mt-20 flex flex-wrap justify-center gap-16 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
        <div className="flex flex-col gap-2 items-center">
          <span className="font-display text-2xl text-[var(--color-brand-gold)]">100+</span>
          <span className="font-ui text-[9px] uppercase font-bold tracking-[0.3em] text-white/50">
            Commissions Delivered
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <span className="font-display text-2xl text-[var(--color-brand-gold)]">Authentic</span>
          <span className="font-ui text-[9px] uppercase font-bold tracking-[0.3em] text-white/50">
            Chola Bronze Methods
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <span className="font-display text-2xl text-[var(--color-brand-gold)]">Direct</span>
          <span className="font-ui text-[9px] uppercase font-bold tracking-[0.3em] text-white/50">
            Artisan Consultation
          </span>
        </div>
      </div>
    </div>
  );
}
