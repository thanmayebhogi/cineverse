export interface FallbackMovie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  original_language: string;
  trailer_key: string;
  production_companies: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  cast: { id: number; name: string; character: string; profile_path: string }[];
  director: string;
  writer: string;
  reviews: { id: string; author: string; content: string; created_at: string; rating: number }[];
  category: 'trending' | 'popular' | 'top_rated' | 'upcoming' | 'now_playing' | 'disney' | 'action' | 'scifi';
}

export const GENRES_LIST = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export const FALLBACK_MOVIES: FallbackMovie[] = [
  {
    id: 101,
    title: "Dune: Part Two",
    original_title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    release_date: "2024-02-27",
    vote_average: 8.6,
    vote_count: 5420,
    popularity: 2950.4,
    genre_ids: [878, 12],
    genres: [{ id: 878, name: "Science Fiction" }, { id: 12, name: "Adventure" }],
    runtime: 166,
    budget: 190000000,
    revenue: 711800000,
    tagline: "Long live the fighters.",
    status: "Released",
    original_language: "en",
    trailer_key: "Way9Dexny3w",
    production_companies: [{ id: 923, logo_path: null, name: "Legendary Pictures", origin_country: "US" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 501, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
      { id: 502, name: "Zendaya", character: "Chani", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" },
      { id: 503, name: "Rebecca Ferguson", character: "Lady Jessica", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80" },
      { id: 504, name: "Javier Bardem", character: "Stilgar", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "Denis Villeneuve",
    writer: "Denis Villeneuve, Jon Spaihts",
    reviews: [
      { id: "r101", author: "CinematicVision", content: "A breathtaking sci-fi masterpiece with stunning visuals and unmatched sound design.", created_at: "2024-03-01", rating: 9.5 },
      { id: "r102", author: "FilmBuff99", content: "Chalamet and Zendaya deliver powerhouse performances. Truly epic storytelling.", created_at: "2024-03-05", rating: 9.0 }
    ],
    category: "trending"
  },
  {
    id: 102,
    title: "Oppenheimer",
    original_title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, examining the moral dilemmas and political fallout that followed.",
    poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    release_date: "2023-07-19",
    vote_average: 8.8,
    vote_count: 8900,
    popularity: 2420.1,
    genre_ids: [18, 36],
    genres: [{ id: 18, name: "Drama" }, { id: 36, name: "History" }],
    runtime: 180,
    budget: 100000000,
    revenue: 957000000,
    tagline: "The world forever changes.",
    status: "Released",
    original_language: "en",
    trailer_key: "uYPbbksJxIg",
    production_companies: [{ id: 33, logo_path: null, name: "Universal Pictures", origin_country: "US" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 505, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80" },
      { id: 506, name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profile_path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80" },
      { id: 507, name: "Matt Damon", character: "Leslie Groves", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80" },
      { id: 508, name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "Christopher Nolan",
    writer: "Christopher Nolan",
    reviews: [
      { id: "r103", author: "NolanEnthusiast", content: "An unforgettable biographical drama with hypnotic editing and score.", created_at: "2023-08-10", rating: 9.8 }
    ],
    category: "top_rated"
  },
  {
    id: 103,
    title: "Interstellar",
    original_title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80",
    release_date: "2014-11-05",
    vote_average: 8.7,
    vote_count: 34100,
    popularity: 3100.8,
    genre_ids: [878, 18, 12],
    genres: [{ id: 878, name: "Science Fiction" }, { id: 18, name: "Drama" }, { id: 12, name: "Adventure" }],
    runtime: 169,
    budget: 165000000,
    revenue: 701729206,
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    status: "Released",
    original_language: "en",
    trailer_key: "zSWdZVtXT7E",
    production_companies: [{ id: 923, logo_path: null, name: "Syncopy", origin_country: "GB" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 509, name: "Matthew McConaughey", character: "Joseph Cooper", profile_path: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80" },
      { id: 510, name: "Anne Hathaway", character: "Dr. Amelia Brand", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" },
      { id: 511, name: "Jessica Chastain", character: "Murphy Cooper", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "Christopher Nolan",
    writer: "Jonathan Nolan, Christopher Nolan",
    reviews: [
      { id: "r104", author: "CosmoObserver", content: "Hans Zimmer's score paired with emotional storytelling makes this legendary.", created_at: "2022-01-15", rating: 10 }
    ],
    category: "scifi"
  },
  {
    id: 104,
    title: "Avatar: The Way of Water",
    original_title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, Jake Sully and Neytiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora.",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
    release_date: "2022-12-14",
    vote_average: 7.7,
    vote_count: 10800,
    popularity: 2800.5,
    genre_ids: [878, 12, 28],
    genres: [{ id: 878, name: "Science Fiction" }, { id: 12, name: "Adventure" }, { id: 28, name: "Action" }],
    runtime: 192,
    budget: 350000000,
    revenue: 2320250281,
    tagline: "Return to Pandora.",
    status: "Released",
    original_language: "en",
    trailer_key: "d9MyW72ELq0",
    production_companies: [{ id: 574, logo_path: null, name: "Lightstorm Entertainment", origin_country: "US" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 512, name: "Sam Worthington", character: "Jake Sully", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" },
      { id: 513, name: "Zoe Saldaña", character: "Neytiri", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" },
      { id: 514, name: "Sigourney Weaver", character: "Kiri", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "James Cameron",
    writer: "James Cameron, Rick Jaffa, Amanda Silver",
    reviews: [
      { id: "r105", author: "PandoraFan", content: "Visual effects unlike anything ever produced in cinema history.", created_at: "2023-01-05", rating: 8.5 }
    ],
    category: "disney"
  },
  {
    id: 105,
    title: "The Dark Knight",
    original_title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 31900,
    popularity: 2900.2,
    genre_ids: [28, 80, 18],
    genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 18, name: "Drama" }],
    runtime: 152,
    budget: 185000000,
    revenue: 1004558444,
    tagline: "Welcome to a world without rules.",
    status: "Released",
    original_language: "en",
    trailer_key: "EXeTwQWrcwY",
    production_companies: [{ id: 174, logo_path: null, name: "Warner Bros. Pictures", origin_country: "US" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 515, name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
      { id: 516, name: "Heath Ledger", character: "Joker", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" },
      { id: 517, name: "Aaron Eckhart", character: "Harvey Dent", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "Christopher Nolan",
    writer: "Jonathan Nolan, Christopher Nolan",
    reviews: [
      { id: "r106", author: "GothamKnight", content: "Heath Ledger's Joker is the greatest villain performance of all time.", created_at: "2021-05-12", rating: 10 }
    ],
    category: "action"
  },
  {
    id: 106,
    title: "Spider-Man: Across the Spider-Verse",
    original_title: "Spider-Man: Across the Spider-Verse",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    poster_path: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80",
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 6200,
    popularity: 2600.0,
    genre_ids: [16, 28, 12, 878],
    genres: [{ id: 16, name: "Animation" }, { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 878, name: "Science Fiction" }],
    runtime: 140,
    budget: 100000000,
    revenue: 690516673,
    tagline: "It's how you wear the mask that matters.",
    status: "Released",
    original_language: "en",
    trailer_key: "cqGjhVJWtEg",
    production_companies: [{ id: 5, logo_path: null, name: "Columbia Pictures", origin_country: "US" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 518, name: "Shameik Moore", character: "Miles Morales / Spider-Man", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
      { id: 519, name: "Hailee Steinfeld", character: "Gwen Stacy / Spider-Woman", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" },
      { id: 520, name: "Oscar Isaac", character: "Miguel O'Hara / Spider-Man 2099", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    writer: "Phil Lord, Christopher Miller, Dave Callaham",
    reviews: [
      { id: "r107", author: "WebSlinger", content: "Visual artistry at its peak. Every frame is a museum painting.", created_at: "2023-06-15", rating: 9.7 }
    ],
    category: "popular"
  },
  {
    id: 107,
    title: "Deadpool & Wolverine",
    original_title: "Deadpool & Wolverine",
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit up again with an even more reluctant Wolverine.",
    poster_path: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
    release_date: "2024-07-24",
    vote_average: 7.7,
    vote_count: 4800,
    popularity: 3500.2,
    genre_ids: [28, 35, 878],
    genres: [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }, { id: 878, name: "Science Fiction" }],
    runtime: 128,
    budget: 200000000,
    revenue: 1337000000,
    tagline: "Everyone deserves a happy ending.",
    status: "Released",
    original_language: "en",
    trailer_key: "73_1biulkYk",
    production_companies: [{ id: 420, logo_path: null, name: "Marvel Studios", origin_country: "US" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 521, name: "Ryan Reynolds", character: "Wade Wilson / Deadpool", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
      { id: 522, name: "Hugh Jackman", character: "Logan / Wolverine", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" },
      { id: 523, name: "Emma Corrin", character: "Cassandra Nova", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "Shawn Levy",
    writer: "Ryan Reynolds, Rhett Reese, Paul Wernick, Zeb Wells, Shawn Levy",
    reviews: [
      { id: "r108", author: "MarvelGeek", content: "Hilarious, action-packed, and full of nostalgic cameos!", created_at: "2024-07-28", rating: 8.8 }
    ],
    category: "now_playing"
  },
  {
    id: 108,
    title: "Gladiator II",
    original_title: "Gladiator II",
    overview: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
    poster_path: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    release_date: "2024-11-13",
    vote_average: 7.9,
    vote_count: 2100,
    popularity: 2980.0,
    genre_ids: [28, 12, 18],
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 18, name: "Drama" }],
    runtime: 148,
    budget: 250000000,
    revenue: 460000000,
    tagline: "Prepare for glory.",
    status: "Released",
    original_language: "en",
    trailer_key: "4rgYUipGJNo",
    production_companies: [{ id: 4, logo_path: null, name: "Paramount Pictures", origin_country: "US" }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    cast: [
      { id: 524, name: "Paul Mescal", character: "Lucius Verus", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
      { id: 525, name: "Pedro Pascal", character: "Marcus Acacius", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" },
      { id: 526, name: "Denzel Washington", character: "Macrinus", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80" }
    ],
    director: "Ridley Scott",
    writer: "David Scarpa",
    reviews: [
      { id: "r109", author: "RomeHistorian", content: "Thrilling colosseum battles and Denzel Washington shines brilliantly.", created_at: "2024-11-20", rating: 8.2 }
    ],
    category: "upcoming"
  }
];
