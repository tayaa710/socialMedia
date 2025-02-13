const timelineRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware');


//get all posts of the users followings (timeline)
timelineRouter.get('/all', tokenExtractor, userExtractor, async (request, response) => {
  const user = await User.findById(request.user.id)
  const userPosts = await Post.find({user: user._id})
  const friendPosts = await Promise.all(
    user.following.map(friendId => {
      return Post.find({user: friendId}).populate("user", { firstName: 1 })
    })
  )
  const timeline = userPosts.concat(...friendPosts)
  response.json(timeline)



})

module.exports = timelineRouter