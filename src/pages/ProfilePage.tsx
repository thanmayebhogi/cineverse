import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bookmark, Star, Clock, History as HistoryIcon, Settings, User as UserIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';
import { tmdbApi } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types';

type ProfileTab = 'watchlist' | 'favorites' | 'history' | 'searchHistory' | 'settings';

export const ProfilePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as ProfileTab) || 'watchlist';

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { watchlist, favorites, history, searchHistory, clearSearchHistory, showToast } = useMovie();

  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [historyMovies, setHistoryMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Settings form states
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchListMovies = async () => {
      setIsLoading(true);
      try {
        const [watchRes, favRes, histRes] = await Promise.all([
          Promise.all(watchlist.map((id) => tmdbApi.getMovieDetails(id).catch(() => null))),
          Promise.all(favorites.map((id) => tmdbApi.getMovieDetails(id).catch(() => null))),
          Promise.all(history.map((h) => tmdbApi.getMovieDetails(h.movieId).catch(() => null)))
        ]);

        setWatchlistMovies((watchRes.filter(Boolean) as Movie[]) || []);
        setFavoriteMovies((favRes.filter(Boolean) as Movie[]) || []);
        setHistoryMovies((histRes.filter(Boolean) as Movie[]) || []);
      } catch (err) {
        console.error('Failed to load profile lists:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListMovies();
  }, [watchlist, favorites, history]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, avatar });
      showToast('success', 'Profile updated successfully!');
    } catch {
      showToast('error', 'Failed to update profile.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20 px-4 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md space-y-4">
          <UserIcon className="w-12 h-12 text-blue-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
          <p className="text-xs text-slate-400">Please sign in to view your personal watchlists, favorites, and history.</p>
          <button
            onClick={() => navigate('/auth')}
            className="py-3 px-6 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Card Header */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/80 shadow-xl"
          />
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-blue-400 font-semibold">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-800">
                VIP Streamer
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'watchlist' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Watchlist ({watchlist.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'favorites' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Star className="w-4 h-4" /> Favorites ({favorites.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Clock className="w-4 h-4" /> Recently Viewed ({history.length})
          </button>

          <button
            onClick={() => setActiveTab('searchHistory')}
            className={`py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'searchHistory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <HistoryIcon className="w-4 h-4" /> Search History
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'watchlist' && (
          <div className="space-y-4">
            {watchlistMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlistMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-12 text-center">Your Watchlist is empty. Bookmark movies to watch later!</p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favoriteMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-12 text-center">No favorite movies saved yet. Click the star icon on any movie!</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {historyMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-12 text-center">No recently viewed history recorded yet.</p>
            )}
          </div>
        )}

        {activeTab === 'searchHistory' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Past Search Queries</h3>
              {searchHistory.length > 0 && (
                <button
                  onClick={clearSearchHistory}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All History
                </button>
              )}
            </div>

            {searchHistory.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
                  >
                    <span>{s.query}</span>
                    <span className="text-[10px] text-slate-500">{new Date(s.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No search history logged.</p>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 max-w-xl space-y-4">
            <h3 className="text-base font-bold text-white">Account Preferences</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
