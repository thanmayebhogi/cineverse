import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export const TrailerModal: React.FC = () => {
  const { activeTrailerKey, playTrailer } = useMovie();

  if (!activeTrailerKey) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Official Trailer
            </h3>
            <button
              onClick={() => playTrailer(null)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title="Movie Trailer"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
