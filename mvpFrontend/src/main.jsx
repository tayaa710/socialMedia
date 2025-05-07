import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { OnlineUsersContextProvider } from './context/OnlineUsersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <SocketProvider>
        <OnlineUsersContextProvider>
          <App />
        </OnlineUsersContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  </StrictMode>,
)
