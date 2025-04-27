// this example uses axios and form-data
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('./config');

const checkImage = async (input) => {
    const data = new FormData();
    
    // Check if input is a buffer or a file path
    if (Buffer.isBuffer(input)) {
        // If it's a buffer, append it directly
        data.append('media', input, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });
    } else {
        // If it's a path, use createReadStream
        data.append('media', fs.createReadStream(input));
    }
    
    data.append('models', config.SIGHTENGINE_API_MODELS);
    data.append('api_user', config.SIGHTENGINE_API_USER);
    data.append('api_secret', config.SIGHTENGINE_API_SECRET);

    try {
        const res = await axios.post('https://api.sightengine.com/1.0/check.json', data, {
            headers: data.getHeaders()
        });
        return res.data;
    } catch (error) {
        console.error('Error checking image:', error);
        throw new Error('Image check failed');
    }
};

module.exports = {
    checkImage
};
