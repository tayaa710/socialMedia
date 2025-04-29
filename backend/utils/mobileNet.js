const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const path = require('path');

async function classifyImage(imagePath) {
    try {
        // Load the model
        const model = await mobilenet.load();
        
        // Read and decode the image
        const imageBuffer = fs.readFileSync(imagePath);
        const image = tf.node.decodeImage(imageBuffer, 3); // Ensure 3 channels (RGB)
        
        // Resize and expand dimensions
        const resized = tf.image.resizeBilinear(image, [224, 224]);
        const expanded = resized.expandDims(0); // Add batch dimension
        
        // Get predictions
        const predictions = await model.classify(expanded);
        
        // Clean up
        tf.dispose([image, resized, expanded]);
        
        return predictions;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Example usage
const imagePath = path.join(__dirname, 'a.jpeg');

classifyImage(imagePath)
    .then(predictions => {
        console.log('Predictions:', predictions);
    })
    .catch(error => {
        console.error('Failed to classify image:', error);
    });

