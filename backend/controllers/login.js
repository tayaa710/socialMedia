const loginRouter = require("express").Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { tokenExtractor, userExtractor } = require('../utils/middleware');
const axios = require('axios')



loginRouter.post("/", async (request, response) => {
  try {
    const {email, password, captcha} = request.body
    
    // 1. Verify reCAPTCHA
    /* Commenting out reCAPTCHA verification temporarily
    if (!captcha) {
      return response.status(400).json({ error: "Captcha is required" })
    }
    try {
      const verifyRes = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captcha,
          }
        }
      )
      if (!verifyRes.data.success) {
        return response.status(400).json({ error: "Captcha verification failed" })
      }
      if (verifyRes.data.success) {
        console.log("Captcha verification successful")
      }
    } catch (err) {
      return response.status(500).json({ error: err.message })
    }
    */

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
      id: user.id
    }
    
    console.log("Creating token for user ID:", user.id)
    const token = jwt.sign(userToken, process.env.SECRET,{ expiresIn: '2h' })

    // Ensure we're returning the user document that matches the email provided
    const userData = {
      email: user.email,
      username: user.username,
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture
    }
    
    console.log("Returning user in response:", userData.email, "with ID:", userData.id)
    
    response
      .status(200)
      .send({ token, user: userData })
  } catch (error) {
    console.error('Unhandled error in login route:', error)
    response.status(500).json({ error: error.message })
  }
})

loginRouter.get("/verify", tokenExtractor, userExtractor, async (request, response) => {
  console.log("Verify endpoint, user from token:", request.user ? request.user.email : "No user")
  response.status(200).json(request.user)
})

module.exports = loginRouter