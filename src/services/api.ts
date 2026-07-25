import axios from 'axios';
import { Movie, ActorDetail, SearchFilters, User } from '../types';

const api = axios.create({
  baseURL: '/api'
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cineverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getImageUrl(path: string | null, size: 'poster' | 'backdrop' | 'profile' | 'original' = 'poster'): string {
  if (!path) {
    if (size === 'poster') return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80';
    if (size === 'backdrop') return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const sizes = {
    poster: 'w500',
    backdrop: 'w1280',
    profile: 'h632',
    original: 'original'
  };
  return `https://image.tmdb.org/t/p/${sizes[size]}${path}`;
}

// Movies TMDB API calls
export const tmdbApi = {
  getTrending: () => api.get<{ results: Movie[] }>('/tmdb/trending').then(res => res.data.results),
  getPopular: () => api.get<{ results: Movie[] }>('/tmdb/popular').then(res => res.data.results),
  getTopRated: () => api.get<{ results: Movie[] }>('/tmdb/top-rated').then(res => res.data.results),
  getUpcoming: () => api.get<{ results: Movie[] }>('/tmdb/upcoming').then(res => res.data.results),
  getNowPlaying: () => api.get<{ results: Movie[] }>('/tmdb/now-playing').then(res => res.data.results),
  getGenres: () => api.get<{ genres: { id: number; name: string }[] }>('/tmdb/genres').then(res => res.data.genres),
  getMovieDetails: (id: number) => api.get<Movie>(`/tmdb/movie/${id}`).then(res => res.data),
  getActorDetails: (id: number) => api.get<ActorDetail>(`/tmdb/actor/${id}`).then(res => res.data),
  searchMovies: (query: string) => api.get<{ results: Movie[] }>(`/tmdb/search?q=${encodeURIComponent(query)}`).then(res => res.data.results),
  discoverMovies: (filters: Partial<SearchFilters> & { page?: number }) => {
    const params = new URLSearchParams();
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    if (filters.minRating) params.append('minRating', String(filters.minRating));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.language) params.append('language', filters.language);
    if (filters.page) params.append('page', String(filters.page));
    return api.get<{ page: number; total_pages: number; results: Movie[] }>(`/tmdb/discover?${params.toString()}`).then(res => res.data);
  },
  getRandomMovie: () => api.get<Movie>('/tmdb/random').then(res => res.data)
};

// User API calls
export const userApi = {
  getFavorites: () => api.get<{ movieIds: number[] }>('/user/favorites').then(res => res.data.movieIds),
  toggleFavorite: (movieId: number) => api.post<{ message: string; isFavorite: boolean }>('/user/favorites/toggle', { movieId }).then(res => res.data),
  getWatchlist: () => api.get<{ movieIds: number[] }>('/user/watchlist').then(res => res.data.movieIds),
  toggleWatchlist: (movieId: number) => api.post<{ message: string; inWatchlist: boolean }>('/user/watchlist/toggle', { movieId }).then(res => res.data),
  getHistory: () => api.get<{ history: { movieId: number; timestamp: string }[] }>('/user/history').then(res => res.data.history),
  addHistory: (movieId: number) => api.post('/user/history/add', { movieId }),
  getSearchHistory: () => api.get<{ searchHistory: { query: string; timestamp: string }[] }>('/user/search-history').then(res => res.data.searchHistory),
  addSearchHistory: (query: string) => api.post('/user/search-history/add', { query }),
  clearSearchHistory: () => api.delete('/user/search-history'),
  getReviews: (movieId: number) => api.get<{ reviews: any[] }>(`/user/reviews/${movieId}`).then(res => res.data.reviews),
  addReview: (movieId: number, content: string, rating: number) => api.post('/user/reviews/add', { movieId, content, rating }).then(res => res.data)
};

// Auth API calls
export const authApi = {
  register: (data: { name: string; email: string; password: string }) => api.post<{ token: string; user: User; message: string }>('/auth/register', data).then(res => res.data),
  login: (data: { email: string; password: string }) => api.post<{ token: string; user: User; message: string }>('/auth/login', data).then(res => res.data),
  getMe: () => api.get<{ user: User }>('/auth/me').then(res => res.data.user),
  updateProfile: (data: Partial<User>) => api.put<{ user: User; message: string }>('/auth/profile', data).then(res => res.data),
  forgotPassword: (email: string) => api.post<{ message: string }>('/auth/forgot-password', { email }).then(res => res.data)
};
