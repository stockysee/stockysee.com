import prisma from "./db";
import { getPlanConfig } from "./plan-limits";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import InvoiceTemplate from "@/components/dashboard/invoices/InvoiceTemplate";
import { uploadToSupabase } from "./storage-helper";

/**
 * Generates and saves a customer invoice to Supabase Storage and Database.
 * Only if the client's plan allows it.
 */
export async function autoGenerateAndSaveInvoice(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        client: true
      }
    });

    if (!order) return null;

    const planConfig = getPlanConfig(order.client.plan);
    if (!planConfig.hasInvoice) return null;

    // Check if invoice already exists
    const existing = await prisma.customerInvoice.findUnique({
      where: { orderId }
    });
    if (existing) return existing;

    // 1. Generate Invoice Number
    const year = new Date().getFullYear();
    const count = await prisma.customerInvoice.count({
      where: { 
        clientId: order.clientId,
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      }
    });
    
    const sequence = (count + 1).toString().padStart(3, '0');
    const invoiceNumber = `INV/${order.client.slug.toUpperCase()}/${year}/${sequence}`;

    // 2. Render PDF to Buffer
    const invoiceDocument = React.createElement(InvoiceTemplate, {
      order,
      client: order.client,
      invoiceNumber,
    }) as React.ReactElement;
    const buffer = await renderToBuffer(invoiceDocument);

    // 3. Upload to Supabase
    const path = `invoices/${order.clientId}/${invoiceNumber.replace(/\//g, '-')}.pdf`;
    const pdfUrl = await uploadToSupabase(path, buffer, 'application/pdf');

    // 4. Save to Database with Snapshot
    const snapshotData = {
      client: {
        name: order.client.name,
        phone: order.client.phone,
        email: order.client.email,
        logoUrl: order.client.logoUrl
      },
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.shippingAddress
      },
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: order.totalPrice,
      shippingCost: order.shippingCost,
      shippingMethod: order.shippingMethod,
      socialLinks: order.client.socialLinks
    };

    const customerInvoice = await prisma.customerInvoice.create({
      data: {
        invoiceNumber,
        pdfUrl,
        orderId,
        clientId: order.clientId,
        snapshotData: snapshotData as any
      }
    });

    console.log(`📄 [INVOICE_AUTO_SAVE] Generated: ${invoiceNumber} for Order: ${orderId}`);
    return customerInvoice;

  } catch (error) {
    console.error("[INVOICE_AUTO_GENERATE_ERROR]", error);
    return null;
  }
}
