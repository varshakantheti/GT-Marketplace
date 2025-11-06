import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { messageSchema } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Create or get thread
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, sellerId } = body;

    if (!listingId || !sellerId) {
      return NextResponse.json(
        { error: 'Listing ID and seller ID are required' },
        { status: 400 }
      );
    }

    if (sellerId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot message yourself' },
        { status: 400 }
      );
    }

    // Find or create thread
    let thread = await prisma.messageThread.findUnique({
      where: {
        buyerId_sellerId_listingId: {
          buyerId: session.user.id,
          sellerId,
          listingId,
        },
      },
    });

    if (!thread) {
      thread = await prisma.messageThread.create({
        data: {
          buyerId: session.user.id,
          sellerId,
          listingId,
        },
      });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    );
  }
}

// Get user's threads
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const threads = await prisma.messageThread.findMany({
      where: {
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id },
        ],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}

