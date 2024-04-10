import { getTeam } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types';

export const load = (async ({ params, fetch, url }) => {
    const token = await tokenOrRedirect(url.pathname)
    if (params.team.length === 10 && !params.team.startsWith('@')) {
        return {
            t_id: params.team,
            teamPromise: getTeam(fetch, token, params.team)
        };
    }
    error(404, 'Team not found')
}) satisfies LayoutLoad;