let mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    max: 200
  },
  age: {
    type: Number
  },
  friends: [{
    type: Number
  }],
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
  isOnline: {
    type: Boolean,
    default: false
  },
  personal: {
    birthday: {
      type: String
    },
    age: {
      type: Number
    },
    country: {
      type: String
    },
    city: {
      type: String
    }
  },
  relationships: {
    status: {
      type: String
    },
    education: {
      type: String
    },
    phone: {
      type: String
    }
  },
  values: [{
    type: String
  }],
  // Fields below are kept from original schema for backend functionality
  firstName: {
    type: String
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
  role: {
    type: String
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