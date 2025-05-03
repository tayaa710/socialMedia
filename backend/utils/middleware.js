const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  console.log("Starting tokenExtractor middleware")
  console.log("Authorization header:", request.get('authorization'))
  
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    console.log("Token extracted successfully:", request.token.substring(0, 10) + '...')
  } else {
    console.log("No valid authorization header found")
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  console.log("Starting userExtractor middleware")
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log("Decoded token:", decodedToken)
    
    if (!decodedToken.id) {
      console.log("Token missing ID field")
      return response.status(401).json({ error: "token invalid" })
    }
    
    console.log("Looking up user by ID:", decodedToken.id)
    const user = await User.findById(decodedToken.id)
    console.log("User found by ID:", user ? user.email : "No user found")
    
    request.user = user
    next()
  } catch (error) {
    console.log("Error in userExtractor:", error.message)
    return response.status(401).json({ error: "token invalid" })
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}