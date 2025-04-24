const loginRouter = require("express").Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



loginRouter.post("/",async (request, response) => {
  const {email, password} = request.body

  const user = await User.findOne({email})
  const passwordCheck = user === null ? false : await bcrypt.compare(password,user.passwordHash)
  if (!(passwordCheck && user)){
    response.status(401).json({
      error: "invalid email or password"
    })
  }

  const userToken = {
    email: user.email,
    id: user._id

  }

  const token = jwt.sign(userToken, process.env.SECRET,{ expiresIn: '7d' })

  response
    .status(200)
    .send({ token, user})

})

module.exports = loginRouter