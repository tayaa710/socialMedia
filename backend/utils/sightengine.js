// this example uses axios and form-data
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('./config');
const imageThresholds = require('./imageThresholds');

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
        const result = res.data;
        
        // Add validation results based on thresholds
        result.validation = validateImage(result);
        
        return result;
    } catch (error) {
        console.error('Error checking image with Sightengine:', error);
        throw new Error('Image verification failed');
    }
};

/**
 * Validate image against defined thresholds
 * @param {Object} analysis - Analysis result from Sightengine
 * @returns {Object} Validation results with rejection reasons if any
 */
const validateImage = (analysis) => {
    const validation = {
        approved: true,
        rejectionReasons: []
    };
    
    // Check nudity thresholds
    if (analysis.nudity) {
        const nudityThresholds = imageThresholds.nudity;
        
        // Check main nudity categories
        if (analysis.nudity.sexual_activity > nudityThresholds.sexual_activity) {
            validation.approved = false;
            validation.rejectionReasons.push('Explicit sexual content detected');
        }
        
        if (analysis.nudity.sexual_display > nudityThresholds.sexual_display) {
            validation.approved = false;
            validation.rejectionReasons.push('Explicit nudity detected');
        }
        
        if (analysis.nudity.erotica > nudityThresholds.erotica) {
            validation.approved = false;
            validation.rejectionReasons.push('Erotic content detected');
        }
        
        if (analysis.nudity.very_suggestive > nudityThresholds.very_suggestive) {
            validation.approved = false;
            validation.rejectionReasons.push('Very suggestive content detected');
        }
        
        if (analysis.nudity.suggestive > nudityThresholds.suggestive) {
            validation.approved = false;
            validation.rejectionReasons.push('Suggestive content detected');
        }
        
        if (analysis.nudity.mildly_suggestive > nudityThresholds.mildly_suggestive) {
            validation.approved = false;
            validation.rejectionReasons.push('Suggestive content detected');
        }
        
        // Check suggestive classes
        if (analysis.nudity.suggestive_classes) {
            const classes = Object.keys(analysis.nudity.suggestive_classes);
            for (const className of classes) {
                const threshold = nudityThresholds.suggestive_classes[className] || imageThresholds.defaultThreshold;
                if (analysis.nudity.suggestive_classes[className] > threshold) {
                    validation.approved = false;
                    validation.rejectionReasons.push(`Suggestive content detected: ${className}`);
                }
            }
        }
    }
    
    // Check scam content
    if (analysis.scam && analysis.scam.prob > imageThresholds.scam.prob) {
        validation.approved = false;
        validation.rejectionReasons.push('Potential scam content detected');
    }
    
    // Check AI-generated content
    if (analysis.type && analysis.type.ai_generated > imageThresholds.type.ai_generated) {
        validation.approved = false;
        validation.rejectionReasons.push('AI-generated content detected');
    }
    
    // Check self-harm content
    if (analysis['self-harm']) {
        if (analysis['self-harm'].prob > imageThresholds.selfHarm.prob) {
            validation.approved = false;
            validation.rejectionReasons.push('Self-harm content detected');
        }
        
        // Check specific types of self-harm content
        if (analysis['self-harm'].type) {
            if (analysis['self-harm'].type.real > imageThresholds.selfHarm.type.real) {
                validation.approved = false;
                validation.rejectionReasons.push('Real self-harm content detected');
            }
            
            if (analysis['self-harm'].type.fake > imageThresholds.selfHarm.type.fake) {
                validation.approved = false;
                validation.rejectionReasons.push('Fake self-harm content detected');
            }
            
            if (analysis['self-harm'].type.animated > imageThresholds.selfHarm.type.animated) {
                validation.approved = false;
                validation.rejectionReasons.push('Animated self-harm content detected');
            }
        }
    }
    
    return validation;
};

module.exports = {
    checkImage
};
