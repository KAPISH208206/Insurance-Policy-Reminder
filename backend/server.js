
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initCron } = require('./cron/reminderCron');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins (simpler for Vercel deployment debugging)
  credentials: true
}));
app.use(express.json());

// Ensure DB is connected before handling any request (Critical for Serverless with bufferCommands: false)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed in middleware:', err);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/admin', require('./routes/admin'));
app.use('/clients', require('./routes/clients'));
app.use('/policies', require('./routes/policies'));

// Initialize Cron Job
initCron();

// Basic Route
app.get('/', (req, res) => {
  res.send('Insurance Backend API is running. Please access the frontend at http://localhost:3000');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Insurance Backend is running' });
});

// Vercel Cron Route
app.get('/api/cron', async (req, res) => {
  // Validate Vercel Cron Header to prevent abuse
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { runReminderJob } = require('./cron/reminderCron');
    console.log('--- Triggering Cron via Vercel Route ---');
    await runReminderJob();
    res.json({ message: 'Cron job executed successfully' });
  } catch (err) {
    console.error('Cron Route Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// Only listen if not running in Vercel (Vercel exports the app)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Global Error Handling to prevent crash
// Global Error Handling
// Note: In serverless, we generally want to let errors bubble up or be caught by middleware.
// Explicitly shutting down the process is bad practice in Vercel.

module.exports = app;
