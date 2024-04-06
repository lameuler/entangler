import { getTeamElement } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url, params }) => {
    const token = await tokenOrRedirect(url.pathname)
    return {
        t_id: params.team,
        itemsPromise: getTeamElement(fetch, 'items', token, params.team),
        servicesPromise: getTeamElement(fetch, 'services', token, params.team)
    };
}) satisfies PageLoad;