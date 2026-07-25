import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20 pb-16 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto">
          <Film className="w-10 h-10 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Lost in Cinematic Space</h2>
          <p className="text-xs text-slate-400">The movie page or stream you are looking for doesn't exist or has moved.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
        >
          <Home className="w-4 h-4" /> Return to CineVerse Home
        </Link>
      </div>
    </div>
  );
};
