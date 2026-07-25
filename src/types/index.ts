export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  tagline?: string;
  status?: string;
  original_language?: string;
  production_companies?: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  images?: {
    backdrops: { file_path: string; width: number; height: number }[];
    posters: { file_path: string; width: number; height: number }[];
  };
}

export interface CastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  known_for_department?: string;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface ActorDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  movie_credits?: {
    cast: Movie[];
  };
}

export interface Review {
  id: string;
  author: string;
  author_details?: {
    name?: string;
    username?: string;
    avatar_path?: string | null;
    rating?: number | null;
  };
  content: string;
  created_at: string;
  rating?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferredGenres?: number[];
  createdAt?: string;
}

export interface SearchFilters {
  query: string;
  genre: string;
  year: string;
  minRating: number;
  sortBy: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc' | 'release_date.asc';
  language: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
