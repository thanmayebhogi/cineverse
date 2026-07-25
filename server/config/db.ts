import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI not provided. CineVerse is running with fast local persistence store.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, falling back to local persistence store:', error);
    return false;
  }
}
