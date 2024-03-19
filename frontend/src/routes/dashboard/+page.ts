import { getToken, tokenOrRedirect } from '$lib/auth'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
    await tokenOrRedirect(url.pathname)
    return {};
}) satisfies PageLoad;