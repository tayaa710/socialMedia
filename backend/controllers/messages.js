const router = require('express').Router()
const Message = require('../models/message')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

//add message
router.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    sender: req.body.sender,
    text: req.body.text,
  })
  try {
    const savedMessage = await newMessage.save()
    res.status(200).json(savedMessage)
  } catch (err) {
    res.status(500).json(err)
  }
})

//get all messages for a conversation
router.get('/:conversationId', tokenExtractor, userExtractor, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router