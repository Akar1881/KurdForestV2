'use client';

import { SearchSuggestion } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  query: string;
  isVisible: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export default function SearchSuggestions({
  suggestions,
  query,
  isVisible,
  onSelect,
}: SearchSuggestionsProps) {
  if (!isVisible || !query || suggestions.length === 0) {
    return null;
  }

  const getMediaTypeLabel = (mediaType: string) => {
    return mediaType === 'movie' ? 'Movie' : 'TV Show';
  };

  const getYear = (dateString?: string) => {
    if (!dateString) return '';
    const year = new Date(dateString).getFullYear();
    return isNaN(year) ? '' : year;
  };

  return (
    <div className="absolute top-full left-4 right-4 bg-gray-900 border border-yellow-600/70 rounded-lg shadow-xl z-50 mt-2 max-h-64 overflow-y-auto">
      <div className="py-1">
        {suggestions.map((suggestion) => (
          <Link
            key={`${suggestion.media_type}-${suggestion.id}`}
            href={`/${suggestion.media_type}/${suggestion.id}`}
            onClick={() => onSelect(suggestion)}
          >
            <div className="flex items-center px-3 py-2 hover:bg-yellow-600/10 cursor-pointer transition-colors border-b border-yellow-900/30 last:border-b-0">
              {suggestion.poster_path ? (
                <div className="w-8 h-10 flex-shrink-0 mr-3">
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                    alt={suggestion.title}
                    width={32}
                    height={40}
                    className="rounded object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-8 h-10 flex-shrink-0 mr-3 bg-gray-800 rounded flex items-center justify-center border border-yellow-900/30">
                  <span className="text-yellow-800 text-[10px] text-center px-1">No image</span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <span className="text-yellow-50 font-medium truncate text-sm">
                    {suggestion.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {suggestion.release_date && (
                      <span className="text-xs text-yellow-700">
                        {getYear(suggestion.release_date)}
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      suggestion.media_type === 'movie' 
                        ? 'bg-yellow-600 text-yellow-50' 
                        : 'bg-yellow-700 text-yellow-50'
                    }`}>
                      {getMediaTypeLabel(suggestion.media_type)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="border-t border-yellow-600/50 bg-yellow-900/10 sticky bottom-0">
        <Link
          href={`/search?q=${encodeURIComponent(query)}`}
          className="text-yellow-500 hover:text-yellow-400 text-sm font-medium block text-center py-2 px-3 transition-colors"
          onClick={() => onSelect({} as SearchSuggestion)}
        >
          View all results for "{query}"
        </Link>
      </div>
    </div>
  );
}