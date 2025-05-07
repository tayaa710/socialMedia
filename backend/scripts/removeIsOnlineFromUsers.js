const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Using MongoDB URI:', MONGODB_URI ? 'URI found' : 'URI not found');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    removeIsOnlineField();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function removeIsOnlineField() {
  try {
    const db = mongoose.connection;
    const usersCollection = db.collection('users');
    
    // Find all users with the isOnline field
    const usersWithIsOnline = await usersCollection.find({ isOnline: { $exists: true } }).toArray();
    console.log(`Found ${usersWithIsOnline.length} users with isOnline field`);
    
    // Remove the isOnline field from all users
    const result = await usersCollection.updateMany(
      { isOnline: { $exists: true } },
      { $unset: { isOnline: "" } }
    );
    
    console.log(`Successfully updated ${result.modifiedCount} users`);
    console.log('Removal of isOnline field completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error during removal of isOnline field:', error);
    mongoose.disconnect();
    process.exit(1);
  }
} 