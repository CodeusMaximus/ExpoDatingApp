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

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
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
  answers: { type: [String] },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
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

  client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: phone, channel: 'sms' })
    .then(verification => res.json({ success: true, sid: verification.sid }))
    .catch(error => {
      console.error('Error sending code:', error);
      res.status(500).send('Failed to send verification code');
    });
});

// Verify code and complete registration
app.post('/verify-code', async (req, res) => {
  const { phone, code, username, email, password, location, gender, interests, bio, images, answers } = req.body;

  console.log('Verifying code for phone:', phone);
  console.log('Verification code:', code);

  if (!username || !email || !password || !phone) {
    console.error('Missing required fields');
    return res.status(400).send('All fields are required');
  }

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

      try {
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Server error');
      }
    } else {
      res.status(400).send('Invalid verification code');
    }
  } catch (error) {
    console.error('Error verifying code:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to verify code');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('All fields are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
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

app.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.json(user);
});

app.put('/profile', authMiddleware, async (req, res) => {
  const { age, bio, interests, picture } = req.body;
  const user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  user.profile.age = age;
  user.profile.bio = bio;
  user.profile.interests = interests;
  user.profile.picture = picture;

  try {
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
