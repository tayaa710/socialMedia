import './login.css'
import { useState, useRef, useContext, useEffect } from 'react'
import { LocalFlorist } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import ReCAPTCHA from 'react-google-recaptcha'
import { loginCall } from '../../apiCalls'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [captchaValue, setCaptchaValue] = useState(null)
    const recaptchaRef = useRef(null)
    const emailRef = useRef()
    const passwordRef = useRef()
    // eslint-disable-next-line no-unused-vars
    const { user, isFetching, error, dispatch } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            console.log("User in context after login:", user)
        }
    }, [user])

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
        
        const credentials = { 
            email: emailRef.current.value, 
            password: passwordRef.current.value 
        }
        console.log("Submitting login with email:", credentials.email)
        loginCall(credentials, dispatch)
        recaptchaRef.current.reset()
        setCaptchaValue(null)
    }
    
    return (
        <div className='login'>
            <div className="loginWrapper">
                <div className="loginLeft">
                    <div className="loginLogoContainer">
                        <LocalFlorist className="logoIcon" />
                        <h3 className="loginLogo">Authentra</h3>
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
                        <button type="submit" className='loginButton' disabled={isFetching || !captchaValue}>
                            <span>{isFetching ? <CircularProgress size={20} /> : "Sign In"}</span>
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <div className="divider">
                            <span>New to Authentra?</span>
                        </div>
                        <button type="button" className="loginRegisterButton" onClick={() => navigate('/register')}>
                            <LocalFlorist className="buttonIcon" />
                            <span>Create Account</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
