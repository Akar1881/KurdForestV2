import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { resolvePoster } from '@/lib/tmdb';
import type { Episode } from '@/lib/types';

interface EpisodeListProps {
  episodes: Episode[];
  tvId: number;
  seasonNumber: number;
  filterUnreleased?: boolean;
}

function isEpisodeReleased(episode: Episode): boolean {
  if (!episode.still_path) return false;
  
  if (!episode.air_date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const airDate = new Date(episode.air_date);
  airDate.setHours(0, 0, 0, 0);
  
  return airDate < today;
}

export default function EpisodeList({ episodes, tvId, seasonNumber, filterUnreleased = false }: EpisodeListProps) {
  const displayEpisodes = filterUnreleased 
    ? episodes.filter(isEpisodeReleased)
    : episodes;

  if (displayEpisodes.length === 0) {
    return (
      <div className="bg-gray-900 rounded-md p-8 text-center">
        <p className="text-gray-400">No episodes available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayEpisodes.map((episode) => {
        const imageUrl = resolvePoster(episode.still_path, 'w300');
        const truncatedTitle = episode.name.length > 40
          ? `${episode.name.substring(0, 40)}...`
          : episode.name;

        return (
          <Link
            key={episode.id}
            href={`/watch/tv/${tvId}/${seasonNumber}/${episode.episode_number}`}
            className="flex gap-4 bg-gray-900 rounded-md overflow-hidden hover:bg-gray-800 transition-colors border border-gray-800"
            data-testid={`episode-${episode.episode_number}`}
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 bg-gray-800">
              <Image
                src={imageUrl}
                alt={episode.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 py-3 pr-4 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-white font-semibold text-sm line-clamp-1" data-testid={`text-episode-title-${episode.episode_number}`}>
                  {episode.episode_number}. {truncatedTitle}
                </h3>
                {episode.vote_average > 0 && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-yellow-400 font-semibold">
                      {episode.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              {episode.air_date && (
                <p className="text-gray-500 text-xs mb-1">
                  Aired: {new Date(episode.air_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              )}
              <p className="text-gray-400 text-xs line-clamp-2">
                {episode.overview || 'No description available.'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
