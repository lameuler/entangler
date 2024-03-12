import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    return { request: params.request, team: params.team };
}) satisfies PageLoad;