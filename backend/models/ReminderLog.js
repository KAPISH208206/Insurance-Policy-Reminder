
const mongoose = require('mongoose');

const reminderLogSchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  },
  reminderDay: {
    type: Number,
    enum: [30, 20, 15, 10, 5, 1, 0],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReminderLog', reminderLogSchema);
