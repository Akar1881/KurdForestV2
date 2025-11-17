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
    const data = await tmdbFetch(`/${endpoint}/${id}?append_to_response=credits,videos,similar`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Details API error:', error);
    
    // Handle 404 specifically - content not found in TMDB
    if (error.message?.includes('404')) {
      return NextResponse.json(
        { 
          error: 'Content not found',
          message: 'This movie or TV show does not exist in our database.',
          notFound: true 
        },
        { status: 404 }
      );
    }
    
    // Other errors
    return NextResponse.json(
      { error: 'Failed to fetch details' },
      { status: 500 }
    );
  }
}