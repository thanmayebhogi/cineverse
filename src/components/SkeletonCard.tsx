import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-44 sm:w-52 shrink-0 rounded-2xl bg-slate-900/60 border border-slate-800/60 overflow-hidden animate-pulse">
      <div className="w-full h-64 sm:h-72 bg-slate-800/60" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-800/80 rounded w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 bg-slate-800/80 rounded w-1/3" />
          <div className="h-3 bg-slate-800/80 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};
