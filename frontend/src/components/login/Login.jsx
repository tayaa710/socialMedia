import './login.css'

export default function Login() {
  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Definitley not Facebook</h3>
          <span className="loginDesc"> Looks nothing like Facebook</span>

        </div>
        <div className="loginRight">
          <div className="loginBox">
            <input placeholder="Email" className="loginInput" />
            <input placeholder="Password" className="loginInput" />
            <button className='loginButton'>Log In</button>
            <span className="loginForgot">Forgot Password</span>
            <button className="loginRegisterButton">Create a New Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}
