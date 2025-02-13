const loginRouter = require("express").Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



loginRouter.post("/",async (request, response) => {
  const {username, password} = request.body

  const user = await User.findOne({username})
  const passwordCheck = user === null ? false : await bcrypt.compare(password,user.passwordHash)
  if (!(passwordCheck && user)){
    response.status(401).json({
      error: "invalid username or password"
    })
  }

  const userToken = {
    username: user.username,
    id: user._id

  }

  const token = jwt.sign(userToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username:user.username, firstName:user.firstName})

})

module.exports = loginRouter