import Post from "../post/Post";
import './profilePosts.css'

export default function ProfilePosts() {

  const posts = [
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      Caption: "Photo 1",
      url: "../../assets/postReal/1.JPG",
      id:1
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 1030,
      Caption: "Photo 2",
      url: "../../assets/postReal/2.jpeg",
      id:2
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      Caption: "Photo 3",
      url: "../../assets/postReal/3.jpeg",
      id:3
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      Caption: "Photo 4",
      url: "../../assets/postReal/4.jpeg",
      id:4
    },

    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      Caption: "GITHYB TESTTTTTTTTTTTTTTT",
      url: "../../assets/postReal/4.jpeg",
      id:7
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      Caption: "GITHYB TESTTTTTTTTTTTTTTT",
      url: "../../assets/postReal/4.jpeg",
      id:8
    }
  ]
  return (
   <div className="postsContainer">
     {posts.map(post => <Post date={post.date} likes={post.likes} caption={post.caption} image={post.url} key={post.id}/> )}
   </div>
  )
}
