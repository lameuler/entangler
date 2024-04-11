import { request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url, params, fetch }) => {
    const token = await tokenOrRedirect(url.pathname)
    const q = url.searchParams.get('q')
    const filter = url.searchParams.get('filter')
    
    return {
        q, filter,
        requestsPromise: request(fetch, `/requests?filter=managed,${filter}&team=${params.team}&q=${q ?? ''}`, token)
    };
}) satisfies PageLoad;