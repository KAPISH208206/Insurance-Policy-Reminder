
const Broker = require('../models/Broker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerBroker = async (req, res) => {
  try {
    const { name, email, password, whatsappNumber } = req.body;

    // Check if broker already exists
    let broker = await Broker.findOne({ email });
    if (broker) {
      return res.status(400).json({ message: 'Broker with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new broker
    broker = new Broker({
      name,
      email,
      password: hashedPassword,
      whatsappNumber
    });

    await broker.save();
    res.status(201).json({ message: 'Broker registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginBroker = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if broker exists
    const broker = await Broker.findOne({ email });
    if (!broker) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, broker.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const payload = { id: broker._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      broker: {
        id: broker._id,
        name: broker.name,
        email: broker.email,
        whatsappNumber: broker.whatsappNumber
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
