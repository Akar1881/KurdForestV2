'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import VerticalGrid from '@/components/VerticalGrid';
import Pagination from '@/components/Pagination';
import type { TMDBResponse, TMDBMovie } from '@/lib/types';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}&page=${currentPage}`);
        const data: TMDBResponse<TMDBMovie> = await res.json();
        setResults(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  return (
    <div className="min-h-screen bg-black pt-4">
      <div className="max-w-[1400px] mx-auto">
        <SearchBar />

        {query && (
          <h1 className="text-white text-xl mb-6 px-4" data-testid="text-search-query">
            Search results for: <span className="font-bold">{query}</span>
          </h1>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : !query ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Enter a search query to find movies and TV shows</div>
        </div>
      ) : (
        <>
          <VerticalGrid items={results} type="movie" />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
