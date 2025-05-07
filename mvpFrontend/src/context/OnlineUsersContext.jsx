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
        const userIds = users.map((user) => user.userId).filter((id) => id !== user.id)
        setOnlineUsers(userIds)
      })
    }, [on])

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers }}>
            {children}
        </OnlineUsersContext.Provider>
    )
}