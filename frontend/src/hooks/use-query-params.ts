import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current query string as an object
  const getParams = useCallback(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  // Update a specific query parameter and push to router
  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      
      // If we are changing anything other than page, we probably want to reset page to 1
      if (key !== 'page' && params.has('page')) {
        params.set('page', '1');
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Build the query string for API calls
  const getQueryString = useCallback(() => {
    return searchParams.toString();
  }, [searchParams]);

  return {
    getParams,
    setParam,
    getQueryString,
    searchParams,
  };
}
