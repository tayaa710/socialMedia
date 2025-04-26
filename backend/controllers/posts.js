const postsRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware')
const multer = require('multer')
const { uploadImage } = require('../utils/cloudinary')

// Configure multer for memory storage (no disk writing)
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

postsRouter.get('/', async (request, response) => {
  const posts = await Post.find({}).populate("user", { username: 1 })
  response.json(posts)
})

// Create a post with image upload
postsRouter.post('/', tokenExtractor, userExtractor, upload.single('image'), async (req, res) => {
  try {
    let photo = null
    
    // If there's an image file, upload it to Cloudinary
    if (req.file) {
      photo = await uploadImage(req.file.buffer)
    }
    
    // Get description from form data
    const description = req.body.description
    
    // Create the post
    const newPost = new Post({
      user: req.user.id,
      description,
      photo,
    })
    
    const post = await newPost.save()
    const postId = post._id
    const user = await User.findById(req.user.id)
    user.posts = user.posts.concat(postId)
    await User.findByIdAndUpdate(user._id, user)

    res.status(201).json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Failed to create post' })
  }
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
postsRouter.patch('/:id/like', tokenExtractor, userExtractor, async (req, res) => {
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
  await Post.findByIdAndUpdate(postToLike._id, postToLike, { new: true })
  res.status(200).json(postToLike)
})

//get a post
postsRouter.get('/:id',async (request, response) => {
  const post = await Post.findById(request.params.id).populate("user", { firstName: 1 })
  response.status(200).json(post)
})

//get all posts from a specific user
postsRouter.get('/user/:userId', async (request, response) => {
  try {
    const user = await User.findById(request.params.userId)
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }
    
    const userPosts = await Post.find({user: user._id})
    response.status(200).json(userPosts)
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch user posts' })
  }
})

module.exports = postsRouter