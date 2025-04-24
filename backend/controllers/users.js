const usersRouter = require("express").Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware');



usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).select("-passwordHash").populate([
    { path: "followers", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" },
    { path: "following", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" }
  ])
  response.json(users)
})
//Create new user

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
//Delet your user account
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
      { path: "followers", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" },
      { path: "following", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" }
    ])
    response.status(200).json(user)
  } else {
    const user = await User.findById(request.params.id).select('-passwordHash -email -updatedAt').populate([
      { path: "followers", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" },
      { path: "following", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" }
    ]);
    response.status(200).json(user)
  }
})

//Follow a user
usersRouter.put("/:id/follow", tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  const userBeingFollowed = await User.findById(request.params.id)
  if (userBeingFollowed.followers.filter(id => id.toString() === user.id.toString()).length > 0){
    response.status(409).json({"error" : "Already following"})
  }else if (userBeingFollowed._id.toString() === user.id.toString()){
    response.status(409).json({"error" : "Can't follow yourself"})
  }else{  
    userBeingFollowed.followers = userBeingFollowed.followers.concat(user.id)
    const newFollowedUser = await User.findByIdAndUpdate(userBeingFollowed._id, userBeingFollowed,{ new: true })
    user.following = user.following.concat(request.params.id)
    const newFollowingUser = await User.findByIdAndUpdate(user.id, user,{ new: true })
    response.status(201).json(newFollowedUser)
  }
})
//Unfollow a user
usersRouter.put("/:id/unfollow", tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  const userBeingUnfollowed = await User.findById(request.params.id)
  if (userBeingUnfollowed.followers.filter(id => id.toString() === user.id.toString()).length === 0){
    response.status(409).json({"error" : "Not following"})
  }else{  
    userBeingUnfollowed.followers = userBeingUnfollowed.followers.filter(id => id.toString() !== user.id.toString())
    const newFollowedUser = await User.findByIdAndUpdate(userBeingUnfollowed._id, userBeingUnfollowed,{ new: true })
    user.following = user.following.filter(id => id.toString() !== request.params.id)
    await User.findByIdAndUpdate(user.id, user,{ new: true })
    response.status(201).json(newFollowedUser)
  }
})

module.exports = usersRouter