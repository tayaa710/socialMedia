const { processImageLocally, waitForModelReady } = require('./utils/blip');

// Get the test image URL from command line args or use a default
const testImageUrl = process.argv[2] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";

async function testSingleImage() {
  console.log(`Testing image captioning for: ${testImageUrl}`);
  
  try {
    // First, try to wait for the model to be ready
    console.log('Checking if model is ready...');
    try {
      await waitForModelReady();
      console.log('Model is ready.');
    } catch (modelError) {
      console.warn(`Warning: ${modelError.message}`);
      console.log('Will attempt to process image anyway...');
    }
    
    console.log('Processing image...');
    const result = await processImageLocally(testImageUrl, true);
    
    if (result.error) {
      console.error('Error processing image:', result.error);
    } else {
      console.log('\nResults:');
      console.log('==============================');
      console.log('Caption:');
      console.log(result.caption);
      
      console.log('\nCategories:');
      if (result.categories && result.categories.length > 0) {
        result.categories.forEach((cat, i) => {
          console.log(`${i+1}. ${cat}`);
        });
      } else {
        console.log('No categories generated');
      }
      console.log('==============================');
    }
    
    // Print raw result for debugging
    console.log('\nRaw result:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

testSingleImage(); 