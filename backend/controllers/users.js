const userModel = require('../models/users');
const { generateOTP } = require('../utils/otp');
const { sendEmail } = require('../utils/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
  try {
    const { organization_id } = req.query;
    if (!organization_id) return res.status(400).json({ error: 'organization_id is required' });
    const users = await userModel.getAll(organization_id);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    let userData = { ...req.body };
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password_hash = await bcrypt.hash(userData.password, salt);
      delete userData.password;
    }
    const user = await userModel.create(userData);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userModel.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    await userModel.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = generateOTP();
    const user = await userModel.getByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await userModel.setEmailVerificationToken(user.id, otp);
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);
    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.getByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.email_verification_token !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    await userModel.verifyEmail(user.id);
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.getByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.is_active) return res.status(403).json({ error: 'User is inactive' });
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name, organization_id: user.organization_id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 