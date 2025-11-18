import type { FilterOptions } from './types';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  throw new Error("[TMDB] Missing TMDB_API_KEY in environment");
}

/* ---------------------------------------------
   TMDB FETCH WITH LANGUAGE + IMAGE FALLBACK
---------------------------------------------- */

export async function tmdbFetch(endpoint: string) {
  const hasExistingParams = endpoint.includes('?');

  const url = `${TMDB_BASE_URL}${endpoint}${
    hasExistingParams ? '&' : '?'
  }api_key=${TMDB_API_KEY}&language=en-US&include_image_language=en,en-US,null`;

  console.log('[TMDB] Fetching:', url);

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[TMDB] TMDB ERROR:', {
      status: res.status,
      text,
      endpoint
    });
    throw new Error(`TMDB API Error: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

/* ---------------------------------------------
   IMAGE URL BUILDER WITH SMART FALLBACKS
---------------------------------------------- */

export function getImageUrl(
  path: string | null,
  size: 'w200' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
) {
  if (!path) return '/placeholder.png';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Accepts TMDB item: movie, TV, or similar result
 * Returns best possible image:
 * 1. poster_path
 * 2. fallback to backdrop_path
 * 3. fallback to placeholder
 */
export function resolvePoster(item: any, size: string = 'w500') {
  const path =
    item.poster_path ||
    item.backdrop_path ||
    null;

  return getImageUrl(path, size as any);
}

/* ---------------------------------------------
   DISCOVER FILTER PARAM BUILDER
---------------------------------------------- */

export function buildDiscoverParams(filters: FilterOptions, type: 'movie' | 'tv'): string {
  const params = new URLSearchParams();

  // YEAR RANGE
  if (filters.yearFrom && filters.yearTo) {
    if (type === 'movie') {
      params.append('primary_release_date.gte', `${filters.yearFrom}-01-01`);
      params.append('primary_release_date.lte', `${filters.yearTo}-12-31`);
    } else {
      params.append('first_air_date.gte', `${filters.yearFrom}-01-01`);
      params.append('first_air_date.lte', `${filters.yearTo}-12-31`);
    }
  }

  // GENRES
  if (filters.genres?.length) {
    params.append('with_genres', filters.genres.join(','));
  }

  // RATING
  if (filters.ratingFrom !== undefined) {
    params.append('vote_average.gte', String(filters.ratingFrom));
  }

  if (filters.ratingTo !== undefined) {
    params.append('vote_average.lte', String(filters.ratingTo));
  }

  // AVOID BAD RESULTS
  params.append('vote_count.gte', '100');

  // SORTING
  params.append('sort_by', filters.sortBy ?? 'popularity.desc');

  return params.toString();
}

/* ---------------------------------------------
   UTILITIES
---------------------------------------------- */

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/* ---------------------------------------------
   GENRE MAP
---------------------------------------------- */

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