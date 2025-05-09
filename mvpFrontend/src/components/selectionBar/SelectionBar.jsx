import './selectionbar.css'
import Option from './option/Option'

const SelectionBar = ({setSelectedOption, selectedOption}) => {
  const options = ["Posts", "Friends", "Info"]
  return (
    <div>
      <div className="selectionBarContainer">
        {
          options.map(option =>
            <Option
              text={option}
              isSelected={selectedOption === option}
              setSelectedOption={setSelectedOption}
              key={option}
            />
          )
        }
      </div>
      <div>
        <hr></hr>
      </div>
    </div>
  )
}

export default SelectionBar
