import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material"
import "./share.css"

const Share = () => {
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src="/assets/person/8.jpeg" alt="" />
          <input placeholder="What's on your mind?" className="shareInput" />
        </div>
        <hr className="shareHr" />
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon"></PermMedia>
              <span className="shareOptions">Photo or Video?</span>
            </div>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon"></Label>
              <span className="shareOptions">Tag</span>
            </div>
            <div className="shareOption">
              <Room  htmlColor="green" className="shareIcon"></Room>
              <span className="shareOptions">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions  htmlColor="goldenrod" className="shareIcon"></EmojiEmotions>
              <span className="shareOptions">Feelings</span>
            </div>
          </div>
          <button className="shareButton">Share</button>
        </div>
      </div>
    </div>
  )
}

export default Share