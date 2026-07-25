import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Star, Clock, Flame, Film, ArrowRight, Trash2 } from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import { tmdbApi, getImageUrl } from '../services/api';
import { Movie } from '../types';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setSearchModalOpen, searchHistory, addSearchQuery, clearSearchHistory, refreshSearchHistory } = useMovie();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const popularTags = ['Dune', 'Oppenheimer', 'Interstellar', 'Batman', 'Marvel', 'Spider-Man', 'Sci-Fi'];

  useEffect(() => {
    if (isSearchModalOpen) {
      refreshSearchHistory();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchModalOpen]);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      tmdbApi
        .searchMovies(query)
        .then((res) => {
          setResults(res || []);
          setSelectedIndex(-1);
        })
        .catch(() => setResults([]))
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchModalOpen) return null;

  const handleSelectMovie = (movie: Movie) => {
    addSearchQuery(movie.title);
    setSearchModalOpen(false);
    navigate(`/movie/${movie.id}`);
  };

  const handleFullSearch = (q: string) => {
    if (!q.trim()) return;
    addSearchQuery(q);
    setSearchModalOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchModalOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectMovie(results[selectedIndex]);
      } else if (query.trim()) {
        handleFullSearch(query);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          onKeyDown={handleKeyDown}
        >
          {/* Search Input Header */}
          <div className="relative flex items-center px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <Search className="w-6 h-6 text-blue-500 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, actors, directors, genres..."
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-lg font-medium outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSearchModalOpen(false)}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {!query.trim() && (
              <>
                {/* Recent Searches Section */}
                {searchHistory.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-blue-400 font-bold">
                        <Clock className="w-3.5 h-3.5 text-blue-400" /> Recent Searches
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px] font-medium transition-colors"
                        title="Clear all recent searches"
                      >
                        <Trash2 className="w-3 h-3" /> Clear History
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuery(s.query);
                          }}
                          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 hover:border-blue-500/50 text-xs font-medium text-slate-200 transition-all hover:shadow-md"
                        >
                          <Clock className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                          <span>{s.query}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Search Tags */}
                <div className="space-y-3">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                    <Flame className="w-3.5 h-3.5 text-amber-500" /> Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(tag)}
                        className="px-3.5 py-1.5 rounded-full bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/50 text-xs font-semibold text-blue-300 transition-all"
                      >
                        🔥 {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium">Searching CineVerse TMDB Database...</span>
              </div>
            )}

            {/* Results List */}
            {!isLoading && query.trim() && results.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 text-xs font-semibold text-slate-400 border-b border-slate-800">
                  <span>Found {results.length} movies</span>
                  <button
                    onClick={() => handleFullSearch(query)}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold"
                  >
                    <span>View all results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {results.slice(0, 6).map((movie, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={movie.id}
                      onClick={() => handleSelectMovie(movie)}
                      className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500/80 shadow-lg'
                          : 'bg-slate-950/50 hover:bg-slate-800/80 border-slate-800/60'
                      }`}
                    >
                      <img
                        src={getImageUrl(movie.poster_path, 'poster')}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-xl shrink-0 bg-slate-900"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                          <span className="text-xs text-slate-400 font-medium">
                            ({movie.release_date?.split('-')[0] || 'N/A'})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{movie.overview}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && query.trim() && results.length === 0 && (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Film className="w-12 h-12 mx-auto text-slate-600 stroke-1" />
                <p className="text-base font-semibold text-slate-200">No movies found matching "{query}"</p>
                <p className="text-xs text-slate-500">Try searching for different keywords or explore trending categories.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
