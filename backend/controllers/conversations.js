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

  //get conv of a user
})

module.exports = router