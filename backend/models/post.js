let mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      max: 500
    },
    photo: {
      type: String
    },
    imageAnalysis: {
      type: Object,
      default: null
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    comments: [{
      comment: {
        type: String,
        required: true
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
      },
      replies: [{
        reply: {
          type: String,
          required: true
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        likes: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'User',
          default: []
        }
      }]
    }]
  },
  { timestamps: true }
)

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    if (returnedObject.comments) {
      returnedObject.comments.forEach(comment => {
        comment.id = comment._id.toString()
        delete comment._id
        if (comment.replies) {
          comment.replies.forEach(reply => {
            reply.id = reply._id.toString()
            delete reply._id
          })
        }
      })
    }
  }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post