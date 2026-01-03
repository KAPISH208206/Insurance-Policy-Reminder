
const Client = require('../models/Client');

exports.addClient = async (req, res) => {
  try {
    const { name, mobileNumber } = req.body;

    // Auto-link Broker: Try finding by Admin email, fallback to any Broker
    const Admin = require('../models/Admin');
    const Broker = require('../models/Broker');

    const admin = await Admin.findById(req.adminId);
    let broker = await Broker.findOne({ email: admin.email });

    if (!broker) {
      // Fallback: Use the most recent broker (assumes single-tenant or main broker)
      broker = await Broker.findOne().sort({ createdAt: -1 });
    }

    const client = new Client({
      name,
      mobileNumber,
      adminId: req.adminId,
      brokerId: broker ? broker._id : null
    });

    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { name, mobileNumber } = req.body;
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, adminId: req.adminId },
      { name, mobileNumber },
      { new: true }
    );
    if (!client) return res.status(404).json({ message: 'Client not found or unauthorized' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, adminId: req.adminId });
    if (!client) return res.status(404).json({ message: 'Client not found or unauthorized' });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ adminId: req.adminId });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
