const mongoose = require('mongoose')
const config = require('./utils/config')

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB for migration')
    migrateToFriends()
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

// Define a simplified user schema for migration
const userSchema = new mongoose.Schema({
  username: String,
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

const User = mongoose.model('User', userSchema)

// Main migration function
const migrateToFriends = async () => {
  try {
    // Step 1: Get all users that have non-empty followers or following arrays
    const usersWithConnections = await User.find({
      $or: [
        { followers: { $exists: true, $ne: [] } },
        { following: { $exists: true, $ne: [] } }
      ]
    })

    console.log(`Found ${usersWithConnections.length} users with non-empty followers/following`)

    // Process each user with connections
    for (const user of usersWithConnections) {
      console.log(`Processing user: ${user.username} (${user._id})`)
      
      // Get current friends (if any)
      let updatedFriends = user.friends || []
      
      // Process followers - add bidirectional connections
      if (user.followers && user.followers.length > 0) {
        for (const followerId of user.followers) {
          // Add follower to user's friends (if not already there)
          if (!updatedFriends.map(id => id.toString()).includes(followerId.toString())) {
            updatedFriends.push(followerId)
          }
          
          // Add user to follower's friends (bidirectional)
          const follower = await User.findById(followerId)
          if (follower) {
            let followerFriends = follower.friends || []
            if (!followerFriends.map(id => id.toString()).includes(user._id.toString())) {
              followerFriends.push(user._id)
              await User.findByIdAndUpdate(followerId, { friends: followerFriends })
            }
          }
        }
      }
      
      // Process following - add bidirectional connections
      if (user.following && user.following.length > 0) {
        for (const followingId of user.following) {
          // Add following to user's friends (if not already there)
          if (!updatedFriends.map(id => id.toString()).includes(followingId.toString())) {
            updatedFriends.push(followingId)
          }
          
          // Add user to following's friends (bidirectional)
          const following = await User.findById(followingId)
          if (following) {
            let followingFriends = following.friends || []
            if (!followingFriends.map(id => id.toString()).includes(user._id.toString())) {
              followingFriends.push(user._id)
              await User.findByIdAndUpdate(followingId, { friends: followingFriends })
            }
          }
        }
      }
      
      // Update user with new friends array and remove followers/following
      await User.findByIdAndUpdate(user._id, {
        friends: updatedFriends,
        $unset: { followers: "", following: "" }
      })
      
      console.log(`Updated user ${user.username}`)
    }
    
    // Step 2: Find all users with empty followers or following arrays and remove those properties
    const usersWithEmptyArrays = await User.find({
      $or: [
        { followers: { $exists: true, $size: 0 } },
        { following: { $exists: true, $size: 0 } }
      ]
    })
    
    console.log(`Found ${usersWithEmptyArrays.length} users with empty followers/following arrays`)
    
    for (const user of usersWithEmptyArrays) {
      console.log(`Cleaning up user: ${user.username} (${user._id})`)
      
      await User.findByIdAndUpdate(user._id, {
        $unset: { followers: "", following: "" }
      })
      
      console.log(`Cleaned up user ${user.username}`)
    }
    
    console.log('Migration completed successfully')
    mongoose.connection.close()
    process.exit(0)
    
  } catch (error) {
    console.error('Migration failed:', error)
    mongoose.connection.close()
    process.exit(1)
  }
} 