import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Film, ArrowLeft } from 'lucide-react';
import { tmdbApi, getImageUrl } from '../services/api';
import { ActorDetail } from '../types';
import { MovieCard } from '../components/MovieCard';

export const ActorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const actorId = Number(id);
  const navigate = useNavigate();

  const [actor, setActor] = useState<ActorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!actorId) return;
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    tmdbApi
      .getActorDetails(actorId)
      .then(setActor)
      .catch((err) => console.error('Failed to load actor:', err))
      .finally(() => setIsLoading(false));
  }, [actorId]);

  if (isLoading || !actor) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profileUrl = getImageUrl(actor.profile_path, 'profile');

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Actor Profile Header */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row gap-8">
          <img
            src={profileUrl}
            alt={actor.name}
            className="w-44 sm:w-56 aspect-[2/3] object-cover rounded-2xl border-2 border-slate-800 shrink-0 mx-auto md:mx-0 shadow-2xl"
          />

          <div className="flex-1 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{actor.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
              {actor.birthday && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-400" /> Born: {actor.birthday}
                </span>
              )}
              {actor.place_of_birth && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" /> {actor.place_of_birth}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> Popularity Score: {actor.popularity?.toFixed(0)}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Biography</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {actor.biography || `${actor.name} is a celebrated actor with numerous filmography credits.`}
              </p>
            </div>
          </div>
        </div>

        {/* Filmography Section */}
        {actor.movie_credits?.cast && actor.movie_credits.cast.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-400" /> Known For Movies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {actor.movie_credits.cast.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
