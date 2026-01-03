
const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/insurance_db');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`MongoDB Connection Error (Attempt ${retries}/${MAX_RETRIES}): ${error.message}`);
      if (retries === MAX_RETRIES) {
        console.error('MAX RETRIES REACHED. Exiting...');
        // Only exit if we truly can't connect after multiple attempts
        process.exit(1);
      }
      // Wait 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
