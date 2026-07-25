# CineVerse - Premium OTT Movie Discovery & Search Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://cineverse-dpj0.onrender.com)


**CineVerse** is a full-stack, production-ready OTT movie discovery and search platform inspired by modern streaming interfaces like *Netflix*, *IMDb*, and *Disney+*. It delivers real-time movie queries, HD trailer previews, interactive search autocomplete, personalized watchlists, user authentication, and a resilient fallback engine.

🌐 **Live Demo:** [https://cineverse-dpj0.onrender.com](https://cineverse-dpj0.onrender.com)

---

## 🌟 Key Features

* **Cinematic OTT Billboard Hero:** Dynamic auto-rotating movie trailer carousel featuring real-time ratings, genres, and quick action buttons.
* **Instant Search & Autocomplete:** Live debounced search with dropdown previews, keyboard navigation (`Up` / `Down` / `Enter`), and search history.
* **Comprehensive Filtering:** Refine catalog by Genre, Release Year, Minimum IMDb Rating, Language, and Sorting parameters (Popularity, Rating, Release Date).
* **HD Trailer Modal:** Zero-lag embedded YouTube trailer player for instant viewing.
* **User Authentication:** Secure JWT-based register, sign-in, and instant 1-click Demo Login.
* **Personalized Collections:** Manage your Watchlist, Favorites, and Recently Viewed items with persistent storage.
* **Resilient Fallback Engine:** Built-in curated catalog fallback that ensures seamless app browsing even without an active external database or API key.

---

## 🛠️ Tech Stack

* **Frontend:** React 19 (Vite), React Router DOM, Axios, Tailwind CSS, Framer Motion, Lucide React
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** MongoDB & Mongoose
* **Authentication:** JWT (JSON Web Tokens), bcryptjs
* **Data Provider:** TMDB (The Movie Database) API

---

## 🚀 Environment Variables (`.env`)

Create a `.env` file in the project root directory with the following keys:

```env
# TMDB API Key (Optional)
TMDB_API_KEY="YOUR_TMDB_API_KEY"

# MongoDB Connection String (Optional)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/cineverse?retryWrites=true&w=majority"

# Secret key for JWT authentication
JWT_SECRET="cineverse_super_secret_jwt_key_2026" 

💻 Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/thanmayebhogi/cineverse.git](https://github.com/thanmayebhogi/cineverse.git)
cd cineverse

☁️ Deployment
Hosting: Hosted as a Web Service on Render

Build Command: npm install && npm run build

Start Command: npm start
