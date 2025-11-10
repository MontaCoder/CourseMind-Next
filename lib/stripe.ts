import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

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
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PLANS;
