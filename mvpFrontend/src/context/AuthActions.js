// eslint-disable-next-line no-unused-vars
export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
})

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
})

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
})

export const UpdateUser = (user) => ({
  type: "UPDATE_USER",
  payload: user,
})