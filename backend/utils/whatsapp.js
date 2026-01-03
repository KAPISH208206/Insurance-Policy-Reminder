
const twilio = require('twilio');

/**
 * Sends a WhatsApp message using Twilio
 * @param {string} to - The recipient's phone number
 * @param {string} body - The message content
 * @returns {Promise<boolean>} - Success status
 */
const sendWhatsAppMessage = async (to, body, contentSid, contentVariables) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_FROM;

  // Step 13.4: Handle missing/invalid credentials gracefully
  if (!accountSid || !authToken || !fromWhatsAppNumber || accountSid === 'INVALID' || authToken === 'INVALID') {
    console.error('WhatsApp Error: Twilio credentials missing or invalidated. Skipping send.');
    return false;
  }

  try {
    const client = twilio(accountSid, authToken);

    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const formattedFrom = fromWhatsAppNumber.startsWith('whatsapp:') ? fromWhatsAppNumber : `whatsapp:${fromWhatsAppNumber}`;

    const messageOptions = {
      from: formattedFrom,
      to: formattedTo
    };

    if (contentSid) {
      messageOptions.contentSid = contentSid;
      if (contentVariables) {
        messageOptions.contentVariables = JSON.stringify(contentVariables);
      }
    } else {
      messageOptions.body = body;
    }

    const response = await client.messages.create(messageOptions);

    console.log(`WhatsApp Success: SID ${response.sid} to ${to}`);
    return true;
  } catch (error) {
    // Step 13.3: Handle invalid numbers and API errors
    console.error(`WhatsApp Failure to ${to}:`);
    console.error(error);
    return false;
  }
};

module.exports = { sendWhatsAppMessage };
