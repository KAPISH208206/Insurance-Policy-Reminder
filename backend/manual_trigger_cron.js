
const mongoose = require('mongoose');
// Register models
require('./models/Client');
require('./models/Admin'); // Policy refs Admin too
require('./models/Broker');
require('./models/Policy');
require('./models/ReminderLog');
const { runReminderJob } = require('./cron/reminderCron');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/insurance_db');
        console.log('Connected to DB');

        await runReminderJob();

        console.log('Job finished. Exiting.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
