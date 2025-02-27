//Utility imports 
const config = require("./utils/config")
const express = require("express")
require('express-async-errors')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const timelineRouter = require('./controllers/timeline')
const middleware = require('./utils/middleware')

const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


//Middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(helmet())

morgan.token('body', (request) => {
  if (request.method === 'POST') { return JSON.stringify(request.body) }
  else { return '' }
})
app.use(morgan('common'))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)


app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)
app.use('/api/timeline', timelineRouter)


// Error middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app