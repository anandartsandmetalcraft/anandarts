import { z } from "zod";

// =============================================================
// AUTH SCHEMAS
// =============================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const phoneOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PhoneOtpInput = z.infer<typeof phoneOtpSchema>;

// =============================================================
// USER PROFILE SCHEMA
// =============================================================

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
});

export type UserUpdateInput = z.infer<typeof userSchema>;

// =============================================================
// ADDRESS SCHEMAS
// =============================================================

export const addressSchema = z.object({
  label: z.string().max(20).optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  houseNo: z.string().min(1, "House/flat number is required"),
  street: z.string().min(1, "Street is required"),
  landmark: z.string().max(100).optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// =============================================================
// PRODUCT SCHEMAS (Admin CRUD)
// =============================================================

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().max(5000).optional(),
  material: z.string().max(100).optional().nullable(),
  size: z.string().min(1, "Size is required"),
  heightInInches: z.number().positive().optional().nullable(),
  weight: z.string().optional(),
  hsnCode: z.string().max(10).optional(),
  price: z.number().int().positive("Price must be positive"), // in paise
  compareAt: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  tag: z.string().max(30).optional(),
  couponCode: z.string().max(50).optional().nullable(),
  categoryId: z.string().cuid("Invalid category"),
  isActive: z.boolean().default(true),
});

export const productImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().max(200).optional(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;

// =============================================================
// ORDER / CHECKOUT SCHEMAS
// =============================================================

export const checkoutSchema = z.object({
  addressId: z.string().cuid("Select a delivery address").optional().nullable(),
  couponCode: z.string().max(50).optional().nullable(),
  gstNumber: z
    .string()
    .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}[A-Z\d]{1}$/, "Invalid GSTIN")
    .optional()
    .nullable(),
  companyName: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional(),
  isGiftWrapped: z.boolean().optional(),
});

export const orderStatusUpdateSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum([
    "CONFIRMED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
  trackingId: z.string().optional(),
  trackingUrl: z.string().url().optional(),
  shippingCarrier: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

// =============================================================
// CATEGORY SCHEMA
// =============================================================

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// =============================================================
// REVIEW SCHEMA
// =============================================================

export const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

// =============================================================
// QUERY / FILTER SCHEMAS
// =============================================================

export const catalogQuerySchema = z.object({
  category: z.string().optional(),
  material: z.string().optional(),
  size: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
  minHeight: z.coerce.number().min(0).optional(),
  maxHeight: z.coerce.number().positive().optional(),
  search: z.string().max(100).optional(),
  sort: z
    .enum(["featured", "price_asc", "price_desc", "newest"])
    .default("featured"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(18),
});

export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
