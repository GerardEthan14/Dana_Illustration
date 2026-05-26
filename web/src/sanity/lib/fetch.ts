import { client, isSanityConfigured } from './client';

/**
 * Safe wrapper around Sanity's client.fetch().
 * Returns a fallback when Sanity isn't configured yet (no project ID),
 * or when the query fails — so the UI can render an empty state instead
 * of crashing during early development.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!isSanityConfigured) {
    return fallback;
  }
  try {
    return await client.fetch<T>(query, params, {
      // 60s ISR window — adjust later for revalidation strategy
      next: { revalidate: 60 },
    });
  } catch (error) {
    console.error('[sanity] Fetch failed:', error);
    return fallback;
  }
}
