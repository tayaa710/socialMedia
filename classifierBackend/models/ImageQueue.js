const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageQueueSchema = new Schema({
  imageId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'done', 'failed'],
    default: 'queued'
  },
  retries: {
    type: Number,
    default: 0
  },
  error: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

imageQueueSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('ImageQueue', imageQueueSchema); 