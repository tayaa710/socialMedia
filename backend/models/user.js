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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
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
  
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  
  filterSettings: {
    friendsVsCommunities: {
      type: Number,
      default: 50 // 0: all communities, 100: all friends
    },
    newVsFollowing: {
      type: Number,
      default: 50 // 0: all following, 100: all new users
    },
    factualVsEntertainment: {
      type: Number,
      default: 60 // 0: all entertainment, 100: all factual
    },
    seriousVsLighthearted: {
      type: Number,
      default: 40 // 0: serious/in-depth, 100: lighthearted/fun
    },
    recentVsPopular: {
      type: Number,
      default: 50 // 0: recent only, 100: popular only
    },
    textHeavyVsImageHeavy: {
      type: Number,
      default: 50 // 0: text heavy, 100: image heavy
    },
    localVsGlobal: {
      type: Number,
      default: 50 // 0: local only, 100: global only
    }
  }
},
{ timestamps: true })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString()
    }
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User