import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISearchHistory {
  userId: string;
  query: string;
  createdAt: Date;
}

export interface ISearchHistoryDocument extends ISearchHistory, Document {}

const SearchHistorySchema = new Schema<ISearchHistoryDocument>({
  userId: { type: String, required: true, index: true },
  query: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export const SearchHistoryModel: Model<ISearchHistoryDocument> =
  (mongoose.models.SearchHistory as Model<ISearchHistoryDocument>) ||
  mongoose.model<ISearchHistoryDocument>('SearchHistory', SearchHistorySchema);
