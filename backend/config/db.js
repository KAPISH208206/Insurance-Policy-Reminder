
const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/insurance_db';

    console.log('Connecting to MongoDB Endpoint...');

    // Create a connection promise
    const connPromise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully');
      return mongoose;
    });

    // Create a timeout promise (3 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB Connection Timed Out (Hard Limit 3s)')), 3000)
    );

    // Race them
    cached.promise = Promise.race([connPromise, timeoutPromise])
      .catch(err => {
        console.error('MongoDB Initial Connection Error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
