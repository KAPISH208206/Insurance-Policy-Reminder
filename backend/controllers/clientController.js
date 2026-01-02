
const Client = require('../models/Client');

exports.addClient = async (req, res) => {
  try {
    const { name, mobileNumber } = req.body;
    const client = new Client({
      name,
      mobileNumber,
      adminId: req.adminId
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
