/* eslint-disable react/prop-types */
import { MoreVert } from '@mui/icons-material'
import './post.css'
import { Users } from "../../dummyData"
import { useState } from 'react'

const Post = ({ post }) => {
  const [like, setLike] = useState(post.like)
  const [isLiked, setIsLiked] = useState(false)
  const user = Users.filter(user => user.id === post.userId)[0]

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }
  
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img src={user.profilePicture} alt="" className="postProfileImg" />
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{post.date}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>

        </div>
        <div className="postCenter">
          <span className="postText">
            {post.desc}
          </span>
          <img src={post.photo} alt="" className="postImage" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className='likeIcon' src="assets/like.png" alt="" onClick={likeHandler}/>
            <img className='likeIcon' src="assets/heart.png" alt="" onClick={likeHandler}/>
            <span className="postLikeCounter">{like} {like === 1 ? "person has" : "people have"} liked the post</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} {post.comment === 1 ? "comment" : "comments"} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post