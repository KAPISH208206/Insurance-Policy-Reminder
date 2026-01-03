
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
      bufferCommands: false, // Disable Mongoose buffering for serverless
    };

    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/insurance_db';

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB Connection Error:', err);
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
