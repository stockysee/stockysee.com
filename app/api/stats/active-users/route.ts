import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const totalClients = await prisma.client.count();
    // Start from +25 as requested
    const displayCount = totalClients + 25;

    return NextResponse.json({ count: displayCount });
  } catch (error) {
    console.error('Error fetching client count:', error);
    return NextResponse.json({ count: 0 });
  }
}
