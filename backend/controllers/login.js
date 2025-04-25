const loginRouter = require("express").Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { tokenExtractor, userExtractor } = require('../utils/middleware');



loginRouter.post("/",async (request, response) => {
  const {email, password} = request.body
  
  console.log("Login attempt with email:", email)
  
  // Use a more explicit query to ensure exact match on email
  const users = await User.find({})
  console.log("Total users in database:", users.length)
  
  // Find user with exact email match
  const user = users.find(u => u.email === email)
  console.log("User found by exact email match:", user ? user.email : "No user found")
  
  if (!user) {
    return response.status(401).json({
      error: "invalid email or password"
    })
  }
  
  const passwordCheck = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCheck) {
    return response.status(401).json({
      error: "invalid email or password"
    })
  }

  const userToken = {
    email: user.email,
    id: user._id
  }
  
  console.log("Creating token for user ID:", user._id)
  const token = jwt.sign(userToken, process.env.SECRET,{ expiresIn: '7d' })

  // Ensure we're returning the user document that matches the email provided
  const userData = {
    email: user.email,
    username: user.username,
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture
  }
  
  console.log("Returning user in response:", userData.email, "with ID:", userData.id)
  
  response
    .status(200)
    .send({ token, user: userData })

})

loginRouter.get("/verify", tokenExtractor, userExtractor, async (request, response) => {
  console.log("Verify endpoint, user from token:", request.user ? request.user.email : "No user")
  response.status(200).json(request.user)
})

module.exports = loginRouter