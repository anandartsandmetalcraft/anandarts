export const FREE_SHIPPING_THRESHOLD_PAISE = 200_000; // ₹2000
export const STANDARD_SHIPPING_CHARGE_PAISE = 15_000; // ₹150
export const REMOTE_AREA_SURCHARGE_PAISE = 50_000; // ₹500

// Gift wrap is part of checkout totals (taxable), but not "shipping".
export const GIFT_WRAP_FEE_PAISE = 9_900; // ₹99

// India remote zones (simple prefix rules):
// - J&K: 18xxxx, 19xxxx
// - North-East: 78xxxx, 79xxxx
// - Islands: 744xxx (A&N), 682xxx (Lakshadweep)
const REMOTE_PIN_PREFIXES = ["18", "19", "78", "79", "744", "682"] as const;

export function isRemotePincode(pincode: string | null | undefined): boolean {
  const pin = (pincode ?? "").trim();
  if (!pin) return false;
  return REMOTE_PIN_PREFIXES.some((prefix) => pin.startsWith(prefix));
}

export function calculateShippingChargePaise(input: {
  subtotalPaise: number;
  isStorePickup: boolean;
  postalCode?: string | null;
}): number {
  const { subtotalPaise, isStorePickup, postalCode } = input;

  if (isStorePickup) return 0;
  if (isRemotePincode(postalCode)) return REMOTE_AREA_SURCHARGE_PAISE;
  if (subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) return 0;
  return STANDARD_SHIPPING_CHARGE_PAISE;
}

export function remainingForFreeShippingPaise(subtotalPaise: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);
}

export function calculateGiftWrapFeePaise(input: {
  isGiftWrapped: boolean;
  totalQuantity: number;
}): number {
  if (!input.isGiftWrapped) return 0;
  return Math.max(0, input.totalQuantity) * GIFT_WRAP_FEE_PAISE;
}
