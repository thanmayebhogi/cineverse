# CineVerse - Premium OTT Movie Discovery & Search Platform

CineVerse is a full-stack, production-ready OTT movie search and discovery platform inspired by **Netflix**, **IMDb**, and **Disney+**. It delivers real-time movie queries, HD trailer popups, interactive search autocomplete, personalized watchlists & favorites, community reviews, and an interactive "Surprise Me" random movie generator.

---

## 🌟 Key Features

- **Cinematic OTT Billboard Hero**: 6-second auto-rotating movie trailer carousel with real-time ratings and action buttons.
- **Instant Search & Autocomplete**: Debounced live search with dropdown preview, keyboard navigation (`Up`/`Down`/`Enter`), matching text highlights, and search history pills.
- **Comprehensive Explore Filters**: Refine catalog by Genre, Release Year, Minimum IMDb Rating, Language, and Sort By (Popularity, Rating, Release Date).
- **HD YouTube Trailer Player**: Embedded zero-lag trailer modal overlay.
- **Actor & Cast Profiles**: Comprehensive actor biography, birthplace, popularity score, and filmography grid.
- **User Authentication**: JWT-based register, sign-in, and instant 1-click Demo Login.
- **Personalized Collections**: Watchlist, Favorites, Recently Viewed History, and Search History persistence.
- **Resilient Fallback Engine**: Works out-of-the-box with a rich curated catalog even without an active TMDB API key or MongoDB instance!

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite), React Router DOM, Axios, Tailwind CSS v4, Motion (Framer Motion), Lucide React
- **Backend**: Node.js, Express.js, TypeScript (`tsx`, `esbuild`)
- **Database**: MongoDB & Mongoose (with automated local persistence fallback)
- **Authentication**: JWT, bcryptjs
- **Movie API**: TMDB (The Movie Database) API proxy

---

## 🚀 Environment Variables (`.env`)

Create a `.env` file in the project root based on `.env.example`:

```env
# TMDB API Key (Optional: Required for live TMDB data. App includes rich fallback engine when omitted)
TMDB_API_KEY="YOUR_TMDB_API_KEY"

# MongoDB Connection String (Optional: Connects to MongoDB Atlas; otherwise uses local persistence store)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/cineverse?retryWrites=true&w=majority"

# Secret key for JWT authentication
JWT_SECRET="cineverse_super_secret_jwt_key_2026"
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Deployment Guide

- **Frontend**: Vercel / Netlify (Build command: `npm run build`, Output directory: `dist`)
- **Backend**: Render / Cloud Run (Start command: `npm start`)
- **Database**: MongoDB Atlas
