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
    
    // FIRST CHECK: Strictly filter AI-generated content and deepfakes
    // This is a key feature of the platform to ensure authentic content
    if (analysis.type) {
        // Check AI-generated content - priority check
        if (analysis.type.ai_generated > imageThresholds.type.ai_generated) {
            validation.approved = false;
            validation.rejectionReasons.push('AI-generated content is not allowed on this platform');
        }
        
        // Check deepfake content - priority check
        if (analysis.type.deepfake > imageThresholds.type.deepfake) {
            validation.approved = false;
            validation.rejectionReasons.push('Deepfake content is not allowed on this platform');
        }
    }
    
    // Check nudity thresholds
    if (analysis.nudity) {
        const nudityThresholds = imageThresholds.nudity;
        
        // Determine the context of the image
        let detectedContext = 'indoor_other'; // Default context
        if (analysis.nudity.context) {
            const contexts = {
                sea_lake_pool: analysis.nudity.context.sea_lake_pool || 0,
                outdoor_other: analysis.nudity.context.outdoor_other || 0,
                indoor_other: analysis.nudity.context.indoor_other || 0
            };
            
            // Find the context with the highest probability
            const highestContext = Object.entries(contexts).reduce((max, [context, prob]) => 
                prob > max.prob ? {context, prob} : max, {context: 'indoor_other', prob: 0}
            );
            
            detectedContext = highestContext.context;
        }
        
        // Check main nudity categories - focus only on explicit content
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
        
        // For suggestive content, use context-specific thresholds if available
        let veryThreshold = nudityThresholds.very_suggestive;
        let suggestiveThreshold = nudityThresholds.suggestive;
        let mildlyThreshold = nudityThresholds.mildly_suggestive;
        
        // Apply context-specific adjustments to general suggestive thresholds
        if (nudityThresholds.context && 
            nudityThresholds.context[detectedContext] && 
            nudityThresholds.context[detectedContext].suggestive !== undefined) {
            // Use context-specific suggestive threshold if available
            suggestiveThreshold = nudityThresholds.context[detectedContext].suggestive;
        }
        
        // Only check very suggestive content - skip checking mild and regular suggestive
        if (analysis.nudity.very_suggestive > veryThreshold) {
            validation.approved = false;
            validation.rejectionReasons.push('Very suggestive content detected');
        }
        
        // Only check regular suggestive if the threshold isn't set to 1.0
        if (suggestiveThreshold < 1.0 && analysis.nudity.suggestive > suggestiveThreshold) {
            validation.approved = false;
            validation.rejectionReasons.push('Suggestive content detected');
        }
        
        // Skip checking mildly_suggestive since we've set that threshold to 1.0
        
        // Check suggestive classes with context awareness, skipping many classes
        if (analysis.nudity.suggestive_classes) {
            const classes = Object.keys(analysis.nudity.suggestive_classes);
            
            // Define classes to always skip - normal social media content
            const alwaysSkipClasses = [
                'swimwear_male', 'swimwear_one_piece', 'bikini', 'male_chest',
                'cleavage', 'minishort', 'miniskirt', 'nudity_art'
            ];
            
            for (const className of classes) {
                // Skip classes that we've decided to always allow
                if (alwaysSkipClasses.includes(className)) {
                    continue;
                }
                
                // First try to get context-specific threshold
                let threshold = imageThresholds.defaultThreshold;
                
                if (nudityThresholds.context && 
                    nudityThresholds.context[detectedContext] && 
                    nudityThresholds.context[detectedContext][className] !== undefined) {
                    // Use context-specific threshold
                    threshold = nudityThresholds.context[detectedContext][className];
                } else if (nudityThresholds.suggestive_classes[className] !== undefined) {
                    // Fall back to general threshold
                    threshold = nudityThresholds.suggestive_classes[className];
                }
                
                // Only check if threshold is less than 1.0 (meaning we actually want to restrict it)
                if (threshold < 1.0 && analysis.nudity.suggestive_classes[className] > threshold) {
                    validation.approved = false;
                    validation.rejectionReasons.push(`Suggestive content detected: ${className}`);
                }
            }
        }
    }
    
    // Check scam content - only if it's very clearly a scam
    if (analysis.scam && analysis.scam.prob > imageThresholds.scam.prob) {
        validation.approved = false;
        validation.rejectionReasons.push('Potential scam content detected');
    }
    
    // Check self-harm content - still moderate strictness
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
