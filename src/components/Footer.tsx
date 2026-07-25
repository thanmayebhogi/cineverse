import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#030712] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white font-display">
                Cine<span className="text-blue-500">Verse</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation OTT streaming discovery engine bringing blockbuster movies, trailers, and personal cinema collections together in one seamless platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search" className="hover:text-white transition-colors">Trending Movies</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Popular Releases</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Top Rated Classics</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Upcoming Blockbusters</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">OTT Features</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400">4K Trailer Playback</span></li>
              <li><span className="text-slate-400">Personalized Watchlists</span></li>
              <li><span className="text-slate-400">Surprise Random Picker</span></li>
              <li><span className="text-slate-400">Real-time TMDB API Integration</span></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Data & Credits</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by <span className="text-blue-400 font-semibold">The Movie Database (TMDB) API</span>. Built with React, Vite, Express, and Tailwind CSS.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CineVerse OTT. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for movie lovers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
