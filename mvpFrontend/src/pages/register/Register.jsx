import './register.css'
import { useRef, useState } from 'react'
import { LocalFlorist } from '@mui/icons-material'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Register = () => {
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const bioRef = useRef(null)
    const ageRef = useRef(null)
    const birthdayRef = useRef(null)
    const countryRef = useRef(null)
    const cityRef = useRef(null)
    const statusRef = useRef(null)
    const educationRef = useRef(null)
    const phoneRef = useRef(null)
    const valuesRef = useRef(null)
    const profilePictureRef = useRef(null)
    const recaptchaRef = useRef(null)
    const [captchaValue, setCaptchaValue] = useState(null)
    const navigate = useNavigate()

    const handleCaptchaChange = (value) => {
        console.log("Captcha value:", value)
        setCaptchaValue(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (confirmPasswordRef.current.value !== passwordRef.current.value) {
            passwordRef.current.setCustomValidity("Passwords do not match")
        } else {
            // Create user object matching backend schema
            const user = {
                username: usernameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value, // Backend will hash this
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                profilePicture: profilePictureRef.current.value,
                bio: bioRef.current.value,
                age: ageRef.current.value ? parseInt(ageRef.current.value) : null,
                personal: {
                    birthday: birthdayRef.current.value,
                    age: ageRef.current.value ? parseInt(ageRef.current.value) : null,
                    country: countryRef.current.value,
                    city: cityRef.current.value
                },
                relationships: {
                    status: statusRef.current.value,
                    education: educationRef.current.value,
                    phone: phoneRef.current.value
                },
                values: valuesRef.current.value.split(',').map(value => value.trim()),
                captchaValue: captchaValue
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
                    <form className="registerBox" onSubmit={handleSubmit}>
                        <h2 className="formTitle">Create Your Account</h2>
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
                        
                        <h3 className="sectionTitle">Personal Information</h3>
                        <div className="inputGroup">
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                id="firstName" 
                                type="text" 
                                placeholder="Your first name" 
                                className="registerInput" 
                                ref={firstNameRef}
                                defaultValue="John"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                id="lastName" 
                                type="text" 
                                placeholder="Your last name" 
                                className="registerInput" 
                                ref={lastNameRef}
                                defaultValue="Smith"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="bio">Bio</label>
                            <textarea 
                                id="bio" 
                                placeholder="Tell us about yourself (max 200 characters)" 
                                className="registerInput textArea" 
                                ref={bioRef}
                                maxLength={200}
                                defaultValue="Software developer passionate about sustainable technology and ethical computing. Love hiking and photography in my free time."
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="age">Age</label>
                            <input 
                                id="age" 
                                type="number" 
                                placeholder="Your age" 
                                className="registerInput" 
                                ref={ageRef}
                                defaultValue="28"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="profilePicture">Profile Picture URL</label>
                            <input 
                                id="profilePicture" 
                                type="text" 
                                placeholder="URL to your profile picture" 
                                className="registerInput" 
                                ref={profilePictureRef}
                                defaultValue="https://randomuser.me/api/portraits/men/42.jpg"
                            />
                        </div>
                        
                        <h3 className="sectionTitle">Personal Details</h3>
                        <div className="inputGroup">
                            <label htmlFor="birthday">Birthday</label>
                            <input 
                                id="birthday" 
                                type="date" 
                                className="registerInput" 
                                ref={birthdayRef}
                                defaultValue="1995-05-15"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="country">Country</label>
                            <input 
                                id="country" 
                                type="text" 
                                placeholder="Your country" 
                                className="registerInput" 
                                ref={countryRef}
                                defaultValue="United States"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="city">City</label>
                            <input 
                                id="city" 
                                type="text" 
                                placeholder="Your city" 
                                className="registerInput" 
                                ref={cityRef}
                                defaultValue="San Francisco"
                            />
                        </div>
                        
                        <h3 className="sectionTitle">Relationships</h3>
                        <div className="inputGroup">
                            <label htmlFor="status">Relationship Status</label>
                            <select 
                                id="status" 
                                className="registerInput" 
                                ref={statusRef}
                                defaultValue="Single"
                            >
                                <option value="">Select status</option>
                                <option value="Single">Single</option>
                                <option value="In a relationship">In a relationship</option>
                                <option value="Married">Married</option>
                                <option value="It's complicated">It&apos;s complicated</option>
                            </select>
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="education">Education</label>
                            <input 
                                id="education" 
                                type="text" 
                                placeholder="Your education background" 
                                className="registerInput" 
                                ref={educationRef}
                                defaultValue="Computer Science from State University"
                            />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="phone">Phone</label>
                            <input 
                                id="phone" 
                                type="tel" 
                                placeholder="Your phone number" 
                                className="registerInput" 
                                ref={phoneRef}
                                defaultValue="415-555-1234"
                            />
                        </div>
                        
                        <h3 className="sectionTitle">Values</h3>
                        <div className="inputGroup">
                            <label htmlFor="values">Your Values (comma-separated)</label>
                            <textarea 
                                id="values" 
                                placeholder="Sustainability, Privacy, Digital Wellbeing, etc." 
                                className="registerInput textArea" 
                                ref={valuesRef}
                                defaultValue="Sustainability, Privacy, Digital Wellbeing, Authentic Communication, Ethical Tech"
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
                        <button type="button" className="registerLoginButton" onClick={() => navigate('/login')}>
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
                <p>© 2025 Authentra • Ethical Social Media • No AI-Generated Content</p>
            </footer>
        </div>
    )
}

export default Register 