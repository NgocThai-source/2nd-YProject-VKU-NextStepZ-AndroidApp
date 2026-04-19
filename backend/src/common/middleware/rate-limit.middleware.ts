import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RequestTracker {
  count: number;
  resetTime: number;
}

/**
 * Rate Limiting Middleware
 * Prevents spam and abuse by limiting requests per IP/endpoint
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestMap = new Map<string, RequestTracker>();
  private readonly maxRequests = 5; // Max 5 requests per window (strict)
  private readonly windowMs = 60 * 1000; // Per 60 seconds

  use(req: Request, res: Response, next: NextFunction) {
    // Only apply to sensitive endpoints
    const sensitiveEndpoints = [
      '/auth/forgot-password/send-otp',
      '/auth/forgot-password/verify-otp',
      '/auth/register',
      '/auth/login',
    ];

    const isSensitiveEndpoint = sensitiveEndpoints.some((endpoint) =>
      req.path.includes(endpoint),
    );

    if (!isSensitiveEndpoint) {
      return next();
    }

    const clientIp = this.getClientIp(req);
    const key = `${clientIp}:${req.path}`;

    const now = Date.now();
    let tracker = this.requestMap.get(key);

    // Reset if window expired
    if (!tracker || tracker.resetTime < now) {
      tracker = { count: 0, resetTime: now + this.windowMs };
      this.requestMap.set(key, tracker);
    }

    tracker.count++;

    // Log for debugging
    console.log(
      `[RATE-LIMIT] IP: ${clientIp}, Endpoint: ${req.path}, Request: ${tracker.count}/${this.maxRequests}`,
    );

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, this.maxRequests - tracker.count),
    );
    res.setHeader('X-RateLimit-Reset', Math.ceil(tracker.resetTime / 1000));

    if (tracker.count > this.maxRequests) {
      const retryAfter = Math.ceil((tracker.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);

      console.warn(
        `[RATE-LIMIT-BLOCKED] IP: ${clientIp}, Endpoint: ${req.path} - Exceeded ${this.maxRequests} requests. Retry after ${retryAfter}s`,
      );

      throw new HttpException(
        `Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi ${retryAfter} giây.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
}

/**
 * Cleanup old entries periodically to prevent memory leak
 */
setInterval(
  () => {
    // Cleanup would happen here
    // This is a simple implementation
  },
  5 * 60 * 1000,
); // Every 5 minutes
