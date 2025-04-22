let mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 5,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    minLength: 5
  },
  dateCreated: Date,
  profilePicture: {
    type: String,
    default: ""
  },
  birthday: {
    type: Date,
    required: true
  },
  age: {
    type: Number
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  education: {
    institution: {
      type: String
    },
    status: {
      type: String
    }
  },
  mobileNumber: {
    type: String
  },
  relationshipStatus: {
    type: String,
    enum: ['Single', 'In a relationship', 'Married', 'Other']
  },
  impactPoints: {
    type: Number,
    default: 0
  },
  trustRating: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  role: {
    type: String
  },
  valuesAndInterests: [{
    type: String
  }],
  description: {
    type: String,
    max: 100
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
},
{ timestamps: true })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User