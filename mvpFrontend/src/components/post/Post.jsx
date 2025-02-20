import './post.css'

export default function Post({date, likes, image, caption}) {
  return (
    <div className="postContainer">
      <div className="hiddenPostDetailsTop">
        <p className="datePosted">Posted on {date}</p>
        <p className="likes">{likes} Likes</p>
      </div>
      <img src={image} alt="not found" className="postImage" />
      <div className="hiddenPostDetailsBottom">
        <p className="postCaption">Caption: {caption}</p>
      </div>
    </div>
  )
}
