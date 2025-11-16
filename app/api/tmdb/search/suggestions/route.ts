import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&page=1`);
    
    // Filter and limit results
    const suggestions = data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .slice(0, limit)
      .map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        media_type: item.media_type,
        release_date: item.release_date || item.first_air_date,
        poster_path: item.poster_path,
      }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions API error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}