import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith("sk_", "STRIPE_SECRET_KEY must start with 'sk_'"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_", "STRIPE_WEBHOOK_SECRET must start with 'whsec_'"),
  STRIPE_MONTHLY_PRICE_ID: z.string().startsWith("price_", "STRIPE_MONTHLY_PRICE_ID must start with 'price_'").optional(),
  STRIPE_YEARLY_PRICE_ID: z.string().startsWith("price_", "STRIPE_YEARLY_PRICE_ID must start with 'price_'").optional(),

  // Google Gemini AI
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),

  // YouTube API
  YOUTUBE_API_KEY: z.string().min(1, "YOUTUBE_API_KEY is required"),

  // Unsplash API
  UNSPLASH_ACCESS_KEY: z.string().min(1, "UNSPLASH_ACCESS_KEY is required"),

  // App URL
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validated environment variables
 * Use this instead of process.env to get type-safe, validated environment variables
 */
export const env = envSchema.parse(process.env);

/**
 * Validate environment variables at startup
 * Call this in your main application entry point to fail fast if configuration is invalid
 */
export function validateEnv() {
  try {
    envSchema.parse(process.env);
    console.log("✅ Environment variables validated successfully");
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}
