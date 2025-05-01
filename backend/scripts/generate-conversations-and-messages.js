const mongoose = require('mongoose')
const Conversation = require('../models/conversation')
const Message = require('../models/message')
const User = require('../models/user')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

const sampleMessages = [
  "Hey, how's it going?",
  "What are you up to?",
  "Did you see that new post?",
  "That's really interesting!",
  "I agree with you on that",
  "Let's catch up soon",
  "How was your day?",
  "That's awesome!",
  "I'm doing great, thanks for asking",
  "What do you think about that?",
  "Let me know if you need anything",
  "That's a great idea!",
  "I'll get back to you soon",
  "Thanks for letting me know",
  "Have a great day!"
]

const generateRandomMessages = (conversationId, senderId, receiverId, count) => {
  const messages = []
  for (let i = 0; i < count; i++) {
    const isSender = Math.random() > 0.5
    messages.push({
      conversationId,
      sender: isSender ? senderId : receiverId,
      text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random time in last 7 days
    })
  }
  return messages
}

const main = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Get all users
    const users = await User.find({})
    if (users.length < 2) {
      console.log('Need at least 2 users to create conversations')
      return
    }

    // Create conversations between random pairs of users
    const conversations = []
    const numConversations = Math.min(users.length * 2, 50) // Create up to 50 conversations or 2 per user

    for (let i = 0; i < numConversations; i++) {
      const user1 = users[Math.floor(Math.random() * users.length)]
      let user2
      do {
        user2 = users[Math.floor(Math.random() * users.length)]
      } while (user2._id.toString() === user1._id.toString())

      const conversation = new Conversation({
        members: [user1._id, user2._id]
      })
      await conversation.save()
      conversations.push(conversation)
      console.log(`Created conversation between ${user1.username} and ${user2.username}`)

      // Generate 5-15 random messages for each conversation
      const numMessages = Math.floor(Math.random() * 11) + 5
      const messages = generateRandomMessages(
        conversation._id,
        user1._id,
        user2._id,
        numMessages
      )
      await Message.insertMany(messages)
      console.log(`Added ${numMessages} messages to conversation`)
    }

    console.log(`Successfully created ${conversations.length} conversations with messages`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Disconnected from MongoDB')
  }
}

main() 