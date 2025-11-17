'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Bookmark, Heart, Trash2 } from 'lucide-react';
import { useWatchlistContext } from '@/lib/WatchlistContext';
import { getImageUrl } from '@/lib/tmdb';
import type { SavedItem } from '@/lib/types';
import GAClientTracker from '@/components/GAClientTracker';

export default function MyListPage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites'>('watchlist');
  const { watchlist, removeFromWatchlist, favorites, removeFromFavorites } = useWatchlistContext();

  const items = activeTab === 'watchlist' ? watchlist : favorites;
  const removeItem = activeTab === 'watchlist' ? removeFromWatchlist : removeFromFavorites;

  const handleRemove = (id: number, media_type: 'movie' | 'tv') => {
    removeItem(id, media_type);
  };

  return (
    <>
      <GAClientTracker />
      <div className="min-h-screen bg-black pb-4">
        {/* Header with Toggle Buttons */}
        <div className="sticky top-16 sm:top-18 z-40 glass border-b border-gray-800/50 backdrop-blur-lg">
          <div className="container-custom py-4">
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'watchlist'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                data-testid="button-watchlist-tab"
              >
                <Bookmark className="w-5 h-5" />
                <span>Watchlist</span>
                {watchlist.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'watchlist' ? 'bg-black/20 text-black' : 'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {watchlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'favorites'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                data-testid="button-favorites-tab"
              >
                <Heart className="w-5 h-5" />
                <span>Favorites</span>
                {favorites.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === 'favorites' ? 'bg-black/20 text-white' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className={`p-6 rounded-full mb-4 ${
                activeTab === 'watchlist' ? 'bg-yellow-400/10' : 'bg-red-500/10'
              }`}>
                {activeTab === 'watchlist' ? (
                  <Bookmark className="w-12 h-12 text-yellow-400" />
                ) : (
                  <Heart className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">
                Your {activeTab === 'watchlist' ? 'Watchlist' : 'Favorites'} is Empty
              </h2>
              <p className="text-gray-400 text-center max-w-md">
                {activeTab === 'watchlist'
                  ? 'Add movies and shows you want to watch later by clicking the bookmark icon.'
                  : 'Add your favorite movies and shows by clicking the heart icon.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <ItemCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                  onRemove={handleRemove}
                  activeTab={activeTab}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ItemCard({
  item,
  onRemove,
  activeTab,
}: {
  item: SavedItem;
  onRemove: (id: number, media_type: 'movie' | 'tv') => void;
  activeTab: 'watchlist' | 'favorites';
}) {
  const posterUrl = getImageUrl(item.poster_path, 'w300');
  const backdropUrl = getImageUrl(item.backdrop_path, 'w780');
  const title = item.title || item.name || 'Unknown';
  const year = item.release_date
    ? new Date(item.release_date).getFullYear()
    : item.first_air_date
    ? new Date(item.first_air_date).getFullYear()
    : null;

  return (
    <div
      className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
      data-testid={`card-${activeTab}-${item.id}`}
    >
      <Link href={`/${item.media_type}/${item.id}`} className="flex gap-4 p-3 sm:p-4">
        {/* Poster */}
        <div className="flex-shrink-0 relative w-24 h-36 sm:w-28 sm:h-42 rounded-lg overflow-hidden bg-white/5">
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-2 line-clamp-2" data-testid={`text-title-${item.id}`}>
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm capitalize">
                {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
              </span>
              {year && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-sm">{year}</span>
                </>
              )}
              {item.vote_average > 0 && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove(item.id, item.media_type);
        }}
        className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-500/80 rounded-lg backdrop-blur-sm transition-all duration-200 group/btn"
        data-testid={`button-remove-${item.id}`}
        aria-label="Remove from list"
      >
        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </button>
    </div>
  );
}
