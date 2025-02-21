import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import User from "../user/User";
import "./profileFriends.css";
import { useState } from "react";

export default function ProfileFriends() {
  const [sortOrder, setSortOrder] = useState("Recent")
  const friends = [
    { id: 100, name: "Daffy Duck", friendedDate: "2021-08-09" },
    { id: 101, name: "Bob", friendedDate: "2020-02-19" },
    { id: 102, name: "Charlie", friendedDate: "2023-12-27" },
    { id: 103, name: "David", friendedDate: "2021-01-06" },
    { id: 104, name: "Frank", friendedDate: "2023-06-30" },
    { id: 105, name: "Grace", friendedDate: "2023-07-06" },
    { id: 106, name: "Haggis", friendedDate: "2022-02-28" },
    { id: 107, name: "Alice", friendedDate: "2021-01-21" },
    { id: 108, name: "Haggis", friendedDate: "2020-01-21" },
    { id: 109, name: "George", friendedDate: "2021-12-12" },
    { id: 110, name: "Ivy", friendedDate: "2020-03-25" },
    { id: 111, name: "Jack", friendedDate: "2022-06-09" },
    { id: 112, name: "Karen", friendedDate: "2024-01-10" },
    { id: 113, name: "Liam", friendedDate: "2021-05-22" },
  ];

  const friendsSorted = () => {
    switch (sortOrder) {
      case "A-Z": {
        return friends.sort((a, b) => a.name.localeCompare(b.name));
      }

      case "Z-A": {
        return friends.sort((a, b) => b.name.localeCompare(a.name));
      }

      case "Recent": {
        return friends.sort((a, b) => new Date(b.friendedDate) - new Date(a.friendedDate));
      }

      case "Oldest": {
        return friends.sort((a, b) => new Date(a.friendedDate) - new Date(b.friendedDate));
      }

      default: {
        return friends.sort((a, b) => new Date(b.friendedDate) - new Date(a.friendedDate));
      }
    }
  }

  return (
    <div>
      <select name="orderSelector" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
        <option value="Recent">Recent</option>
        <option value="Oldest">Oldest</option>
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
      </select>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 300: 4, 600: 5, 900: 6 }}
        gutterBreakpoints={{ 350: "10px", 750: "15px", 800: "20px" }}
      >
        <Masonry>
          {friendsSorted().map((friend) => (
            <User key={friend.id} name={friend.name} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}