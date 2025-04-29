# classifierBackend/classify.py
import sys
import requests
import os
import tempfile
from PIL import Image
from transformers import Blip2Processor, Blip2ForConditionalGeneration
from io import BytesIO
import torch
import gc
import json
import re
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import threading

# Global variable to track if model is loaded
MODEL_LOADED = False
processor = None
model = None

def load_model():
    """Load the BLIP2 model if it hasn't been loaded already"""
    global MODEL_LOADED, processor, model
    
    if MODEL_LOADED:
        return
    
    # Set to CPU only, explicitly disable CUDA and MPS
    device = torch.device("cpu")
    print("Using CPU for inference")

    # Enable garbage collection to manage memory
    gc.enable()

    # Load BLIP2 model once when script is first loaded
    print("Loading BLIP2-Flan-T5-XL model (this may take a few minutes)...")

    # Use efficient loading options
    processor = Blip2Processor.from_pretrained(
        "Salesforce/blip2-flan-t5-xl",
        use_fast=True
    )

    # Load model with CPU offloading for memory efficiency
    print("Loading model in CPU mode (this will take several minutes)...")
    model = Blip2ForConditionalGeneration.from_pretrained(
        "Salesforce/blip2-flan-t5-xl",
        low_cpu_mem_usage=True,
        offload_folder="offload_folder",  # Temporary folder for offloading
        offload_state_dict=True,  # Offload state dict to reduce peak memory
        torch_dtype=torch.float32  # Use 32-bit for better compatibility
    )

    # Explicitly move to CPU
    model.to(device)
    MODEL_LOADED = True
    print("Model loaded successfully")

def process_image(source):
    """
    Process an image to generate both a caption and categories
    
    Args:
        source (str): URL or local file path to the image
        
    Returns:
        dict: A dictionary with 'caption' and 'categories' keys
    """
    try:
        # Make sure model is loaded
        if not MODEL_LOADED:
            load_model()
        
        # Clear any cached memory before processing
        gc.collect()
        torch.cuda.empty_cache() if torch.cuda.is_available() else None
        
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
        
        # Resize image to reduce memory usage (optional)
        if max(img.size) > 1000:
            scale = 1000 / max(img.size)
            new_size = (int(img.size[0] * scale), int(img.size[1] * scale))
            img = img.resize(new_size, Image.LANCZOS)
        
        # First: Generate a detailed caption
        print("Processing image for caption...")
        caption_prompt = "Describe this image in detail."
        inputs_caption = processor(img, caption_prompt, return_tensors="pt").to(device)
        
        print("Generating caption...")
        generated_ids_caption = model.generate(
            **inputs_caption,
            max_new_tokens=75,
            do_sample=False,
            num_beams=1,
            length_penalty=1.0
        )
        caption = processor.batch_decode(generated_ids_caption, skip_special_tokens=True)[0]
        
        # Clean up to free memory
        del inputs_caption, generated_ids_caption
        gc.collect()
        
        # Second: Generate categories
        print("Processing image for categories...")
        category_prompt = "List the main objects, subjects, and themes in this image as comma-separated categories."
        inputs_categories = processor(img, category_prompt, return_tensors="pt").to(device)
        
        print("Generating categories...")
        generated_ids_categories = model.generate(
            **inputs_categories,
            max_new_tokens=30,
            do_sample=False,
            num_beams=1,
            length_penalty=1.0
        )
        categories_text = processor.batch_decode(generated_ids_categories, skip_special_tokens=True)[0]
        
        # Parse the categories from comma-separated list
        categories = [cat.strip() for cat in re.split(r',|\n', categories_text) if cat.strip()]
        
        # Clean up to free memory
        del inputs_categories, generated_ids_categories
        gc.collect()
        
        return {
            "caption": caption,
            "categories": categories
        }
        
    except Exception as e:
        print(f"Error processing image: {str(e)}", file=sys.stderr)
        return {
            "caption": "Failed to generate caption",
            "categories": []
        }

def caption_image(source):
    """
    Legacy function that calls process_image but only returns the caption
    Used for backward compatibility
    """
    result = process_image(source)
    return result["caption"]

class ImageClassifierHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/classify'):
            # Parse query parameters
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            
            if 'image' not in params:
                self.send_error(400, 'Missing image parameter')
                return
            
            image_source = params['image'][0]
            
            # Process the image
            result = process_image(image_source)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        else:
            self.send_error(404, 'Not Found')

def run_server(port=8000):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ImageClassifierHandler)
    print(f"Starting image classifier server on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    # Load the model once at startup
    load_model()
    
    if len(sys.argv) < 2:
        print("No arguments provided. Starting server mode...")
        server_thread = threading.Thread(target=run_server)
        server_thread.daemon = True
        server_thread.start()
        
        # Keep the main thread running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("Server shutting down...")
            sys.exit(0)
    else:
        # CLI mode for backward compatibility
        image_source = sys.argv[1]
        result = process_image(image_source)
        
        # Print the results
        print(f"Caption: {result['caption']}")
        print(f"Categories: {', '.join(result['categories'])}")
        
        # Also output as JSON for programmatic use
        print("\nJSON OUTPUT:")
        print(json.dumps(result))