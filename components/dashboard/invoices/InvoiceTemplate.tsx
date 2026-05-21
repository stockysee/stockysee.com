import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Font (Optional: can use standard fonts if preferred)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#18181b', // zinc-900
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5', // zinc-100
    paddingBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#71717a', // zinc-500
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBlock: {
    width: '45%',
  },
  infoTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#71717a',
    marginBottom: 6,
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 10,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right' },
  headerCol: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#71717a',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  summaryBlock: {
    width: '40%',
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#18181b',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    width: '60%',
  },
  footerRight: {
    width: '35%',
    textAlign: 'right',
  },
  noteTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#71717a',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 9,
    color: '#52525b',
    lineHeight: 1.4,
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  }
});

interface InvoiceProps {
  order: any;
  client: any;
  invoiceNumber: string;
}

const InvoiceTemplate: React.FC<InvoiceProps> = ({ order, client, invoiceNumber }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {client.logoUrl ? (
              <Image src={client.logoUrl} style={styles.logo} />
            ) : (
              <View style={[styles.logo, { backgroundColor: '#18181b', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>{client.name?.[0]}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
            <Text style={[styles.infoText, { marginTop: 4, color: '#71717a' }]}>
              Tanggal: {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Diterbitkan Oleh</Text>
            <Text style={[styles.infoText, { fontWeight: 'bold' }]}>{client.name}</Text>
            <Text style={styles.infoText}>{client.phone}</Text>
            <Text style={styles.infoText}>{client.email}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Ditagihkan Kepada</Text>
            <Text style={[styles.infoText, { fontWeight: 'bold' }]}>{order.customerName}</Text>
            <Text style={styles.infoText}>{order.customerPhone}</Text>
            <Text style={styles.infoText}>{order.shippingAddress}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCol, styles.colDesc]}>Deskripsi Produk</Text>
            <Text style={[styles.headerCol, styles.colQty]}>Jumlah</Text>
            <Text style={[styles.headerCol, styles.colPrice]}>Harga</Text>
            <Text style={[styles.headerCol, styles.colTotal]}>Total</Text>
          </View>

          {order.items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.infoText, styles.colDesc]}>{item.product.name}</Text>
              <Text style={[styles.infoText, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.infoText, styles.colPrice]}>{formatCurrency(item.price)}</Text>
              <Text style={[styles.infoText, styles.colTotal]}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBlock}>
            <View style={styles.summaryRow}>
              <Text style={styles.infoText}>Subtotal</Text>
              <Text style={styles.infoText}>{formatCurrency(order.totalPrice - (order.shippingCost || 0))}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.infoText}>Biaya Pengiriman</Text>
              <Text style={styles.infoText}>{formatCurrency(order.shippingCost || 0)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>{formatCurrency(order.totalPrice)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.noteTitle}>Metode Pembayaran</Text>
            <Text style={[styles.noteText, { marginBottom: 10, fontWeight: 'bold' }]}>{order.shippingMethod || 'Manual Transfer'}</Text>
            
            <Text style={styles.noteTitle}>Catatan</Text>
            <Text style={styles.noteText}>
              Terima kasih telah berbelanja di {client.name}. Invoice ini merupakan bukti pembayaran yang sah.
            </Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={[styles.noteText, { fontSize: 8, color: '#a1a1aa' }]}>Follow us</Text>
            <View style={styles.socials}>
               {client.socialLinks?.instagram && <Text style={{ fontSize: 8 }}>@{client.socialLinks.instagram}</Text>}
               {client.socialLinks?.tiktok && <Text style={{ fontSize: 8 }}>@{client.socialLinks.tiktok}</Text>}
            </View>
            <Text style={[styles.noteText, { marginTop: 4, fontSize: 7, color: '#d4d4d8' }]}>Powered by Stockysee Engine</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceTemplate;
