'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Play } from 'lucide-react';
import TrailerModal from '@/components/TrailerModal';
import HorizontalScroller from '@/components/HorizontalScroller';
import { getImageUrl } from '@/lib/tmdb';
import type { TVDetails, Cast } from '@/lib/types';

export default function TVDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [show, setShow] = useState<TVDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await fetch(`/api/tmdb/details?id=${id}&type=tv`);
        const data = await res.json();
        setShow(data);
      } catch (error) {
        console.error('Failed to fetch TV show details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-gray-500">TV show not found</div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(show.backdrop_path, 'w1280');
  const posterUrl = getImageUrl(show.poster_path, 'w500');
  const trailer = show.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = show.credits?.cast?.slice(0, 10) || [];
  const similar = show.similar?.results || [];
  const seasons = show.seasons.filter(s => s.season_number > 0);

  return (
    <div className="min-h-screen bg-black">
      {/* Banner Background */}
      <div className="relative w-full h-[50vh] sm:h-[60vh]">
        <Image
          src={backdropUrl}
          alt={show.name}
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
                alt={show.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3" data-testid="text-tv-title">
              {show.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              {show.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-lg font-semibold">
                    {show.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
              {show.first_air_date && (
                <span className="text-gray-400">{new Date(show.first_air_date).getFullYear()}</span>
              )}
            </div>

            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map((genre) => (
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
              {show.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
                  data-testid="button-trailer"
                >
                  <Play className="w-5 h-5" />
                  <span className="font-medium">Trailer</span>
                </button>
              )}
              {seasons.length > 0 && (
                <Link
                  href={`/watch/tv/${id}/1/1`}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium"
                  data-testid="button-watch-now"
                >
                  <Play className="w-5 h-5" />
                  <span className="font-medium">Watch Now</span>
                </Link>
              )}
            </div>

            {/* Show Info */}
            {seasons.length > 0 && (
              <div className="bg-gray-900 rounded-md p-4 border border-gray-800">
                <p className="text-gray-300 text-sm">
                  {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''} • 
                  {' '}{seasons.reduce((acc, s) => acc + s.episode_count, 0)} Episodes
                </p>
              </div>
            )}
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

        {/* Similar Shows */}
        {similar.length > 0 && (
          <HorizontalScroller title="Similar TV Shows" items={similar} type="tv" />
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
