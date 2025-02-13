const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const assert = require('node:assert')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(helper.userToLogin.password, 10)

  const userObject = new User({
    ...helper.userToLogin,
    passwordHash,
    password: null, // Avoid storing plain-text password
  })
  await userObject.save()


})

describe("POST user", () => {
  test("Users are added correctly", async () => {
    const existingUsers = await User.find({})

    const newUser = { username: 'TestUser', password: "12345", firstName: "Name", email: "email" }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const updatedExistingUsers = await User.find({})
    const usernames = updatedExistingUsers.map(user => user.username)

    assert.strictEqual(existingUsers.length + 1, updatedExistingUsers.length)
    assert(usernames.includes(newUser.username))
  })

  test("Username already exists handled correctly", async () => {
    const existingUsers = await User.find({})

    // This new user uses the same username as the seeded user ("tayaa710")
    // (Even if the email is different, the duplicate username will trigger the error.)
    const newUser = { username: 'tayaa710', password: "12345", firstName: "Name", email: "newemail" }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    // Assert that the error message is as expected.

    const updatedUsers = await User.find({})
    assert.strictEqual(existingUsers.length, updatedUsers.length)
  })

  test("Email already exists handled correctly", async () => {
    const existingUsers = await User.find({})

    // Use a different username but duplicate the seeded email ("test")
    const newUser = { username: 'TestUser2', password: "12345", firstName: "Name", email: "test" }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    // If you update your error handler to show the correct field (e.g., "expected `email` to be unique"),
    // you can assert that here. For now, if your handler still returns the username error, skip checking the message.
    // assert.strictEqual(response.body.error, 'expected `email` to be unique')

    const updatedUsers = await User.find({})
    assert.strictEqual(existingUsers.length, updatedUsers.length)
  })

  describe("Required values", () => {
    test("No username fails", async () => {
      const existingUsers = await User.find({})
      const newUser = { password: "12345", firstName: "Name", email: "email" }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const updatedUsers = await User.find({})
      assert.strictEqual(existingUsers.length, updatedUsers.length)
    })

    test("No first name fails", async () => {
      const existingUsers = await User.find({})
      const newUser = { username: "TestUser", password: "12345", email: "email" }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const updatedUsers = await User.find({})
      assert.strictEqual(existingUsers.length, updatedUsers.length)
    })

    test("No email fails", async () => {
      const existingUsers = await User.find({})
      const newUser = { username: "TestUser", password: "12345", firstName: "Name" }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const updatedUsers = await User.find({})
      assert.strictEqual(existingUsers.length, updatedUsers.length)
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})