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
import queue
import logging
from tqdm import tqdm

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Global variables
MODEL_LOADED = False
MODEL_LOADING = False
MODEL_LOAD_ERROR = None
MODEL_LOAD_PROGRESS = 0
processor = None
model = None
device = torch.device("cpu")  # Always use CPU for consistency
request_queue = queue.Queue()

def load_model():
    """Load the BLIP2 model in a background thread"""
    global MODEL_LOADED, MODEL_LOADING, MODEL_LOAD_ERROR, MODEL_LOAD_PROGRESS, processor, model, device
    
    if MODEL_LOADED or MODEL_LOADING:
        return

    MODEL_LOADING = True
    MODEL_LOAD_PROGRESS = 0
    logger.info("Starting model loading process...")
    
    try:
        # Always use CPU for consistency
        logger.info("Using CPU for inference")

        # Enable garbage collection to manage memory
        gc.enable()
        
        # Create a temporary folder for model cache
        cache_dir = os.path.join(tempfile.gettempdir(), "blip2_cache")
        os.makedirs(cache_dir, exist_ok=True)
        logger.info(f"Using cache directory: {cache_dir}")

        # Load BLIP2 model
        logger.info("Loading BLIP2-Flan-T5-XL model (this may take a few minutes)...")

        # First load the processor (faster)
        logger.info("Loading processor...")
        processor = Blip2Processor.from_pretrained(
            "Salesforce/blip2-flan-t5-xl",
            use_fast=True,
            cache_dir=cache_dir
        )
        logger.info("Processor loaded successfully")
        MODEL_LOAD_PROGRESS = 20

        # Load model with CPU offloading for memory efficiency
        logger.info("Loading model in CPU mode (this will take several minutes)...")
        model = Blip2ForConditionalGeneration.from_pretrained(
            "Salesforce/blip2-flan-t5-xl",
            low_cpu_mem_usage=True,
            offload_folder="offload_folder",  # Temporary folder for offloading
            offload_state_dict=True,  # Offload state dict to reduce peak memory
            torch_dtype=torch.float32,  # Use 32-bit for better compatibility
            cache_dir=cache_dir
        )
        logger.info("Model loaded successfully")
        MODEL_LOAD_PROGRESS = 100

        # Explicitly move to CPU
        model.to(device)
        MODEL_LOADED = True
        logger.info("Model initialization complete")
        
    except Exception as e:
        MODEL_LOAD_ERROR = str(e)
        logger.error(f"Error loading model: {MODEL_LOAD_ERROR}", exc_info=True)
    finally:
        if not MODEL_LOADED and not MODEL_LOAD_ERROR:
            MODEL_LOAD_ERROR = "Model failed to load for unknown reason"
        MODEL_LOADING = False

def get_model_status():
    """Get the current status of the model loading process"""
    if MODEL_LOADED:
        return {"status": "loaded", "progress": 100}
    elif MODEL_LOADING:
        return {"status": "loading", "progress": MODEL_LOAD_PROGRESS}
    elif MODEL_LOAD_ERROR:
        return {"status": "error", "error": MODEL_LOAD_ERROR}
    else:
        return {"status": "not_started", "progress": 0}

def process_image(source):
    """
    Process an image to generate both a caption and categories
    
    Args:
        source (str): URL or local file path to the image
        
    Returns:
        dict: A dictionary with 'caption' and 'categories' keys
    """
    global MODEL_LOADED, MODEL_LOADING, MODEL_LOAD_ERROR, device
    
    logger.info(f"Processing image from source: {source}")
    
    # Check if model is still loading
    if MODEL_LOADING:
        logger.warning("Model is still loading, request will be queued")
        return {
            "error": "Model is still loading, please try again in a few minutes",
            "caption": None,
            "categories": []
        }
    
    # Check if there was an error loading the model
    if MODEL_LOAD_ERROR:
        logger.error(f"Model failed to load: {MODEL_LOAD_ERROR}")
        return {
            "error": f"Model failed to load: {MODEL_LOAD_ERROR}",
            "caption": None,
            "categories": []
        }
    
    # Make sure model is loaded
    if not MODEL_LOADED:
        logger.warning("Model is not loaded yet, request will be queued")
        return {
            "error": "Model is not loaded yet, please try again in a few minutes",
            "caption": None,
            "categories": []
        }
    
    try:
        # Clear any cached memory before processing
        gc.collect()
        torch.cuda.empty_cache() if torch.cuda.is_available() else None
        
        # Handle URL vs local file
        if source.startswith(('http://', 'https://')):
            logger.info("Downloading image from URL...")
            try:
                response = requests.get(source, stream=True, timeout=30)
                response.raise_for_status()
                
                # Open image from bytes
                img = Image.open(BytesIO(response.content))
            except Exception as e:
                logger.error(f"Failed to download image: {str(e)}")
                return {
                    "error": f"Failed to download image: {str(e)}",
                    "caption": None,
                    "categories": []
                }
        else:
            try:
                logger.info("Opening image from local path...")
                img = Image.open(source)
            except Exception as e:
                logger.error(f"Failed to open local image: {str(e)}")
                return {
                    "error": f"Failed to open image: {str(e)}",
                    "caption": None,
                    "categories": []
                }
        
        # Convert to RGB (in case of PNG, etc.)
        img = img.convert('RGB')
        
        # Resize image to reduce memory usage (optional)
        if max(img.size) > 1000:
            scale = 1000 / max(img.size)
            new_size = (int(img.size[0] * scale), int(img.size[1] * scale))
            img = img.resize(new_size, Image.LANCZOS)
        
        # First: Generate a detailed caption
        logger.info("Processing image for caption...")
        caption_prompt = "Describe this image in detail."
        inputs_caption = processor(img, caption_prompt, return_tensors="pt").to(device)
        
        logger.info("Generating caption...")
        generated_ids_caption = model.generate(
            **inputs_caption,
            max_new_tokens=75,
            do_sample=False,
            num_beams=1,
            length_penalty=1.0
        )
        caption = processor.batch_decode(generated_ids_caption, skip_special_tokens=True)[0]
        logger.info(f"Generated caption: {caption}")
        
        # Clean up to free memory
        del inputs_caption, generated_ids_caption
        gc.collect()
        
        # Second: Generate categories
        logger.info("Processing image for categories...")
        category_prompt = "List the main objects, subjects, and themes in this image as comma-separated categories."
        inputs_categories = processor(img, category_prompt, return_tensors="pt").to(device)
        
        logger.info("Generating categories...")
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
        logger.info(f"Generated categories: {categories}")
        
        # Clean up to free memory
        del inputs_categories, generated_ids_categories
        gc.collect()
        
        return {
            "error": None,
            "caption": caption,
            "categories": categories
        }
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}", exc_info=True)
        return {
            "error": str(e),
            "caption": None,
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
    def log_message(self, format, *args):
        """Override to use our logger"""
        logger.info("%s - %s", self.address_string(), format % args)
    
    def do_GET(self):
        if self.path.startswith('/classify'):
            # Parse query parameters
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            
            if 'image' not in params:
                self.send_error(400, 'Missing image parameter')
                return
            
            image_source = params['image'][0]
            logger.info(f"Received classification request for image: {image_source}")
            
            # Check model status
            model_status = get_model_status()
            if model_status["status"] == "loading":
                logger.warning("Model is still loading, returning 503")
                self.send_response(503)  # Service Unavailable
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": "Model is still loading, please try again in a few minutes",
                    "status": model_status,
                    "caption": None,
                    "categories": []
                }).encode())
                return
            
            if model_status["status"] == "error":
                logger.error(f"Model failed to load: {model_status['error']}")
                self.send_response(500)  # Internal Server Error
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": f"Model failed to load: {model_status['error']}",
                    "status": model_status,
                    "caption": None,
                    "categories": []
                }).encode())
                return
            
            if model_status["status"] != "loaded":
                logger.warning("Model is not loaded yet, returning 503")
                self.send_response(503)  # Service Unavailable
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": "Model is not loaded yet, please try again in a few minutes",
                    "status": model_status,
                    "caption": None,
                    "categories": []
                }).encode())
                return
            
            # Process the image
            result = process_image(image_source)
            result["status"] = model_status
            
            # Send response
            if result.get("error"):
                logger.error(f"Error processing image: {result['error']}")
                self.send_response(500)  # Internal Server Error
            else:
                logger.info("Successfully processed image")
                self.send_response(200)  # OK
                
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        elif self.path == '/status':
            # Return model loading status
            model_status = get_model_status()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(model_status).encode())
        else:
            self.send_error(404, 'Not Found')

def run_server(port=8000):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ImageClassifierHandler)
    logger.info(f"Starting image classifier server on port {port}")
    
    # Start model loading in background
    model_thread = threading.Thread(target=load_model)
    model_thread.daemon = True
    model_thread.start()
    
    # Start server immediately
    logger.info("Server is starting, model will load in background")
    httpd.serve_forever()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        logger.info("No arguments provided. Starting server mode...")
        run_server()
    else:
        # CLI mode for backward compatibility
        image_source = sys.argv[1]
        
        # Start model loading in the background
        model_thread = threading.Thread(target=load_model)
        model_thread.daemon = True
        model_thread.start()
        
        # Wait for the model to load
        logger.info("Waiting for model to load...")
        while MODEL_LOADING and not MODEL_LOAD_ERROR:
            logger.info(f"Model loading progress: {MODEL_LOAD_PROGRESS}%")
            time.sleep(5)
        
        if MODEL_LOAD_ERROR:
            logger.error(f"Model failed to load: {MODEL_LOAD_ERROR}")
            sys.exit(1)
            
        # Process the image
        result = process_image(image_source)
        
        # Print the results
        if result.get("error"):
            logger.error(f"Error: {result['error']}")
        else:
            logger.info(f"Caption: {result['caption']}")
            logger.info(f"Categories: {', '.join(result['categories'])}")
        
        # Also output as JSON for programmatic use
        logger.info("\nJSON OUTPUT:")
        logger.info(json.dumps(result))