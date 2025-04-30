/**
 * This function creates a cropped image from the original image and crop area
 */
export const createCroppedImage = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // Set canvas dimensions to match the cropped image
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // Convert the canvas to a blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        // Reject if blob is null
        return
      }
      
      blob.name = 'cropped-image.jpeg'
      resolve(blob)
    }, 'image/jpeg', 0.95) // JPEG format with high quality
  })
}

/**
 * Creates an HTMLImageElement from a source
 */
const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })
} 