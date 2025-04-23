let mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true
    },
    desc: {
      type: String,
      max: 500
    },
    photo: {
      type: String
    },
    date: {
      type: String
    },
    like: {
      type: Number,
      default: 0
    },
    comment: {
      type: Number,
      default: 0
    }
  }
)

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post