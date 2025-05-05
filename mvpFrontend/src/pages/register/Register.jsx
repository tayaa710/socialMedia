import './register.css'
import { useRef } from 'react'
import { LocalFlorist } from '@mui/icons-material'
// import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Register = () => {
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    // const recaptchaRef = useRef(null)
    // const [captchaValue, setCaptchaValue] = useState(null)
    const navigate = useNavigate()

    /* Commenting out captcha handling temporarily
    const handleCaptchaChange = (value) => {
        setCaptchaValue(value)
    }
    */

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (confirmPasswordRef.current.value !== passwordRef.current.value) {
            passwordRef.current.setCustomValidity("Passwords do not match")
        } else {
            const user = {
                username: usernameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value, 
                // captchaValue: captchaValue
            }
            try {
                const response = await axios.post('/api/users/register', user)
                console.log(response)
                navigate('/login')
            } catch (error) {
                console.error('Error registering user:', error)
            }
        }
    }

    return (
        <div className='register'>
            <div className="registerWrapper">
                <div className="registerLeft">
                    <div className="registerLogoContainer">
                        <LocalFlorist className="logoIcon" />
                        <h3 className="registerLogo">Authentra</h3>
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
                    <h2 className="formTitle">Create Your Account</h2>
                    <form className="registerBox" onSubmit={handleSubmit}>
                        <div className="inputGroup">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Choose a username"
                                className="registerInput"
                                ref={usernameRef}
                                defaultValue="testuser123"
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
                                ref={emailRef}
                                defaultValue="test@example.com"
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
                                ref={passwordRef}
                                defaultValue="password123"
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
                                ref={confirmPasswordRef}
                                defaultValue="password123"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Commenting out ReCAPTCHA component temporarily
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LeghB0rAAAAAMlalrzzGgaJc-C_vf4PRKkNEuze"
                            onChange={handleCaptchaChange}
                        />
                        */}
                        <button type="submit" className='registerButton'>
                            <span>Sign Up</span>
                        </button>
                        <div className="divider">
                            <span>Already have an account?</span>
                        </div>
                        <button type="button" className="registerLoginButton" onClick={() => navigate('/login')}>
                            <LocalFlorist className="buttonIcon" />
                            <span>Sign In</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register 