import crypto from "crypto";
import axios from "axios";

/**
 * Payment Gateway Helper
 * Cashfree is the primary gateway. PhonePe utilities are retained for legacy compatibility.
 */

// --- Legacy PhonePe Constants ---
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "";
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const BASE_URL = process.env.PHONEPE_BASE_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";

// --- Cashfree Constants ---
const CF_APP_ID = process.env.CASHFREE_APP_ID || "";
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || "";
const CF_ENV = process.env.CASHFREE_ENVIRONMENT || "sandbox"; // sandbox or production
const CF_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";
const CF_BASE_URL = CF_ENV === "production" 
  ? "https://api.cashfree.com/pg/orders" 
  : "https://sandbox.cashfree.com/pg/orders";

// --- Checksum Generation ---
function generateChecksum(payload: string, endpoint: string): string {
  const base64 = Buffer.from(payload).toString("base64");
  const stringToHash = base64 + endpoint + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  return `${sha256}###${SALT_INDEX}`;
}

// --- Initiate Payment ---
interface PaymentInitiateParams {
  transactionId: string;
  userId: string;
  amount: number; // in paise
  callbackUrl: string;
  mobileNumber?: string;
}

export async function initiatePhonePePayment({
  transactionId,
  userId,
  amount,
  callbackUrl,
  mobileNumber,
}: PaymentInitiateParams) {
  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: userId,
    amount: amount,
    redirectUrl: callbackUrl,
    redirectMode: "POST",
    callbackUrl: callbackUrl, // We'll use the same for redirect and server webhook for now
    mobileNumber,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString).toString("base64");
  const checksum = generateChecksum(payloadString, "/pg/v1/pay");

  try {
    const response = await axios.post(
      `${BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    if (response.data.success) {
      return {
        url: response.data.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId: response.data.data.merchantTransactionId,
      };
    } else {
      throw new Error(response.data.message || "Payment initiation failed");
    }
  } catch (error: any) {
    console.error("PhonePe Payment Initiation Error:", error.response?.data || error.message);
    throw new Error("Could not initiate payment. Please try again.");
  }
}

// --- Check Payment Status ---
export async function checkPhonePeStatus(transactionId: string) {
  const endpoint = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
  const stringToHash = endpoint + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = `${sha256}###${SALT_INDEX}`;

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
    });

    return response.data; // Includes code, success, message, and data (transactionId, state, responseCode, amount)
  } catch (error: any) {
    console.error("PhonePe Status Check Error:", error.response?.data || error.message);
    return null;
  }
}

// --- Verify Webhook Checksum ---
export function verifyPhonePeWebhook(base64Payload: string, xVerify: string): boolean {
  const stringToHash = base64Payload + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const expected = `${sha256}###${SALT_INDEX}`;
  return expected === xVerify;
}

// --- Cashfree Payment Gateway ---

interface CashfreeInitiateParams {
  orderId: string;
  orderAmount: number; // in Paise
  customerDetails: {
    customerId: string;
    customerPhone: string;
    customerEmail?: string;
    customerName?: string;
  };
  returnUrl: string;
}

export async function initiateCashfreePayment({
  orderId,
  orderAmount,
  customerDetails,
  returnUrl
}: CashfreeInitiateParams) {
  // Cashfree requires amount in Rupees (decimal)
  const amountInRupees = (orderAmount / 100).toFixed(2);

  const payload = {
    order_id: orderId,
    order_amount: amountInRupees,
    order_currency: "INR",
    customer_details: {
      customer_id: customerDetails.customerId,
      customer_phone: customerDetails.customerPhone,
      customer_email: customerDetails.customerEmail || undefined,
      customer_name: customerDetails.customerName || undefined
    },
    order_meta: {
      return_url: returnUrl
    }
  };

  try {
    const response = await axios.post(CF_BASE_URL, payload, {
      headers: {
        "x-client-id": CF_APP_ID,
        "x-client-secret": CF_SECRET_KEY,
        "x-api-version": CF_VERSION,
        "Content-Type": "application/json"
      }
    });

    if (response.data && response.data.payment_session_id) {
      // For redirect flow, Cashfree usually provides a payments page or we use the session
      // In v3, we can use the payment_session_id to build the checkout URL
      const checkoutUrl = CF_ENV === "production"
        ? `https://payments.cashfree.com/order/${response.data.payment_session_id}`
        : `https://sandbox.cashfree.com/pg/view/checkout/${response.data.payment_session_id}`;

      return {
        url: checkoutUrl,
        paymentSessionId: response.data.payment_session_id,
        orderId: response.data.order_id
      };
    } else {
      throw new Error("Invalid response from Cashfree");
    }
  } catch (error: any) {
    console.error(`[CRITICAL] Cashfree Payment Initiation Error for Order ${orderId}:`, error.response?.data || error.message);
    throw new Error("Payment initiation failed. Please try again or contact support.");
  }
}

export async function checkCashfreeStatus(orderId: string) {
  try {
    const response = await axios.get(`${CF_BASE_URL}/${orderId}`, {
      headers: {
        "x-client-id": CF_APP_ID,
        "x-client-secret": CF_SECRET_KEY,
        "x-api-version": CF_VERSION,
        "Content-Type": "application/json"
      }
    });

    return response.data; // Includes order_status (PAID, ACTIVE, EXPIRED, etc.)
  } catch (error: any) {
    console.error("Cashfree Status Check Error:", error.response?.data || error.message);
    return null;
  }
}
