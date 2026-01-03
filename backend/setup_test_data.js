
const mongoose = require('mongoose');
const Client = require('./models/Client');
const Policy = require('./models/Policy');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/insurance_db');
        console.log('Connected to DB');

        require('./models/Admin');
        const Broker = require('./models/Broker');

        // 0. Create Test Broker
        let broker = await Broker.findOne({ whatsappNumber: '+14155238886' }); // Use sandbox number for broker too
        if (!broker) {
            broker = await Broker.create({
                name: 'Test Broker',
                email: 'broker@test.com',
                password: 'password123',
                whatsappNumber: '+14155238886' // Using Sandbox number to ensure delivery (or could be user's number)
            });
            console.log('Created Test Broker');
        }

        // 1. Create/Update Test Client
        const testMobile = '+919915992006';
        let client = await Client.findOne({ mobileNumber: testMobile });
        if (!client) {
            client = await Client.create({
                name: 'Test User (Kapish)',
                mobileNumber: testMobile,
                email: 'test@example.com',
                adminId: new mongoose.Types.ObjectId(), // Fake admin ID
                brokerId: broker._id // Link to broker
            });
            console.log('Created Test Client');
        } else {
            console.log('Found Test Client');
            client.brokerId = broker._id;
            await client.save();
            console.log('Updated Test Client with Broker');
        }

        // 2. Create Policy Expiring TODAY
        // today at 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const policy = await Policy.create({
            clientId: client._id,
            adminId: client.adminId, // Use same admin ID
            policyNumber: 'TEST-POL-' + Math.floor(Math.random() * 1000),
            policyType: 'Health',        // Corrected from insuranceType
            insuranceCompany: 'HDFC Ergo', // Corrected from provider
            startDate: new Date(),       // Added
            expiryDate: today,
            premiumAmount: 15000
        });
        console.log(`Created Policy ${policy.policyNumber} expiring TODAY (${today})`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
