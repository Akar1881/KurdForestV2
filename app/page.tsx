import Hero from '@/components/Hero';
import ContinueWatching from '@/components/ContinueWatching';
import HorizontalScroller from '@/components/HorizontalScroller';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie } from '@/lib/types';

async function getTrendingMovies() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/trending/movie/day');
  return data.results.slice(0, 10);
}

async function getTrendingTV() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/trending/tv/day');
  return data.results.slice(0, 10);
}

async function getPopularMovies() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/movie/popular');
  return data.results.slice(0, 10);
}

async function getTopRatedMovies() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/movie/top_rated');
  return data.results.slice(0, 10);
}

async function getTopRatedTV() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/tv/top_rated');
  return data.results.slice(0, 10);
}

export default async function HomePage() {
  const [trendingMovies, trendingTV, popularMovies, topRatedMovies, topRatedTV] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getPopularMovies(),
    getTopRatedMovies(),
    getTopRatedTV(),
  ]);

  // Use trending movies for hero
  const heroItems = trendingMovies.slice(0, 5);

  return (
    <div className="min-h-screen bg-black">
      <Hero items={heroItems} type="movie" />
      
      <div className="py-8 sm:py-10 md:py-12">
        <ContinueWatching />
        <HorizontalScroller title="Trending Movies" items={trendingMovies} type="movie" />
        <HorizontalScroller title="Trending TV Shows" items={trendingTV} type="tv" />
        <HorizontalScroller title="Popular Movies" items={popularMovies} type="movie" />
        <HorizontalScroller title="Top Rated Movies" items={topRatedMovies} type="movie" />
        <HorizontalScroller title="Top Rated TV Shows" items={topRatedTV} type="tv" />
      </div>
    </div>
  );
}
