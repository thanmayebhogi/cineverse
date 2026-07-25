import { Request, Response } from 'express';
import axios from 'axios';
import { FALLBACK_MOVIES, GENRES_LIST, FallbackMovie } from '../data/fallbackMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_TMDB_KEY = '10bb577f7f89bb9c630a7ec536f169ba';

async function fetchFromTMDB(endpoint: string, params: Record<string, any> = {}) {
  const apiKey = process.env.TMDB_API_KEY || DEFAULT_TMDB_KEY;
  if (!apiKey) return null;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: apiKey,
        ...params
      },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    console.warn(`TMDB API call failed for ${endpoint}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getTrendingMovies(req: Request, res: Response) {
  const tmdbData = await fetchFromTMDB('/trending/movie/week');
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }
  return res.json({ results: FALLBACK_MOVIES });
}

export async function getPopularMovies(req: Request, res: Response) {
  const tmdbData = await fetchFromTMDB('/movie/popular');
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }
  return res.json({ results: FALLBACK_MOVIES.filter(m => m.category === 'popular' || m.popularity > 2500) });
}

export async function getTopRatedMovies(req: Request, res: Response) {
  const tmdbData = await fetchFromTMDB('/movie/top_rated');
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }
  return res.json({ results: FALLBACK_MOVIES.filter(m => m.vote_average >= 8.0) });
}

export async function getUpcomingMovies(req: Request, res: Response) {
  const tmdbData = await fetchFromTMDB('/movie/upcoming');
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }
  return res.json({ results: FALLBACK_MOVIES.filter(m => m.category === 'upcoming') });
}

export async function getNowPlayingMovies(req: Request, res: Response) {
  const tmdbData = await fetchFromTMDB('/movie/now_playing');
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }
  return res.json({ results: FALLBACK_MOVIES.filter(m => m.category === 'now_playing' || m.category === 'trending') });
}

export async function getGenres(_req: Request, res: Response) {
  const tmdbData = await fetchFromTMDB('/genre/movie/list');
  if (tmdbData && tmdbData.genres) {
    return res.json({ genres: tmdbData.genres });
  }
  return res.json({ genres: GENRES_LIST });
}

export async function getMovieDetails(req: Request, res: Response) {
  const movieId = Number(req.params.id);
  const tmdbData = await fetchFromTMDB(`/movie/${movieId}`, { append_to_response: 'videos,credits,images,similar,recommendations,reviews' });
  if (tmdbData) {
    return res.json(tmdbData);
  }

  // Fallback search
  const movie = FALLBACK_MOVIES.find(m => m.id === movieId) || FALLBACK_MOVIES[0];
  const formattedMovie = {
    ...movie,
    videos: {
      results: [
        { id: 'v1', key: movie.trailer_key, name: `${movie.title} Official Trailer`, site: 'YouTube', type: 'Trailer', official: true }
      ]
    },
    credits: {
      cast: movie.cast.map(c => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path
      })),
      crew: [
        { id: 901, name: movie.director, job: 'Director', department: 'Directing', profile_path: null },
        { id: 902, name: movie.writer, job: 'Writer', department: 'Writing', profile_path: null }
      ]
    },
    images: {
      backdrops: [{ file_path: movie.backdrop_path, width: 1920, height: 1080 }],
      posters: [{ file_path: movie.poster_path, width: 1000, height: 1500 }]
    },
    reviews: {
      results: movie.reviews.map(r => ({
        id: r.id,
        author: r.author,
        content: r.content,
        created_at: r.created_at,
        author_details: { rating: r.rating }
      }))
    }
  };

  return res.json(formattedMovie);
}

export async function searchMovies(req: Request, res: Response) {
  const query = (req.query.q as string) || '';
  if (!query.trim()) {
    return res.json({ results: [] });
  }

  const tmdbData = await fetchFromTMDB('/search/movie', { query });
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }

  const qLower = query.toLowerCase();
  const matched = FALLBACK_MOVIES.filter(m =>
    m.title.toLowerCase().includes(qLower) ||
    m.overview.toLowerCase().includes(qLower) ||
    m.genres.some(g => g.name.toLowerCase().includes(qLower)) ||
    m.director.toLowerCase().includes(qLower) ||
    m.cast.some(c => c.name.toLowerCase().includes(qLower))
  );

  return res.json({ results: matched });
}

export async function discoverMovies(req: Request, res: Response) {
  const { genre, year, minRating, sortBy, language, page = 1 } = req.query;

  const params: Record<string, any> = { page };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  if (minRating) params['vote_average.gte'] = minRating;
  if (sortBy) params.sort_by = sortBy;
  if (language) params.with_original_language = language;

  const tmdbData = await fetchFromTMDB('/discover/movie', params);
  if (tmdbData && tmdbData.results) {
    return res.json(tmdbData);
  }

  let results = [...FALLBACK_MOVIES];

  if (genre) {
    const genreId = Number(genre);
    results = results.filter(m => m.genre_ids.includes(genreId));
  }
  if (year) {
    results = results.filter(m => m.release_date.startsWith(String(year)));
  }
  if (minRating) {
    const ratingNum = Number(minRating);
    results = results.filter(m => m.vote_average >= ratingNum);
  }
  if (language) {
    results = results.filter(m => m.original_language === language);
  }

  if (sortBy === 'vote_average.desc') {
    results.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy === 'release_date.desc') {
    results.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  } else if (sortBy === 'release_date.asc') {
    results.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
  } else {
    results.sort((a, b) => b.popularity - a.popularity);
  }

  return res.json({
    page: Number(page),
    total_pages: 1,
    total_results: results.length,
    results
  });
}

export async function getActorDetails(req: Request, res: Response) {
  const actorId = Number(req.params.id);
  const tmdbData = await fetchFromTMDB(`/person/${actorId}`, { append_to_response: 'movie_credits' });
  if (tmdbData) {
    return res.json(tmdbData);
  }

  // Fallback actor profile
  let foundActor: { id: number; name: string; character: string; profile_path: string } | null = null;
  let knownMovies: FallbackMovie[] = [];

  for (const movie of FALLBACK_MOVIES) {
    const actor = movie.cast.find(c => c.id === actorId);
    if (actor) {
      foundActor = actor;
      knownMovies.push(movie);
    }
  }

  if (!foundActor) {
    foundActor = FALLBACK_MOVIES[0].cast[0];
    knownMovies = [FALLBACK_MOVIES[0]];
  }

  return res.json({
    id: foundActor.id,
    name: foundActor.name,
    biography: `${foundActor.name} is a critically acclaimed actor renowned for captivating performances in cinematic blockbusters and award-winning dramas worldwide.`,
    birthday: '1988-06-15',
    place_of_birth: 'Los Angeles, California, USA',
    profile_path: foundActor.profile_path,
    known_for_department: 'Acting',
    popularity: 94.5,
    movie_credits: {
      cast: knownMovies
    }
  });
}

export async function getRandomMovie(_req: Request, res: Response) {
  const randomIndex = Math.floor(Math.random() * FALLBACK_MOVIES.length);
  return res.json(FALLBACK_MOVIES[randomIndex]);
}
