import { Router } from 'express';
import {
  getFavorites,
  toggleFavorite,
  getWatchlist,
  toggleWatchlist,
  getHistory,
  addHistory,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  getMovieReviews,
  addMovieReview
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/favorites', authenticateToken, getFavorites);
router.post('/favorites/toggle', authenticateToken, toggleFavorite);

router.get('/watchlist', authenticateToken, getWatchlist);
router.post('/watchlist/toggle', authenticateToken, toggleWatchlist);

router.get('/history', authenticateToken, getHistory);
router.post('/history/add', authenticateToken, addHistory);

router.get('/search-history', authenticateToken, getSearchHistory);
router.post('/search-history/add', authenticateToken, addSearchHistory);
router.delete('/search-history', authenticateToken, clearSearchHistory);

router.get('/reviews/:movieId', getMovieReviews);
router.post('/reviews/add', authenticateToken, addMovieReview);

export default router;
