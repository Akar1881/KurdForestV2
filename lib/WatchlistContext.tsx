'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SavedItem } from './types';

interface WatchlistContextType {
  watchlist: SavedItem[];
  favorites: SavedItem[];
  addToWatchlist: (item: Omit<SavedItem, 'addedAt'>) => void;
  removeFromWatchlist: (id: number, media_type: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, media_type: 'movie' | 'tv') => boolean;
  addToFavorites: (item: Omit<SavedItem, 'addedAt'>) => void;
  removeFromFavorites: (id: number, media_type: 'movie' | 'tv') => void;
  isInFavorites: (id: number, media_type: 'movie' | 'tv') => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<SavedItem[]>([]);
  const [favorites, setFavorites] = useState<SavedItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedWatchlist = localStorage.getItem('watchlist');
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedWatchlist) {
      try {
        setWatchlist(JSON.parse(storedWatchlist));
      } catch (e) {
        console.error('Failed to parse watchlist:', e);
      }
    }
    
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Listen to storage events for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'watchlist' && e.newValue) {
        try {
          setWatchlist(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to parse watchlist from storage event:', err);
        }
      } else if (e.key === 'favorites' && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to parse favorites from storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToWatchlist = (item: Omit<SavedItem, 'addedAt'>) => {
    const newItem: SavedItem = { ...item, addedAt: Date.now() };
    const updated = [newItem, ...watchlist.filter(i => !(i.id === item.id && i.media_type === item.media_type))];
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  const removeFromWatchlist = (id: number, media_type: 'movie' | 'tv') => {
    const updated = watchlist.filter(i => !(i.id === id && i.media_type === media_type));
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  const isInWatchlist = (id: number, media_type: 'movie' | 'tv') => {
    return watchlist.some(i => i.id === id && i.media_type === media_type);
  };

  const addToFavorites = (item: Omit<SavedItem, 'addedAt'>) => {
    const newItem: SavedItem = { ...item, addedAt: Date.now() };
    const updated = [newItem, ...favorites.filter(i => !(i.id === item.id && i.media_type === item.media_type))];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeFromFavorites = (id: number, media_type: 'movie' | 'tv') => {
    const updated = favorites.filter(i => !(i.id === id && i.media_type === media_type));
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isInFavorites = (id: number, media_type: 'movie' | 'tv') => {
    return favorites.some(i => i.id === id && i.media_type === media_type);
  };

  // Don't render children until initialized to avoid hydration mismatches
  if (!isInitialized) {
    return null;
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        favorites,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlistContext() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlistContext must be used within a WatchlistProvider');
  }
  return context;
}
