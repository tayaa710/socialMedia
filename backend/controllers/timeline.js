const timelineRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware');


//get all posts of the users followings (timeline)
timelineRouter.get('/:userId', async (request, response) => {
  try {
    const user = await User.findById(request.params.userId)
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }
    console.log(user)
    const userPosts = await Post.find({user: user._id})
    const friendPosts = await Promise.all(
      user.following.map(friendId => {
        return Post.find({user: friendId})
      })
    )
    const timeline = userPosts.concat(...friendPosts)
    response.json(timeline)
  } catch (error) {
    console.error('Timeline error:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = timelineRouter