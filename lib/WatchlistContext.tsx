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

  // Load from localStorage or Google Drive on mount
  useEffect(() => {
    const loadData = async () => {
      if (session.status === 'loading') return;

      if (session.data?.accessToken) {
        // User is authenticated - load from Google Drive
        setIsSyncing(true);
        try {
          const response = await fetch('/api/watchlist/sync');
          if (response.ok) {
            const data = await response.json();
            if (data.watchlist) setWatchlist(data.watchlist);
            if (data.favorites) setFavorites(data.favorites);
            
            // Also update localStorage as cache
            localStorage.setItem('watchlist', JSON.stringify(data.watchlist || []));
            localStorage.setItem('favorites', JSON.stringify(data.favorites || []));
          } else {
            // Fallback to localStorage if Drive fails
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error('Failed to load from Google Drive:', error);
          loadFromLocalStorage();
        } finally {
          setIsSyncing(false);
        }
      } else {
        // Not authenticated - load from localStorage
        loadFromLocalStorage();
      }
      
      setIsInitialized(true);
    };

    loadData();
  }, [session.data, session.status]);

  const loadFromLocalStorage = () => {
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
  };

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

  const syncToCloud = async (updatedWatchlist: SavedItem[], updatedFavorites: SavedItem[]) => {
    if (!session.data?.accessToken) return;
    
    setIsSyncing(true);
    try {
      await fetch('/api/watchlist/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watchlist: updatedWatchlist,
          favorites: updatedFavorites,
        }),
      });
    } catch (error) {
      console.error('Failed to sync to Google Drive:', error);
    } finally {
      setIsSyncing(false);
    }
  };

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

  const isInWatchlist = (id: number, media_type: 'movie' | 'tv') => {
    return watchlist.some(i => i.id === id && i.media_type === media_type);
  };

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

  const isInFavorites = (id: number, media_type: 'movie' | 'tv') => {
    return favorites.some(i => i.id === id && i.media_type === media_type);
  };

  // Manual sync function that can be called externally
  const syncData = async () => {
    if (!session.data?.accessToken) {
      console.log('[Watchlist] Cannot sync - user not authenticated');
      return;
    }
    
    setIsSyncing(true);
    try {
      const response = await fetch('/api/watchlist/sync');
      if (response.ok) {
        const data = await response.json();
        if (data.watchlist) setWatchlist(data.watchlist);
        if (data.favorites) setFavorites(data.favorites);
        
        // Also update localStorage as cache
        localStorage.setItem('watchlist', JSON.stringify(data.watchlist || []));
        localStorage.setItem('favorites', JSON.stringify(data.favorites || []));
        console.log('[Watchlist] Sync successful');
      } else {
        console.error('[Watchlist] Sync failed with status:', response.status);
      }
    } catch (error) {
      console.error('[Watchlist] Failed to sync from Google Drive:', error);
    } finally {
      setIsSyncing(false);
    }
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
  if (context === undefined) {
    throw new Error('useWatchlistContext must be used within a WatchlistProvider');
  }
  return context;
}
