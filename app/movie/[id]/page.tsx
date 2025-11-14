'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Clock, Calendar } from 'lucide-react';
import TrailerModal from '@/components/TrailerModal';
import HorizontalScroller from '@/components/HorizontalScroller';
import { getImageUrl, formatRuntime } from '@/lib/tmdb';
import type { MovieDetails, Cast } from '@/lib/types';

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

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/tmdb/details?id=${id}&type=movie`);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-pulse text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500 text-sm">Movie not found</div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'w1280');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const trailer = movie.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const similar = movie.similar?.results || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] max-h-[700px]">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      </div>

      {/* Content Container */}
      <div className="container-custom -mt-24 sm:-mt-32 md:-mt-40 relative z-10 pb-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-40 h-60 sm:w-48 sm:h-72 md:w-56 md:h-84 lg:w-64 lg:h-96 rounded-xl overflow-hidden bg-card-bg shadow-card-hover border border-card-border">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight" data-testid="text-movie-title">
              {movie.title}
            </h1>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm sm:text-base">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1.5 bg-black/40 glass px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-5 sm:mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-white/10 text-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/10"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-3xl" data-testid="text-overview">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href={`/watch/movie/${id}`}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl button-press font-semibold text-sm sm:text-base"
                data-testid="button-watch"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span>Watch Now</span>
              </Link>
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-center gap-2 glass-light text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 backdrop-blur-md button-press font-medium text-sm sm:text-base"
                  data-testid="button-trailer"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Cast</h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 smooth-scroll">
              {cast.map((person: Cast) => (
                <div key={person.id} className="flex-shrink-0 w-24 sm:w-28 md:w-32">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-card-bg shadow-card mb-2 border border-card-border">
                    <Image
                      src={getImageUrl(person.profile_path, 'w200')}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                    />
                  </div>
                  <p className="text-white text-xs sm:text-sm font-medium text-center line-clamp-2 mb-0.5">
                    {person.name}
                  </p>
                  <p className="text-gray-400 text-xs text-center line-clamp-1">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <HorizontalScroller title="Similar Movies" items={similar} type="movie" />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
}
