const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  location: {
    country: { type: String },
    zipcode: { type: String },
  },
  gender: { type: String },
  interests: { type: [String] },
  bio: { type: String },
  images: { type: [String] },
  profilePicture: { type: String },
  isVerified: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

// Send verification code
app.post('/send-code', (req, res) => {
  const { phone } = req.body;

  console.log('Sending verification code to:', phone); // Log the phone number

  client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: phone, channel: 'sms' })
    .then(verification => {
      console.log('Verification sent:', verification); // Log the verification details
      res.json({ success: true, sid: verification.sid });
    })
    .catch(error => {
      console.error('Error sending code:', error); // Log any errors
      res.status(500).send('Failed to send verification code');
    });
});

// Verify code and complete registration
app.post('/verify-code', async (req, res) => {
  const { phone, code, username, email, password, location, gender, interests, bio, images, answers } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).send('All fields are required');
  }

  console.log('Verifying code for phone:', phone); // Log the phone and code details
  console.log('Verification code:', code);

  try {
    const verification_check = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phone, code });

    console.log('Verification check status:', verification_check.status);

    if (verification_check.status === 'approved') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        phone,
        location,
        gender,
        interests,
        bio,
        images,
        answers,
        isVerified: true,
      });

      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(400).send('Invalid verification code');
    }
  } catch (error) {
    console.error('Error during verification or registration:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to verify code or complete registration');
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    // Update last active time
    user.lastActive = Date.now();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error); // Log any errors
    res.status(500).send('Server error during login');
  }
});

// Middleware to authenticate users
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

// Get user profile
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server error while fetching profile');
  }
});

// Update user profile
app.put('/profile', authMiddleware, async (req, res) => {
  const { bio, interests, profilePicture } = req.body;

  console.log('Updating profile with:', req.body); // Log the request data

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.bio = bio || user.bio;
    user.interests = interests || user.interests;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error); // Log any errors
    res.status(500).send('Server error while updating profile');
  }
});

// Check username availability
app.post('/check-username', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    res.json({ isAvailable: !user });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).send('Server error while checking username availability');
  }
});

// Check email availability
app.post('/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    res.json({ isAvailable: !user });
  } catch (error) {
    console.error('Error checking email availability:', error);
    res.status(500).send('Server error while checking email availability');
  }
});

// Update profile picture and username
app.post('/update-profile', async (req, res) => {
  const { email, username, profilePicture } = req.body;

  console.log('Updating profile for email:', email); // Log the email and other details

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { username, profilePicture },
      { new: true }
    );

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error); // Log any errors
    res.status(500).send('Server error while updating profile');
  }
});

// Get nearby users
app.get('/nearby-users', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const nearbyUsers = await User.find({
      'location.zipcode': user.location.zipcode,
      _id: { $ne: user._id },
    }).select('-password');

    res.json(nearbyUsers);
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    res.status(500).send('Server error while fetching nearby users');
  }
});

// Get online users
app.get('/online-users', authMiddleware, async (req, res) => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const onlineUsers = await User.find({
      lastActive: { $gte: tenMinutesAgo },
      _id: { $ne: req.user.userId },
    }).select('-password');

    res.json(onlineUsers);
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).send('Server error while fetching online users');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});