import type { PageLoad } from './$types';

export const load = (async ({params}) => {
    return {
        team: params.team
    };
}) satisfies PageLoad;

export const csr = true