import { request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types';

export const load = (async ({ params, url, fetch }) => {
    const token = await tokenOrRedirect(url.pathname)

    if (params.request.length !== 10) error(404, 'Request not found')
    return { 
        t_id: params.team,
        req_id: params.request,
        request: params.request, team: params.team,
        requestPromise: await request(fetch, '/request/'+params.request+'?team='+params.team, token).then(r => r.json()).then(r => r.request),
        deploymentsPromise: await request(fetch, '/team/'+params.team+'/deployments?request='+params.request, token).then(r => r.json()).then(r => r.deployments)
    };
}) satisfies PageLoad;