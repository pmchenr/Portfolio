// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware to verify JWT token
function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Helper to create JWT and user response
function createAuthResponse(user) {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      username: user.username,
      isSubscriber: user.isSubscriber
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      isSubscriber: user.isSubscriber,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan
    }
  };
}

// POST /api/auth/register - Create new account
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create username from email (before the @)
    let username = email.split('@')[0];
    // Make sure username is unique
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      username = `${username}${Date.now().toString().slice(-4)}`;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      passwordHash,
      name: name || username,
      role: 'user',
      subscriptionStatus: 'none'
    });

    res.status(201).json(createAuthResponse(user));
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login - Login with email/username and password
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Find by username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ message: 'Please login with Google' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(createAuthResponse(user));
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      isSubscriber: user.isSubscriber,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      isSubscriber: user.isSubscriber,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/google - Login/Register with Google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential required' });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with this email (maybe registered with password before)
      user = await User.findOne({ email });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        if (!user.avatar) user.avatar = picture;
        if (!user.name) user.name = name;
        await user.save();
      } else {
        // Create new user
        let username = email.split('@')[0];
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          username = `${username}${Date.now().toString().slice(-4)}`;
        }

        user = await User.create({
          googleId,
          email,
          username,
          name,
          avatar: picture,
          role: 'user',
          subscriptionStatus: 'none'
        });
      }
    } else {
      // Update avatar if changed
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    res.json(createAuthResponse(user));
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ message: 'Invalid Google credential' });
  }
});

module.exports = router;
