import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import './imageCropper.css'

const ImageCropper = ({ image, onCropComplete, onCancel, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = () => {
    onCropComplete(croppedAreaPixels)
    onSave()
  }

  return (
    <div className="cropperContainer">
      <div className="cropperWrapper">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={onZoomChange}
          cropShape="round"
        />
      </div>
      <div className="cropperControls">
        <div className="zoomControl">
          <label>Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => onZoomChange(e.target.value)}
            className="zoomSlider"
          />
        </div>
        <div className="cropperActions">
          <button className="cropperCancel" onClick={onCancel}>Cancel</button>
          <button className="cropperSave" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper 