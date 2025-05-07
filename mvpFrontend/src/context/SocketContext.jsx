import { createContext, useEffect, useRef, useContext, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    if (user) {
      // Get the socket URL from environment variables or use default
      const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8900";
      console.log("Socket URL:", socketUrl);
      console.log("User ID for socket:", user.id);

      // Initialize socket connection with improved options
      socket.current = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      // Connection event listeners
      socket.current.on("connect", () => {
        console.log("Connected to socket with ID:", socket.current.id);
        setIsConnected(true);
        setConnectionAttempts(0);
        
        // Register user with socket server immediately after connection
        socket.current.emit("addUser", user.id);
      });

      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        setIsConnected(false);
        setConnectionAttempts(prev => prev + 1);
      });

      socket.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
        
        // If server disconnect, try to reconnect manually
        if (reason === "io server disconnect") {
          socket.current.connect();
        }
      });

      socket.current.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts");
        
        // Re-register user with socket server after reconnection
        socket.current.emit("addUser", user.id);
      });

      // Cleanup on unmount
      return () => {
        if (socket.current) {
          console.log("Disconnecting socket");
          socket.current.disconnect();
          socket.current = null;
        }
      }
    }

    return undefined;
  }, [user])

  // Provide socket methods with better error handling
  const emit = (...args) => {
    if (!socket.current || !isConnected) {
      console.warn("Socket not connected, can't emit:", args[0]);
      return false;
    }
    return socket.current.emit(...args);
  };

  const on = (event, callback) => {
    if (!socket.current) {
      console.warn("Socket not initialized, can't listen to:", event);
      return () => {};
    }
    socket.current.on(event, callback);
    return () => socket.current?.off(event, callback);
  };

  const value = {
    socket: socket.current,
    emit,
    on,
    isConnected,
    connectionAttempts
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
