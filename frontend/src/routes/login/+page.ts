import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types';
import { getToken } from '$lib/auth'

export const load = (async ({ url }) => {
    const location = url.searchParams.get('redirect') ?? '/'
    let token
    try {
        token = await getToken()
    } catch (err) {
        token = undefined
    }
    if (token) { // user is already logged in
        redirect(302, location)
    }
    return { redirect: location } // proceed to login page
}) satisfies PageLoad;

export const ssr = false;
export const csr = true;