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

    const user = new Promise<User|null>(async (resolve, reject) => {
        try {
            if (token) {
                const result = await getUser(fetch, token)
                console.log('layout:load:fetch', result)
                resolve(result)
            }
            resolve(null)
        } catch (err) {
            reject(err)
        }
        
    })
    
    // console.log('layout:load', user)
    return { user };
}) satisfies LayoutLoad;