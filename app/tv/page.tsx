'use client';

import { useState, useEffect } from 'react';
import VerticalGrid from '@/components/VerticalGrid';
import Pagination from '@/components/Pagination';
import FilterPanel from '@/components/FilterPanel';
import type { TMDBResponse, TMDBMovie, FilterOptions } from '@/lib/types';


export default function TVPage() {
  const [shows, setShows] = useState<TMDBMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: 'popularity.desc' });
  const [useFilters, setUseFilters] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        let url: string;
        
        if (useFilters) {
          const params = new URLSearchParams({ page: currentPage.toString() });
          if (filters.yearFrom) params.append('yearFrom', filters.yearFrom.toString());
          if (filters.yearTo) params.append('yearTo', filters.yearTo.toString());
          if (filters.genres) params.append('genres', filters.genres.join(','));
          if (filters.ratingFrom) params.append('ratingFrom', filters.ratingFrom.toString());
          if (filters.ratingTo) params.append('ratingTo', filters.ratingTo.toString());
          if (filters.sortBy) params.append('sortBy', filters.sortBy);
          
          url = `/api/tmdb/discover?type=tv&${params.toString()}`;
        } else {
          url = `/api/tmdb/list?type=tv&category=popular&page=${currentPage}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch TV shows');
        }
        
        if (!data.results || !Array.isArray(data.results)) {
          throw new Error('Invalid response format');
        }
        
        setShows(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error('Failed to fetch TV shows:', error);
        setError(error instanceof Error ? error.message : 'Failed to load TV shows');
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [currentPage, filters, useFilters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setUseFilters(true);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ sortBy: 'popularity.desc' });
    setUseFilters(false);
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    if (!useFilters) return 'Popular TV Shows';
    
    const parts: string[] = [];
    if (filters.yearFrom && filters.yearTo) {
      parts.push(`${filters.yearFrom}-${filters.yearTo}`);
    }
    if (filters.genres && filters.genres.length > 0) {
      parts.push('Filtered');
    }
    
    return parts.length > 0 ? `${parts.join(' ')} TV Shows` : 'TV Shows';
  };

  return (
    <div className="min-h-screen bg-black pt-6 sm:pt-8">
      <div className="container-custom">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" data-testid="text-page-title">
          {getPageTitle()}
        </h1>
        
        <FilterPanel
          type="tv"
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-400 text-black rounded-md hover-elevate active-elevate-2"
            data-testid="button-retry"
          >
            Retry
          </button>
        </div>
      ) : shows.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">No TV shows found. Try adjusting your filters.</div>
        </div>
      ) : (
        <>
          <VerticalGrid items={shows} type="tv" />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
