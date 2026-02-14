import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { format } from "date-fns";
import { InvoiceTemplateProps } from "./types";

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Roboto', fontSize: 10, color: '#333' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  senderDetails: { maxWidth: 200 },
  senderName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 }, 
  senderMeta: { fontSize: 9, color: '#666', lineHeight: 1.4 },
  
  logoContainer: { alignItems: 'flex-end' },
  logo: { width: 100, height: 60, objectFit: 'contain' },

  titleContainer: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  title: { fontSize: 20, fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: 2 },

  metaSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
  billTo: { maxWidth: 250 },
  billToLabel: { fontSize: 8, fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginBottom: 4 },
  clientName: { fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  clientMeta: { fontSize: 9, color: '#666', lineHeight: 1.4 },

  invoiceMeta: { alignItems: 'flex-end' },
  metaRow: { flexDirection: 'row', gap: 20, marginBottom: 4 },
  metaLabel: { fontSize: 9, color: '#888', fontWeight: 'bold' },
  metaValue: { fontSize: 9, fontWeight: 'bold', minWidth: 70, textAlign: 'right' },

  table: { width: '100%', marginTop: 10, marginBottom: 20 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1.5, borderBottomColor: '#000', paddingBottom: 8, marginBottom: 8 },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  
  colDesc: { flex: 4, paddingRight: 10 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right', fontWeight: 'bold' },
  
  headerText: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  cellText: { fontSize: 9 },

  totalsContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  totalsBox: { width: 200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalLabel: { fontSize: 9, color: '#666' },
  totalValue: { fontSize: 9 },
  
  separator: { borderBottomWidth: 1, borderBottomColor: '#eee', marginVertical: 8 },
  
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  grandTotalLabel: { fontSize: 11, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 11, fontWeight: 'bold' },

  footer: { flexDirection: 'row', marginTop: 30, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  footerLeft: { flex: 1, paddingRight: 20 },
  footerRight: { flex: 1, alignItems: 'flex-end' },
  
  footerTitle: { fontSize: 8, fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginBottom: 4 },
  footerText: { fontSize: 8, color: '#666', lineHeight: 1.5 },
  
  watermark: { position: 'absolute', top: 350, left: 90, transform: 'translate(-50%, -50%) rotate(-45deg)', fontWeight: 600, fontSize: 106, color: "#000000", zIndex: -1, textAlign: 'center', opacity: 0.03 },
  branding: { position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#aaa', borderTopWidth: 1, borderTopColor: '#f5f5f5', paddingTop: 10 }
});


export const SimpleMinimalTemplate = ({ data, removeBranding }: InvoiceTemplateProps) => {
    const subTotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subTotal * (data.taxRate || 0)) / 100;
    const discountAmount = data.discount || 0;
    const shippingAmount = data.shipping || 0;
    const total = subTotal + taxAmount + shippingAmount - discountAmount;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: data.currency || 'INR',
        }).format(amount);
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {!removeBranding && (
                    <Text style={styles.watermark}>CHALLAN MAKER</Text>
                )}

                <View style={styles.header}>
                    <View style={styles.senderDetails}>
                        <Text style={styles.senderName}>{data.senderDetails.name}</Text>
                        <Text style={styles.senderMeta}>{data.senderDetails.address}</Text>
                        {data.senderDetails.email && <Text style={styles.senderMeta}>{data.senderDetails.email}</Text>}
                        {data.senderDetails.phone && <Text style={styles.senderMeta}>{data.senderDetails.phone}</Text>}
                    </View>
                    
                    <View style={styles.logoContainer}>
                        {data.logo && (
                            <Image src={data.logo} style={styles.logo} />
                        )}
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>INVOICE</Text>
                </View>

                <View style={styles.metaSection}>
                    <View style={styles.billTo}>
                        {(data.clientDetails.name || data.clientDetails.address) && (
                            <Text style={styles.billToLabel}>Bill To:</Text>
                        )}
                        <Text style={styles.clientName}>{data.clientDetails.name}</Text>
                        <Text style={styles.clientMeta}>{data.clientDetails.address}</Text>
                        {data.clientDetails.email && <Text style={styles.clientMeta}>{data.clientDetails.email}</Text>}
                        {data.clientDetails.phone && <Text style={styles.clientMeta}>{data.clientDetails.phone}</Text>}
                    </View>

                    <View style={styles.invoiceMeta}>
                        {data.invoiceNumber && (
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Invoice No:</Text>
                                <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
                            </View>
                        )}
                        {data.issueDate && (
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Issue Date:</Text>
                                <Text style={styles.metaValue}>{format(new Date(data.issueDate), 'dd MMM yyyy')}</Text>
                            </View>
                        )}
                        {data.dueDate && (
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Due Date:</Text>
                                <Text style={styles.metaValue}>{format(new Date(data.dueDate), 'dd MMM yyyy')}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colDesc, styles.headerText]}>DESCRIPTION</Text>
                        <Text style={[styles.colQty, styles.headerText]}>QTY</Text>
                        <Text style={[styles.colPrice, styles.headerText]}>PRICE</Text>
                        <Text style={[styles.colTotal, styles.headerText]}>AMOUNT</Text>
                    </View>
                    {data.items.map((item, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={[styles.colDesc, styles.cellText]}>{item.description}</Text>
                            <Text style={[styles.colQty, styles.cellText]}>{item.quantity}</Text>
                            <Text style={[styles.colPrice, styles.cellText]}>{formatCurrency(item.unitPrice)}</Text>
                            <Text style={[styles.colTotal, styles.cellText]}>
                                {formatCurrency(item.quantity * item.unitPrice)}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalsContainer}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>{formatCurrency(subTotal)}</Text>
                        </View>
                        {data.taxRate > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Tax ({data.taxRate}%)</Text>
                                <Text style={styles.totalValue}>{formatCurrency(taxAmount)}</Text>
                            </View>
                        )}
                        {data.discount > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={[styles.totalLabel, {color: 'red'}]}>Discount</Text>
                                <Text style={[styles.totalValue, {color: 'red'}]}>-{formatCurrency(discountAmount)}</Text>
                            </View>
                        )}
                        {data.shipping > 0 && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Shipping</Text>
                                <Text style={styles.totalValue}>{formatCurrency(shippingAmount)}</Text>
                            </View>
                        )}
                        
                        <View style={styles.separator} />

                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalLabel}>Total ({data.currency})</Text>
                            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        {(data.bankDetails?.accountNumber || data.bankDetails?.bankName) && (
                            <View style={{ marginBottom: 10 }}>
                                <Text style={styles.footerTitle}>Bank Details</Text>
                                {data.bankDetails.bankName ? <Text style={styles.footerText}>Bank: {data.bankDetails.bankName}</Text> : null}
                                {data.bankDetails.accountNumber ? <Text style={styles.footerText}>Acct: {data.bankDetails.accountNumber}</Text> : null}
                                {data.bankDetails.accountName ? <Text style={styles.footerText}>Name: {data.bankDetails.accountName}</Text> : null}
                                {data.bankDetails.ifscCode ? <Text style={styles.footerText}>IFSC: {data.bankDetails.ifscCode}</Text> : null}
                            </View>
                        )}
                    </View>

                    <View style={styles.footerRight}>
                        <View style={{ alignItems: 'flex-end', maxWidth: 250 }}>
                            <Text style={styles.footerTitle}>Notes</Text>
                            <Text style={[styles.footerText, { textAlign: 'right' }]}>{data.notes}</Text>
                            
                            {data.terms && (
                                <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
                                    <Text style={styles.footerTitle}>Terms</Text>
                                    <Text style={[styles.footerText, { textAlign: 'right' }]}>{data.terms}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                
                {!removeBranding && (
                    <View style={styles.branding}>
                        <Text>Generated for free using Challan Maker</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};
