import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  preferredGenres?: number[];
  createdAt: string;
}

export interface UserDataStore {
  users: UserRecord[];
  favorites: Record<string, number[]>; // userId -> movieIds
  watchlist: Record<string, number[]>; // userId -> movieIds
  history: Record<string, { movieId: number; timestamp: string }[]>; // userId -> viewed items
  searchHistory: Record<string, { query: string; timestamp: string }[]>; // userId -> search terms
  reviews: Record<string, { id: string; userId: string; userName: string; movieId: number; content: string; rating: number; createdAt: string }[]>; // movieId -> reviews
}

const STORE_PATH = path.join(process.cwd(), 'server', 'data', 'store.json');

const defaultStore: UserDataStore = {
  users: [],
  favorites: {},
  watchlist: {},
  history: {},
  searchHistory: {},
  reviews: {}
};

export class Store {
  private data: UserDataStore;

  constructor() {
    this.data = this.load();
  }

  private load(): UserDataStore {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        return { ...defaultStore, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.warn('Fallback store load issue, using memory store:', err);
    }
    return { ...defaultStore };
  }

  private save() {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to persist store.json to disk:', err);
    }
  }

  // Users
  findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user: UserRecord): UserRecord {
    this.data.users.push(user);
    if (!this.data.favorites[user.id]) this.data.favorites[user.id] = [];
    if (!this.data.watchlist[user.id]) this.data.watchlist[user.id] = [];
    if (!this.data.history[user.id]) this.data.history[user.id] = [];
    if (!this.data.searchHistory[user.id]) this.data.searchHistory[user.id] = [];
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updates);
      this.save();
    }
    return user;
  }

  // Favorites
  getFavorites(userId: string): number[] {
    return this.data.favorites[userId] || [];
  }

  toggleFavorite(userId: string, movieId: number): boolean {
    if (!this.data.favorites[userId]) this.data.favorites[userId] = [];
    const list = this.data.favorites[userId];
    const index = list.indexOf(movieId);
    let isFav = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(movieId);
      isFav = true;
    }
    this.save();
    return isFav;
  }

  // Watchlist
  getWatchlist(userId: string): number[] {
    return this.data.watchlist[userId] || [];
  }

  toggleWatchlist(userId: string, movieId: number): boolean {
    if (!this.data.watchlist[userId]) this.data.watchlist[userId] = [];
    const list = this.data.watchlist[userId];
    const index = list.indexOf(movieId);
    let inWatchlist = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(movieId);
      inWatchlist = true;
    }
    this.save();
    return inWatchlist;
  }

  // History (Recently Viewed)
  getHistory(userId: string) {
    return this.data.history[userId] || [];
  }

  addHistory(userId: string, movieId: number) {
    if (!this.data.history[userId]) this.data.history[userId] = [];
    const list = this.data.history[userId];
    // Remove if already exists to push to front
    const existingIndex = list.findIndex(h => h.movieId === movieId);
    if (existingIndex > -1) {
      list.splice(existingIndex, 1);
    }
    list.unshift({ movieId, timestamp: new Date().toISOString() });
    // limit history to 50 items
    if (list.length > 50) list.pop();
    this.save();
  }

  // Search History
  getSearchHistory(userId: string) {
    return this.data.searchHistory[userId] || [];
  }

  addSearchHistory(userId: string, query: string) {
    if (!query.trim()) return;
    if (!this.data.searchHistory[userId]) this.data.searchHistory[userId] = [];
    const list = this.data.searchHistory[userId];
    const clean = query.trim();
    const existing = list.findIndex(s => s.query.toLowerCase() === clean.toLowerCase());
    if (existing > -1) list.splice(existing, 1);
    list.unshift({ query: clean, timestamp: new Date().toISOString() });
    if (list.length > 20) list.pop();
    this.save();
  }

  clearSearchHistory(userId: string) {
    this.data.searchHistory[userId] = [];
    this.save();
  }

  // Reviews
  getReviewsForMovie(movieId: number) {
    return this.data.reviews[String(movieId)] || [];
  }

  addReview(movieId: number, review: { id: string; userId: string; userName: string; content: string; rating: number; createdAt: string }) {
    const key = String(movieId);
    if (!this.data.reviews[key]) this.data.reviews[key] = [];
    this.data.reviews[key].unshift({ ...review, movieId });
    this.save();
  }
}

export const localStore = new Store();
