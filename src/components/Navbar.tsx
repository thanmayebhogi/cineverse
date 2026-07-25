import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, Star, Bookmark, Sparkles, User as UserIcon, LogOut, Sun, Moon, Menu, X, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { setSearchModalOpen, setRandomModalOpen, watchlist, favorites } = useMovie();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/search' },
    { name: 'Trending', path: '/#trending' },
    { name: 'Watchlist', path: '/profile?tab=watchlist', count: watchlist.length },
    { name: 'Favorites', path: '/profile?tab=favorites', count: favorites.length }
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#030712]/90 via-[#030712]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-display">
            Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">Verse</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools & Profile */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 py-2 px-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all shadow-md hover:border-slate-700"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search movies...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Surprise Me Button */}
          <button
            onClick={() => setRandomModalOpen(true)}
            title="Random Movie Picker"
            className="p-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* User Profile / Auth */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-blue-500/50"
                />
                <span className="text-xs font-bold text-white max-w-[100px] truncate">{user.name}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-blue-400" /> My Profile & Lists
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="py-2 px-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 text-slate-300 bg-slate-900 rounded-full"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 bg-slate-900 rounded-full"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-4 space-y-4 shadow-2xl">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-200 hover:text-blue-400 py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs font-bold text-rose-400 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-6 rounded-full bg-blue-600 text-white text-xs font-bold"
              >
                Sign In
              </Link>
            )}
            <button onClick={toggleTheme} className="p-2 text-slate-300">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
