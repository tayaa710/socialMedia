import { useState } from 'react'
import { AddPhotoAlternate, Mood, EmojiObjects, Send } from '@mui/icons-material'
import './postCreate.css'

const PostCreate = () => {
  const [postText, setPostText] = useState('')

  const handleInputChange = (e) => {
    setPostText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // This will be implemented later
    console.log('Post content:', postText)
    setPostText('')
  }

  return (
    <div className="postCreateContainer">
      <div className="postCreateHeader">
        <h3>Share Something</h3>
      </div>
      <form onSubmit={handleSubmit} className="postCreateForm">
        <textarea
          className="postCreateInput"
          placeholder="What's on your mind?"
          value={postText}
          onChange={handleInputChange}
          name="postText"
          id="postText"
        />
        <div className="postCreateActions">
          <div className="postCreateButtons">
            <button type="button" className="postCreateButton">
              <AddPhotoAlternate />
              <span>Photo</span>
            </button>
            <button type="button" className="postCreateButton">
              <Mood />
              <span>Feeling</span>
            </button>
            <button type="button" className="postCreateButton">
              <EmojiObjects />
              <span>Idea</span>
            </button>
          </div>
          <button 
            type="submit" 
            className="postCreateSubmit"
            disabled={!postText.trim()}
          >
            <Send />
            <span>Share</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostCreate 