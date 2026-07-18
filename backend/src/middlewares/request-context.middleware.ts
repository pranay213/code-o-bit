import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { parseDevice, getLocation, generateFingerprint } from '@/utils/device-info';

const REQUEST_ID_HEADER = 'X-Request-ID';

/**
 * Attaches a unique request ID, device info, geolocation, and fingerprint
 * to every incoming request. Must be the first middleware in the chain.
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers[REQUEST_ID_HEADER.toLowerCase()] as string | undefined) ?? uuidv4();
  const startTime = process.hrtime();

  const userAgent = (req.headers['user-agent'] as string | undefined) ?? '';
  const device = parseDevice(userAgent);
  const location = getLocation(req);
  const fingerprint = generateFingerprint(location, device, req);

  req.context = {
    requestId,
    startTime,
    device,
    location,
    fingerprint,
  };

  // Expose request ID to the client for tracing
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}
