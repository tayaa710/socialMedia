const usersRouter = require("express").Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware');
const multer = require('multer')
const { uploadImage } = require('../utils/cloudinary')
const { checkImage } = require('../utils/sightengine')

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

usersRouter.post("/register", async (request, response) => {
  const { password, ...body } = request.body
  if (!password) {
    return response.status(400).json({ error: "password required" })
  }

  if (password.length < 5) {
    return response.status(400).json({ error: "password must be at least 5 characters" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    ...body, passwordHash
  })

  const savedUser = await user.save()
  return response.status(201).json(savedUser)
})
//update account
usersRouter.put("/:id", tokenExtractor, userExtractor, async (request, response) => {
  let updatedData = { ...request.body }
  if (request.user.id === request.params.id) {
    if (request.body.password) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(request.body.password, saltRounds)
      updatedData.passwordHash = passwordHash
    }

    const user = await User.findByIdAndUpdate(request.params.id,
      { $set: updatedData },
      { new: true }
    )
    response.status(200).json(user)

  } else {
    return response.status(403).json({
      "error": "You do not have permission to update this account"
    })
  }
})
//Update profile picture
usersRouter.put("/:id/profile-picture", tokenExtractor, userExtractor, upload.single('profileImage'), async (request, response) => {
  try {
    // Check if the user is updating their own profile
    if (request.user.id !== request.params.id) {
      return response.status(403).json({
        error: "You do not have permission to update this profile picture"
      });
    }

    // Check if there's an image file
    if (!request.file) {
      return response.status(400).json({
        error: "No image file provided"
      });
    }

    // Perform content moderation check
    const imageCheck = await checkImage(request.file.buffer);
    console.log('Image check:', imageCheck);
    
    // Check if the image passes validation
    if (imageCheck.validation && !imageCheck.validation.approved) {
      return response.status(400).json({ 
        error: 'Image content not allowed', 
        reasons: imageCheck.validation.rejectionReasons 
      });
    }
    
    // Upload the image to Cloudinary
    const profilePictureUrl = await uploadImage(request.file.buffer);
    
    // Update the user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      { $set: { profilePicture: profilePictureUrl } },
      { new: true }
    ).populate([
      { path: "friends", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests friends" }
    ]);
    
    response.status(200).json(updatedUser);
    
  } catch (error) {
    console.error('Error updating profile picture:', error);
    response.status(500).json({
      error: 'Failed to update profile picture'
    });
  }
});
//Delete your user account
usersRouter.delete("/:id", tokenExtractor, userExtractor, async (request, response) => {
  let updatedData = { ...request.body }
  if (request.user.id === request.params.id) {

    await User.findByIdAndDelete(request.params.id)
    response.status(204).json("Succesfully deleted account")

  } else {
    return response.status(403).json({
      "error": "You do not have permission to update this account"
    })
  }
})


//Get your own profile and also another persons profile
usersRouter.get("/:id", tokenExtractor, userExtractor, async (request, response) => {
  if (request.user.id === request.params.id) {
    const user = await User.findById(request.params.id).populate([
      { path: "friends", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests friends" }
    ])
    response.status(200).json(user)
  } else {
    const user = await User.findById(request.params.id).select('-passwordHash -email -updatedAt').populate([
      { path: "friends", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests friends" }
    ]);
    response.status(200).json(user)
  }
})

//Friend a user
usersRouter.put("/:id/friend", tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  const userBeingFriended = await User.findById(request.params.id)
  if (userBeingFriended.friends.filter(id => id.toString() === user.id.toString()).length > 0){
    response.status(409).json({"error" : "Already friends"})
  }else if (userBeingFriended._id.toString() === user.id.toString()){
    response.status(409).json({"error" : "Can't friend yourself"})
  }else{  
    userBeingFriended.friends = userBeingFriended.friends.concat(user.id)
    const newFriendedUser = await User.findByIdAndUpdate(userBeingFriended._id, userBeingFriended,{ new: true })
    user.friends = user.friends.concat(request.params.id)
    const newFollowingUser = await User.findByIdAndUpdate(user.id, user,{ new: true })
    response.status(201).json(newFriendedUser)
  }
})
//Unfriend a user
usersRouter.put("/:id/unfriend", tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  const userBeingUnfriended = await User.findById(request.params.id)
  if (userBeingUnfriended.friends.filter(id => id.toString() === user.id.toString()).length === 0){
    response.status(409).json({"error" : "Not friends"})
  }else{  
    userBeingUnfriended.friends = userBeingUnfriended.friends.filter(id => id.toString() !== user.id.toString())
    const newFriendedUser = await User.findByIdAndUpdate(userBeingUnfriended._id, userBeingUnfriended,{ new: true })
    user.friends = user.friends.filter(id => id.toString() !== request.params.id)
    await User.findByIdAndUpdate(user.id, user,{ new: true })
    response.status(201).json(newFriendedUser)
  } 
})

module.exports = usersRouter