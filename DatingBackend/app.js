const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytes } = require('firebase/storage');
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
  city: { type: String },
  state: { type: String },
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

  client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: phone, channel: 'sms' })
    .then(verification => res.json({ success: true, sid: verification.sid }))
    .catch(error => {
      console.error('Failed to send verification code:', error);
      res.status(500).send('Failed to send verification code');
    });
});

// Verify code and complete registration
app.post('/verify-code', async (req, res) => {
  const {
    phone, code, username, email, password, firstName,
    city, location, state, age, gender, interests = [],
    bio = '', images = [], relationshipTypes = [], answers = []
  } = req.body;

  const missingFields = [];
  if (!username) missingFields.push('username');
  if (!email) missingFields.push('email');
  if (!password) missingFields.push('password');
  if (!phone) missingFields.push('phone');

  if (missingFields.length > 0) {
    return res.status(400).send(`Missing required fields: ${missingFields.join(', ')}`);
  }

  try {
    const verification_check = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phone, code });

    console.log('Verification check status:', verification_check.status);

    if (verification_check.status === 'approved') {
      const hashedPassword = await bcrypt.hash(password, 10);

      let profilePictureUrl = 'profile_pictures/default-profile.png';  // Default image URL
      const imageUrls = [];
      if (images.length > 0) {
        for (const image of images) {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            const storageRef = ref(storage, `profile_pictures/${Date.now()}_${username}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(snapshot.ref);
            imageUrls.push(downloadURL);
          } catch (imageError) {
            console.error('Error uploading image:', imageError);
          }
        }
        profilePictureUrl = imageUrls.length > 0 ? imageUrls[0] : profilePictureUrl;
      }

      const user = new User({
        firstName,
        username,
        email,
        password: hashedPassword,
        phone,
        location,
        city,
        state,
        age,
        gender,
        interests,
        bio,
        images: imageUrls,
        profilePicture: profilePictureUrl, // Save the profile picture
        relationshipTypes,
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
    console.error('Failed to verify code or complete registration', {
      message: error.message,
      stack: error.stack,
      error: error,
    });
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    user.lastActive = Date.now();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).send('Server error during login');
  }
});

// Middleware to authenticate users
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(400).send('Invalid token');
  }
};

// Get user profile
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).send('User not found');

    res.json({
      username: user.username,
      age: user.age,
      city: user.city,
      state: user.state,
      phone: user.phone,
      location: user.location,
      relationshipTypes: user.relationshipTypes,
      answers: user.answers,
      gender: user.gender,
      bio: user.bio,
      interests: user.interests,
      images: user.images,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Server error while fetching profile:', error);
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
app.put('/update-profile', authMiddleware, async (req, res) => {
  const { username, profilePicture } = req.body;

  try {
    let profilePictureUrl = profilePicture;
    
    if (profilePicture) {
      profilePictureUrl = profilePicture; 
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

// Fetch users (return full path to profile pictures)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('username profilePicture age city state firstName');

    const userData = users.map((user) => ({
      id: user._id,
      username: user.username,
      age: user.age,
      city: user.city,
      state: user.state,
      profilePicture: user.profilePicture, // Directly use the stored URL
    }));

    res.json(userData);
  } catch (error) {
    console.error('Error fetching users:', error); // Log the error
    res.status(500).send('Server error while fetching users');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
