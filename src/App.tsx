import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { TrailerModal } from './components/TrailerModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { RandomMovieModal } from './components/RandomMovieModal';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { ActorDetailsPage } from './pages/ActorDetailsPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
              <Navbar />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/actor/:id" element={<ActorDetailsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />

              {/* Modals & Overlays */}
              <Toast />
              <TrailerModal />
              <QuickViewModal />
              <SearchModal />
              <RandomMovieModal />
            </div>
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
