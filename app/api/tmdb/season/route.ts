import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const season = searchParams.get('season');

    if (!id || !season) {
      return NextResponse.json(
        { error: 'Missing id or season parameter' },
        { status: 400 }
      );
    }

    const data = await tmdbFetch(`/tv/${id}/season/${season}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Season API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season details' },
      { status: 500 }
    );
  }
}
