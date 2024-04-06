import { getTeam, getTeamElement } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types';

export const load = (async ({ params, url, fetch }) => {
    const token = await tokenOrRedirect(url.pathname)
    if (params.team.length === 10 && !params.team.startsWith('@')) {
        return {
            t_id: params.team,
            teamPromise: getTeam(fetch, token, params.team),
            itemsPromise: getTeamElement(fetch, 'items', token, params.team),
            servicesPromise: getTeamElement(fetch, 'services', token, params.team),
            membersPromise: getTeamElement(fetch, 'members', token, params.team)
        };
    }
    error(404, 'Team not found :(')
}) satisfies LayoutLoad;