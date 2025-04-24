import './login.css'
import { useState, useRef, useContext } from 'react'
import { LocalFlorist } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import ReCAPTCHA from 'react-google-recaptcha'
import { loginCall } from '../../apiCalls'
import { AuthContext } from '../../context/AuthContext.jsx'

const Login = () => {
    const [captchaValue, setCaptchaValue] = useState(null)

    const recaptchaRef = useRef(null)
    const emailRef = useRef()
    const passwordRef = useRef()
    // eslint-disable-next-line no-unused-vars
    const { user, isFetching, error, dispatch } = useContext(AuthContext)

    const handleCaptchaChange = (value) => {
        console.log("Captcha value:", value)
        setCaptchaValue(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Check if CAPTCHA is completed
        if (!captchaValue) {
            alert("Please complete the CAPTCHA verification")
            return
        }
        
        loginCall({ email:emailRef.current.value, password:passwordRef.current.value }, dispatch)
        // Add your login logic here
    }
    console.log(user)
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
                    <form className="loginBox" onSubmit={handleSubmit}>
                        <h2 className="formTitle">Welcome Back</h2>
                        <div className="inputGroup">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Your email address"
                                className="loginInput"
                                defaultValue=""
                                required
                                ref={emailRef}
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Your password"
                                className="loginInput"
                                defaultValue=""
                                required
                                ref={passwordRef}
                                minLength={8}
                            />
                        </div>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LeghB0rAAAAAMlalrzzGgaJc-C_vf4PRKkNEuze"
                            onChange={handleCaptchaChange}
                        />
                        <button type="submit" className='loginButton'>
                            <span>{isFetching ? <CircularProgress size={20} /> : "Sign In"}</span>
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <div className="divider">
                            <span>New to Verdant?</span>
                        </div>
                        <button type="button" className="loginRegisterButton">
                            <LocalFlorist className="buttonIcon" />
                            <span>Create Account</span>
                        </button>
                    </form>
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
