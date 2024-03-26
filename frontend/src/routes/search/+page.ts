import { getTeams } from '$lib/api'
import { tokenOrNullRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch }) => {
    const q = url.searchParams.get('q')
    const filter = url.searchParams.get('filter')
    const teamsPromise = tokenOrNullRedirect().then(token => getTeams(fetch, token, q, filter))
    return { teamsPromise, q, filter };
}) satisfies PageLoad;

export const ssr = false
export const csr = true