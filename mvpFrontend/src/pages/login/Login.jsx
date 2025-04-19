import './login.css'
import { LocalFlorist } from '@mui/icons-material'

const Login = () => {
  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="loginLogoContainer">
            <LocalFlorist className="logoIcon" />
            <h3 className="loginLogo">Verdant</h3>
          </div>
          <span className="loginDesc">Ethical Social Media for Authentic Connections</span>
          <div className="ethicalStatement">
            <p>Join a community that values:</p>
            <ul>
              <li>Authentic content without AI manipulation</li>
              <li>Privacy-focused interactions</li>
              <li>Sustainable digital practices</li>
              <li>Meaningful relationships over engagement metrics</li>
            </ul>
          </div>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <h2 className="formTitle">Welcome Back</h2>
            <div className="inputGroup">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Your email address" className="loginInput" />
            </div>
            <div className="inputGroup">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Your password" className="loginInput" />
            </div>
            <button className='loginButton'>
              <span>Sign In</span>
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <div className="divider">
              <span>New to Verdant?</span>
            </div>
            <button className="loginRegisterButton">
              <LocalFlorist className="buttonIcon" />
              <span>Create Account</span>
            </button>
          </div>
          <div className="footerText">
            <p>By joining, you agree to our commitment to ethical social media practices</p>
          </div>
        </div>
      </div>
      <footer className="loginFooter">
        <p>© 2025 Verdant • Ethical Social Media • No AI-Generated Content</p>
      </footer>
    </div>
  )
}

export default Login
