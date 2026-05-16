export type CouponLike = {
  code: string;
  discount: string;
  startDate: Date | string;
  endDate: Date | string;
  status?: string;
};

export function isCouponExpired(coupon: CouponLike, now = new Date()) {
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);
  const status = String(coupon.status || "").toUpperCase();

  return status !== "ACTIVE" || now < startDate || now > endDate;
}

export function parseCouponDiscount(discount: string) {
  const value = String(discount || "").trim();

  if (!value) {
    return { type: "AMOUNT" as const, value: 0 };
  }

  if (value.endsWith("%")) {
    const percent = Number.parseFloat(value.replace("%", ""));
    return {
      type: "PERCENT" as const,
      value: Number.isFinite(percent) ? Math.max(0, percent) : 0,
    };
  }

  const amount = Number.parseFloat(value.replace(/[₹,\s]/g, ""));
  return {
    type: "AMOUNT" as const,
    value: Number.isFinite(amount) ? Math.max(0, amount) : 0,
  };
}

export function formatCouponDiscount(discount: string) {
  const parsed = parseCouponDiscount(discount);

  if (parsed.type === "PERCENT") {
    return `${parsed.value}% OFF`;
  }

  return `₹${Math.round(parsed.value).toLocaleString("en-IN")} OFF`;
}
