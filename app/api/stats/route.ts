import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  let clientId: string | null = null;
  try {
    const { searchParams } = new URL(req.url);
    clientId = await getCurrentClientId();
    
    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Total Revenue (PAID only)
    const revenueData = await prisma.order.aggregate({
      where: { clientId, status: "PAID" },
      _sum: { totalPrice: true }
    });

    // 2. Total Success Orders
    const paidOrders = await prisma.order.count({
      where: { clientId, status: "PAID" }
    });

    // 3. Total Products
    const totalProducts = await prisma.product.count({
      where: { clientId }
    });

    // 4. Total Visitors
    const totalVisitors = await (prisma as any).visitor.count({
      where: { clientId }
    });

    // 5. Pending Orders Count (NEW)
    const pendingCount = await prisma.order.count({
      where: { clientId, status: "PENDING" }
    });

    // 6. Recent Activity (Latest 7)
    const recentOrders = await prisma.order.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 7,
    });

    return NextResponse.json({
      revenue: revenueData._sum.totalPrice || 0,
      paidOrders: paidOrders,
      products: totalProducts,
      visitors: totalVisitors,
      pendingCount: pendingCount,
      trends: {
        revenue: "Total",
        orders: "Total",
        visitors: "Total"
      },
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        amount: o.totalPrice,
        status: o.status,
        time: o.createdAt
      }))
    });
  } catch (error: any) {
    console.error("[STATS_API_ERROR]", error);
    return NextResponse.json({ 
      error: error.message,
      debugClientId: clientId
    }, { status: 500 });
  }
}
