import './button.css'

const Button = ({ message, className, onClick }) => {
  const buttonClass = className ? `button ${className}` : 'button';
  
  return (
    <button className={buttonClass} onClick={onClick}>{message}</button>
  )
}

export default Button