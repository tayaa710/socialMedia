
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Post from "../post/Post";
import "./profilePosts.css";
import { useState } from "react";
export default function ProfilePosts() {
  const [sortOrder, setSortOrder] = useState("Recent")
  const posts = [
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      caption: "Photo 1",
      url: "../../assets/postReal/1.JPG",
      id: 1,
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 1030,
      caption: "Photo 2",
      url: "../../assets/postReal/2.jpeg",
      id: 2,
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      caption: "Photo 3",
      url: "../../assets/postReal/3.jpeg",
      id: 3,
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      caption: "Photo 4",
      url: "../../assets/postReal/4.jpeg",
      id: 4,
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      caption: "GITHYB TESTTTTTTTTTTTTTTT",
      url: "../../assets/postReal/4.jpeg",
      id: 7,
    },
    {
      user: "Aaron",
      date: "20/02/2025",
      likes: 100,
      caption: "GITHYB TESTTTTTTTTTTTTTTT",
      url: "../../assets/postReal/4.jpeg",
      id: 8,
    },
  ];

  return (
    <div>
      <select name="orderSelector" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="Recent">Recent</option>
          <option value="Oldest">Oldest</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
        </select>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 300: 3, 850: 4, 1400: 5 }}
        gutterBreakpoints={{ 350: "12px", 750: "16px", 800: "18px" }}
      >
        <Masonry>
          {posts.map((post) => (
            <Post
              key={post.id}
              date={post.date}
              likes={post.likes}
              caption={post.caption}
              image={post.url}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}