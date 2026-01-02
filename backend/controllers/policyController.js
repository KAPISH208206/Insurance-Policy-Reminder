
const Policy = require('../models/Policy');
const Client = require('../models/Client');

exports.addPolicy = async (req, res) => {
  try {
    const { clientId, policyNumber, policyType, insuranceCompany, startDate, expiryDate, premiumAmount } = req.body;
    
    // Validate client ownership
    const client = await Client.findOne({ _id: clientId, adminId: req.adminId });
    if (!client) return res.status(403).json({ message: 'Invalid client or unauthorized' });

    const policy = new Policy({
      clientId,
      adminId: req.adminId,
      policyNumber,
      policyType,
      insuranceCompany,
      startDate,
      expiryDate,
      premiumAmount
    });
    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOneAndUpdate(
      { _id: req.params.id, adminId: req.adminId },
      req.body,
      { new: true }
    );
    if (!policy) return res.status(404).json({ message: 'Policy not found or unauthorized' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOneAndDelete({ _id: req.params.id, adminId: req.adminId });
    if (!policy) return res.status(404).json({ message: 'Policy not found or unauthorized' });
    res.json({ message: 'Policy deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUpcomingExpiries = async (req, res) => {
  try {
    const now = new Date();
    const policies = await Policy.find({
      adminId: req.adminId,
      expiryDate: { $gte: now }
    })
    .sort({ expiryDate: 1 })
    .populate('clientId', 'name mobileNumber');
    
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
