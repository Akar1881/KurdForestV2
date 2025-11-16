import type { FilterOptions } from './types';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export async function tmdbFetch(endpoint: string) {
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  
  const res = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB API Error: ${res.status}`);
  }

  return res.json();
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

export interface SearchSuggestion {
  id: number;
  title: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
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
