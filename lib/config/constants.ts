/**
 * Application configuration and constants
 * Single source of truth for all app-wide configuration
 */

// ============================================================================
// Application Settings
// ============================================================================

export const APP_CONFIG = {
  name: "CourseMind",
  description: "AI-Powered Course Generation Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supportEmail: "support@coursemind.com",
} as const;

// ============================================================================
// Supported Languages
// ============================================================================

export const SUPPORTED_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Punjabi",
  "Urdu",
  "Indonesian",
  "Malay",
  "Thai",
  "Vietnamese",
  "Turkish",
  "Polish",
  "Ukrainian",
  "Romanian",
  "Dutch",
  "Greek",
  "Czech",
  "Swedish",
  "Hungarian",
  "Finnish",
  "Norwegian",
  "Danish",
  "Hebrew",
  "Tagalog",
  "Swahili",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// ============================================================================
// Subscription Plans and Pricing
// ============================================================================

export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "3 AI-generated courses",
      "Basic course viewer",
      "39 language support",
      "Community support",
    ],
    limits: {
      courses: 3,
    },
    courseType: "TEXT_IMAGE" as const,
  },
  MONTHLY: {
    name: "Pro Monthly",
    price: 9.99,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID,
    features: [
      "50 AI-generated courses/month",
      "Advanced AI tutor",
      "Interactive quizzes",
      "Course certificates",
      "Priority support",
      "YouTube integration",
      "Note-taking tools",
      "Course sharing",
    ],
    limits: {
      courses: 50,
    },
    courseType: "VIDEO_TEXT" as const,
  },
  YEARLY: {
    name: "Pro Yearly",
    price: 99.99,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID,
    features: [
      "50 AI-generated courses/month",
      "Advanced AI tutor",
      "Interactive quizzes",
      "Course certificates",
      "Priority support",
      "YouTube integration",
      "Note-taking tools",
      "Course sharing",
      "2 months free",
    ],
    limits: {
      courses: 50,
    },
    courseType: "VIDEO_TEXT" as const,
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PLANS;

/**
 * Get course limit for a plan
 */
export function getCourseLimit(plan: StripePlan): number {
  return STRIPE_PLANS[plan].limits.courses;
}

/**
 * Get course type for a plan
 */
export function getCourseType(plan: StripePlan): "VIDEO_TEXT" | "TEXT_IMAGE" {
  return STRIPE_PLANS[plan].courseType;
}

/**
 * Get plan price for revenue calculations
 */
export function getPlanPrice(plan: StripePlan): number {
  return STRIPE_PLANS[plan].price;
}

// ============================================================================
// Course Configuration
// ============================================================================

export const COURSE_CONFIG = {
  chapterCount: {
    min: 3,
    max: 10,
    default: 5,
  },
  topicNameMinLength: 3,
  quiz: {
    defaultQuestionCount: 5,
  },
} as const;

// ============================================================================
// Backward Compatibility Exports
// ============================================================================

/**
 * @deprecated Use APP_CONFIG.name instead
 */
export const appName = APP_CONFIG.name;

/**
 * @deprecated Use SUPPORTED_LANGUAGES instead
 */
export const LANGUAGES = SUPPORTED_LANGUAGES;
