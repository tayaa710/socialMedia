# classifierBackend/classify.py
import sys
import requests
import os
import tempfile
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from io import BytesIO

# Load BLIP model once when script is first loaded
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def caption_image(source):
    """
    Generate a caption for an image from a URL or local file path
    
    Args:
        source (str): URL or local file path to the image
        
    Returns:
        str: Generated caption for the image
    """
    try:
        # Handle URL vs local file
        if source.startswith(('http://', 'https://')):
            # Download image from URL
            response = requests.get(source, stream=True, timeout=10)
            response.raise_for_status()
            
            # Open image from bytes
            img = Image.open(BytesIO(response.content))
        else:
            # Open image from local path
            img = Image.open(source)
        
        # Convert to RGB (in case of PNG, etc.)
        img = img.convert('RGB')
        
        # Process image with BLIP
        inputs = processor(img, return_tensors="pt")
        output = model.generate(**inputs)
        caption = processor.decode(output[0], skip_special_tokens=True)
        
        return caption
        
    except Exception as e:
        print(f"Error processing image: {str(e)}", file=sys.stderr)
        return "Failed to generate caption"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python classify.py <image_url_or_path>", file=sys.stderr)
        sys.exit(1)
    
    image_source = sys.argv[1]
    caption = caption_image(image_source)
    print(caption)