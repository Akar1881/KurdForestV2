'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play } from 'lucide-react';
import TrailerModal from '@/components/TrailerModal';
import HorizontalScroller from '@/components/HorizontalScroller';
import { getImageUrl } from '@/lib/tmdb';
import type { MovieDetails, Cast } from '@/lib/types';

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
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
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500">Movie not found</div>
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
      {/* Banner Background */}
      <div className="relative w-full h-[50vh] sm:h-[60vh]">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 -mt-32 relative z-10 pb-8">
        <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-[150px] h-[225px] sm:w-[180px] sm:h-[270px] md:w-[200px] md:h-[300px] rounded-md overflow-hidden bg-gray-900">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3" data-testid="text-movie-title">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-lg font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
              {movie.release_date && (
                <span className="text-gray-400">{new Date(movie.release_date).getFullYear()}</span>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 mb-6 leading-relaxed" data-testid="text-overview">
              {movie.overview}
            </p>

            <div className="flex gap-3">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                  data-testid="button-trailer"
                >
                  <Play className="w-5 h-5" />
                  <span className="font-medium">Trailer</span>
                </button>
              )}
              <Link
                href={`/watch/movie/${id}`}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
                data-testid="button-watch"
              >
                <Play className="w-5 h-5" />
                <span className="font-medium">Watch</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 smooth-scroll max-w-full">
              {cast.map((person: Cast) => (
                <div key={person.id} className="flex-shrink-0 w-24 sm:w-28 md:w-32">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-900 mb-2">
                    <Image
                      src={getImageUrl(person.profile_path, 'w200')}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-sm font-medium text-center line-clamp-1">
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
          <HorizontalScroller title="Similar Movies" items={similar} type="movie" />
        )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <TrailerModal videoKey={trailer.key} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
}
