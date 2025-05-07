import { createContext, useContext, useState, useEffect } from "react";
import { SocketContext } from "./SocketContext";
import { AuthContext } from "./AuthContext";

export const OnlineUsersContext = createContext()

export const OnlineUsersContextProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const { on } = useContext(SocketContext)
    const { user } = useContext(AuthContext)
    
    useEffect(() => {
      on("getUsers", (users) => {
        // Convert all user IDs to strings for consistent type comparison
        const userIds = users
          .map((user) => String(user.userId))
          .filter((id) => user && id !== String(user.id))
        
        console.log("Online users received:", users);
        console.log("Filtered online user IDs:", userIds);
        
        setOnlineUsers(userIds)
      })
    }, [on, user])

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers }}>
            {children}
        </OnlineUsersContext.Provider>
    )
}