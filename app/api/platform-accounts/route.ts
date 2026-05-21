import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    let accounts = await prisma.platformAccount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });

    // If empty, return defaults so frontend doesn't break
    if (accounts.length === 0) {
      accounts = [
        { id: '1', name: 'GoPay', accountNumber: '081331019725', accountOwner: 'Nur', logoUrl: '/gopay.jpg', type: 'wallet', isActive: true } as any,
        { id: '2', name: 'Dana', accountNumber: '081331019725', accountOwner: 'Nur', logoUrl: '/dana.jpg', type: 'wallet', isActive: true } as any
      ];
    }

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("GET Public Platform Accounts Error:", error);
    // Even on error, return defaults so registration doesn't break
    const defaults = [
      { id: '1', name: 'GoPay', accountNumber: '081331019725', accountOwner: 'Nur', logoUrl: '/gopay.jpg', type: 'wallet', isActive: true },
      { id: '2', name: 'Dana', accountNumber: '081331019725', accountOwner: 'Nur', logoUrl: '/dana.jpg', type: 'wallet', isActive: true }
    ];
    return NextResponse.json(defaults);
  }
}
