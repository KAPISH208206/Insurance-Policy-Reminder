
const mongoose = require('mongoose');
// Register models
require('./models/Client');
require('./models/Admin');
require('./models/Broker');
require('./models/Policy');
require('./models/ReminderLog');
const { runReminderJob } = require('./cron/reminderCron');
require('dotenv').config();
const Client = mongoose.model('Client');
const Policy = mongoose.model('Policy');
const Broker = mongoose.model('Broker');

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/insurance_db');
        console.log('Connected to DB');

        // 1. Get/Create Broker & Client
        let broker = await Broker.findOne({ whatsappNumber: '+14155238886' });
        if (!broker) {
            broker = await Broker.create({
                name: 'Test Broker 30',
                email: 'broker30@test.com',
                password: 'password123',
                whatsappNumber: '+14155238886'
            });
        }

        const testMobile = '+919915992006'; // User's number
        let client = await Client.findOne({ mobileNumber: testMobile });
        if (!client) {
            client = await Client.create({
                name: 'Test 30Day User',
                mobileNumber: testMobile,
                email: 'test30@example.com',
                adminId: new mongoose.Types.ObjectId(),
                brokerId: broker._id
            });
        }

        // Ensure client has broker
        if (!client.brokerId) {
            client.brokerId = broker._id;
            await client.save();
        }

        // 2. Create Policy Expiring in EXACTLY 30 Days
        const today = new Date();
        // Add 30 days
        const targetDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        targetDate.setHours(0, 0, 0, 0); // Normalize

        const policy = await Policy.create({
            clientId: client._id,
            adminId: client.adminId,
            policyNumber: 'TEST-30DAY-' + Math.floor(Math.random() * 1000),
            policyType: 'Life',
            insuranceCompany: 'LIC',
            startDate: new Date(),
            expiryDate: targetDate,
            premiumAmount: 5000
        });
        console.log(`Created Policy ${policy.policyNumber} expiring on ${targetDate} (30 days from now)`);

        // 3. Trigger Job
        console.log('--- Triggering Reminder Job ---');
        await runReminderJob();
        console.log('--- Job Finished ---');

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
