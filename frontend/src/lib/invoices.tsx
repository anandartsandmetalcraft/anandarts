import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

/**
 * Anand Arts & Metal Craft — GST-Compliant Invoice
 * Premium redesign matching UI/UX standard.
 */

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#1A1208", fontFamily: "Helvetica", backgroundColor: "#FFFFFF" },
  
  // Header Section
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 20, borderBottom: "2px solid #1A1208", marginBottom: 30 },
  logoContainer: { width: 80 },
  logo: { width: "100%", height: "auto" },
  companyInfo: { textAlign: "right" },
  companyName: { fontSize: 16, fontWeight: "bold", color: "#1A1208", marginBottom: 4, letterSpacing: 1 },
  companyDetails: { fontSize: 9, color: "#8B8375", marginBottom: 3 },
  goldText: { color: "#B8860B", fontWeight: "bold" },
  
  // Title & Meta Section
  invoiceTitleSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 },
  invoiceTitle: { fontSize: 24, fontWeight: "bold", color: "#1A1208", letterSpacing: 2 },
  statusBadge: { backgroundColor: "#FDF5E6", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, color: "#B8860B", fontSize: 9, fontWeight: "bold" },
  invoiceMeta: { textAlign: "right" },
  invoiceMetaRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 },
  invoiceMetaLabel: { fontSize: 9, color: "#8B8375", width: 70, textAlign: "right", paddingRight: 10 },
  invoiceMetaValue: { fontSize: 10, color: "#1A1208", fontWeight: "bold", width: 120, textAlign: "right" },
  
  // Address Section
  addressesContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40, backgroundColor: "#FDF5E6", padding: 20, borderRadius: 8 },
  addressBlock: { width: "45%" },
  addressTitle: { fontSize: 9, color: "#B8860B", fontWeight: "bold", marginBottom: 8, letterSpacing: 1 },
  addressName: { fontSize: 12, fontWeight: "bold", color: "#1A1208", marginBottom: 4 },
  addressLine: { fontSize: 10, color: "#1A1208", marginBottom: 3, lineHeight: 1.4 },
  
  // Table Section
  table: { width: "100%", marginBottom: 30 },
  tableHeader: { flexDirection: "row", borderBottom: "1px solid #1A1208", paddingBottom: 8, marginBottom: 8 },
  thCol1: { width: "50%", fontSize: 9, fontWeight: "bold", color: "#8B8375" },
  thCol2: { width: "15%", fontSize: 9, fontWeight: "bold", color: "#8B8375", textAlign: "center" },
  thCol3: { width: "15%", fontSize: 9, fontWeight: "bold", color: "#8B8375", textAlign: "right" },
  thCol4: { width: "20%", fontSize: 9, fontWeight: "bold", color: "#8B8375", textAlign: "right" },
  
  tableRow: { flexDirection: "row", borderBottom: "1px solid #EAEAEC", paddingVertical: 12 },
  tdCol1: { width: "50%", fontSize: 10, color: "#1A1208", fontWeight: "bold" },
  tdCol1Desc: { fontSize: 8, color: "#8B8375", marginTop: 4 },
  tdCol2: { width: "15%", fontSize: 10, color: "#1A1208", textAlign: "center" },
  tdCol3: { width: "15%", fontSize: 10, color: "#1A1208", textAlign: "right" },
  tdCol4: { width: "20%", fontSize: 10, color: "#1A1208", textAlign: "right", fontWeight: "bold" },
  
  // Totals Section
  totalsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  paymentInstruction: { width: "40%", padding: 15, backgroundColor: "#FAFAFA", borderRadius: 4, alignSelf: "flex-start" },
  instructionTitle: { fontSize: 9, fontWeight: "bold", color: "#8B8375", marginBottom: 8 },
  instructionText: { fontSize: 9, color: "#1A1208", lineHeight: 1.5 },
  
  totalsBox: { width: "45%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  totalLabel: { fontSize: 10, color: "#8B8375" },
  totalValue: { fontSize: 10, color: "#1A1208", textAlign: "right" },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderTop: "2px solid #1A1208", marginTop: 6 },
  grandTotalLabel: { fontSize: 12, fontWeight: "bold", color: "#1A1208" },
  grandTotalValue: { fontSize: 16, fontWeight: "bold", color: "#1A1208", textAlign: "right" },
  
  // Footer
  footer: { position: "absolute", bottom: 40, left: 40, right: 40 },
  signatureBox: { width: 150, borderTop: "1px solid #1A1208", paddingTop: 8, marginBottom: 30 },
  signatureTitle: { fontSize: 8, color: "#8B8375", textAlign: "center" },
  signatureName: { fontSize: 10, fontWeight: "bold", color: "#1A1208", textAlign: "center", fontStyle: "italic", marginTop: 4 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", borderTop: "1px solid #EAEAEC", paddingTop: 12 },
  footerText: { fontSize: 8, color: "#8B8375" },
});

interface InvoiceProps {
  order: any;
}

export const InvoicePDF = ({ order }: InvoiceProps) => {
  // Invoice number is now set by the email action (AAS001 or AAW001 format)
  // Falls back to the old format only for legacy orders
  const invoiceNumber = order.invoiceNumber || order.invoice?.invoiceNumber || `AAW-${order.orderNumber}`;
  const logoUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/Logo3.png` : "http://localhost:3000/Logo3.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image src={logoUrl} style={styles.logo} />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>ANAND ARTS & METAL CRAFT</Text>
            <Text style={styles.companyDetails}>No. 12, 1st Cross, Srirampura</Text>
            <Text style={styles.companyDetails}>Bengaluru, Karnataka 560021</Text>
            <Text style={styles.companyDetails}>+91 84318 38722  |  support@anandartsandmetalcrafts.com</Text>
            <Text style={[styles.companyDetails, { marginTop: 4 }]}>GSTIN: <Text style={styles.goldText}>29PTJPS2898B1ZQ</Text></Text>
          </View>
        </View>

        {/* Title & Meta Section */}
        <View style={styles.invoiceTitleSection}>
          <View>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.statusBadge}>STATUS: {order.status === "PAID" ? "PAID" : "PENDING"}</Text>
            </View>
          </View>
          <View style={styles.invoiceMeta}>
            <View style={styles.invoiceMetaRow}>
              <Text style={styles.invoiceMetaLabel}>INVOICE NO.</Text>
              <Text style={styles.invoiceMetaValue}>{invoiceNumber}</Text>
            </View>
            <View style={styles.invoiceMetaRow}>
              <Text style={styles.invoiceMetaLabel}>DATE</Text>
              <Text style={styles.invoiceMetaValue}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
            </View>
            <View style={styles.invoiceMetaRow}>
              <Text style={styles.invoiceMetaLabel}>ORDER REF.</Text>
              <Text style={styles.invoiceMetaValue}>{order.orderNumber}</Text>
            </View>
          </View>
        </View>

        {/* Addresses Section */}
        <View style={styles.addressesContainer}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>BILLING TO:</Text>
            <Text style={styles.addressName}>{order.user?.firstName || order.address?.firstName} {order.user?.lastName || order.address?.lastName}</Text>
            {order.companyName && <Text style={styles.addressLine}>{order.companyName}</Text>}
            <Text style={styles.addressLine}>{order.address?.houseNo}, {order.address?.street}</Text>
            <Text style={styles.addressLine}>{order.address?.city}, {order.address?.state} {order.address?.postalCode}</Text>
            {order.address?.phone && <Text style={[styles.addressLine, { marginTop: 4, color: '#8B8375' }]}>Phone: {order.address?.phone}</Text>}
            {order.gstNumber && <Text style={[styles.addressLine, { marginTop: 2, fontWeight: 'bold' }]}>GSTIN: {order.gstNumber}</Text>}
          </View>

          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>SHIPPING TO:</Text>
            {order.notes === "STORE_PICKUP" ? (
              <View>
                <Text style={styles.addressName}>Store Pickup</Text>
                <Text style={styles.addressLine}>Customer will collect from</Text>
                <Text style={styles.addressLine}>Srirampura Studio, Bengaluru</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.addressName}>{order.address?.firstName} {order.address?.lastName}</Text>
                <Text style={styles.addressLine}>{order.address?.houseNo}, {order.address?.street}</Text>
                <Text style={styles.addressLine}>{order.address?.city}, {order.address?.state} {order.address?.postalCode}</Text>
                {order.address?.phone && <Text style={[styles.addressLine, { marginTop: 4, color: '#8B8375' }]}>Phone: {order.address?.phone}</Text>}
              </View>
            )}
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thCol1}>DESCRIPTION</Text>
            <Text style={styles.thCol2}>QTY</Text>
            <Text style={styles.thCol2}>RATE (₹)</Text>
            <Text style={styles.thCol4}>AMOUNT (₹)</Text>
          </View>
          
          {order.items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <View style={{ width: "50%" }}>
                <Text style={styles.tdCol1}>{item.name}</Text>
                {item.product?.hsnCode && <Text style={styles.tdCol1Desc}>HSN: {item.product.hsnCode}</Text>}
              </View>
              <Text style={styles.tdCol2}>{item.quantity}</Text>
              <Text style={styles.tdCol3}>{(item.price / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              <Text style={styles.tdCol4}>{(item.total / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsContainer}>
          <View style={styles.paymentInstruction}>
            <Text style={styles.instructionTitle}>PAYMENT INSTRUCTIONS:</Text>
            <Text style={styles.instructionText}>Method: {order.payments?.[0]?.method || "Online Payment"}</Text>
            <Text style={[styles.instructionText, { marginTop: 8, fontStyle: "italic", color: "#8B8375" }]}>
              All artifacts are carefully inspected. Returns are subject to our standard policy. Items may vary slightly due to handmade nature.
            </Text>
          </View>

          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUB TOTAL (Excl. Tax)</Text>
              <Text style={styles.totalValue}>₹{(order.subtotal / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            {order.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: "#8b0000" }]}>DISCOUNT</Text>
                <Text style={[styles.totalValue, { color: "#8b0000" }]}>- ₹{(order.discount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}

            {order.giftWrapFee > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>GIFT WRAP</Text>
                <Text style={styles.totalValue}>₹{(order.giftWrapFee / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>GST (18%)</Text>
              <Text style={styles.totalValue}>₹{(order.tax / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SHIPPING</Text>
              <Text style={styles.totalValue}>
                {order.shippingCharge === 0 ? (order.notes === "STORE_PICKUP" ? "PICKUP" : "COMPLIMENTARY") : `₹${(order.shippingCharge / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              </Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
              <Text style={styles.grandTotalValue}>₹{(order.total / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>AUTHORIZED SIGNATURE</Text>
            <Text style={styles.signatureName}>For Anand Arts</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Thank you for preserving heritage with us.</Text>
            <Text style={styles.footerText}>Page 1 of 1</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
