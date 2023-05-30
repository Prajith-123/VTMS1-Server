const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/config');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ name: user.name, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save new user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error saving new user' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find the user based on the user ID and check if the reset token has expired
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    // Send a success response or redirect to the login page
    res.json({ message: 'Password reset successful' });

  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Generate a reset token and set an expiration time (e.g., 1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Update the user's reset token and reset token expiration in the database
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kumarprajith944@gmail.com',
        pass: 'inyywoodaxgyqxsf',
      },
    });

    // Prepare email options
    const link = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'kumarprajith944@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      html: `
      <p>Click the following link to reset your password:</p>
      <a href="${link}">Reset Password</a>
      <p>This link is valid for 5 minutes only.</p>
    `,
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ message: 'Error sending password recovery email' });
      } else {
        res.json({ message: 'Password recovery email sent' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending password recovery email' });
  }
};

module.exports = { login, register, recoverPassword, resetPassword };