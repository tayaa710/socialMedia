/* eslint-disable react/prop-types */
import './option.css'

export default function Option({text, isSelected, setSelectedOption}) {
  const handleOptionChange = () => {
    if (isSelected) {
      return
    }

    console.log("Selected", text)
    setSelectedOption(text)
  }
  return (
    <button className={!isSelected ? "optionsContainer" : `optionsContainerSelected`} onClick={handleOptionChange}>{text}</button>
  )
}
