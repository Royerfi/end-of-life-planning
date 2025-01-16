export function logError(error: unknown, context?: string) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error ${context ? `in ${context}: ` : ''}${errorMessage}`)
    
    // In a production environment, you might want to send this to an error tracking service
    // For example, using Sentry:
    // Sentry.captureException(error)
  }
  
  