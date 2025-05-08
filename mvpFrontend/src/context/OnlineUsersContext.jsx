import { createContext, useContext, useState, useEffect } from "react";
import { SocketContext } from "./SocketContext";
import { AuthContext } from "./AuthContext";

export const OnlineUsersContext = createContext()

export const OnlineUsersContextProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const { on, emit, isConnected } = useContext(SocketContext)
    const { user } = useContext(AuthContext)
    
    useEffect(() => {
      // When socket connection is established and user is logged in
      if (isConnected && user) {
        // Request current online users list
        emit("getUsers");
      }
    }, [isConnected, user, emit]);

    useEffect(() => {
      if (!isConnected || !user) return;

      // Listen for online users updates
      const handleGetUsers = (users) => {
        // Convert all user IDs to strings for consistent type comparison
        const userIds = users
          .map((user) => String(user.userId))
          .filter((id) => user && id !== String(user.id))
        
        console.log("Online users received:", users);
        console.log("Filtered online user IDs:", userIds);
        
        setOnlineUsers(userIds)
      };

      // Set up event listener for getUsers events
      const cleanup = on("getUsers", handleGetUsers);

      return cleanup;
    }, [on, user, isConnected]);

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers }}>
            {children}
        </OnlineUsersContext.Provider>
    )
}