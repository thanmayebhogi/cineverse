import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Star, Play, RefreshCw, ArrowRight } from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import { tmdbApi, getImageUrl } from '../services/api';
import { Movie } from '../types';

export const RandomMovieModal: React.FC = () => {
  const { isRandomModalOpen, setRandomModalOpen, playTrailer } = useMovie();
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleFetchRandom = async () => {
    setIsSpinning(true);
    try {
      const movie = await tmdbApi.getRandomMovie();
      setRandomMovie(movie);
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsSpinning(false), 600);
    }
  };

  React.useEffect(() => {
    if (isRandomModalOpen && !randomMovie) {
      handleFetchRandom();
    }
  }, [isRandomModalOpen]);

  if (!isRandomModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              <h3 className="text-xl font-extrabold text-white">Surprise Movie Picker</h3>
            </div>
            <button
              onClick={() => setRandomModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wheel / Movie Display */}
          {isSpinning ? (
            <div className="py-16 text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"
              />
              <p className="text-sm font-semibold text-slate-300">Shuffling CineVerse Catalog...</p>
            </div>
          ) : randomMovie ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={getImageUrl(randomMovie.backdrop_path, 'backdrop')}
                  alt={randomMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    {randomMovie.vote_average?.toFixed(1) || '8.2'}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    {randomMovie.release_date?.split('-')[0]}
                  </span>
                </div>
              </div>

              <h4 className="text-2xl font-extrabold text-white tracking-tight">{randomMovie.title}</h4>
              <p className="text-sm text-slate-300 line-clamp-3 font-normal leading-relaxed">{randomMovie.overview}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setRandomModalOpen(false);
                    playTrailer(randomMovie.videos?.results?.[0]?.key || 'Way9Dexny3w');
                  }}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Trailer</span>
                </button>

                <button
                  onClick={() => {
                    setRandomModalOpen(false);
                    navigate(`/movie/${randomMovie.id}`);
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Spin Again Footer */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleFetchRandom}
              disabled={isSpinning}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
            >
              <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>Spin Again (Random Pick)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
