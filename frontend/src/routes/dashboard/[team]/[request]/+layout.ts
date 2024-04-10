import { request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import type { LayoutLoad } from './$types';

export const load = (async ({ params, fetch, url }) => {
    const token = await tokenOrRedirect(url.pathname)
    
    return {
        req_id: params.request,
        requestPromise: await request(fetch, '/request/'+params.request+'?team='+params.team, token).then(r => r.request)
    };
}) satisfies LayoutLoad;