
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    index: true
  },
  policyNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  policyType: {
    type: String,
    required: true,
    trim: true
  },
  insuranceCompany: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  premiumAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Policy', policySchema);
