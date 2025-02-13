const User = require('../models/user')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



const userToLogin = {
  username: "tayaa710",
  password: "testingtesting123",
  firstName: "testdfghd",
  email: "test"
}

const logIn = (user) => {
  const userToken = {
    username: user.username,
    id: user.id
  }
  return jwt.sign(userToken, process.env.SECRET)
}

const userInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())[0]
}

module.exports = {
  userInDb, userToLogin, logIn,logInAsDifferentUser
}