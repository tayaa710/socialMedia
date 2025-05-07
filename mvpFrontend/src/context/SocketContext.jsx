import { createContext, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socket = useRef(null);

  useEffect(() => {
    if (user) {
      // Get the socket URL from environment variables or use default
      const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8900";
      console.log("Socket URL:", socketUrl);
      console.log("User ID for socket:", user.id);

      socket.current = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket with ID:", socket.current.id);
        // Make sure to emit addUser to register with the socket server
        socket.current.emit("addUser", user.id);
      });

      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });
      
      // Listen for disconnections
      socket.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      return () => {
        if (socket.current) {
          console.log("Disconnecting socket");
          socket.current.disconnect();
        }
      }
    }

    return undefined;
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

