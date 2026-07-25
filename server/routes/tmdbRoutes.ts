import { Router } from 'express';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getGenres,
  getMovieDetails,
  searchMovies,
  discoverMovies,
  getActorDetails,
  getRandomMovie
} from '../controllers/tmdbController';

const router = Router();

router.get('/trending', getTrendingMovies);
router.get('/popular', getPopularMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/now-playing', getNowPlayingMovies);
router.get('/genres', getGenres);
router.get('/search', searchMovies);
router.get('/discover', discoverMovies);
router.get('/random', getRandomMovie);
router.get('/movie/:id', getMovieDetails);
router.get('/actor/:id', getActorDetails);

export default router;
