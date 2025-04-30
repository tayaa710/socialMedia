const postsRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware')
const multer = require('multer')
const { uploadImage } = require('../utils/cloudinary')
const { checkImage } = require('../utils/sightengine')
const axios = require('axios') // Add axios for HTTP requests

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
  const posts = await Post.find({})
    .populate("user", { username: 1 })
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
  response.json(posts)
})

// Create a post with image upload
postsRouter.post('/', tokenExtractor, userExtractor, upload.single('image'), async (req, res) => {
  try {
    let photo = null
    let imageAnalysis = null

    // If there's an image file, check it first
    if (req.file) {
      console.log('File received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
      });
      
      // Perform content moderation check
      const imageCheck = await checkImage(req.file.buffer)
      console.log('Image check:', imageCheck)
      
      // Check if the image passes validation
      if (imageCheck.validation && !imageCheck.validation.approved) {
        return res.status(400).json({ 
          error: 'Image content not allowed', 
          reasons: imageCheck.validation.rejectionReasons 
        });
      }
      
      // Store the image analysis data
      imageAnalysis = imageCheck
      
      // Upload the image to Cloudinary
      try {
        photo = await uploadImage(req.file.buffer)
        console.log('Photo uploaded successfully:', photo)
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError)
        return res.status(500).json({ error: 'Failed to upload image' })
      }
    } else {
      console.log('No file received in request')
    }
    
    // Get description from form data
    const description = req.body.description
    console.log('Creating post with description:', description)
    
    // Create the post
    const newPost = new Post({
      user: req.user.id,
      description,
      photo,
      imageAnalysis,
    })
    
    const post = await newPost.save()
    console.log('Post saved successfully:', post)
    
    const postId = post._id
    const user = await User.findById(req.user.id)
    user.posts = user.posts.concat(postId)
    await User.findByIdAndUpdate(user._id, user)

    // Send the post ID to the classifier backend
    try {
      const classifierUrl = 'http://localhost:4000/api/queue';
      const classifierResponse = await axios.post(classifierUrl, { postId: post._id.toString() });
      console.log('Classifier response:', classifierResponse.data);
    } catch (classifierError) {
      // We don't want to fail the post creation if the classifier fails
      console.error('Error sending to classifier:', classifierError.message);
    }

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

//comment on a post
postsRouter.post('/:id/comment', tokenExtractor, userExtractor, async (req, res) => {
  try {
    const postToComment = await Post.findById(req.params.id)
    if (!postToComment) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userId = req.user.id
    const comment = req.body.comment
    const commentObject = {
      comment: comment,
      user: userId
    }
    console.log(commentObject)

    postToComment.comments = postToComment.comments.concat(commentObject)
    await postToComment.save()
    
    // Populate user data for all comments before returning
    const populatedPost = await Post.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'firstName lastName profilePicture',
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
    
    res.status(201).json(populatedPost)
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).json({ error: "Failed to add comment" })
  }
})

//get comments for a post
postsRouter.get('/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'firstName lastName profilePicture')
      .populate('comments.replies.user', 'firstName lastName profilePicture')
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post.comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    res.status(500).json({ error: "Failed to fetch comments" })
  }
})

//get a post
postsRouter.get('/:id',async (request, response) => {
  try {
    const post = await Post.findById(request.params.id)
      .populate({
        path: 'user',
        select: 'firstName lastName profilePicture',
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
    
    if (!post) {
      return response.status(404).json({ error: "Post not found" })
    }
    
    response.status(200).json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    response.status(500).json({ error: "Failed to fetch post" })
  }
})

//get all posts from a specific user
postsRouter.get('/user/:userId', async (request, response) => {
  try {
    const user = await User.findById(request.params.userId)
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }
    
    const userPosts = await Post.find({user: user._id})
      .populate({
        path: 'user',
        select: 'firstName lastName profilePicture',
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
      .sort({ createdAt: -1 })

    response.status(200).json(userPosts)
  } catch (error) {
    console.error("Error fetching user posts:", error)
    response.status(500).json({ error: "Failed to fetch user posts" })
  }
})

//add reply to a comment
postsRouter.post('/:id/comment/:commentId/reply', tokenExtractor, userExtractor, async (req, res) => {
  try {
    const postId = req.params.id
    const commentId = req.params.commentId
    const userId = req.user.id
    const replyText = req.body.reply

    if (!replyText || !replyText.trim()) {
      return res.status(400).json({ error: "Reply text is required" })
    }

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    // Find the comment
    const commentIndex = post.comments.findIndex(comment => 
      comment._id.toString() === commentId
    )

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" })
    }

    // Create reply object
    const replyObject = {
      reply: replyText,
      user: userId
    }

    // Add reply to the comment
    post.comments[commentIndex].replies = post.comments[commentIndex].replies || []
    post.comments[commentIndex].replies.push(replyObject)
    
    await post.save()
    
    // Populate user data before returning
    const populatedPost = await Post.findById(postId)
      .populate({
        path: 'user',
        select: 'firstName lastName profilePicture',
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
    
    res.status(201).json(populatedPost)
  } catch (error) {
    console.error("Error adding reply:", error)
    res.status(500).json({ error: "Failed to add reply" })
  }
})

//like/unlike a comment
postsRouter.patch('/:id/comment/:commentId/like', tokenExtractor, userExtractor, async (req, res) => {
  try {
    const postId = req.params.id
    const commentId = req.params.commentId
    const userId = req.user.id

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    // Find the comment
    const commentIndex = post.comments.findIndex(comment => 
      comment._id.toString() === commentId
    )

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" })
    }

    // Check if user already liked the comment
    const alreadyLiked = post.comments[commentIndex].likes.includes(userId)
    
    if (alreadyLiked) {
      // Unlike: remove user ID from likes array
      post.comments[commentIndex].likes = post.comments[commentIndex].likes
        .filter(id => id.toString() !== userId.toString())
    } else {
      // Like: add user ID to likes array
      post.comments[commentIndex].likes.push(userId)
    }
    
    await post.save()
    
    // Populate user data before returning
    const populatedPost = await Post.findById(postId)
      .populate({
        path: 'user',
        select: 'firstName lastName profilePicture',
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
    
    res.status(200).json(populatedPost)
  } catch (error) {
    console.error("Error liking/unliking comment:", error)
    res.status(500).json({ error: "Failed to like/unlike comment" })
  }
})

//like/unlike a reply
postsRouter.patch('/:id/comment/:commentId/reply/:replyId/like', tokenExtractor, userExtractor, async (req, res) => {
  try {
    const postId = req.params.id
    const commentId = req.params.commentId
    const replyId = req.params.replyId
    const userId = req.user.id

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    // Find the comment
    const commentIndex = post.comments.findIndex(comment => 
      comment._id.toString() === commentId
    )

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" })
    }

    // Find the reply
    const replyIndex = post.comments[commentIndex].replies.findIndex(reply => 
      reply._id.toString() === replyId
    )

    if (replyIndex === -1) {
      return res.status(404).json({ error: "Reply not found" })
    }

    // Check if user already liked the reply
    const alreadyLiked = post.comments[commentIndex].replies[replyIndex].likes.includes(userId)
    
    if (alreadyLiked) {
      // Unlike: remove user ID from likes array
      post.comments[commentIndex].replies[replyIndex].likes = 
        post.comments[commentIndex].replies[replyIndex].likes
          .filter(id => id.toString() !== userId.toString())
    } else {
      // Like: add user ID to likes array
      post.comments[commentIndex].replies[replyIndex].likes.push(userId)
    }
    
    await post.save()
    
    // Populate user data before returning
    const populatedPost = await Post.findById(postId)
      .populate({
        path: 'user',
        select: 'firstName lastName profilePicture',
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
    
    res.status(200).json(populatedPost)
  } catch (error) {
    console.error("Error liking/unliking reply:", error)
    res.status(500).json({ error: "Failed to like/unlike reply" })
  }
})

module.exports = postsRouter