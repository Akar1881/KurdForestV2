export interface TMDBMovie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: Genre[];
  media_type?: 'movie' | 'tv';
}

export interface TMDBTVShow extends TMDBMovie {
  name: string;
  first_air_date: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieDetails extends TMDBMovie {
  runtime: number;
  genres: Genre[];
  credits?: {
    cast: Cast[];
  };
  videos?: {
    results: Video[];
  };
  similar?: TMDBResponse<TMDBMovie>;
}

export interface TVDetails extends TMDBTVShow {
  number_of_seasons: number;
  seasons: Season[];
  genres: Genre[];
  credits?: {
    cast: Cast[];
  };
  videos?: {
    results: Video[];
  };
  similar?: TMDBResponse<TMDBTVShow>;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  vote_average: number;
  air_date: string;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface SubtitleStatus {
  processId: string;
  status: 'starting' | 'fetching_imdb' | 'searching_subs' | 'downloading' | 'translating' | 'finalizing' | 'converting' | 'complete' | 'failed' | 'retrying' | 'processing' | 'from_cache';
  subtitleUrl?: string;
  error?: string;
  fromCache?: boolean;
  progress?: number;
}

export interface FilterOptions {
  yearFrom?: number;
  yearTo?: number;
  genres?: number[];
  ratingFrom?: number;
  ratingTo?: number;
  sortBy?: 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'primary_release_date.desc' | 'primary_release_date.asc' | 'first_air_date.desc' | 'first_air_date.asc' | 'original_title.asc' | 'original_title.desc';
}

// Add these missing types for SearchBar
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

export interface SavedItem {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  addedAt: number;
}