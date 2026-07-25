import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Info, Star, Plus, Check } from 'lucide-react';
import { Movie } from '../types';
import { getImageUrl } from '../services/api';
import { useMovie } from '../context/MovieContext';

interface HeroSectionProps {
  movies: Movie[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { playTrailer, toggleWatchlist, isInWatchlist } = useMovie();

  const heroMovies = movies.slice(0, 5);

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (heroMovies.length === 0) return null;

  const currentMovie = heroMovies[currentIndex];
  const backdropUrl = getImageUrl(currentMovie.backdrop_path, 'backdrop');
  const rating = currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : '8.5';
  const releaseYear = currentMovie.release_date ? currentMovie.release_date.split('-')[0] : '2024';
  const inWatch = isInWatchlist(currentMovie.id);

  return (
    <div className="relative w-full h-[80vh] min-h-[550px] max-h-[800px] bg-slate-950 overflow-hidden">
      {/* Background Slides with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={backdropUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
          />
          {/* Multi-layered OTT Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/70 to-transparent w-full md:w-3/4" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-end pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-4"
          >
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-lg shadow-blue-600/30 uppercase tracking-wider text-[11px]">
                FEATURED OTT PREMIERE
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{rating} IMDb</span>
              </div>
              <span className="text-slate-300">{releaseYear}</span>
              <span className="px-2 py-0.5 rounded border border-slate-700 text-slate-300 text-xs">U/A 16+</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
              {currentMovie.title}
            </h1>

            {/* Overview */}
            <p className="text-slate-300 text-sm sm:text-base line-clamp-3 font-medium leading-relaxed max-w-xl drop-shadow">
              {currentMovie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => playTrailer(currentMovie.videos?.results?.[0]?.key || 'Way9Dexny3w')}
                className="py-3.5 px-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Play Trailer</span>
              </button>

              <button
                onClick={() => navigate(`/movie/${currentMovie.id}`)}
                className="py-3.5 px-6 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm backdrop-blur-md border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Info className="w-5 h-5 text-sky-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => toggleWatchlist(currentMovie.id, currentMovie.title)}
                title={inWatch ? "In Watchlist" : "Add to Watchlist"}
                className={`p-3.5 rounded-xl backdrop-blur-md border transition-all ${
                  inWatch
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {inWatch ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-2.5 mt-8">
          {heroMovies.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-blue-500 shadow-lg shadow-blue-500/50' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
