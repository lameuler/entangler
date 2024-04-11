import { getTeamElement, request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { LayoutLoad } from './$types';

export const load = (async ({ params, url, fetch }) => {
    const token = await tokenOrRedirect(url.pathname)
    if (params.team.length === 10 && !params.team.startsWith('@')) {
        return {
            itemsPromise: getTeamElement(fetch, 'items', token, params.team),
            servicesPromise: getTeamElement(fetch, 'services', token, params.team),
            membersPromise: getTeamElement(fetch, 'members', token, params.team),
            requestsPromise: request(fetch, `/requests?filter=managed,pending&team=${params.team}`, token)
        };
    }
}) satisfies LayoutLoad;