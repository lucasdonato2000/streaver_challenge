
export type ErrorType = "load_posts" | "delete_post" | "search_users";

export function shouldForceError(errorType: ErrorType): boolean {
  return process.env.NEXT_PUBLIC_FORCE_ERRORS === errorType;
}

export function throwForcedError(operation: string): never {
  throw new Error(`[SIMULATED ERROR] Failed to ${operation}`);
}

export function simulateErrorIfEnabled(errorType: ErrorType, operation: string): void {
  if (shouldForceError(errorType)) {
    throwForcedError(operation);
  }
}
