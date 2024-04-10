import { request } from '$lib/api'
import { tokenOrRedirect } from '$lib/auth'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types';

export const load = (async ({ params, url, fetch }) => {
    const token = await tokenOrRedirect(url.pathname)

    if (params.request.length !== 10) error(404, 'Request not found')
    return {
        deploymentsPromise: request(fetch, '/team/'+params.team+'/deployments?request='+params.request, token).then(r => r.deployments)
    };
}) satisfies PageLoad;