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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('ImageQueue', imageQueueSchema); 