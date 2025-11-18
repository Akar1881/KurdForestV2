'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
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
  isSyncing: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  syncData: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const [watchlist, setWatchlist] = useState<SavedItem[]>([]);
  const [favorites, setFavorites] = useState<SavedItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Only sync ONCE per page load
  useEffect(() => {
    if (session.status !== 'authenticated') {
      // Not authenticated, load from localStorage
      loadFromLocalStorage();
      setIsInitialized(true);
      return;
    }

    const syncOnce = async () => {
      setIsSyncing(true);
      try {
        const res = await fetch('/api/watchlist/sync');
        if (res.ok) {
          const data = await res.json();
          setWatchlist(data.watchlist || []);
          setFavorites(data.favorites || []);
          // Update localStorage as cache
          localStorage.setItem('watchlist', JSON.stringify(data.watchlist || []));
          localStorage.setItem('favorites', JSON.stringify(data.favorites || []));
        } else {
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error('Failed to sync watchlist:', err);
        loadFromLocalStorage();
      } finally {
        setIsSyncing(false);
        setIsInitialized(true);
      }
    };

    syncOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]); // Only triggers when session status changes

  const loadFromLocalStorage = () => {
    try {
      const storedWatchlist = localStorage.getItem('watchlist');
      const storedFavorites = localStorage.getItem('favorites');
      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    } catch (err) {
      console.error('Failed to load watchlist from localStorage:', err);
    }
  };

  // Storage listener for cross-tab sync (optional)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'watchlist' && e.newValue) setWatchlist(JSON.parse(e.newValue));
      if (e.key === 'favorites' && e.newValue) setFavorites(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Functions for add/remove
  const addToWatchlist = (item: Omit<SavedItem, 'addedAt'>) => {
    const newItem: SavedItem = { ...item, addedAt: Date.now() };
    const updated = [newItem, ...watchlist.filter(i => !(i.id === item.id && i.media_type === item.media_type))];
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
    syncToCloud(updated, favorites);
  };

  const removeFromWatchlist = (id: number, media_type: 'movie' | 'tv') => {
    const updated = watchlist.filter(i => !(i.id === id && i.media_type === media_type));
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
    syncToCloud(updated, favorites);
  };

  const isInWatchlist = (id: number, media_type: 'movie' | 'tv') =>
    watchlist.some(i => i.id === id && i.media_type === media_type);

  const addToFavorites = (item: Omit<SavedItem, 'addedAt'>) => {
    const newItem: SavedItem = { ...item, addedAt: Date.now() };
    const updated = [newItem, ...favorites.filter(i => !(i.id === item.id && i.media_type === item.media_type))];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    syncToCloud(watchlist, updated);
  };

  const removeFromFavorites = (id: number, media_type: 'movie' | 'tv') => {
    const updated = favorites.filter(i => !(i.id === id && i.media_type === media_type));
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    syncToCloud(watchlist, updated);
  };

  const isInFavorites = (id: number, media_type: 'movie' | 'tv') =>
    favorites.some(i => i.id === id && i.media_type === media_type);

  const syncToCloud = async (updatedWatchlist: SavedItem[], updatedFavorites: SavedItem[]) => {
    if (!session.data?.accessToken) return;
    setIsSyncing(true);
    try {
      await fetch('/api/watchlist/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchlist: updatedWatchlist, favorites: updatedFavorites }),
      });
    } catch (err) {
      console.error('Failed to sync to cloud:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncData = async () => {
    // Manual sync if needed
    if (!session.data?.accessToken) return;
    setIsSyncing(true);
    try {
      const res = await fetch('/api/watchlist/sync');
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data.watchlist || []);
        setFavorites(data.favorites || []);
        localStorage.setItem('watchlist', JSON.stringify(data.watchlist || []));
        localStorage.setItem('favorites', JSON.stringify(data.favorites || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isInitialized) return null;

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
        isSyncing,
        isAuthenticated: !!session.data,
        isInitialized,
        syncData,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlistContext() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlistContext must be used within a WatchlistProvider');
  return context;
}