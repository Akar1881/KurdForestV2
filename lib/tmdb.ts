import type { FilterOptions } from './types';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export async function tmdbFetch(endpoint: string) {
  // Check if endpoint already has query params
  const hasExistingParams = endpoint.includes('?');
  const url = `${TMDB_BASE_URL}${endpoint}${hasExistingParams ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  
  console.log('[TMDB] Fetching:', endpoint);
  
  const res = await fetch(url, {
    next: { revalidate: 600 }, // Reduced from 3600 to 600 seconds (10 minutes) to prevent stale data
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unable to read error response');
    console.error('[TMDB] API Error:', {
      status: res.status,
      statusText: res.statusText,
      endpoint,
      error: errorText
    });
    throw new Error(`TMDB API Error: ${res.status} - ${res.statusText}`);
  }

  const data = await res.json();
  
  // Log warnings for missing data when using append_to_response
  if (endpoint.includes('append_to_response')) {
    const missing = [];
    if (endpoint.includes('credits') && !data.credits) missing.push('credits');
    if (endpoint.includes('videos') && !data.videos) missing.push('videos');
    if (endpoint.includes('similar') && !data.similar) missing.push('similar');
    
    if (missing.length > 0) {
      console.warn('[TMDB] Missing appended data:', {
        endpoint,
        id: data.id,
        title: data.title || data.name,
        missing
      });
    }
    
    // Log if data exists but is empty
    if (data.credits && (!data.credits.cast || data.credits.cast.length === 0)) {
      console.warn('[TMDB] Empty cast data:', { endpoint, id: data.id, title: data.title || data.name });
    }
    if (data.similar && (!data.similar.results || data.similar.results.length === 0)) {
      console.warn('[TMDB] Empty similar content:', { endpoint, id: data.id, title: data.title || data.name });
    }
  }

  return data;
}

export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500') {
  if (!path) return '/placeholder.png';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function buildDiscoverParams(filters: FilterOptions, type: 'movie' | 'tv'): string {
  const params = new URLSearchParams();
  
  if (filters.yearFrom && filters.yearTo) {
    if (type === 'movie') {
      params.append('primary_release_date.gte', `${filters.yearFrom}-01-01`);
      params.append('primary_release_date.lte', `${filters.yearTo}-12-31`);
    } else {
      params.append('first_air_date.gte', `${filters.yearFrom}-01-01`);
      params.append('first_air_date.lte', `${filters.yearTo}-12-31`);
    }
  }
  
  if (filters.genres && filters.genres.length > 0) {
    params.append('with_genres', filters.genres.join(','));
  }
  
  if (filters.ratingFrom !== undefined) {
    params.append('vote_average.gte', filters.ratingFrom.toString());
  }
  
  if (filters.ratingTo !== undefined) {
    params.append('vote_average.lte', filters.ratingTo.toString());
  }
  
  params.append('vote_count.gte', '100');
  
  if (filters.sortBy) {
    params.append('sort_by', filters.sortBy);
  } else {
    params.append('sort_by', 'popularity.desc');
  }
  
  return params.toString();
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};
