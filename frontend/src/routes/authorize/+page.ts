import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load = (async ({ url }) => {
    const location = browser ? url.searchParams.get('redirect') : undefined
    return { redirect: location ?? '/' };
}) satisfies PageLoad;

export const csr = true;
export const prerender = true;