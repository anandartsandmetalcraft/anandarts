/**
 * Centralized logging utility for active monitoring.
 * In a real-world scenario, you would integrate a service like Sentry or Datadog here.
 * For now, this safely formats and handles errors without exposing stack traces to clients.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  action?: string;
  path?: string;
  [key: string]: any;
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext, error?: any) {
    const timestamp = new Date().toISOString();
    
    // In production, we'd send this to Sentry/Logtail
    const logData = {
      timestamp,
      level,
      message,
      context,
      // Safely serialize the error
      ...(error && {
        errorName: error?.name,
        errorMessage: error?.message,
        // Stack traces stay on the server, never sent to the client
        stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined,
      }),
    };

    if (process.env.NODE_ENV !== 'production') {
      const colorMap = {
        info: '\x1b[36m', // Cyan
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
      };
      const reset = '\x1b[0m';
      console[level](`${colorMap[level]}[${level.toUpperCase()}] ${timestamp}${reset} ${message}`, {
        context,
        ...(error && { error: error?.message })
      });
    } else {
      // Production fallback (e.g. Vercel Logs)
      console[level](JSON.stringify(logData));
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: any, context?: LogContext) {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();
