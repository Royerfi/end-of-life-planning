export function logError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] Error ${context ? `in ${context}: ` : ''}${errorMessage}`);
  console.error(`Stack trace: ${errorStack}`);

  // In a production environment, you might want to send this to an error tracking service
  // For example, using Sentry:
  // Sentry.captureException(error, { extra: { context } });
}

export function logInfo(message: string, ...args: unknown[]): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Info: ${message}`, ...args);
}
