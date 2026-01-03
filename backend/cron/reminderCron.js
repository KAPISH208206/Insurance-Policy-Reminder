
const cron = require('node-cron');
const Policy = require('../models/Policy');
const ReminderLog = require('../models/ReminderLog');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

/**
 * Utility to get current date in IST (UTC+5:30)
 */
const getISTDate = () => {
  const now = new Date();
  // IST is UTC + 5.5 hours
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  istDate.setUTCHours(0, 0, 0, 0);
  return istDate;
};

/**
 * Logic to calculate days remaining and trigger reminders
 * Exported to allow manual triggering for Step 13 testing.
 */
const runReminderJob = async () => {
  console.log(`[${new Date().toISOString()}] Cron Job Started: Checking for policy expiries...`);

  try {
    // Step 14.2: Ensure date comparison uses IST logic
    const todayIST = getISTDate();

    // Populate client and broker details for message personalization
    const policies = await Policy.find().populate({
      path: 'clientId',
      populate: { path: 'brokerId' }
    });

    // Updated milestones: 30, 15, 5, 1 days before expiry
    const targetMilestones = [30, 15, 5, 1];

    for (const policy of policies) {
      const expiry = new Date(policy.expiryDate);
      // Normalize expiry to start of its day for comparison
      expiry.setHours(0, 0, 0, 0);

      const diffTime = expiry.getTime() - todayIST.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (targetMilestones.includes(diffDays)) {
        // Step 13.2: Duplicate Prevention Rule
        const alreadySent = await ReminderLog.findOne({
          policyId: policy._id,
          reminderDay: diffDays
        });

        if (alreadySent) {
          console.log(`Skipping: Reminder for Policy ${policy.policyNumber} at milestone ${diffDays} already sent.`);
          continue;
        }

        const client = policy.clientId;
        const broker = client?.brokerId;

        if (!client || !broker) {
          console.warn(`Missing relations for Policy ${policy.policyNumber}. Skipping.`);
          continue;
        }

        // Content Template Logic
        const contentSid = process.env.TWILIO_CONTENT_SID;
        const expiryStr = policy.expiryDate.toDateString();
        // Variable Mapping: "1" = Date, "2" = Time (or generic "End of Day")
        const contentVariables = { "1": expiryStr, "2": "End of Day" };
        const daysLabel = diffDays === 0 ? "TODAY" : `in ${diffDays} days`;

        // Fallback text if template fails (e.g. not joined sandbox)
        const fallbackMessage = `Hi ${client.name}, your policy ${policy.policyNumber} is expiring ${daysLabel} (${expiryStr}). Please contact your broker at ${broker.whatsappNumber} for assistance.`;

        // Step 13.3 & 13.4: Send WhatsApp with template (supports client and broker)
        // Send to Client (Template)
        let clientSent = await sendWhatsAppMessage(client.mobileNumber, fallbackMessage, contentSid, contentVariables);
        if (!clientSent) {
          console.log(`Template failed for client ${client.name}, falling back to text.`);
          clientSent = await sendWhatsAppMessage(client.mobileNumber, fallbackMessage);
        }

        // Send to Broker (Plain Text is safer/clearer for internal alerts, or could use template too)
        // For broker, keeping plain text message for clarity on WHICH client it is.
        const brokerMessage = `Reminder Alert: Client ${client.name}'s policy ${policy.policyNumber} expires ${daysLabel} (${expiryStr}).`;
        const brokerSent = await sendWhatsAppMessage(broker.whatsappNumber, brokerMessage);

        // Step 13.3: Logging status (success/failed)
        await ReminderLog.create({
          policyId: policy._id,
          reminderDay: diffDays,
          sentAt: new Date(),
          status: (clientSent && brokerSent) ? 'success' : 'failed'
        });

        console.log(`Processed: Policy ${policy.policyNumber} (${diffDays} days left). Status: ${clientSent && brokerSent ? 'Success' : 'Partial/Failed'}`);
      }
    }
    console.log('Cron Job Completed.');
  } catch (error) {
    // Step 13.4: Handle failure gracefully, server must not crash
    console.error('CRITICAL: Reminder Cron Job Error:', error.message);
  }
};

/**
 * Initialize the cron job to run at 9:00 AM daily
 */
const initCron = () => {
  // Cron schedule: 0 9 * * * (9:00 AM)
  // Step 13.5: Cron resumes correctly on server restart
  cron.schedule('0 9 * * *', runReminderJob);
  console.log('Daily Expiry Reminder Cron initialized for 9:00 AM IST.');
};

module.exports = { initCron, runReminderJob };
