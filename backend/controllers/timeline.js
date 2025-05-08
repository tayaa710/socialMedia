const timelineRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware');

//get paginated posts of the user's friends (timeline)
timelineRouter.get('/:userId', tokenExtractor, userExtractor, async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1
    const limit = parseInt(request.query.limit) || 10
    const skip = (page - 1) * limit
    
    const user = await User.findById(request.params.userId)
    if (!user) {
      return response.status(404).json({ error: "User not found" })
    }
    
    // Get all friend IDs including the user's own ID
    const friendIds = [...user.friends, user.id]
    
    // Get paginated posts from user and friends
    const timeline = await Post.find({ user: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'username profilePicture firstName lastName',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'comments.user',
        select: 'firstName lastName profilePicture',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'comments.replies.user',
        select: 'firstName lastName profilePicture',
        options: { strictPopulate: false }
      })
    
    // Get total count for pagination
    const total = await Post.countDocuments({ user: { $in: friendIds } })
    
    response.status(200).json({
      posts: timeline,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + timeline.length < total
    })
  } catch (error) {
    console.error("Timeline error:", error)
    response.status(500).json({ error: "Failed to fetch timeline" })
  }
})

timelineRouter.put('/preferences', tokenExtractor, userExtractor, async (request, response) => {
  try {
    const filterSettings = request.body
    const user = request.user
    
    const updatedUser = await User.findByIdAndUpdate(user.id, { filterSettings }, { new: true })
    console.log(updatedUser.filterSettings)
    response.status(200).json(updatedUser.filterSettings)
  }catch (error) {
    console.error("Timeline error:", error)
    response.status(500).json({ error: "Failed to fetch timeline" })
  }
})

    // Update user preferences
  

module.exports = timelineRouter