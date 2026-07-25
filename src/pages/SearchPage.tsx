import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Grid, List, RotateCcw, Star, Film } from 'lucide-react';
import { tmdbApi } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Movie, SearchFilters } from '../types';
import { GENRES_LIST } from '../../server/data/fallbackMovies';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    genre: '',
    year: '',
    minRating: 0,
    sortBy: 'popularity.desc',
    language: ''
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>(GENRES_LIST);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    tmdbApi.getGenres().then((g) => setGenres(g || GENRES_LIST)).catch(() => {});
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, query: initialQuery }));
  }, [initialQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        if (filters.query.trim() && !filters.genre && !filters.year && filters.minRating === 0) {
          const res = await tmdbApi.searchMovies(filters.query);
          setMovies(res || []);
          setTotalPages(1);
        } else {
          const res = await tmdbApi.discoverMovies({
            genre: filters.genre,
            year: filters.year,
            minRating: filters.minRating,
            sortBy: filters.sortBy,
            language: filters.language,
            page
          });
          setMovies(res.results || []);
          setTotalPages(res.total_pages || 1);
        }
      } catch (err) {
        console.error('Failed to discover movies:', err);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [filters, page]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      genre: '',
      year: '',
      minRating: 0,
      sortBy: 'popularity.desc',
      language: ''
    });
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header & Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => {
                const val = e.target.value;
                setFilters((prev) => ({ ...prev, query: val }));
                setSearchParams(val ? { q: val } : {});
              }}
              placeholder="Search by title, character, or director..."
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 text-sm font-medium outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden py-3 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-400" /> Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`space-y-6 md:block ${
              showFiltersMobile ? 'block' : 'hidden'
            } bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 h-fit`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" /> Refine Catalog
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Genre Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 outline-none focus:border-blue-500"
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Year */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Release Year</label>
              <input
                type="number"
                min="1950"
                max="2026"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                placeholder="e.g. 2024"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Minimum Rating</label>
                <span className="text-xs text-amber-400 font-bold">{filters.minRating} +</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Sort Results By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 outline-none focus:border-blue-500"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Newest Release</option>
                <option value="release_date.asc">Oldest Release</option>
              </select>
            </div>
          </aside>

          {/* Results Display */}
          <main className="md:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing {movies.length} results</span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : movies.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                }
              >
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8">
                <Film className="w-16 h-16 text-slate-600 mx-auto stroke-1" />
                <h3 className="text-lg font-bold text-slate-200">No Movies Match Your Query</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your filters, searching for a different title, or resetting search keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="py-2.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-8">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
