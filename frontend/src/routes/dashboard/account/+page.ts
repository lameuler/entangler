import { tokenOrRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
    const location = url.searchParams.get('redirect')
    await tokenOrRedirect(url.pathname + url.search)
    return { redirect: location };
}) satisfies PageLoad;