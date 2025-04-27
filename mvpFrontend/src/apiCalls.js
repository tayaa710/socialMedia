import { authAPI } from "./services/api"

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" })
  try {
    console.log("Attempting login with credentials:", userCredentials)
    const data = await authAPI.login(userCredentials)
    console.log("Login response received:", data)
    
    const userData = data.user || data
    console.log("User data being dispatched:", userData)
    dispatch({ type: "LOGIN_SUCCESS", payload: userData })
  } catch (err) {
    console.error("Login error:", err)
    dispatch({ type: "LOGIN_FAILURE", payload: err })
  }
}

// Function to initialize auth state from localStorage
export const initializeAuth = async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_START" })
    console.log("Verifying token from localStorage")
    const data = await authAPI.verifyToken()
    
    if (data) {
      console.log("Token verification response:", data)
      dispatch({ type: "LOGIN_SUCCESS", payload: data })
      return data
    } else {
      throw new Error("No valid token")
    }
  } catch (err) {
    console.error("Token verification error:", err)
    authAPI.logout()
    dispatch({ type: "LOGIN_FAILURE", payload: err })
    return null
  }
}
