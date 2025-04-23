const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const MONGODB_URI = process.env.MONGODB_URI
console.log('Connecting to:', MONGODB_URI ? 'MongoDB URI found' : 'MongoDB URI not found')

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    updatePostTimestamps()
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

// Function to generate a random date in ISO format between 2020 and now
function getRandomDate() {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  
  // Format to match the requested format (2021-03-24T13:56:28.216+00:00)
  return randomDate.toISOString().replace('Z', '+00:00')
}

async function updatePostTimestamps() {
  try {
    const db = mongoose.connection
    const postsCollection = db.collection('posts')
    
    // Find all posts
    const posts = await postsCollection.find({}).toArray()
    console.log(`Found ${posts.length} posts to update`)
    
    // Update each post with random createdAt and updatedAt timestamps
    let successCount = 0
    for (const post of posts) {
      const createdAt = getRandomDate()
      const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * (24 * 60 * 60 * 1000)) // Random time up to 24 hours later
      
      await postsCollection.updateOne(
        { _id: post._id },
        { 
          $set: { 
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt.toISOString().replace('Z', '+00:00'))
          }
        }
      )
      successCount++
    }
    
    console.log(`Successfully updated ${successCount} posts with timestamps`)
    mongoose.disconnect()
  } catch (error) {
    console.error('Error during update:', error)
    mongoose.disconnect()
    process.exit(1)
  }
} 