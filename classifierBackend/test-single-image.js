const getBlipCaptionLocally = require('./utils/blip');

// Test URL - replace with your actual image URL
const testImageUrl = "https://example.com/test-image.jpg";

async function testSingleImage() {
  console.log(`Testing image captioning for: ${testImageUrl}`);
  
  try {
    const caption = await getBlipCaptionLocally(testImageUrl);
    console.log('Generated caption:');
    console.log(caption);
  } catch (error) {
    console.error('Error generating caption:', error.message);
  }
}

testSingleImage(); 