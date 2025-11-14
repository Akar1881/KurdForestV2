'use client';

import { useState, useEffect } from 'react';
import { GENRE_MAP } from '@/lib/tmdb';
import type { FilterOptions } from '@/lib/types';
import { ChevronDown, X, Filter } from 'lucide-react';

interface FilterPanelProps {
  type: 'movie' | 'tv';
  onFilterChange: (filters: FilterOptions) => void;
  onClear: () => void;
}

const SORT_OPTIONS = {
  movie: [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'popularity.asc', label: 'Least Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'primary_release_date.desc', label: 'Newest First' },
    { value: 'primary_release_date.asc', label: 'Oldest First' },
    { value: 'original_title.asc', label: 'Title (A-Z)' },
    { value: 'original_title.desc', label: 'Title (Z-A)' },
  ],
  tv: [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'popularity.asc', label: 'Least Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'first_air_date.desc', label: 'Newest First' },
    { value: 'first_air_date.asc', label: 'Oldest First' },
  ],
};

const GENRE_OPTIONS = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
  ],
};

const currentYear = new Date().getFullYear();

export default function FilterPanel({ type, onFilterChange, onClear }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [ratingFrom, setRatingFrom] = useState<string>('');
  const [ratingTo, setRatingTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');

  const genres = GENRE_OPTIONS[type];
  const sortOptions = SORT_OPTIONS[type];

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleApply = () => {
    const filters: FilterOptions = {
      sortBy: sortBy as any,
    };

    if (yearFrom) filters.yearFrom = parseInt(yearFrom);
    if (yearTo) filters.yearTo = parseInt(yearTo);
    if (selectedGenres.length > 0) filters.genres = selectedGenres;
    if (ratingFrom) filters.ratingFrom = parseFloat(ratingFrom);
    if (ratingTo) filters.ratingTo = parseFloat(ratingTo);

    onFilterChange(filters);
    setIsExpanded(false);
  };

  const handleClearFilters = () => {
    setYearFrom('');
    setYearTo('');
    setSelectedGenres([]);
    setRatingFrom('');
    setRatingTo('');
    setSortBy('popularity.desc');
    onClear();
    setIsExpanded(false);
  };

  const hasActiveFilters = yearFrom || yearTo || selectedGenres.length > 0 || ratingFrom || ratingTo || sortBy !== 'popularity.desc';

  return (
    <div className="mb-6 sm:mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 px-5 py-3 bg-card-bg text-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 w-full sm:w-auto border border-card-border button-press"
        data-testid="button-toggle-filters"
      >
        <Filter className="w-5 h-5" />
        <span className="font-semibold">Filters & Sort</span>
        {hasActiveFilters && (
          <span className="bg-yellow-400 text-black text-xs px-2.5 py-1 rounded-full font-bold ml-1">Active</span>
        )}
        <ChevronDown className={`w-5 h-5 ml-auto transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="mt-4 p-5 sm:p-6 bg-card-bg rounded-xl border border-card-border shadow-lg" data-testid="panel-filters">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-3 text-sm sm:text-base">Year Range</label>
              <div className="flex gap-3 flex-wrap items-center">
                <input
                  type="number"
                  min="1900"
                  max={currentYear}
                  placeholder="From"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  className="flex-1 min-w-[120px] bg-black/40 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none transition-colors"
                  data-testid="input-year-from"
                />
                <span className="text-gray-400 text-sm font-medium">to</span>
                <input
                  type="number"
                  min="1900"
                  max={currentYear}
                  placeholder="To"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                  className="flex-1 min-w-[120px] bg-black/40 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none transition-colors"
                  data-testid="input-year-to"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3 text-sm sm:text-base">Genres</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-yellow-400 text-black shadow-glow'
                        : 'bg-black/40 text-white border border-gray-700 hover:bg-white/5 button-press'
                    }`}
                    data-testid={`button-genre-${genre.id}`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3 text-sm sm:text-base">Rating Range (0-10)</label>
              <div className="flex gap-3 flex-wrap items-center">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="From"
                  value={ratingFrom}
                  onChange={(e) => setRatingFrom(e.target.value)}
                  className="flex-1 min-w-[120px] bg-black/40 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none transition-colors"
                  data-testid="input-rating-from"
                />
                <span className="text-gray-400 text-sm font-medium">to</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="To"
                  value={ratingTo}
                  onChange={(e) => setRatingTo(e.target.value)}
                  className="flex-1 min-w-[120px] bg-black/40 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none transition-colors"
                  data-testid="input-rating-to"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3 text-sm sm:text-base">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black/40 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none transition-colors cursor-pointer"
                data-testid="select-sort-by"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 flex-wrap pt-2">
              <button
                onClick={handleApply}
                className="flex-1 min-w-[140px] bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-glow transition-all duration-200 button-press"
                data-testid="button-apply-filters"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 min-w-[140px] bg-black/40 text-white px-6 py-3 rounded-xl font-medium border border-gray-700 hover:bg-white/5 transition-all duration-200 button-press"
                data-testid="button-clear-filters"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
