import { Error } from '@mui/icons-material';
import './postCreate.css';

const ValidationError = ({ error, validationErrors, onDismiss, onReset }) => {
  return (
    <div className="validationErrorContainer">
      <div className="validationErrorHeader">
        <Error className="validationErrorIcon" />
        <h4>{error}</h4>
        <button 
          type="button"
          className="dismissErrorBtn"
          onClick={onDismiss}
        >
          ✕
        </button>
      </div>
      {validationErrors.length > 0 && (
        <ul className="validationErrorList">
          {validationErrors.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      )}
      <div className="validationErrorActions">
        <button 
          type="button" 
          className="validationErrorBtn" 
          onClick={onReset}
        >
          Reset Form
        </button>
        <button 
          type="button" 
          className="validationErrorBtn validationErrorBtnPrimary" 
          onClick={onDismiss}
        >
          Try Different Image
        </button>
      </div>
    </div>
  );
};

export default ValidationError; 