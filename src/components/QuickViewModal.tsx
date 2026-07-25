import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Play, Bookmark, ArrowRight } from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import { getImageUrl } from '../services/api';

export const QuickViewModal: React.FC = () => {
  const { quickViewMovie, openQuickView, isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist, playTrailer } = useMovie();
  const navigate = useNavigate();

  if (!quickViewMovie) return null;

  const posterUrl = getImageUrl(quickViewMovie.poster_path, 'poster');
  const backdropUrl = getImageUrl(quickViewMovie.backdrop_path, 'backdrop');
  const fav = isFavorite(quickViewMovie.id);
  const watch = isInWatchlist(quickViewMovie.id);
  const rating = quickViewMovie.vote_average ? quickViewMovie.vote_average.toFixed(1) : '8.0';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={() => openQuickView(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Poster Image */}
          <div className="relative w-full md:w-2/5 aspect-[2/3] md:aspect-auto shrink-0 bg-slate-950">
            <img
              src={posterUrl}
              alt={quickViewMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden" />
          </div>

          {/* Right Details Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {rating} IMDb
                </span>
                <span className="text-slate-400">{quickViewMovie.release_date?.split('-')[0]}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {quickViewMovie.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed line-clamp-4 font-normal">
                {quickViewMovie.overview}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    openQuickView(null);
                    playTrailer(quickViewMovie.videos?.results?.[0]?.key || 'Way9Dexny3w');
                  }}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Trailer</span>
                </button>

                <button
                  onClick={() => {
                    openQuickView(null);
                    navigate(`/movie/${quickViewMovie.id}`);
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Full Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(quickViewMovie.id, quickViewMovie.title)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    fav ? 'bg-rose-600/20 text-rose-300 border-rose-500/50' : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${fav ? 'fill-rose-400' : ''}`} />
                  <span>{fav ? 'Favorited' : 'Favorite'}</span>
                </button>

                <button
                  onClick={() => toggleWatchlist(quickViewMovie.id, quickViewMovie.title)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    watch ? 'bg-blue-600/20 text-blue-300 border-blue-500/50' : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${watch ? 'fill-blue-400' : ''}`} />
                  <span>{watch ? 'In Watchlist' : 'Watchlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
