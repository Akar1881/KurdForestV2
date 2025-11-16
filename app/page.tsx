// page.tsx - Updated home page
import Hero from '@/components/Hero';
import ContinueWatching from '@/components/ContinueWatching';
import HorizontalScroller from '@/components/HorizontalScroller';
import TrendingNow from '@/components/TrendingNow';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie } from '@/lib/types';

export const metadata = {
  title: "KurdForest – Kurdish Movies & TV Shows",
  description: "Watch Kurdish movies and TV shows online on KurdForest.",
  keywords: "kurdforest, kurd forest, Kurdish movies, Kurdish TV shows",
  authors: [{ name: 'KurdForest', url: 'https://www.kurdforest.xyz' }],
  openGraph: {
    title: "KurdForest – Kurdish Movies & TV Shows",
    description: "Watch Kurdish movies and TV shows online on KurdForest.",
    url: 'https://www.kurdforest.xyz',
    siteName: 'KurdForest',
    images: [
      {
        url: 'https://www.kurdforest.xyz/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KurdForest Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

async function getTrendingMovies() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/trending/movie/day');
  return data.results.slice(0, 10);
}

async function getTrendingTV() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/trending/tv/day');
  return data.results.slice(0, 10);
}

async function getTrendingAll() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/trending/all/week');
  return data.results.slice(0, 5);
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
  const [trendingMovies, trendingTV, trendingAll, popularMovies, topRatedMovies, topRatedTV] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getTrendingAll(),
    getPopularMovies(),
    getTopRatedMovies(),
    getTopRatedTV(),
  ]);

  // Combine trending movies and TV shows for the trending section
  const trendingItems = [...trendingMovies.slice(0, 5), ...trendingTV.slice(0, 5)];
  
  // Use trending all for hero
  const heroItems = trendingAll.slice(0, 5);

  return (
    <div className="min-h-screen bg-black">
      <Hero items={heroItems} type="mixed" />
      
      <div className="py-8 sm:py-10 md:py-12">
        <ContinueWatching />
        <TrendingNow items={trendingItems} />
        <HorizontalScroller title="Popular Movies" items={popularMovies} type="movie" />
        <HorizontalScroller title="Top Rated Movies" items={topRatedMovies} type="movie" />
        <HorizontalScroller title="Top Rated TV Shows" items={topRatedTV} type="tv" />
      </div>
    </div>
  );
}