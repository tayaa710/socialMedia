/**
 * Threshold configuration for image moderation
 * Values are in range 0-1 where higher values represent higher confidence
 * Images exceeding these thresholds will be rejected
 */

const imageThresholds = {
  // Nudity detection thresholds
  nudity: {
    sexual_activity: 0.4,
    sexual_display: 0.4,
    erotica: 0.5,
    very_suggestive: 0.6,
    suggestive: 0.7,
    mildly_suggestive: 0.8,
    suggestive_classes: {
      bikini: 0.8,
      cleavage: 0.8,
      lingerie: 0.7,
      sextoy: 0.6,
      suggestive_focus: 0.7,
      suggestive_pose: 0.7,
      visibly_undressed: 0.7
      // Other classes use the general threshold
    }
  },
  
  // Scam detection threshold
  scam: {
    prob: 0.7
  },
  
  // AI-generated content threshold
  // For platforms that want to limit AI content
  // Set to 1.0 to allow all AI content
  type: {
    ai_generated: 0.3 
  },
  
  // Self-harm content threshold
  selfHarm: {
    prob: 0.3,
    type: {
      real: 0.3,
      fake: 0.4,
      animated: 0.5
    }
  },
  
  // General rejection threshold for any category not specifically defined
  defaultThreshold: 0.7
};

module.exports = imageThresholds; 