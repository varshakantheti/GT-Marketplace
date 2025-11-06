import { NextRequest, NextResponse } from 'next/server';
import { moderateContent, enhanceListingDescription } from '@/lib/gemini';

// Content moderation endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, title, description } = body;

    if (action === 'moderate') {
      if (!text) {
        return NextResponse.json(
          { error: 'Text is required for moderation' },
          { status: 400 }
        );
      }

      const result = await moderateContent(text);
      return NextResponse.json(result);
    }

    if (action === 'enhance') {
      if (!title || !description) {
        return NextResponse.json(
          { error: 'Title and description are required for enhancement' },
          { status: 400 }
        );
      }

      const enhanced = await enhanceListingDescription(title, description);
      return NextResponse.json({ enhanced });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "moderate" or "enhance"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

