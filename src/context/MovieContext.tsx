import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, ToastMessage } from '../types';
import { userApi } from '../services/api';
import { useAuth } from './AuthContext';

interface MovieContextType {
  favorites: number[];
  watchlist: number[];
  history: { movieId: number; timestamp: string }[];
  searchHistory: { query: string; timestamp: string }[];
  toasts: ToastMessage[];
  activeTrailerKey: string | null;
  quickViewMovie: Movie | null;
  isSearchModalOpen: boolean;
  isRandomModalOpen: boolean;

  toggleFavorite: (movieId: number, title?: string) => Promise<void>;
  toggleWatchlist: (movieId: number, title?: string) => Promise<void>;
  addToHistory: (movieId: number) => Promise<void>;
  addSearchQuery: (query: string) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  refreshSearchHistory: () => Promise<void>;
  
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  playTrailer: (key: string | null) => void;
  openQuickView: (movie: Movie | null) => void;
  setSearchModalOpen: (open: boolean) => void;
  setRandomModalOpen: (open: boolean) => void;

  isFavorite: (movieId: number) => boolean;
  isInWatchlist: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [history, setHistory] = useState<{ movieId: number; timestamp: string }[]>([]);
  const [searchHistory, setSearchHistory] = useState<{ query: string; timestamp: string }[]>([]);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [quickViewMovie, setQuickViewMovie] = useState<Movie | null>(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isRandomModalOpen, setRandomModalOpen] = useState(false);

  // Sync user lists when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      userApi.getFavorites().then(setFavorites).catch(() => {});
      userApi.getWatchlist().then(setWatchlist).catch(() => {});
      userApi.getHistory().then(setHistory).catch(() => {});
      userApi.getSearchHistory().then(setSearchHistory).catch(() => {});
    } else {
      // Load local guest storage if unauthenticated
      try {
        const localFavs = JSON.parse(localStorage.getItem('cineverse_guest_favs') || '[]');
        const localWatch = JSON.parse(localStorage.getItem('cineverse_guest_watchlist') || '[]');
        const localSearch = JSON.parse(localStorage.getItem('cineverse_guest_search_history') || '[]');
        setFavorites(localFavs);
        setWatchlist(localWatch);
        setSearchHistory(localSearch);
      } catch {}
    }
  }, [isAuthenticated]);

  const refreshSearchHistory = async () => {
    if (isAuthenticated) {
      try {
        const updated = await userApi.getSearchHistory();
        setSearchHistory(updated || []);
      } catch {}
    } else {
      try {
        const localSearch = JSON.parse(localStorage.getItem('cineverse_guest_search_history') || '[]');
        setSearchHistory(localSearch);
      } catch {}
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const toggleFavorite = async (movieId: number, title?: string) => {
    if (isAuthenticated) {
      try {
        const res = await userApi.toggleFavorite(movieId);
        setFavorites(prev =>
          res.isFavorite ? [...prev, movieId] : prev.filter(id => id !== movieId)
        );
        showToast('success', res.isFavorite ? `Added "${title || 'Movie'}" to Favorites` : `Removed "${title || 'Movie'}" from Favorites`);
      } catch {
        showToast('error', 'Failed to update Favorites');
      }
    } else {
      setFavorites(prev => {
        const exists = prev.includes(movieId);
        const next = exists ? prev.filter(id => id !== movieId) : [...prev, movieId];
        localStorage.setItem('cineverse_guest_favs', JSON.stringify(next));
        showToast('success', exists ? `Removed "${title || 'Movie'}" from Favorites` : `Added "${title || 'Movie'}" to Favorites`);
        return next;
      });
    }
  };

  const toggleWatchlist = async (movieId: number, title?: string) => {
    if (isAuthenticated) {
      try {
        const res = await userApi.toggleWatchlist(movieId);
        setWatchlist(prev =>
          res.inWatchlist ? [...prev, movieId] : prev.filter(id => id !== movieId)
        );
        showToast('success', res.inWatchlist ? `Added "${title || 'Movie'}" to Watchlist` : `Removed "${title || 'Movie'}" from Watchlist`);
      } catch {
        showToast('error', 'Failed to update Watchlist');
      }
    } else {
      setWatchlist(prev => {
        const exists = prev.includes(movieId);
        const next = exists ? prev.filter(id => id !== movieId) : [...prev, movieId];
        localStorage.setItem('cineverse_guest_watchlist', JSON.stringify(next));
        showToast('success', exists ? `Removed "${title || 'Movie'}" from Watchlist` : `Added "${title || 'Movie'}" to Watchlist`);
        return next;
      });
    }
  };

  const addToHistory = async (movieId: number) => {
    if (isAuthenticated) {
      try {
        await userApi.addHistory(movieId);
        const updated = await userApi.getHistory();
        setHistory(updated);
      } catch {}
    } else {
      setHistory(prev => {
        const filtered = prev.filter(h => h.movieId !== movieId);
        return [{ movieId, timestamp: new Date().toISOString() }, ...filtered].slice(0, 30);
      });
    }
  };

  const addSearchQuery = async (query: string) => {
    if (!query.trim()) return;
    const clean = query.trim();
    if (isAuthenticated) {
      try {
        await userApi.addSearchHistory(clean);
        const updated = await userApi.getSearchHistory();
        setSearchHistory(updated || []);
      } catch {}
    } else {
      setSearchHistory(prev => {
        const filtered = prev.filter(s => s.query.toLowerCase() !== clean.toLowerCase());
        const next = [{ query: clean, timestamp: new Date().toISOString() }, ...filtered].slice(0, 15);
        try {
          localStorage.setItem('cineverse_guest_search_history', JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  };

  const clearSearchHistory = async () => {
    if (isAuthenticated) {
      try {
        await userApi.clearSearchHistory();
        setSearchHistory([]);
      } catch {}
    } else {
      try {
        localStorage.removeItem('cineverse_guest_search_history');
      } catch {}
      setSearchHistory([]);
    }
  };

  const isFavorite = (movieId: number) => favorites.includes(movieId);
  const isInWatchlist = (movieId: number) => watchlist.includes(movieId);

  return (
    <MovieContext.Provider
      value={{
        favorites,
        watchlist,
        history,
        searchHistory,
        toasts,
        activeTrailerKey,
        quickViewMovie,
        isSearchModalOpen,
        isRandomModalOpen,
        toggleFavorite,
        toggleWatchlist,
        addToHistory,
        addSearchQuery,
        clearSearchHistory,
        refreshSearchHistory,
        showToast,
        playTrailer: setActiveTrailerKey,
        openQuickView: setQuickViewMovie,
        setSearchModalOpen,
        setRandomModalOpen,
        isFavorite,
        isInWatchlist
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovie must be used within a MovieProvider');
  return context;
};
