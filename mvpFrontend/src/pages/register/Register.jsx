import './register.css'
import { useState, useRef } from 'react'
import { LocalFlorist } from '@mui/icons-material'
import ReCAPTCHA from 'react-google-recaptcha'

const Register = () => {
    const [captchaValue, setCaptchaValue] = useState(null)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const recaptchaRef = useRef(null)

    const handleCaptchaChange = (value) => {
        console.log("Captcha value:", value)
        setCaptchaValue(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form submitted", { username, email, password, captchaValue })
        // Add your registration logic here
    }

    return (
        <div className='register'>
            <div className="registerWrapper">
                <div className="registerLeft">
                    <div className="registerLogoContainer">
                        <LocalFlorist className="logoIcon" />
                        <h3 className="registerLogo">Verdant</h3>
                    </div>
                    <span className="registerDesc">Ethical Social Media for Authentic Connections</span>
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
                <div className="registerRight">
                    <form className="registerBox" onSubmit={handleSubmit}>
                        <h2 className="formTitle">Create Your Account</h2>
                        <div className="inputGroup">
                            <label htmlFor="username">Username</label>
                            <input 
                                id="username" 
                                type="text" 
                                placeholder="Choose a username" 
                                className="registerInput" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="email">Email</label>
                            <input 
                                id="email" 
                                type="email" 
                                placeholder="Your email address" 
                                className="registerInput" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="password">Password</label>
                            <input 
                                id="password" 
                                type="password" 
                                placeholder="Create a password" 
                                className="registerInput" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Confirm your password" 
                                className="registerInput" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LeghB0rAAAAAMlalrzzGgaJc-C_vf4PRKkNEuze"
                            onChange={handleCaptchaChange}
                        />
                        <button type="submit" className='registerButton' disabled={!captchaValue}>
                            <span>Sign Up</span>
                        </button>
                        <div className="divider">
                            <span>Already have an account?</span>
                        </div>
                        <button type="button" className="registerLoginButton">
                            <LocalFlorist className="buttonIcon" />
                            <span>Sign In</span>
                        </button>
                    </form>
                    <div className="footerText">
                        <p>By joining, you agree to our commitment to ethical social media practices</p>
                    </div>
                </div>
            </div>
            <footer className="registerFooter">
                <p>© 2025 Verdant • Ethical Social Media • No AI-Generated Content</p>
            </footer>
        </div>
    )
}

export default Register 