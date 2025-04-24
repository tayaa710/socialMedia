import axios from "axios"

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" })
  try {
    const res = await axios.post("/api/login", userCredentials)
    
    // Store the token in localStorage
    if (res.data.token) {
      localStorage.setItem("auth-token", res.data.token)
      // Set the token for all future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
    }
    
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user || res.data })
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err })
  }
}

// Function to initialize auth state from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem("auth-token")
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    // You may want to validate the token or fetch user data here
  }
}
