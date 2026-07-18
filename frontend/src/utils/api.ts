import { getFingerprint } from './fingerprint';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const { requireAuth, headers: customHeaders, ...restOptions } = options;
  const headers = new Headers(customHeaders);

  // 1. Inject JSON Content-Type
  if (!headers.has('Content-Type') && !(restOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 2. Inject Client Fingerprint
  try {
    const fingerprint = await getFingerprint();
    headers.set('X-Client-Fingerprint', fingerprint);
  } catch (err) {
    console.error('Failed to generate fingerprint', err);
  }

  // 3. Inject Auth Token
  if (requireAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth_error'));
      }
    }
    throw new Error(data?.message || 'An error occurred during the request');
  }

  return data;
};
