import mongoose from 'mongoose';
import env from './env.js';

// Connects to MongoDB if MONGODB_URI is set.
// Returns `true` when connected, `false` otherwise (server keeps running either way).
export async function connectDB() {
  if (!env.mongoUri) {
    console.warn('MONGODB_URI is not set — skipping database connection.');
    return false;
  }

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected.');
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}