/**
 * Email Templates for Anand Arts
 * Contains highly styled, responsive HTML email templates.
 */

interface OrderItemData {
  name: string;
  quantity: number;
  price: number; // in paise
  image: string;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  date: string;
  items: OrderItemData[];
  subtotal: number; // in paise
  tax: number; // in paise
  shippingCharge: number; // in paise
  total: number; // in paise
  isPickup: boolean;
  address?: string;
  trackingLink?: string;
}

function formatCurrency(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export function generateOrderConfirmationEmail(order: OrderData): string {
  // Brand Colors
  const colors = {
    bg: "#FDF5E6",
    card: "#FFFFFF",
    textMain: "#1A1208",
    textMuted: "#8B8375",
    gold: "#B8860B",
    headerBg: "#11100D",
    border: "#EAEAEC",
  };

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid ${colors.border}; width: 80px;">
        <img src="${item.image}" alt="${item.name}" width="64" height="64" style="border-radius: 8px; object-fit: cover; background-color: #f4f4f4;" />
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid ${colors.border}; vertical-align: middle;">
        <h4 style="margin: 0 0 4px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${colors.textMain}; text-transform: uppercase; letter-spacing: 1px;">
          ${item.name}
        </h4>
        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: ${colors.textMuted};">
          Qty: ${item.quantity}
        </p>
      </td>
      <td style="padding: 16px 0; border-bottom: 1px solid ${colors.border}; vertical-align: middle; text-align: right;">
        <p style="margin: 0; font-family: Georgia, serif; font-size: 14px; color: ${colors.textMain};">
          ${formatCurrency(item.price * item.quantity)}
        </p>
      </td>
    </tr>
  `).join('');

  const shippingInfoHtml = order.isPickup 
    ? `
      <div style="background-color: #F8F9FA; border-left: 4px solid ${colors.gold}; padding: 16px; margin-top: 24px;">
        <h3 style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${colors.textMain}; text-transform: uppercase; letter-spacing: 2px;">
          Store Pickup Selected
        </h3>
        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: ${colors.textMuted}; line-height: 1.5;">
          <strong>Anand Arts & Metal Craft</strong><br/>
          No. 12, 1st Cross, Srirampura<br/>
          Bengaluru, Karnataka 560021<br/>
          <br/>
          <em>Please bring your Order ID and a Bill copy to collect your order.</em>
        </p>
      </div>
    `
    : `
      <div style="margin-top: 24px;">
        <h3 style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 2px;">
          Shipping Address
        </h3>
        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: ${colors.textMain}; line-height: 1.5;">
          ${order.address?.replace(/\n/g, '<br/>') || 'Address not provided'}
        </p>
      </div>
    `;

  const trackingButtonHtml = order.trackingLink
    ? `
      <div style="text-align: center; margin-top: 32px;">
        <a href="${order.trackingLink}" style="display: inline-block; background-color: ${colors.textMain}; color: #FFFFFF; padding: 14px 32px; text-decoration: none; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px;">
          Track Your Order
        </a>
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Anand Arts</title>
      <style>
        body { margin: 0; padding: 0; background-color: ${colors.bg}; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
      </style>
    </head>
    <body style="background-color: ${colors.bg}; margin: 0; padding: 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${colors.bg}; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Card -->
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: ${colors.card}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: ${colors.card}; padding: 30px 40px; border-bottom: 1px solid ${colors.border};">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="left" valign="middle">
                        <img src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/Logo3.png" alt="Anand Arts Logo" width="90" style="display: block; max-width: 100%; height: auto;" />
                      </td>
                      <td align="right" valign="middle" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: ${colors.textMuted}; line-height: 1.6; text-align: right;">
                        <strong style="color: ${colors.textMain}; text-transform: uppercase; letter-spacing: 1px; font-size: 10px;">Anand Arts & Metal Craft</strong><br/>
                        +91 84318 38722<br/>
                        <a href="https://www.instagram.com/reel/DKQBl6PzG9D/" style="color: ${colors.gold}; text-decoration: none; font-weight: 600;">@anandarts</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 48px 40px; position: relative;">
                  
                  <!-- Watermark (Hidden in older Outlook to prevent layout issues) -->
                  <!--[if !mso]><!-->
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.04; z-index: 0; pointer-events: none; text-align: center; width: 100%;">
                    <img src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/Logo3.png" alt="Watermark" width="350" style="max-width: 80%; height: auto; display: inline-block;" />
                  </div>
                  <!--<![endif]-->

                  <div style="position: relative; z-index: 1;">
                    <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 28px; font-weight: normal; color: ${colors.textMain};">
                      Your Order is Confirmed
                    </h2>
                    <p style="margin: 0 0 32px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: ${colors.textMuted}; line-height: 1.6;">
                      Dear ${order.customerName},<br/><br/>
                      Thank you for embracing the heritage of Anand Arts. Your order has been successfully placed and is now being carefully prepared by our artisans.
                    </p>

                    <!-- Order Meta Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAFAFA; border: 1px solid ${colors.border}; border-radius: 4px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0 0 4px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
                          <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${colors.textMain};">${order.orderNumber}</p>
                        </td>
                        <td style="padding: 16px; text-align: right;">
                          <p style="margin: 0 0 4px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 1px;">Order Date</p>
                          <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${colors.textMain};">${order.date}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Order Items -->
                    <h3 style="margin: 0 0 16px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid ${colors.textMain}; padding-bottom: 8px;">
                      Order Details
                    </h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      ${itemsHtml}
                    </table>

                    <!-- Totals -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: ${colors.textMuted};">Subtotal</td>
                        <td style="padding: 8px 0; text-align: right; font-family: Georgia, serif; font-size: 14px; color: ${colors.textMain};">${formatCurrency(order.subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: ${colors.textMuted};">GST Included</td>
                        <td style="padding: 8px 0; text-align: right; font-family: Georgia, serif; font-size: 14px; color: ${colors.textMain};">${formatCurrency(order.tax)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: ${colors.textMuted};">Shipping</td>
                        <td style="padding: 8px 0; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${order.shippingCharge === 0 ? '#166534' : colors.textMain};">
                          ${order.shippingCharge === 0 ? (order.isPickup ? 'STORE PICKUP' : 'COMPLIMENTARY') : formatCurrency(order.shippingCharge)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 0 0; border-top: 2px solid ${colors.textMain}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${colors.textMain}; text-transform: uppercase; letter-spacing: 1px;">Grand Total</td>
                        <td style="padding: 16px 0 0 0; border-top: 2px solid ${colors.textMain}; text-align: right; font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: ${colors.textMain};">${formatCurrency(order.total)}</td>
                      </tr>
                    </table>

                    ${shippingInfoHtml}
                    
                    ${trackingButtonHtml}
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: ${colors.bg}; padding: 32px 40px; border-top: 1px solid ${colors.border};">
                  <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: ${colors.textMuted};">
                    Need assistance? Contact our master curators.
                  </p>
                  <p style="margin: 0 0 16px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; color: ${colors.gold};">
                    support@anandartsandmetalcrafts.com | +91 84318 38722
                  </p>
                  <p style="margin: 0; font-family: Georgia, serif; font-size: 10px; font-style: italic; color: #A0A0A0;">
                    "Preserving Heritage, Crafting Devotion"
                  </p>
                </td>
              </tr>

            </table>
            
            <p style="margin: 24px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; color: #B0B0B0; text-align: center;">
              © ${new Date().getFullYear()} Anand Arts & Metal Craft. All rights reserved.<br/>
              No. 12, 1st Cross, Srirampura, Bengaluru, Karnataka 560021
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
