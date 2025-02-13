const postsRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware');

postsRouter.get('/', async (request, response) => {
  const posts = await Post.find({}).populate("user", { firstName: 1 })
  .populate("likes", { firstName: 1});
  response.json(posts)
})

//Create a post
postsRouter.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const { description, image } = req.body
  const newPost = new Post({
    user: req.user.id,
    description,
    image
  })
  const post = await newPost.save()
  const postId = post._id
  const user = await User.findById(req.user.id)
  user.posts = user.posts.concat(postId)
  await User.findByIdAndUpdate(user._id, user)

  res.status(201).json(post)
})


//update a post

postsRouter.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const postToEdit = await Post.findById(req.params.id);
  if (postToEdit.user.toString() === req.user.id.toString()) {
    const post = await Post.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    res.status(200).json(post)
  } else {
    res.status(401).json({ "error": "You do not have permission to edit this post" })
  }
})

//delete a post
postsRouter.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const postToDelete = await Post.findById(req.params.id)
  if (postToDelete.user.toString() === req.user.id.toString()) {
    await Post.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } else {
    res.status(401).json({ "error": "You do not have permission to delete this post" })
  }
})

//like a post

postsRouter.put('/:id/like', tokenExtractor, userExtractor, async (req, res) => {
  const postToLike = await Post.findById(req.params.id)
  if (!postToLike) {
    return res.status(404).json({ error: "Post not found" });
  }
  const userId = req.user.id
  const alreadyLiked = postToLike.likes.includes(req.user.id.toString())
  if (alreadyLiked) {
    postToLike.likes = postToLike.likes.filter(id => id.toString() !== userId.toString())
  } else {
    postToLike.likes = postToLike.likes.concat(userId)
  }
  await Post.findByIdAndUpdate(postToLike._id, postToLike, {new: true})
  res.status(200).json(postToLike)

})
//get a post
postsRouter.get('/:id',async (request, response) => {
  const post = await Post.findById(request.params.id).populate("user", { firstName: 1 })
  response.status(200).json(post)

})




module.exports = postsRouter