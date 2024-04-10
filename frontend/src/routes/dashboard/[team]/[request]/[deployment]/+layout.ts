import { request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { LayoutLoad } from './$types';

export const load = (async ({ params, fetch, url }) => {
    const token = await tokenOrRedirect(url.pathname)
    return {
        dep_id: params.deployment,
        deploymentPromise: request(fetch,
            '/deployment/'+params.deployment+'?request='+params.request+'&team='+params.team,
            token
        ).then(r => r.deployment)
    };
}) satisfies LayoutLoad