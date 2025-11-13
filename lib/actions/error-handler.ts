import { z } from "zod";
import { ActionError } from "./auth-helpers";

/**
 * Standard action response types
 */
export type ActionSuccess<T = void> = {
  success: true;
  data?: T;
} & (T extends void ? {} : { data: T });

export type ActionFailure = {
  success: false;
  error: string;
};

export type ActionResponse<T = void> = ActionSuccess<T> | ActionFailure;

/**
 * Legacy action response format (for backward compatibility)
 */
export type LegacyActionResponse<T = unknown> =
  | ({ error?: never } & T)
  | { error: string };

/**
 * Wrapper for server actions that provides standardized error handling
 *
 * @param action - The async function to execute
 * @param errorMessage - Optional custom error message for generic errors
 * @returns Standardized action response
 *
 * @example
 * ```ts
 * export async function createCourse(formData: FormData) {
 *   return withActionHandler(async () => {
 *     const session = await requireAuth();
 *     // ... action logic
 *     return { courseId: course.id };
 *   });
 * }
 * ```
 */
export async function withActionHandler<T>(
  action: () => Promise<T>,
  errorMessage?: string
): Promise<ActionSuccess<T> | ActionFailure> {
  try {
    const data = await action();
    return { success: true, data } as ActionSuccess<T>;
  } catch (error) {
    console.error("Action error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    // Handle custom ActionError
    if (error instanceof ActionError) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Handle generic errors
    return {
      success: false,
      error: errorMessage || "Something went wrong. Please try again.",
    };
  }
}

/**
 * Legacy wrapper for server actions that maintains backward compatibility
 * Returns the old format: { error } or { success, ...data }
 *
 * Use this when refactoring existing actions to maintain API compatibility
 *
 * @param action - The async function to execute
 * @param errorMessage - Optional custom error message
 * @returns Legacy action response format
 *
 * @example
 * ```ts
 * export async function deleteCourse(courseId: string) {
 *   return withLegacyActionHandler(async () => {
 *     const session = await requireAuth();
 *     await requireCourseOwnership(courseId, session.user.id);
 *     await db.course.delete({ where: { id: courseId } });
 *     return { success: true };
 *   });
 * }
 * ```
 */
export async function withLegacyActionHandler<T extends Record<string, unknown>>(
  action: () => Promise<T>,
  errorMessage?: string
): Promise<T | { error: string }> {
  try {
    return await action();
  } catch (error) {
    console.error("Action error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    // Handle custom ActionError
    if (error instanceof ActionError) {
      return { error: error.message };
    }

    // Handle generic errors
    return {
      error: errorMessage || "Something went wrong. Please try again.",
    };
  }
}

/**
 * Validate form data with Zod schema
 * Throws ActionError if validation fails
 *
 * @param schema - Zod schema for validation
 * @param data - Data to validate
 * @returns Validated and typed data
 * @throws ActionError if validation fails
 */
export function validateFormData<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ActionError(error.errors[0].message);
    }
    throw error;
  }
}
