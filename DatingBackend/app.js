const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Define the User Schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String, unique: true },
  country: { type: String },
  zipcode: { type: String },
  location: {
    coords: {
      latitude: { type: Number },
      longitude: { type: Number },
      accuracy: { type: Number },
      altitude: { type: Number },
      heading: { type: Number },
      altitudeAccuracy: { type: Number },
      speed: { type: Number },
    },
    mocked: { type: Boolean },
    timestamp: { type: Number }
  },
  gender: { type: String },
  age: { type: Number },
  interests: { type: [String] },
  bio: { type: String },
  images: { type: [String] }, // Store Firebase Storage URLs
  profilePicture: { type: String }, // Store Firebase Storage URL
  relationshipTypes: { type: [String] },
  answers: { type: [String] },
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

  console.log('Sending verification code to:', phone);

  client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: phone, channel: 'sms' })
    .then(verification => {
      console.log('Verification sent:', verification);
      res.json({ success: true, sid: verification.sid });
    })
    .catch(error => {
      console.error('Error sending code:', error);
      res.status(500).send('Failed to send verification code');
    });
});

// Verify code and complete registration
app.post('/verify-code', async (req, res) => {
  const {
    phone, code, username, email, password, firstName,
    country, location, zipcode, age, gender, interests = [],
    bio = '', images = [], relationshipTypes = [], answers = []
  } = req.body;

  const missingFields = [];
  if (!username) missingFields.push('username');
  if (!email) missingFields.push('email');
  if (!password) missingFields.push('password');
  if (!phone) missingFields.push('phone');

  if (missingFields.length > 0) {
    console.log('Missing required fields during registration:', missingFields);
    return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
  }

  console.log('Received fields:', req.body);

  try {
    const verification_check = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phone, code });

    console.log('Verification check status:', verification_check.status);

    if (verification_check.status === 'approved') {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload images to Firebase Storage
      const imageUrls = [];
      for (const image of images) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `user_images/${Date.now()}_${username}`);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }

      const user = new User({
        username,
        email,
        password: hashedPassword,
        phone,
        location,
        country,
        zipcode,
        age,
        gender,
        interests,
        bio,
        images: imageUrls,
        relationshipTypes,
        answers,
        isVerified: true,
      });

      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('User registered and token generated:', token);
      res.json({ token });
    } else {
      console.log('Invalid verification code');
      res.status(400).send('Invalid verification code');
    }
  } catch (error) {
    console.error('Error during verification or registration:', error.message);
    res.status(500).send('Failed to verify code or complete registration');
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password during login');
    return res.status(400).send('All fields are required');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials: user not found');
      return res.status(401).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: password mismatch');
      return res.status(401).send('Invalid credentials');
    }

    // Update last active time
    user.lastActive = Date.now();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('User logged in and token generated:', token);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).send('Server error during login');
  }
});

// Middleware to authenticate users
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('No token provided');
    return res.status(401).send('Access denied');
  }

  try {
    console.log('Received token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token validated, user ID:', decoded.userId);
    next();
  } catch (error) {
    console.error('Invalid token:', error.message);
    res.status(400).send('Invalid token');
  }
};

// Get user profile
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.log('User not found with ID:', req.user.userId);
      return res.status(404).send('User not found');
    }
    console.log('User profile fetched:', user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).send('Server error while fetching profile');
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
app.post('/update-profile', authMiddleware, async (req, res) => {
  const { username, profilePicture } = req.body;

  try {
    let profilePictureUrl = profilePicture;
    
    if (profilePicture) {
      const response = await fetch(profilePicture);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_pictures/${Date.now()}_${username}`);
      const snapshot = await uploadBytes(storageRef, blob);
      profilePictureUrl = await getDownloadURL(snapshot.ref);
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username, profilePicture: profilePictureUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Server error while updating profile');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
