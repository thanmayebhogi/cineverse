import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth';
import { SearchHistoryModel } from '../models/SearchHistory';
import { localStore } from '../data/store';

export async function getSearchHistory(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      try {
        const records = await SearchHistoryModel.find({ userId: req.user.id } as any)
          .sort({ createdAt: -1 })
          .limit(15)
          .lean();

        const searchHistory = records.map((r: any) => ({
          query: r.query,
          timestamp: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString()
        }));

        return res.json({ searchHistory });
      } catch (mongoErr) {
        console.warn('MongoDB search history fetch failed, using local store:', mongoErr);
      }
    }

    const searches = localStore.getSearchHistory(req.user.id);
    return res.json({ searchHistory: searches });
  } catch (err) {
    console.error('Error fetching search history:', err);
    return res.status(500).json({ message: 'Error fetching search history' });
  }
}

export async function addSearchHistory(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { query } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ message: 'Valid search query required' });
    }

    const cleanQuery = query.trim();
    const userId = req.user.id;

    // Always keep local store in sync
    localStore.addSearchHistory(userId, cleanQuery);

    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      try {
        // Remove existing identical queries for this user to keep search history deduplicated and recent
        await SearchHistoryModel.deleteMany({
          userId,
          query: { $regex: new RegExp(`^${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        // Insert new search query record
        await SearchHistoryModel.create({
          userId,
          query: cleanQuery,
          createdAt: new Date()
        });

        // Limit user's history in MongoDB to 20 recent items
        const count = await SearchHistoryModel.countDocuments({ userId } as any);
        if (count > 20) {
          const oldest = await SearchHistoryModel.find({ userId } as any)
            .sort({ createdAt: -1 })
            .skip(20)
            .select('_id');
          if (oldest.length > 0) {
            await SearchHistoryModel.deleteMany({ _id: { $in: oldest.map((doc) => doc._id) } });
          }
        }
      } catch (mongoErr) {
        console.warn('MongoDB search history save failed:', mongoErr);
      }
    }

    return res.json({ message: 'Search history recorded successfully' });
  } catch (err) {
    console.error('Error adding search history:', err);
    return res.status(500).json({ message: 'Error recording search history' });
  }
}

export async function clearSearchHistory(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;

    localStore.clearSearchHistory(userId);

    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      try {
        await SearchHistoryModel.deleteMany({ userId });
      } catch (mongoErr) {
        console.warn('MongoDB search history clear failed:', mongoErr);
      }
    }

    return res.json({ message: 'Search history cleared successfully' });
  } catch (err) {
    console.error('Error clearing search history:', err);
    return res.status(500).json({ message: 'Error clearing search history' });
  }
}
