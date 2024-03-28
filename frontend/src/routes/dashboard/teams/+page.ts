import { getTeams } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch }) => {
    const token = await tokenOrRedirect(url.pathname)
    const q = url.searchParams.get('q')
    const filter = url.searchParams.get('filter')
    return {
        teamsPromise: getTeams(fetch, token, q, 'member,'+filter),
        q, filter
    };
}) satisfies PageLoad;