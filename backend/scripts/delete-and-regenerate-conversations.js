const mongoose = require('mongoose')
const Conversation = require('../models/conversation')
const Message = require('../models/message')
const User = require('../models/user')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

// Expanded list of sample messages for more variety
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
  "Have a great day!",
  "Can we meet tomorrow?",
  "I just saw your friend at the coffee shop",
  "Did you finish that project yet?",
  "The weather is amazing today",
  "I'm planning a trip next month",
  "Happy birthday! Hope you have a great day!",
  "Congratulations on your new job!",
  "How's the new apartment working out?",
  "I've been thinking about what you said",
  "Should we try that new restaurant?",
  "I just watched an incredible movie",
  "My day has been so hectic",
  "I love your new profile picture",
  "Did you get my email from yesterday?",
  "Are you going to the event this weekend?"
]

const generateRandomMessages = (conversationId, senderId, receiverId, count) => {
  const messages = []
  let lastSender = Math.random() > 0.5 ? senderId : receiverId
  let lastDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) // Start up to 30 days ago
  
  for (let i = 0; i < count; i++) {
    // For more realistic conversations, alternate senders more often with some randomness
    const shouldSwitch = Math.random() > 0.3
    const currentSender = shouldSwitch 
      ? (lastSender.toString() === senderId.toString() ? receiverId : senderId)
      : lastSender

    // Add some time between messages (1 minute to 12 hours)
    const timeIncrement = Math.floor(Math.random() * (12 * 60 * 60 * 1000)) + 60 * 1000
    const messageDate = new Date(lastDate.getTime() + timeIncrement)
    
    messages.push({
      conversationId,
      sender: currentSender,
      text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      createdAt: messageDate
    })
    
    lastSender = currentSender
    lastDate = messageDate
  }
  
  return messages
}

const main = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Delete all existing conversations and messages
    console.log('Deleting all existing conversations and messages...')
    const deletedMessages = await Message.deleteMany({})
    console.log(`Deleted ${deletedMessages.deletedCount} messages`)
    
    const deletedConversations = await Conversation.deleteMany({})
    console.log(`Deleted ${deletedConversations.deletedCount} conversations`)

    // Get all users
    const users = await User.find({})
    if (users.length < 2) {
      console.log('Need at least 2 users to create conversations')
      return
    }

    // Create more conversations between users
    const conversations = []
    // Create more conversations, approximately 3-5 per user
    const numConversations = Math.floor(Math.random() * (users.length * 2)) + users.length * 3

    console.log(`Generating ${numConversations} new conversations...`)

    for (let i = 0; i < numConversations; i++) {
      const user1 = users[Math.floor(Math.random() * users.length)]
      let user2
      do {
        user2 = users[Math.floor(Math.random() * users.length)]
      } while (user2._id.toString() === user1._id.toString())

      // Check if this conversation already exists
      const existingConversation = conversations.find(
        conv => 
          (conv.members[0].toString() === user1._id.toString() && conv.members[1].toString() === user2._id.toString()) ||
          (conv.members[0].toString() === user2._id.toString() && conv.members[1].toString() === user1._id.toString())
      )

      if (existingConversation) {
        // Skip this iteration if conversation already exists
        continue
      }

      const conversation = new Conversation({
        members: [user1._id, user2._id]
      })
      await conversation.save()
      conversations.push(conversation)
      console.log(`Created conversation between ${user1.username} and ${user2.username}`)

      // Generate 5-30 random messages for each conversation
      const numMessages = Math.floor(Math.random() * 26) + 5
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