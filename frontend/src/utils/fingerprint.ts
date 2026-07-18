import fpPromise from '@fingerprintjs/fingerprintjs';

let visitorIdPromise: Promise<string> | null = null;

export const getFingerprint = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    return 'server-side';
  }

  if (!visitorIdPromise) {
    visitorIdPromise = (async () => {
      const fp = await fpPromise.load();
      const result = await fp.get();
      return result.visitorId;
    })();
  }

  return visitorIdPromise;
};
