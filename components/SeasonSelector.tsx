import type { Season } from '@/lib/types';

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  onSeasonChange: (seasonNumber: number) => void;
}

export default function SeasonSelector({ seasons, selectedSeason, onSeasonChange }: SeasonSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-white text-sm font-medium mb-2">
        Select Season
      </label>
      <select
        value={selectedSeason}
        onChange={(e) => onSeasonChange(Number(e.target.value))}
        className="w-full bg-gray-900 text-white px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-gray-700 border border-gray-800"
        data-testid="select-season"
      >
        {seasons.map((season) => (
          <option key={season.id} value={season.season_number}>
            {season.name} ({season.episode_count} episodes)
          </option>
        ))}
      </select>
    </div>
  );
}
