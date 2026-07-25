import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Bookmark, Eye, Play } from 'lucide-react';
import { Movie } from '../types';
import { getImageUrl } from '../services/api';
import { useMovie } from '../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist, openQuickView, playTrailer } = useMovie();

  const fav = isFavorite(movie.id);
  const watch = isInWatchlist(movie.id);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  const posterUrl = getImageUrl(movie.poster_path, 'poster');

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="group relative w-44 sm:w-52 shrink-0 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/50 shadow-xl overflow-hidden cursor-pointer flex flex-col transition-all"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950" onClick={handleCardClick}>
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Backdrop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{rating}</span>
        </div>

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(movie.id, movie.title);
            }}
            title={fav ? "Remove Favorite" : "Add Favorite"}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              fav
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${fav ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id, movie.title);
            }}
            title={watch ? "In Watchlist" : "Add Watchlist"}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              watch
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${watch ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Quick View & Play Buttons Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(movie);
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold backdrop-blur-md border border-slate-700 flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Quick View</span>
          </button>
          {movie.videos?.results?.[0]?.key && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playTrailer(movie.videos?.results[0].key || null);
              }}
              title="Play Trailer"
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          )}
        </div>
      </div>

      {/* Card Text Content */}
      <div className="p-3.5 flex flex-col justify-between flex-1" onClick={handleCardClick}>
        <h3 className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
          <span>{releaseYear}</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-medium uppercase">
            Movie
          </span>
        </div>
      </div>
    </motion.div>
  );
};
