import winston from 'winston';
import { performance } from 'perf_hooks';

const { combine, timestamp, printf, colorize } = winston.format;

// Custom format for logs
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      ),
    }),
  ],
});

// Performance tracking
class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: Map<string, number[]>;

  private constructor() {
    this.metrics = new Map();
  }

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  start(label: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(label, duration);
      logger.info(`Performance metric: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  private recordMetric(label: string, duration: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)?.push(duration);
  }

  getMetrics(): Record<string, { avg: number; min: number; max: number }> {
    const result: Record<string, { avg: number; min: number; max: number }> = {};
    
    this.metrics.forEach((durations, label) => {
      const sum = durations.reduce((a, b) => a + b, 0);
      result[label] = {
        avg: sum / durations.length,
        min: Math.min(...durations),
        max: Math.max(...durations),
      };
    });

    return result;
  }
}

// Cache metrics
class CacheMetrics {
  private hits = 0;
  private misses = 0;

  recordHit(): void {
    this.hits++;
    this.logMetrics();
  }

  recordMiss(): void {
    this.misses++;
    this.logMetrics();
  }

  private logMetrics(): void {
    const total = this.hits + this.misses;
    if (total > 0) {
      const hitRate = (this.hits / total) * 100;
      logger.info('Cache metrics', {
        hits: this.hits,
        misses: this.misses,
        hitRate: `${hitRate.toFixed(2)}%`,
      });
    }
  }
}

export const performanceTracker = PerformanceTracker.getInstance();
export const cacheMetrics = new CacheMetrics();
export default logger; 