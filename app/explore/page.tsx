import ExploreScroller from '@/components/ExploreScroller';
import ComingSoonCalendar from '@/components/ComingSoonCalendar';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie } from '@/lib/types';
import { TrendingUp, Star, Heart, Calendar } from 'lucide-react';

export const metadata = {
  title: "Explore – KurdForest",
  description: "Discover trending, top-rated, and upcoming Kurdish movies & TV shows on KurdForest.",
};

async function getTopRatedMovies() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/movie/top_rated');
  return data.results.slice(0, 15);
}

async function getTopRatedTV() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/tv/top_rated');
  return data.results.slice(0, 15);
}

async function getPopularMovies() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/movie/popular');
  return data.results.slice(0, 15);
}

async function getPopularTV() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/tv/popular');
  return data.results.slice(0, 15);
}

async function getTrendingToday() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/trending/all/day');
  return data.results.slice(0, 15);
}

async function getUpcomingMovies() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/movie/upcoming');
  return data.results.slice(0, 30);
}

async function getUpcomingTV() {
  const data: TMDBResponse<TMDBMovie> = await tmdbFetch('/tv/on_the_air');
  return data.results.slice(0, 15);
}

export default async function ExplorePage() {
  const [
    topRatedMovies,
    topRatedTV,
    popularMovies,
    popularTV,
    trendingToday,
    upcomingMovies,
    upcomingTV,
  ] = await Promise.all([
    getTopRatedMovies(),
    getTopRatedTV(),
    getPopularMovies(),
    getPopularTV(),
    getTrendingToday(),
    getUpcomingMovies(),
    getUpcomingTV(),
  ]);

  const allUpcoming = [...upcomingMovies, ...upcomingTV.map(item => ({ ...item, media_type: 'tv' as const }))];

  return (
    <div className="min-h-screen bg-black pt-6 sm:pt-8 pb-24">
      <div className="container-custom mb-8 sm:mb-10">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2" data-testid="text-explore-title">
          Explore
        </h1>
        <p className="text-gray-400 text-sm sm:text-base" data-testid="text-explore-subtitle">
          Discover trending, top-rated, and upcoming content
        </p>
      </div>

      <ExploreScroller
        title={
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <span>Trending Today</span>
          </div>
        }
        items={trendingToday}
        type="movie"
      />

      <ExploreScroller
        title={
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-blue-400" />
            <span>Top Rated Movies</span>
          </div>
        }
        items={topRatedMovies}
        type="movie"
      />

      <ExploreScroller
        title={
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-purple-400" />
            <span>Top Rated TV Shows</span>
          </div>
        }
        items={topRatedTV}
        type="tv"
      />

      <ExploreScroller
        title={
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400" />
            <span>Most Popular Movies</span>
          </div>
        }
        items={popularMovies}
        type="movie"
      />

      <ExploreScroller
        title={
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-400" />
            <span>Most Popular TV Shows</span>
          </div>
        }
        items={popularTV}
        type="tv"
      />

      <ExploreScroller
        title={
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-400" />
            <span>Coming Soon</span>
          </div>
        }
        items={upcomingTV}
        type="tv"
      />

      <ComingSoonCalendar upcomingMovies={allUpcoming} />
    </div>
  );
}
