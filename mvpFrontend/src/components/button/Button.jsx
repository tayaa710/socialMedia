import './button.css'

const Button = ({ message, className }) => {
  const buttonClass = className ? `button ${className}` : 'button';
  
  return (
    <button className={buttonClass}>{message}</button>
  )
}

export default Button