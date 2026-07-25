import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import tmdbRoutes from './server/routes/tmdbRoutes';
import userRoutes from './server/routes/userRoutes';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect Database (with automatic local store fallback)
  await connectDB();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tmdb', tmdbRoutes);
  app.use('/api/user', userRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'CineVerse OTT Streaming Engine' });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CineVerse OTT Server running at http://localhost:${PORT}`);
});
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
