import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { localStore } from '../data/store';
import { FALLBACK_MOVIES } from '../data/fallbackMovies';

export async function getFavorites(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const ids = localStore.getFavorites(req.user.id);
    return res.json({ movieIds: ids });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching favorites' });
  }
}

export async function toggleFavorite(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Movie ID required' });

    const isFav = localStore.toggleFavorite(req.user.id, Number(movieId));
    return res.json({
      message: isFav ? 'Added to Favorites' : 'Removed from Favorites',
      isFavorite: isFav
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error toggling favorite' });
  }
}

export async function getWatchlist(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const ids = localStore.getWatchlist(req.user.id);
    return res.json({ movieIds: ids });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching watchlist' });
  }
}

export async function toggleWatchlist(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Movie ID required' });

    const inWatchlist = localStore.toggleWatchlist(req.user.id, Number(movieId));
    return res.json({
      message: inWatchlist ? 'Added to Watchlist' : 'Removed from Watchlist',
      inWatchlist
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error toggling watchlist' });
  }
}

export async function getHistory(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const history = localStore.getHistory(req.user.id);
    return res.json({ history });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching history' });
  }
}

export async function addHistory(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Movie ID required' });

    localStore.addHistory(req.user.id, Number(movieId));
    return res.json({ message: 'History updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding to history' });
  }
}

export { getSearchHistory, addSearchHistory, clearSearchHistory } from './searchHistoryController';

export async function getMovieReviews(req: AuthenticatedRequest, res: Response) {
  try {
    const movieId = Number(req.params.movieId);
    const reviews = localStore.getReviewsForMovie(movieId);
    return res.json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching reviews' });
  }
}

export async function addMovieReview(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { movieId, content, rating } = req.body;

    if (!movieId || !content) {
      return res.status(400).json({ message: 'Movie ID and review content are required.' });
    }

    const review = {
      id: 'rev_' + Date.now(),
      userId: req.user.id,
      userName: req.user.name,
      content,
      rating: Number(rating) || 8,
      createdAt: new Date().toISOString()
    };

    localStore.addReview(Number(movieId), review);
    return res.status(201).json({ message: 'Review published successfully!', review });
  } catch (err) {
    return res.status(500).json({ message: 'Error submitting review' });
  }
}
