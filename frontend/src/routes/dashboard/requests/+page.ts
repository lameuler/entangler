import { request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch }) => {
    const token = await tokenOrRedirect(url.pathname)
    const q = url.searchParams.get('q')
    const filter = url.searchParams.get('filter')
    
    return {
        requestsPromise: request(fetch, `/requests?filter=created,${filter}&q=${q ?? ''}`, token),
        q, filter
    };
}) satisfies PageLoad;