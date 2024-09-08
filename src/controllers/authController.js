const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const db = require('../db');

const SECRET_KEY = 'your-secret-key'; // Use the same secret key as in the middleware

async function register(req, res) {
  const { username, password } = req.body;

  if (db.getUser(username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User(username, hashedPassword);
  db.addUser(user);

  res.status(201).json({ message: 'User registered successfully' });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = db.getUser(username);

  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
}

function logout(req, res) {
  // In a stateless JWT system, logout is typically handled client-side
  // by removing the token from storage. Here we'll just send a success message.
  res.json({ message: 'Logged out successfully' });
}

module.exports = {
  register,
  login,
  logout
};