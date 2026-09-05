"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.46-1.761-1.633-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
);

export default function ContactPage() {
  const [selectedService, setSelectedService] = useState("sculpture");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    { id: "sculpture", label: "Buying a Sculpture", sub: "Browse our existing collection" },
    { id: "custom", label: "Custom Temple Orders", sub: "Bespoke projects and commissions" },
    { id: "repair", label: "Repair & Restoration", sub: "Maintenance of heritage artifacts" }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.", { duration: 3000 });
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.", { duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate submission & trigger feedback
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
      toast.success("Thank you! Your inquiry has been received by our master curators.", { duration: 4000 });
    } catch {
      toast.error("Unable to submit at the moment. Please email or WhatsApp us directly.", { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#0F1115] pt-32 pb-24 text-[#E8E1D5] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative">
        
        {/* Cinematic Header */}
        <div className="mb-24">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="font-ui text-[11px] font-bold uppercase tracking-[0.6em] text-[var(--color-brand-gold)] block mb-6"
           >
             Direct Channel to the Studio
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="font-display text-6xl md:text-[100px] leading-[0.9] mb-12"
           >
             Let’s discuss your <br />
             <span className="italic font-light text-[var(--color-brand-gold)]">Next Masterpiece</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="max-w-2xl font-ui text-xl text-[#8B8375] leading-relaxed"
           >
             Whether you're acquiring a legacy piece or commissioning a temple shrine, our master artisans are here to guide your vision.
           </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-12">
              <ContactItem 
                icon={<MapPin size={22} />} 
                title="The Studio" 
                detail="2/4, 10th 'A', Laxmi Narayanpuram, Srirampura, Bengaluru, Karnataka 560021" 
              />
              <ContactItem 
                icon={<Mail size={22} />} 
                title="Electronic Mail" 
                detail="anandartsandmetalcrafts@gmail.com"
                link="mailto:anandartsandmetalcrafts@gmail.com"
              />
              <ContactItem 
                icon={<Phone size={22} />} 
                title="Studio Line" 
                detail="+91 84318 38722"
                link="tel:+918431838722"
                sub="Available for calls and WhatsApp inquiries"
              />
            </div>

            <div className="pt-12 border-t border-white/5 flex items-center gap-6">
              <a 
                href="https://www.instagram.com/reel/DKQBl6PzG9D/?utm_source=ig_web_copy_link" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-12 h-12 rounded-full bg-[#16181D] border border-white/10 flex items-center justify-center text-[#8B8375] hover:text-[var(--color-brand-gold)] hover:border-[var(--color-brand-gold)] transition-colors"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://www.facebook.com/Anandsingh9268/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-12 h-12 rounded-full bg-[#16181D] border border-white/10 flex items-center justify-center text-[#8B8375] hover:text-[var(--color-brand-gold)] hover:border-[var(--color-brand-gold)] transition-colors"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://wa.me/918431838722" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                className="w-12 h-12 rounded-full bg-[#16181D] border border-white/10 flex items-center justify-center text-[#8B8375] hover:text-[var(--color-brand-gold)] hover:border-[var(--color-brand-gold)] transition-colors"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Inquiry Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-[#16181D] border border-white/5 p-8 md:p-16 rounded-[2.5rem]">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={36} />
                  </div>
                  <h3 className="font-display text-3xl text-white">Inquiry Received</h3>
                  <p className="text-[#8B8375] max-w-md mx-auto text-sm leading-relaxed">
                    Thank you, <strong>{fullName}</strong>. Our senior artisans have received your note and will get back to you via email within 24 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="mt-6 text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-brand-gold)] hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form className="space-y-12" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-2 group">
                      <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] group-focus-within:text-[var(--color-brand-gold)] transition-colors">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Anand" 
                        className="w-full bg-transparent border-b border-white/10 py-4 font-display text-2xl outline-none focus:border-[var(--color-brand-gold)] transition-all placeholder:text-white/5" 
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] group-focus-within:text-[var(--color-brand-gold)] transition-colors">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@studio.com" 
                        className="w-full bg-transparent border-b border-white/10 py-4 font-display text-2xl outline-none focus:border-[var(--color-brand-gold)] transition-all placeholder:text-white/5" 
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375]">How can we assist you?</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedService(s.id)}
                          className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                            selectedService === s.id 
                              ? 'bg-[var(--color-brand-gold)]/10 border-[var(--color-brand-gold)]' 
                              : 'bg-white/5 border-transparent hover:border-white/10'
                          }`}
                        >
                          <h4 className={`font-ui text-xs font-bold uppercase tracking-wider mb-2 ${selectedService === s.id ? 'text-[var(--color-brand-gold)]' : 'text-white'}`}>
                            {s.label}
                          </h4>
                          <p className="font-ui text-[10px] text-[#8B8375] leading-tight">{s.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-[#8B8375] group-focus-within:text-[var(--color-brand-gold)] transition-colors">Your Vision</label>
                    <textarea 
                      rows={4} 
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the piece you are looking for..." 
                      className="w-full bg-transparent border-b border-white/10 py-4 font-display text-xl outline-none focus:border-[var(--color-brand-gold)] transition-all placeholder:text-white/5 resize-none h-32" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-brand-gold)] text-[#0F1115] font-ui text-[12px] font-bold uppercase tracking-[0.3em] py-6 rounded-full hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Studio Inquiry
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Studio Location Map */}
      <div className="mt-32 max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="bg-[#16181D] p-4 rounded-[3rem] border border-white/5">
          <div className="relative aspect-[21/9] md:aspect-[3/1] rounded-[2.5rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6799390946994!2d77.56150577507681!3d12.992311387324941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17d776f4570d%3A0x10daf66b402a1476!2sAnand%20Arts%20And%20Metal%20Craft!5e0!3m2!1sen!2sin!4v1775375304235!5m2!1sen!2sin"
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen={true} 
               loading="lazy" 
               className="brightness-75 hover:brightness-100 transition-all"
             />
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactItem({ icon, title, detail, link, sub }: any) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="mt-1 text-[var(--color-brand-gold)] group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375] mb-2 block">
          {title}
        </span>
        {link ? (
          <a href={link} className="font-display text-2xl text-white hover:text-[var(--color-brand-gold)] transition-colors">
            {detail}
          </a>
        ) : (
          <p className="font-display text-2xl text-white">
            {detail}
          </p>
        )}
        {sub && <p className="font-ui text-xs text-[#8B8375] mt-2">{sub}</p>}
      </div>
    </div>
  );
}
