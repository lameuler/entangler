import { getTeamElement, request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url, params, fetch}) => {
    const token = await tokenOrRedirect(url.pathname)
    return {
        itemsPromise: getTeamElement(fetch, 'items', token, params.team)
    };
}) satisfies PageLoad;