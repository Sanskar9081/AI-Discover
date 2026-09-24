import mongoose from 'mongoose';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI environment variable is not defined");
      return;
    }
    cached.promise = mongoose.connect(uri).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`Error connecting to MongoDB: ${error}`);
  }
};
