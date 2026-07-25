import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Film, Lock, Mail, User, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../context/MovieContext';
import { authApi } from '../services/api';

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const { showToast } = useMovie();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('demo@cineverse.ott', 'demo1234');
      showToast('success', 'Logged in as Demo User!');
      navigate('/');
    } catch {
      // If demo user doesn't exist, auto register
      try {
        await register('CineVerse Explorer', 'demo@cineverse.ott', 'demo1234');
        showToast('success', 'Demo account created and logged in!');
        navigate('/');
      } catch {
        showToast('error', 'Demo login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('success', 'Welcome back to CineVerse!');
        navigate('/');
      } else if (mode === 'register') {
        await register(name, email, password);
        showToast('success', 'Account created successfully!');
        navigate('/');
      } else {
        const res = await authApi.forgotPassword(email);
        showToast('info', res.message);
        setMode('login');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication error';
      showToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20 pb-16 px-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Sign In to CineVerse' : mode === 'register' ? 'Create Your Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {mode === 'login'
              ? 'Access your watchlists, favorites, and cinema history'
              : mode === 'register'
              ? 'Join millions of movie fans worldwide'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* Demo Login Banner */}
        {mode === 'login' && (
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>⚡ Instant One-Click Demo Sign-In</span>
          </button>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 accent-blue-600"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-blue-400 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switch Footer */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-blue-400 font-bold hover:underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-blue-400 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
