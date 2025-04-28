import './postCreate.css';

const ImagePreview = ({ previewUrl, isAnalyzing, onRemove }) => {
  return (
    <div className="imagePreviewContainer">
      <img src={previewUrl} alt="Preview" className="imagePreview" />
      {isAnalyzing && (
        <div className="imageAnalysisOverlay">
          <div className="analysisIndicator">
            <div className="spinner"></div>
            <p>Analyzing image content...</p>
          </div>
        </div>
      )}
      <button 
        type="button" 
        className="removeImageBtn"
        onClick={onRemove}
      >
        ✕
      </button>
    </div>
  );
};

export default ImagePreview; 