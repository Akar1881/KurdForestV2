import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      );
    }

    const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
    
    // Filter only movies and TV shows
    const filtered = {
      ...data,
      results: data.results.filter((item: any) => 
        item.media_type === 'movie' || item.media_type === 'tv'
      ),
    };
    
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}
