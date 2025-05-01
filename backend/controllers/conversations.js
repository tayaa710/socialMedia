const router = require('express').Router()
const Conversation = require('../models/conversation')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

//new conv
router.post('/', tokenExtractor, userExtractor, async (req, res) => {

  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.recieverId],
  })
  try {
    const savedConversation = await newConversation.save()
    res.status(200).json(savedConversation)
  } catch (err) {
    res.status(500).json(err)
  }

 
})

//get conv of a user
router.get('/:userId', tokenExtractor, userExtractor, async (req, res) => {
  try {
    console.log("req.params.userId:", req.params.userId, typeof req.params.userId);
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    })
    console.log("conversations result:", conversation);
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router