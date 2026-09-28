export const FALLBACK_ERROR_MESSAGE = "An unexpected error occurred. Try again or reload the page.";

function isDevBuild(): boolean {
  return typeof import.meta !== "undefined" && import.meta.env?.DEV === true;
}

/**
 * Text shown on the route error screen. Raw error messages can carry internal detail (provider,
 * database, or stack-ish text), so they are only surfaced in dev builds.
 */
export function displayErrorMessage(error: unknown, dev: boolean = isDevBuild()): string {
  if (!dev) return FALLBACK_ERROR_MESSAGE;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_ERROR_MESSAGE;
}
