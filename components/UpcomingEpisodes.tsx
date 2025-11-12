import { Calendar, Clock } from 'lucide-react';
import type { Episode } from '@/lib/types';

interface UpcomingEpisodesProps {
  episodes: Episode[];
  tvId: number;
  seasonNumber: number;
}

function getDayOfWeek(dateString: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  return days[date.getDay()];
}

function getCountdownMessage(airDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const air = new Date(airDate);
  air.setHours(0, 0, 0, 0);
  
  const diffTime = air.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Should be available now, check again later';
  } else if (diffDays === 1) {
    return 'Next episode will air in 1 day';
  } else if (diffDays > 1) {
    return `Next episode will air in ${diffDays} days`;
  } else {
    return 'Episode recently aired';
  }
}

export default function UpcomingEpisodes({ episodes, tvId, seasonNumber }: UpcomingEpisodesProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEpisodes = episodes.filter(ep => {
    if (!ep.air_date) return false;
    const airDate = new Date(ep.air_date);
    airDate.setHours(0, 0, 0, 0);
    return airDate >= today;
  }).sort((a, b) => new Date(a.air_date).getTime() - new Date(b.air_date).getTime());

  if (upcomingEpisodes.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-4">Upcoming Episodes</h2>
      <div className="space-y-4">
        {upcomingEpisodes.map((episode) => {
          const airDate = new Date(episode.air_date);
          const formattedDate = airDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          const dayOfWeek = getDayOfWeek(episode.air_date);
          const countdownMessage = getCountdownMessage(episode.air_date);

          return (
            <div
              key={episode.id}
              className="bg-gray-900 rounded-md p-4 border border-gray-800"
              data-testid={`upcoming-episode-${episode.episode_number}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">
                    S{seasonNumber}E{episode.episode_number}: {episode.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-3 mb-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedDate} ({dayOfWeek})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{countdownMessage}</span>
                  </div>
                </div>
              </div>
              
              {episode.overview && (
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  {episode.overview}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
