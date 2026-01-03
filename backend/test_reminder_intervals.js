const mongoose = require('mongoose');
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
const ReminderLog = mongoose.model('ReminderLog');

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/insurance_db');
        console.log('Connected to DB');

        // Setup Test Data
        let broker = await Broker.findOne({ whatsappNumber: '+14155238886' });
        if (!broker) {
            broker = await Broker.create({ name: 'Test Broker', email: 'broker@test.com', password: 'p', whatsappNumber: '+14155238886' }); // Sandbox number
        }

        const testMobile = '+919915992006';
        let client = await Client.findOne({ mobileNumber: testMobile });
        if (!client) {
            client = await Client.create({ name: 'Test User', mobileNumber: testMobile, email: 'test@ex.com', adminId: new mongoose.Types.ObjectId(), brokerId: broker._id });
        }
        if (!client.brokerId) { client.brokerId = broker._id; await client.save(); }

        // Create Policies for different intervals
        const intervals = [30, 15, 5, 1, 20, 0];
        const policies = [];

        // Clean up old test policies with this specific pattern
        await Policy.deleteMany({ policyNumber: { $regex: /^TEST-INT-/ } });
        await ReminderLog.deleteMany({ policyId: { $in: policies.map(p => p._id) } }); // Checking logic later

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const days of intervals) {
            const targetDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
            // Ensure hours are set? The cron normalizes local time, but we should be careful.
            // Cron uses getISTDate().
            // Let's rely on cron logic.

            const p = await Policy.create({
                clientId: client._id,
                adminId: client.adminId,
                policyNumber: `TEST-INT-${days}DAY-${Math.floor(Math.random() * 1000)}`,
                policyType: 'Test',
                insuranceCompany: 'TestCo',
                startDate: new Date(),
                expiryDate: targetDate, // Cron will read this
                premiumAmount: 100
            });
            policies.push({ id: p._id, days, number: p.policyNumber });
        }
        console.log('Created test policies for days:', intervals);

        // Run Job
        console.log('--- Running Reminder Job ---');
        await runReminderJob();
        console.log('--- Job Finished ---');

        // Verify Logs
        console.log('--- Verification ---');
        const logs = await ReminderLog.find({ policyId: { $in: policies.map(x => x.id) } });

        const expected = [30, 15, 5, 1];
        const unexpected = [20, 0];

        let success = true;

        for (const exp of expected) {
            const pol = policies.find(p => p.days === exp);
            const found = logs.find(l => l.policyId.equals(pol.id) && l.reminderDay === exp);
            if (found) {
                console.log(`[PASS] Log found for ${exp} days (Policy ${pol.number})`);
            } else {
                console.error(`[FAIL] No log found for ${exp} days (Policy ${pol.number})`);
                success = false;
            }
        }

        for (const unexp of unexpected) {
            const pol = policies.find(p => p.days === unexp);
            const found = logs.find(l => l.policyId.equals(pol.id) && l.reminderDay === unexp);
            if (found) {
                console.error(`[FAIL] Log FOUND for ${unexp} days (Policy ${pol.number}) - Should be skipped`);
                success = false;
            } else {
                console.log(`[PASS] No log for ${unexp} days (Correctly skipped)`);
            }
        }

        if (success) {
            console.log('ALL TESTS PASSED');
            process.exit(0);
        } else {
            console.error('SOME TESTS FAILED');
            process.exit(1);
        }

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
