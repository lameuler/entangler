import { type User, getUser, request } from '$lib/api'
import { getToken, logout } from '$lib/auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
    // console.log('layout:load')
    let token: string | null = null
    try {
        token = await getToken()
    } catch (err) {
        // logout()
        // goto('/login?redirect=')
    }

    const user = new Promise<User|null>(async resolve => {
        if (token) {
            const result = await getUser(fetch, token)
            console.log('layout:load:fetch', result)
            resolve(result)
        } else {
            console.log('layout:fetch:token', token)
        }
        resolve(null)
    })
    
    // console.log('layout:load', user)
    return { user };
}) satisfies LayoutLoad;