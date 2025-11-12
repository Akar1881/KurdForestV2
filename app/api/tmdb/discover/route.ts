import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch, buildDiscoverParams } from '@/lib/tmdb';
import type { FilterOptions } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'movie';
    const page = searchParams.get('page') || '1';
    
    const filters: FilterOptions = {
      yearFrom: searchParams.get('yearFrom') ? parseInt(searchParams.get('yearFrom')!) : undefined,
      yearTo: searchParams.get('yearTo') ? parseInt(searchParams.get('yearTo')!) : undefined,
      genres: searchParams.get('genres') ? searchParams.get('genres')!.split(',').map(Number) : undefined,
      ratingFrom: searchParams.get('ratingFrom') ? parseFloat(searchParams.get('ratingFrom')!) : undefined,
      ratingTo: searchParams.get('ratingTo') ? parseFloat(searchParams.get('ratingTo')!) : undefined,
      sortBy: searchParams.get('sortBy') as any,
    };
    
    const filterParams = buildDiscoverParams(filters, type as 'movie' | 'tv');
    const data = await tmdbFetch(`/discover/${type}?${filterParams}&page=${page}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Discover API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discover results' },
      { status: 500 }
    );
  }
}
