import pino from 'pino';

// Create logger instance
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  base: {
    env: process.env.NODE_ENV,
    app: 'synaptica',
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

// Log levels
export const logLevels = {
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
};

// Request logging middleware
export function logRequest(req: Request, res: Response, startTime: number) {
  const duration = Date.now() - startTime;
  const { method, url } = req;
  const status = res.status;
  const userAgent = req.headers.get('user-agent') || 'unknown';

  logger.info({
    type: 'request',
    method,
    url,
    status,
    duration,
    userAgent,
  });
}

// Error logging utility
export function logError(error: Error, context?: Record<string, unknown>) {
  logger.error({
    type: 'error',
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
}

// API response logging
export function logApiResponse(
  operation: string,
  status: number,
  data?: unknown,
  context?: Record<string, unknown>
) {
  logger.info({
    type: 'api_response',
    operation,
    status,
    data,
    ...context,
  });
}

// Security event logging
export function logSecurityEvent(
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: Record<string, unknown>
) {
  logger.warn({
    type: 'security',
    event,
    severity,
    ...details,
  });
} 