const timelineRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware');


//get all posts of the user's friends (timeline)
timelineRouter.get('/:userId', tokenExtractor, userExtractor, async (request, response) => {
  try {
    const user = await User.findById(request.params.userId)
    const userPosts = await Post.find({user: user._id})
    
    // Get posts from friends instead of following
    const friendPosts = await Promise.all(
      user.friends.map(friendId => {
        return Post.find({user: friendId})
      })
    )
    
    const timeline = userPosts.concat(...friendPosts)
    response.status(200).json(timeline)
  } catch (error) {
    console.error("Timeline error:", error)
    response.status(500).json({ error: "Failed to fetch timeline" })
  }
})

module.exports = timelineRouter