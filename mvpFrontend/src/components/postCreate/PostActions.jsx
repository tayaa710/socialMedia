import { AddPhotoAlternate, Mood, EmojiObjects, Send } from '@mui/icons-material';
import './postCreate.css';

const PostActions = ({ 
  onFileChange, 
  isUploading, 
  isAnalyzing, 
  fileInputRef 
}) => {
  return (
    <div className="postCreateActions">
      <div className="postCreateButtons">
        <label htmlFor="file" className="postCreateButton">
          <AddPhotoAlternate />
          <span>Photo</span>
        </label>
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          accept=".png,.jpeg,.jpg"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        <button type="button" className="postCreateButton">
          <Mood />
          <span>Feeling</span>
        </button>
        <button type="button" className="postCreateButton">
          <EmojiObjects />
          <span>Idea</span>
        </button>
      </div>
      <button
        type="submit"
        className="postCreateSubmit"
        disabled={isUploading || isAnalyzing}
      >
        <Send />
        <span>{isUploading ? 'Posting...' : isAnalyzing ? 'Analyzing...' : 'Share'}</span>
      </button>
    </div>
  );
};

export default PostActions; 