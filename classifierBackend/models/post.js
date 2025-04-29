const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  imageAnalysis: {
    type: Object,
    default: null
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  caption: {
    type: String,
    default: null
  },
  processed: {
    type: Boolean,
    default: false
  },
  processingFailed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post