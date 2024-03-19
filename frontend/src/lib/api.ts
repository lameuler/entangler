import { getToken } from './auth'
import { dev } from '$app/environment'

const API_HOST = dev ? 'http://localhost:6231' : 'https://quantum-entang.ler.sg'

export function request(fetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>, path: string, token: string, method: string = 'GET', body?: any) {
    const options: any = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    if (body) {
        options.body = JSON.stringify(body)
        options.headers['Content-Type'] = 'application/json'
    }
    return fetch(new URL(path, API_HOST), options)
}

export type User = {
    u_id: string,
    name: string,
    email: string,
    isNew?: boolean
}

export async function getUser(fetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>, token: string): Promise<User | null> {
    const response = await request(fetch, '/user/me', token)
    const result = await (response).json()
    await wait(5000)
    // console.log('layout:load:fetch', result)
    if (response.status !== 200) {
        throw {
            ...result,
            status: response.status
        }
    }
    if (result.user && result.user.u_id && result.user.name && result.user.email) {
        return {
            u_id: result.user.u_id,
            name: result.user.name,
            email: result.user.email,
            isNew: result.user.isNew
        }
    }
    return null
}

export async function updateUser(fetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>, token: string, update: { name: string, email: string }) {
    const response = await request(fetch, '/user/me', token, 'POST', update)
    console.log('api:updateUser', response.status)
    const result = await(response).json()
    console.log('api:updateUser', result)
    await wait(2000)
    if (response.status !== 200) {
        throw {
            ...result,
            status: response.status
        }
    }
}

export function invalidator(path: string) {
    return (url: URL) => url.origin === API_HOST && url.pathname === path
}

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout)
    })
}