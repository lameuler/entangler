import { tokenOrRedirect } from '$lib/auth'
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
    await tokenOrRedirect(url.pathname)
    return {};
}) satisfies PageLoad;