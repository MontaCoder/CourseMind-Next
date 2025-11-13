/**
 * Centralized exports for all action helpers
 * Import from here for convenience
 */

export {
  requireAuth,
  requireAdmin,
  requireCourseOwnership,
  requireTopicOwnership,
  requireExamOwnership,
  requireNoteOwnership,
  ActionError,
} from "./auth-helpers";

export {
  withActionHandler,
  withLegacyActionHandler,
  validateFormData,
  type ActionSuccess,
  type ActionFailure,
  type ActionResponse,
  type LegacyActionResponse,
} from "./error-handler";
