import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { reportSchema } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = reportSchema.parse(body);

    // Check if user already reported this
    const existing = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        targetType: validatedData.targetType,
        targetId: validatedData.targetId,
        resolvedAt: null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already reported this item' },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        ...validatedData,
        reporterId: session.user.id,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

