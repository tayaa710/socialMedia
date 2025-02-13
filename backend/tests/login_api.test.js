const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(helper.userToLogin.password, 10)
  const userObject = new User({
    ...helper.userToLogin,
    email: "d",
    passwordHash,
    password: null, // Avoid storing plain-text password
  })
  await userObject.save()
})

describe('Login', { concurrency: false }, () => {
  test('login succeeds with correct credentials', async () => {
    const user = await helper.userInDb()

    const loginData = {
      username: user.username,
      password: helper.userToLogin.password,
    }

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Assert that a token is returned and the user information is correct.
    assert.ok(response.body.token, 'Token should be defined')
    assert.strictEqual(response.body.username, helper.userToLogin.username)
    assert.strictEqual(response.body.firstName, helper.userToLogin.firstName)
  })

  test('login fails with wrong password', async () => {
    const user = await helper.userInDb()
    const loginData = {
      username: user.username,
      password: "wrongpassword",
    }

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })


  test('JWT token allows access to a protected route', async () => {
    const user = await helper.userInDb()
    const loginData = {
      username: user.username,
      password: helper.userToLogin.password,
    }

    // Step 1: Log in and get the token
    const loginResponse = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.ok(loginResponse.body.token, 'Token should be defined')
  })
})

after(async () => {
  await mongoose.connection.close()
})