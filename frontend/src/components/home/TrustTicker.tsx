export default function TrustTicker() {
  const content = [
    "✦ Authentic Copper and Antique",
    "✦ Free Shipping Above ₹2000",
    "✦ Custom Commissions Welcome",
    "✦ Handcrafted by Indian Artisans",
    "✦ Secure Payments on All Orders",
    "✦ Shipment Tracking on All Orders"
  ].join("  ·  ");

  return (
    <div className="w-full bg-[var(--color-brand-char)] text-[var(--color-brand-gold-light)] py-3 overflow-hidden border-t border-[var(--color-brand-gold)]/10 font-ui text-[13px] tracking-wide relative z-20">
      <div className="flex whitespace-nowrap animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
        <span className="mx-4">{content}</span>
        <span className="mx-4">{content}</span>
      </div>
    </div>
  );
}
