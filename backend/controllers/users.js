const usersRouter = require("express").Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware');



// usersRouter.get('/', async (request, response) => {
//   const users = await User.find({}).select("-passwordHash").populate([
//     { path: "friends", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" }
//   ])
//   response.json(users)
// })
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
      { path: "friends", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" }
    ])
    response.status(200).json(user)
  } else {
    const user = await User.findById(request.params.id).select('-passwordHash -email -updatedAt').populate([
      { path: "friends", select: "username firstName lastName profilePicture isOnline impactPoints trustRating values interests" }
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