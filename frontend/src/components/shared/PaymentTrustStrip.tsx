import { ShieldCheck } from "lucide-react";
import paymentIcons from "payments-icons-library";

const paymentIconNames = ["paytm", "rupay", "upi", "gpay", "visa", "simpl", "mastercard", "phonepe"];

const paymentIconsList = paymentIconNames
  .map((name) => paymentIcons.getIcon(name, "svg"))
  .filter((icon) => icon.icon_name !== "default");

type PaymentTrustStripProps = {
  compact?: boolean;
  className?: string;
};

export default function PaymentTrustStrip({ compact = false, className = "" }: PaymentTrustStripProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className={`flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 text-blue-800 ${
          compact ? "px-4 py-2" : "px-6 py-3"
        }`}
      >
        <ShieldCheck size={compact ? 13 : 15} className="text-blue-600" />
        <span className="font-ui text-[9px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em]">
          Secured by Cashfree Payments
        </span>
      </div>

      <div className="flex max-w-[320px] flex-wrap items-center justify-center gap-2">
        {paymentIconsList.map((icon) => (
          <span
            key={icon.icon_name}
            className={`flex items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-black/5 ${
              compact ? "h-7 min-w-11 px-2" : "h-8 min-w-12 px-2.5"
            }`}
          >
            <img
              src={icon.icon_url}
              alt={`${icon.icon_name} payment logo`}
              className={`${compact ? "h-4 max-w-[50px]" : "h-[18px] max-w-[56px]"} object-contain`}
              loading="lazy"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
