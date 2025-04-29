/**
 * Threshold configuration for image moderation
 * Values are in range 0-1 where higher values represent higher confidence
 * Images exceeding these thresholds will be rejected
 */

const imageThresholds = {
  // Nudity detection thresholds
  nudity: {
    // Only block explicit content with very low thresholds
    sexual_activity: 0.2,    // Block actual sexual activity
    sexual_display: 0.2,     // Block explicit genital exposure
    erotica: 0.4,            // Higher threshold for erotica (allow more)
    very_suggestive: 1.0,    // Allow all very suggestive content including lingerie modeling
    suggestive: 1.0,        // Never block for just being "suggestive"
    mildly_suggestive: 1.0,  // Never block for mildly suggestive content
    none: 1,
    suggestive_classes: {
      // Allow all these suggestive classes with very high thresholds
      bikini: 1.0,
      cleavage: 1.0,
      lingerie: 1.0,          // Allow all lingerie content
      sextoy: 0.6,           // Still moderately strict with sex toys
      suggestive_focus: 0.8,
      suggestive_pose: 0.9,
      visibly_undressed: 0.8,
      male_underwear: 1.0,
      male_chest: 1.0,
      nudity_art: 1.0,
      schematic: 0.9,
      swimwear_one_piece: 1.0,
      swimwear_male: 1.0,
      minishort: 1.0,
      miniskirt: 1.0,
      other: 0.9
    },
    // Context classes - all very permissive now
    context: {
      sea_lake_pool: {
        bikini: 1.0,
        swimwear_one_piece: 1.0,
        swimwear_male: 1.0,
        male_chest: 1.0,
        mildly_suggestive: 1.0,
        suggestive: 1.0       // Allow all suggestive content at beach/pool
      },
      outdoor_other: {
        bikini: 1.0,
        swimwear_one_piece: 1.0,
        swimwear_male: 1.0,
        male_chest: 1.0,
        suggestive: 0.98      // Very permissive outdoors too
      },
      indoor_other: {
        bikini: 0.95,
        swimwear_one_piece: 0.95,
        swimwear_male: 0.95,
        male_chest: 1.0,
        suggestive: 0.95      // More permissive indoors as well
      }
    }
  },
  
  // Scam detection threshold - higher to allow more
  scam: {
    prob: 0.8
  },
  
  // Type detection thresholds - STRICT on AI content
  type: {
    // AI-generated content threshold (genai model) - Very strict!
    ai_generated: 0.3,     // Block most AI-generated content
    // Deepfake detection threshold - Very strict!
    deepfake: 0.8
  },
  
  // Self-harm content threshold - still moderate strictness
  selfHarm: {
    prob: 0.5,              // Increased threshold
    type: {
      real: 0.4,
      fake: 0.6,
      animated: 0.7
    }
  },
  
  // General rejection threshold for any category not specifically defined
  defaultThreshold: 1
};

module.exports = imageThresholds; 