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
    
    // Simple validation: just compare each value to its threshold
    
    // Check AI and deepfake detection
    if (analysis.type) {
        if (analysis.type.ai_generated > imageThresholds.type.ai_generated) {
            validation.approved = false;
            validation.rejectionReasons.push('AI-generated content is not allowed');
        }
        
        if (analysis.type.deepfake > imageThresholds.type.deepfake) {
            validation.approved = false;
            validation.rejectionReasons.push('Deepfake content is not allowed');
        }
    }
    
    // Check nudity thresholds
    if (analysis.nudity) {
        // Get the nudity thresholds
        const nudityThresholds = imageThresholds.nudity;
        
        // Special case handling for different content types
        const specialCases = detectSpecialCases(analysis);
        
        // Check all main categories directly against thresholds
        if (analysis.nudity.sexual_activity > nudityThresholds.sexual_activity) {
            // Sexual activity is never allowed, regardless of context
            validation.approved = false;
            validation.rejectionReasons.push('Explicit sexual content detected');
        }
        
        if (analysis.nudity.sexual_display > nudityThresholds.sexual_display) {
            // Allow sexual_display if it's artistic nudity
            if (!specialCases.isArtistic) {
                validation.approved = false;
                validation.rejectionReasons.push('Explicit nudity detected');
            }
        }
        
        if (analysis.nudity.erotica > nudityThresholds.erotica) {
            // Allow erotica if it's artistic nudity
            if (!specialCases.isArtistic) {
                validation.approved = false;
                validation.rejectionReasons.push('Erotic content detected');
            }
        }
        
        if (analysis.nudity.very_suggestive > nudityThresholds.very_suggestive) {
            validation.approved = false;
            validation.rejectionReasons.push('Very suggestive content detected');
        }
        
        // Only check against threshold if it's not 1.0 (which means "allow everything")
        if (nudityThresholds.suggestive < 1.0 && analysis.nudity.suggestive > nudityThresholds.suggestive) {
            validation.approved = false;
            validation.rejectionReasons.push('Suggestive content detected');
        }
        
        // Only check against threshold if it's not 1.0 (which means "allow everything")
        if (nudityThresholds.mildly_suggestive < 1.0 && analysis.nudity.mildly_suggestive > nudityThresholds.mildly_suggestive) {
            validation.approved = false;
            validation.rejectionReasons.push('Mildly suggestive content detected');
        }
        
        // Check each suggestive class
        if (analysis.nudity.suggestive_classes) {
            Object.entries(analysis.nudity.suggestive_classes).forEach(([className, score]) => {
                // Get the corresponding threshold or use defaultThreshold if not defined
                const threshold = nudityThresholds.suggestive_classes[className] || imageThresholds.defaultThreshold;
                
                // Only check against threshold if it's not 1.0 (which means "allow everything")
                if (threshold < 1.0 && score > threshold) {
                    validation.approved = false;
                    validation.rejectionReasons.push(`Suggestive content detected: ${className}`);
                }
            });
        }
    }
    
    // Check scam content
    if (analysis.scam && analysis.scam.prob > imageThresholds.scam.prob) {
        validation.approved = false;
        validation.rejectionReasons.push('Potential scam content detected');
    }
    
    // Check self-harm content
    if (analysis['self-harm'] && analysis['self-harm'].prob > imageThresholds.selfHarm.prob) {
        validation.approved = false;
        validation.rejectionReasons.push('Self-harm content detected');
    }
    
    return validation;
};

/**
 * Detect special cases where we should allow content that would otherwise be rejected
 * @param {Object} analysis - Analysis result from Sightengine
 * @returns {Object} Special cases flags
 */
const detectSpecialCases = (analysis) => {
    const specialCases = {
        isArtistic: false,
        isEducational: false,
        isHistorical: false
    };
    
    if (analysis.nudity && analysis.nudity.suggestive_classes) {
        // Check for artistic nudity (sculptures, classical paintings, etc.)
        if (analysis.nudity.suggestive_classes.nudity_art > 0.6) {
            specialCases.isArtistic = true;
        }
        
        // Check for schematic/educational content
        if (analysis.nudity.suggestive_classes.schematic > 0.6) {
            specialCases.isEducational = true;
        }
    }
    
    return specialCases;
};

module.exports = {
    checkImage
};
