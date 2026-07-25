import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Play, Bookmark, Share2, Clock, DollarSign, Globe, Building, Send, Heart, CheckCircle } from 'lucide-react';
import { tmdbApi, userApi, getImageUrl } from '../services/api';
import { Movie, Review } from '../types';
import { MovieRow } from '../components/MovieRow';
import { useMovie } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();

  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist, playTrailer, showToast, addToHistory } = useMovie();
  const { isAuthenticated, user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    tmdbApi
      .getMovieDetails(movieId)
      .then((data) => {
        setMovie(data);
        addToHistory(data.id);
      })
      .catch((err) => {
        console.error('Failed to load movie details:', err);
      })
      .finally(() => setIsLoading(false));

    userApi
      .getReviews(movieId)
      .then((r) => setReviews(r || []))
      .catch(() => {});
  }, [movieId]);

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop');
  const posterUrl = getImageUrl(movie.poster_path, 'poster');
  const fav = isFavorite(movie.id);
  const watch = isInWatchlist(movie.id);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '8.2';
  const trailerKey = movie.videos?.results?.[0]?.key || 'Way9Dexny3w';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast('info', 'Link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    if (!isAuthenticated) {
      showToast('error', 'Please sign in to post a review.');
      navigate('/auth');
      return;
    }

    try {
      const res = await userApi.addReview(movie.id, newReview, newRating);
      showToast('success', 'Review submitted successfully!');
      setReviews((prev) => [res.review, ...prev]);
      setNewReview('');
    } catch {
      showToast('error', 'Failed to submit review.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pt-16">
      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[65vh] min-h-[450px] bg-slate-950 overflow-hidden">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-75 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
      </div>

      {/* Main Details Card (Overlap Banner) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 -mt-40 sm:-mt-52">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row gap-8">
          {/* Poster Image */}
          <div className="w-48 sm:w-64 shrink-0 mx-auto md:mx-0 -mt-20 md:-mt-24 shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-800/80 bg-slate-950">
            <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-4">
            {/* Title & Tagline */}
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold mb-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {rating} IMDb ({movie.vote_count} votes)
                </span>
                <span className="text-slate-400">{movie.release_date}</span>
                {movie.runtime && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> {movie.runtime} min
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{movie.title}</h1>
              {movie.tagline && <p className="text-sm italic text-blue-400 font-medium mt-1">"{movie.tagline}"</p>}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">{movie.overview}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => playTrailer(trailerKey)}
                className="py-3.5 px-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Trailer</span>
              </button>

              <button
                onClick={() => toggleFavorite(movie.id, movie.title)}
                className={`py-3.5 px-5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  fav
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Star className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
                <span>{fav ? 'Favorited' : 'Add Favorite'}</span>
              </button>

              <button
                onClick={() => toggleWatchlist(movie.id, movie.title)}
                className={`py-3.5 px-5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  watch
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${watch ? 'fill-white' : ''}`} />
                <span>{watch ? 'In Watchlist' : 'Add Watchlist'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Share Movie"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Cast & Crew Section */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mt-12 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Top Cast & Crew</h2>
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-4">
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <div
                  key={actor.id}
                  onClick={() => navigate(`/actor/${actor.id}`)}
                  className="w-32 shrink-0 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 text-center cursor-pointer hover:border-blue-500/50 transition-all group"
                >
                  <img
                    src={getImageUrl(actor.profile_path, 'profile')}
                    alt={actor.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border border-slate-800 group-hover:scale-105 transition-transform"
                  />
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 truncate">
                    {actor.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movie Info Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/50 border border-slate-800/80 rounded-3xl text-xs">
          <div>
            <span className="text-slate-500 font-semibold block mb-1">Budget</span>
            <span className="text-slate-200 font-bold">
              {movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-1">Revenue</span>
            <span className="text-slate-200 font-bold">
              {movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-1">Original Language</span>
            <span className="text-slate-200 font-bold uppercase">{movie.original_language || 'EN'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-1">Status</span>
            <span className="text-slate-200 font-bold">{movie.status || 'Released'}</span>
          </div>
        </div>

        {/* User Reviews Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Community Reviews & Ratings</h2>

          {/* Submit Review Form */}
          <form onSubmit={handleAddReview} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Write a Review</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Your Rating:</span>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-bold outline-none"
              >
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    ★ {num} / 10
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your thoughts about the movie..."
              rows={3}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Submit Review
            </button>
          </form>

          {/* Existing Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">{rev.userName || rev.author}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[11px] font-bold">
                      ★ {rev.rating || rev.author_details?.rating || 8}/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to share your opinion!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
