import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

// createClient throws if projectId is empty. Until the user has set up
// their Sanity project, fall back to a placeholder so the app still
// boots — `isSanityConfigured` gates real queries via `safeFetch`.
export const isSanityConfigured = Boolean(projectId);

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: true,
  perspective: 'published',
});
