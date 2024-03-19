import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit'
import { logout } from '$lib/auth'

export const load = (async ({ url }) => {
    const location = url.searchParams.get('redirect') ?? '/'
    // logout()
    // redirect(302, location)
    return { redirect: location }
}) satisfies PageLoad;

export const ssr=false;