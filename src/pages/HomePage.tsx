import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { MovieRow } from '../components/MovieRow';
import { tmdbApi } from '../services/api';
import { Movie } from '../types';
import { Flame, Star, Film, Sparkles, Tv, Rocket, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [scifi, setScifi] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [tr, pop, top, up, np, scifiRes] = await Promise.all([
          tmdbApi.getTrending(),
          tmdbApi.getPopular(),
          tmdbApi.getTopRated(),
          tmdbApi.getUpcoming(),
          tmdbApi.getNowPlaying(),
          tmdbApi.discoverMovies({ genre: '878' })
        ]);

        setTrending(tr || []);
        setPopular(pop || []);
        setTopRated(top || []);
        setUpcoming(up || []);
        setNowPlaying(np || []);
        setScifi(scifiRes?.results || []);
      } catch (err) {
        console.error('Error loading homepage movie rows:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      {/* Hero Billboard */}
      <HeroSection movies={trending.length > 0 ? trending : popular} />

      {/* Main Content Movie Collections */}
      <div className="relative z-20 -mt-10 sm:-mt-16 space-y-4">
        <div id="trending">
          <MovieRow
            title="Trending Right Now"
            movies={trending}
            isLoading={isLoading}
            icon={<Flame className="w-6 h-6 text-rose-500 fill-rose-500" />}
          />
        </div>

        <MovieRow
          title="Popular Blockbusters"
          movies={popular}
          isLoading={isLoading}
          icon={<Sparkles className="w-6 h-6 text-blue-400" />}
        />

        <MovieRow
          title="Top Rated Masterpieces"
          movies={topRated}
          isLoading={isLoading}
          icon={<Star className="w-6 h-6 text-amber-400 fill-amber-400" />}
        />

        <MovieRow
          title="Now Playing in Theaters"
          movies={nowPlaying}
          isLoading={isLoading}
          icon={<Zap className="w-6 h-6 text-amber-500" />}
        />

        <MovieRow
          title="Sci-Fi & Cosmic Adventures"
          movies={scifi}
          isLoading={isLoading}
          icon={<Rocket className="w-6 h-6 text-sky-400" />}
        />

        <MovieRow
          title="Upcoming OTT Releases"
          movies={upcoming}
          isLoading={isLoading}
          icon={<Tv className="w-6 h-6 text-indigo-400" />}
        />
      </div>
    </div>
  );
};
