import axios from "axios"

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" })
  try {
    console.log("Attempting login with credentials:", userCredentials)
    const res = await axios.post("/api/login", userCredentials)
    console.log("Login response received:", res.data)
    
    // Store the token in localStorage
    if (res.data.token) {
      console.log("Storing token in localStorage")
      localStorage.setItem("auth-token", res.data.token)
      // Set the token for all future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
    }
    
    const userData = res.data.user || res.data
    console.log("User data being dispatched:", userData)
    dispatch({ type: "LOGIN_SUCCESS", payload: userData })
  } catch (err) {
    console.error("Login error:", err)
    dispatch({ type: "LOGIN_FAILURE", payload: err })
  }
}

// Function to initialize auth state from localStorage
export const initializeAuth = async (dispatch) => {
  const token = localStorage.getItem("auth-token")
  if (token) {
    dispatch({ type: "LOGIN_START" })
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    try {
      console.log("Verifying token from localStorage")
      const res = await axios.get("/api/login/verify", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      console.log("Token verification response:", res.data)
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
      return res.data
    } catch (err) {
      console.error("Token verification error:", err)
      localStorage.removeItem("auth-token")
      delete axios.defaults.headers.common["Authorization"]
      dispatch({ type: "LOGIN_FAILURE", payload: err })
      return null
    }
  } else {
    // No token found - do nothing or dispatch a specific action
    console.log("No token found in localStorage")
    dispatch({ type: "LOGIN_FAILURE", payload: { message: "No token found" } })
    return null
  }
}
