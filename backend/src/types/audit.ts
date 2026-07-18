export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';
  userAgent: string;
}

export interface LocationInfo {
  ip: string;
  rawIp: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  ll: [number, number] | null;
  isPrivate: boolean;
}

export interface RequestContext {
  requestId: string;
  startTime: [number, number];
  device: DeviceInfo;
  location: LocationInfo;
  fingerprint: string;
}

export interface AuditLogEntry {
  module: string;
  severity: string;
  requestId: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  responseTimeMs: number;
  userId: string;
  // Location
  ip: string;
  rawIp: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  ll: [number, number] | null;
  isPrivate: boolean;
  // Device
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: string;
  userAgent: string;
  // Fingerprint
  fingerprint: string;
}
