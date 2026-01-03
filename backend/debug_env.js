
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '.env');
console.log('Looking for .env at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('.env Found!');
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        console.error('Error loading .env:', result.error);
    } else {
        console.log('Loaded keys:', Object.keys(result.parsed));
    }
} else {
    console.log('.env NOT Found!');
    // Try listing dir
    console.log('Dir contents:', fs.readdirSync(__dirname));
}

const { sendWhatsAppMessage } = require('./utils/whatsapp');
console.log('SID Env var:', process.env.TWILIO_ACCOUNT_SID ? 'Present' : 'Missing');
