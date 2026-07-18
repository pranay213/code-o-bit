import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';
import crypto from 'crypto';
import { Request } from 'express';
import { DeviceInfo, LocationInfo } from '@/types/audit';

const PRIVATE_IP_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^::1$/,
  /^fc00:/,
  /^fd/,
  /^localhost$/i,
];

function isPrivateIp(ip: string): boolean {
  return PRIVATE_IP_RANGES.some((range) => range.test(ip));
}

export function parseDevice(userAgent: string): DeviceInfo {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browser = result.browser.name ?? 'Unknown';
  const browserVersion = result.browser.version ?? '';
  const os = result.os.name ?? 'Unknown';
  const osVersion = result.os.version ?? '';

  let deviceType: DeviceInfo['deviceType'] = 'desktop';
  if (result.device.type === 'mobile') deviceType = 'mobile';
  else if (result.device.type === 'tablet') deviceType = 'tablet';
  else if (result.browser.name?.toLowerCase().includes('bot') ||
    userAgent.toLowerCase().includes('bot') ||
    userAgent.toLowerCase().includes('crawler') ||
    userAgent.toLowerCase().includes('spider')) {
    deviceType = 'bot';
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    userAgent: userAgent || 'Unknown',
  };
}

export function getLocation(req: Request): LocationInfo {
  const rawIp = requestIp.getClientIp(req) ?? '0.0.0.0';

  // Normalize IPv6-mapped IPv4 (::ffff:x.x.x.x → x.x.x.x)
  const ip = rawIp.startsWith('::ffff:') ? rawIp.slice(7) : rawIp;
  const privateIp = isPrivateIp(ip);

  if (privateIp) {
    return {
      ip,
      rawIp,
      country: 'Private Network',
      countryCode: 'XX',
      region: '',
      city: '',
      timezone: '',
      ll: null,
      isPrivate: true,
    };
  }

  const geo = geoip.lookup(ip);

  if (!geo) {
    return {
      ip,
      rawIp,
      country: 'Unknown',
      countryCode: '',
      region: '',
      city: '',
      timezone: '',
      ll: null,
      isPrivate: false,
    };
  }

  return {
    ip,
    rawIp,
    country: geo.country || 'Unknown',
    countryCode: geo.country || '',
    region: geo.region || '',
    city: geo.city || '',
    timezone: geo.timezone || '',
    ll: geo.ll ?? null,
    isPrivate: false,
  };
}

/**
 * Generates a server-side request fingerprint.
 * HMAC-SHA256 of: IP + UA + Accept-Language + Accept-Encoding
 * Stable across requests from the same client, private by design.
 */
export function generateFingerprint(
  location: LocationInfo,
  device: DeviceInfo,
  req: Request,
): string {
  const components = [
    location.ip,
    device.userAgent,
    (req.headers['accept-language'] as string | undefined) ?? '',
    (req.headers['accept-encoding'] as string | undefined) ?? '',
    (req.headers['accept'] as string | undefined) ?? '',
  ].join('|');

  // Use a fixed HMAC key — rotate this via env if needed
  const hmacKey = process.env['FINGERPRINT_SECRET'] ?? 'code-o-bit-fingerprint-key';
  return crypto.createHmac('sha256', hmacKey).update(components).digest('hex');
}
