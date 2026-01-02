
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuthMiddleware');
const { addPolicy, updatePolicy, deletePolicy, getUpcomingExpiries } = require('../controllers/policyController');
const { runReminderJob } = require('../cron/reminderCron');

router.use(adminAuth);

// Manual trigger for testing
router.post('/trigger-reminders', async (req, res) => {
  try {
    await runReminderJob();
    res.json({ message: 'Reminder job triggered manually and processed.' });
  } catch (err) {
    res.status(500).json({ message: 'Manual trigger failed', error: err.message });
  }
});

router.post('/', addPolicy);
router.get('/upcoming', getUpcomingExpiries);
router.put('/:id', updatePolicy);
router.delete('/:id', deletePolicy);

module.exports = router;
