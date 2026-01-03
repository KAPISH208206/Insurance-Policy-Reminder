
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
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Global Error Handling to prevent crash
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  // Ideally restart logic here, but for now log it.
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
});
