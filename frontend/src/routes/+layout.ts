import { type User, getUser, request } from '$lib/api'
import { getToken, logout } from '$lib/auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
    // console.log('layout:load')
    const user = new Promise<User|null>(async (resolve, reject) => {
        let token: string | null = null
        try {
            console.log('layout:load', 'aquiring token')
            token = await getToken()
        } catch (err) {
            console.error('Failed to load token', err)
            redirect(302, '/logout?redirect=/login')
            // logout()
            // goto('/login?redirect=')
        }
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
    
    return { user };
}) satisfies LayoutLoad;