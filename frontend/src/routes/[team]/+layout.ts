import { getTeam } from '$lib/api'
import { tokenOrNullRedirect } from '$lib/auth'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types';

export const load = (async ({params}) => {
    const token = await tokenOrNullRedirect()

    return {
        teamPromise: getTeam(fetch, token, params.team)
    };
}) satisfies LayoutLoad;

export const ssr = false
export const csr = true