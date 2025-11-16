import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'movie';

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    const endpoint = type === 'movie' ? 'movie' : 'tv';
    // This should work now with the fixed tmdbFetch
    const data = await tmdbFetch(`/${endpoint}/${id}?append_to_response=credits,videos,similar`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch details' },
      { status: 500 }
    );
  }
}