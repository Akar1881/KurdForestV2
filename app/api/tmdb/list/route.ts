import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'movie';
    const category = searchParams.get('category') || 'popular';
    const page = searchParams.get('page') || '1';

    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const data = await tmdbFetch(`/${endpoint}/${category}?page=${page}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('List API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    );
  }
}
