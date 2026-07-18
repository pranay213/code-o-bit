import { Request, Response, NextFunction } from 'express';
import { auditLogger } from '@/config/logger';
import { AuditLogEntry } from '@/types/audit';
import { LOG_COMPONENTS, LOG_MESSAGES } from '@/constants/log-messages';

/**
 * Captures a full audit record for every request after the response is sent.
 * Includes request ID, user identity, device, geo-location, fingerprint,
 * response status, and elapsed time.
 */
export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.on('finish', () => {
    const context = req.context;
    if (!context) return;

    const [seconds, nanoseconds] = process.hrtime(context.startTime);
    const responseTimeMs = Math.round(seconds * 1000 + nanoseconds / 1_000_000);

    const isError = res.statusCode >= 400;
    
    const entry: AuditLogEntry = {
      module: LOG_COMPONENTS.AUDIT,
      severity: isError ? 'error' : 'info',
      requestId: context.requestId,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs,
      userId: req.user?.sub ?? 'anonymous',
      // Location
      ip: context.location.ip,
      rawIp: context.location.rawIp,
      country: context.location.country,
      countryCode: context.location.countryCode,
      region: context.location.region,
      city: context.location.city,
      timezone: context.location.timezone,
      ll: context.location.ll,
      isPrivate: context.location.isPrivate,
      // Device
      browser: context.device.browser,
      browserVersion: context.device.browserVersion,
      os: context.device.os,
      osVersion: context.device.osVersion,
      deviceType: context.device.deviceType,
      userAgent: context.device.userAgent,
      // Fingerprint
      fingerprint: context.fingerprint,
    };

    const message = res.statusCode >= 400
      ? LOG_MESSAGES.AUDIT_REQUEST_FAILED
      : LOG_MESSAGES.AUDIT_REQUEST_COMPLETED;

    if (isError) {
      auditLogger.error(message, entry);
    } else {
      auditLogger.info(message, entry);
    }
  });

  next();
}
