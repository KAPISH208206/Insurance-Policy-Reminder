
require('dotenv').config();
const { sendWhatsAppMessage } = require('./utils/whatsapp');

const run = async () => {
    const diff = '+919915992006';
    console.log(`Attempting to send WhatsApp message to ${diff}...`);

    // Note: For Twilio Sandbox, the user must have joined by sending "join <sandbox-keyword>" to the sandbox number.
    // Testing with Content Template (Appointment Reminder)
    const contentSid = 'HXb5b62575e6c4ff6129ad7c8cfe1f983c';
    const contentVariables = { "1": "12/1", "2": "3pm" };

    console.log(`Sending Template ${contentSid} to ${diff}...`);
    let success = await sendWhatsAppMessage(diff, null, contentSid, contentVariables);

    if (!success) {
        console.log('⚠️ Template failed (likely not approved for Sandbox). Falling back to simple text...');
        success = await sendWhatsAppMessage(diff, 'Hello! Compliance Reminder: Your appointment is on 12/1 at 3pm. (Simulated Template)');
    }

    if (success) {
        console.log('✅ API Request Accepted.');
        console.log('⚠️ IMPORTANT: If you are using the Twilio Sandbox, you MUST join it first.');
        console.log('   Send "join <your-sandbox-keyword>" to +14155238886 from your phone.');
        console.log('   Otherwise, Twilio will NOT deliver messages to you.');
    } else {
        console.log('❌ Message Failed.');
        // The utility logs the error to console.error, so we should see it in the terminal output if we capture stderr.
    }
};

run();
