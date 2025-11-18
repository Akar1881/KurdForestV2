'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoreVertical, X } from 'lucide-react';
import { resolvePoster } from '@/lib/tmdb';

interface MediaProgress {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  backdrop_path?: string;
  progress: {
    watched: number;
    duration: number;
  };
  last_season_watched?: string;
  last_episode_watched?: string;
  show_progress?: Record<string, any>;
  last_updated?: number;
}

export default function ContinueWatching() {
  const [watchProgress, setWatchProgress] = useState<Record<string, MediaProgress>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = () => {
      try {
        const data = localStorage.getItem('vidLinkProgress');
        const deletedData = localStorage.getItem('vidLinkProgressDeleted');
        const deletedIds = deletedData ? JSON.parse(deletedData) : [];
        
        if (data) {
          const allProgress = JSON.parse(data);
          const filtered: Record<string, MediaProgress> = {};
          
          Object.keys(allProgress).forEach((id) => {
            if (!deletedIds.includes(id)) {
              filtered[id] = allProgress[id];
            }
          });
          
          setWatchProgress(filtered);
        }
      } catch (error) {
        console.error('Error loading watch progress:', error);
      }
    };

    loadProgress();

    const handleStorageChange = () => {
      loadProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadProgress, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      try {
        const deletedData = localStorage.getItem('vidLinkProgressDeleted');
        const deletedIds = deletedData ? JSON.parse(deletedData) : [];
        
        if (!deletedIds.includes(itemToDelete)) {
          deletedIds.push(itemToDelete);
          localStorage.setItem('vidLinkProgressDeleted', JSON.stringify(deletedIds));
        }
        
        const updated = { ...watchProgress };
        delete updated[itemToDelete];
        setWatchProgress(updated);
      } catch (error) {
        console.error('Error deleting watch progress:', error);
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const getProgressPercentage = (item: MediaProgress): number => {
    if (!item.progress || !item.progress.duration) return 0;
    return Math.min(Math.round((item.progress.watched / item.progress.duration) * 100), 100);
  };

  const getWatchUrl = (item: MediaProgress): string => {
    if (item.type === 'movie') {
      return `/watch/movie/${item.id}`;
    } else {
      const season = item.last_season_watched || '1';
      const episode = item.last_episode_watched || '1';
      return `/watch/tv/${item.id}/${season}/${episode}`;
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const progressItems = Object.values(watchProgress).filter(
    (item) => item.progress && item.progress.duration > 0
  );

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) setOpenMenuId(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    if (deleteDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [deleteDialogOpen]);

  if (progressItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-white text-xl font-bold mb-4 px-4">Continue Watching</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 smooth-scroll">
        {progressItems.map((item) => {
          const percentage = getProgressPercentage(item);
          const isWatched = percentage >= 90;
          const posterUrl = resolvePoster(item.poster_path, 'w300');
          const itemId = String(item.id);

          return (
            <div key={item.id} className="group flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] relative" data-testid={`card-continue-${item.id}`}>
              <Link href={getWatchUrl(item)} className="block">
                <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-gray-800 mb-2 h-[100px] sm:h-[112px] md:h-[125px]">
                  <Image
                    src={posterUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-red-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {isWatched && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                      Watched
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm text-white font-medium line-clamp-2 group-hover:text-gray-300 transition-colors" data-testid={`text-title-${item.id}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-gray-400 text-xs capitalize">{item.type}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{percentage}%</span>
                  </div>
                </div>
              </Link>

              {/* Menu button - always visible at bottom right */}
              <div className="absolute bottom-10 right-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMenu(itemId);
                  }}
                  className="h-6 w-6 flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-sm transition-all"
                  data-testid={`button-menu-${item.id}`}
                >
                  <MoreVertical className="h-3 w-3 text-white" />
                </button>
                
                {openMenuId === itemId && (
                  <div className="absolute bottom-full right-0 mb-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-10 min-w-[200px]">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(itemId);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-800 transition-colors"
                      data-testid={`button-delete-${item.id}`}
                    >
                      <X className="h-4 w-4" />
                      Remove from Continue Watching
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {deleteDialogOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setDeleteDialogOpen(false)}
        >
          <div
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white text-lg font-semibold mb-2">Remove from Continue Watching?</h2>
                <p className="text-gray-400 text-sm">
                  This will remove this item from your continue watching list. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="p-1 hover:bg-gray-800 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                data-testid="button-cancel-delete"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                data-testid="button-confirm-delete"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
