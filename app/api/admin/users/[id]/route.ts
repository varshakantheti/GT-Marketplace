import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { banned } = body;

    if (banned === undefined) {
      return NextResponse.json(
        { error: 'banned field is required' },
        { status: 400 }
      );
    }

    // In a real app, you'd want to add a banned field to User model
    // For now, we'll just update the user's role or add a flag
    // This is a placeholder - you'd need to add banned field to schema
    const user = await prisma.user.update({
      where: { id },
      data: {
        // Add banned field handling here
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

