const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB URI
const mongoURI = 'mongodb+srv://dfsturge:Admin@cluster0.uihszq3.mongodb.net/ExpoDatingApp?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  phone: { type: String, unique: true },
  city: String,
  state: String,
  location: {
    coords: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      altitude: Number,
      heading: Number,
      altitudeAccuracy: Number,
      speed: Number,
    },
    mocked: Boolean,
    timestamp: Number,
  },
  gender: String,
  age: Number,
  interests: [String],
  bio: String,
  images: [String],
  profilePicture: String,
  relationshipTypes: [String],
  answers: [String],
  isVerified: Boolean,
  lastActive: Date,
});

const User = mongoose.model('User', userSchema);

// List of random names and cities
const names = [
  'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
  'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo',
  'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew',
  'Luke', 'Asher', 'Carter', 'Julian', 'Grayson', 'Leo', 'Jayden', 'Gabriel', 'Isaac', 'Lincoln',
  'Anthony', 'Hudson', 'Dylan', 'Ezra', 'Thomas', 'Charles', 'Christopher', 'Jaxon', 'Maverick', 'Josiah',
  'Isaiah', 'Andrew', 'Elias', 'Joshua', 'Nathan', 'Caleb', 'Ryan', 'Adrian', 'Miles', 'Eli',
  'Nolan', 'Christian', 'Aaron', 'Cameron', 'Ezekiel', 'Colton', 'Luca', 'Landon', 'Hunter', 'Jonathan',
  'Santiago', 'Axel', 'Easton', 'Cooper', 'Jeremiah', 'Angel', 'Roman', 'Connor', 'Jameson', 'Robert',
  'Greyson', 'Jordan', 'Ian', 'Carson', 'Jaxson', 'Leonardo', 'Nicholas', 'Dominic', 'Austin', 'Everett',
  'Brooks', 'Xavier', 'Kai', 'Jose', 'Parker', 'Adam', 'Jace', 'Wesley', 'Kayden', 'Silas',
];

const nyCities = [
  'New York', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 
  'White Plains', 'Hempstead', 'Troy', 'Niagara Falls', 'Binghamton', 'Freeport', 'Valley Stream', 'Long Beach', 'Rome', 'Ithaca',
  'Brooklyn', 'Queens', 'Manhattan', 'The Bronx', 'Staten Island'
];

// Randomly choose interests
const getRandomInterests = () => {
  const options = [['Men'], ['Women'], ['Men', 'Women']];
  return options[Math.floor(Math.random() * options.length)];
};

// Generate random users
const users = Array.from({ length: 100 }, (_, index) => ({
  firstName: names[index],
  username: `${names[index]}${index + 1}`,
  email: `${names[index].toLowerCase()}${index + 21}@ny.com`,
  password: `${names[index]}${index + 1}`,
  phone: '+13475158741',
  city: nyCities[Math.floor(Math.random() * nyCities.length)],
  state: 'New York',
  location: {
    coords: {
      latitude: 40.712776 + Math.random() * 0.1,  // Approx. NY area
      longitude: -74.005974 + Math.random() * 0.1, // Approx. NY area
      accuracy: 100,
      altitude: -13.5,
      heading: 0,
      altitudeAccuracy: 100,
      speed: 0,
    },
    mocked: false,
    timestamp: Date.now(),
  },
  gender: 'Man',
  age: Math.floor(Math.random() * 30) + 20, // Ages between 20 and 50
  interests: getRandomInterests(),
  bio: 'Looking to explore and meet new people in New York.',
  images: ['https://firebasestorage.googleapis.com/v0/b/mydatingapp-5f1c8.appspot.com/image1.jpg'],
  profilePicture: 'https://firebasestorage.googleapis.com/v0/b/mydatingapp-5f1c8.appspot.com/profile.jpg',
  relationshipTypes: ['Friendship', 'Dating', 'Serious Relationship'],
  answers: Array.from({ length: 14 }, () => 'Looking for meaningful connections.'),
  isVerified: true,
  lastActive: new Date(),
}));

// Function to seed users
const seedUsers = async () => {
  try {
    // Hash passwords
    for (const user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    console.log('Attempting to insert users...');
    await User.insertMany(users);
    console.log('Users inserted successfully');

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting users:', error);
    mongoose.connection.close();
  }
};

// Run the function
seedUsers();
