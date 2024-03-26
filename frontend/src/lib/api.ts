import { getToken } from './auth'
import { dev } from '$app/environment'

const API_HOST = dev ? 'http://localhost:6231' : 'https://quantum-entang.ler.sg'

export type FetchFunction = (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>

export function request(fetch: FetchFunction, path: string, token?: string|null, method: string = 'GET', body?: any) {
    const options: any = {
        method,
        headers: {}
    }
    if (token) {
        options.headers['Authorization'] = 'Bearer '+token
    }
    if (body) {
        options.body = JSON.stringify(body)
        options.headers['Content-Type'] = 'application/json'
    }
    return fetch(new URL(path, API_HOST), options)
}

export type User = {
    u_id: string
    name: string
    email: string
    isNew?: boolean
}

export type Team = {
    t_id: string
    name: string
    description: string
    public: boolean
    favourites: number
    fav: boolean
    role: string
}

export async function getUser(fetch: FetchFunction, token: string): Promise<User | null> {
    const response = await request(fetch, '/user/me', token)
    const result = await (response).json()
    // await wait(5000)
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

export async function updateUser(fetch: FetchFunction, token: string, update: { name: string, email: string }) {
    const response = await request(fetch, '/user/me', token, 'POST', update)
    // console.log('api:updateUser', response.status)
    const result = await(response).json()
    // console.log('api:updateUser', result)
    // await wait(2000)
    if (response.status !== 200) {
        throw {
            ...result,
            status: response.status
        }
    }
}

export async function getTeams(fetch: FetchFunction, token?: string|null, search?: string|null, filter?: string|null) {
    let path = '/teams'
    const params: { q?: string, filter?: string[] } = {}
    search = encodeParam(search)
    if (search) {
        params.q = search
    }
    if (filter) {
        params.filter = filter.split(',')
    }
    const sp = searchParams(params)
    if (sp) {
        path += '?'+sp
    }

    const response = await request(fetch, path, token)

    const result = await response.json()

    if (response.status !== 200) {
        throw {
            ...result,
            status: response.status
        }
    }

    if (result.teams) {
        return result
    }
    return null
}

export async function getTeam(fetch: FetchFunction, token?: string|null, team?: string|null) {
    if(!team) return null

    const response = await request(fetch, '/team/'+encodeURI(team), token)

    const result = await response.json()

    if (response.status !== 200) {
        throw {
            ...result,
            status: response.status
        }
    }

    if (result.team) {
        return result.team
    }
    return null
}

export function encodeParam(param: string|string[]|null|undefined): string|undefined {
    return param ? typeof param === 'string' ? param.trim().split(/\s+/g).map(encodeURIComponent).join('+') : param.map(encodeParam).join(',') : undefined
}

export function searchParams(params: {[key: string]: string|string[]|null|undefined}) {
    const array: string[] = []
    for (const key in params) {
        const encodedKey = encodeParam(key)
        const encodedParam = encodeParam(params[key])
        array.push(encodedKey+'='+encodedParam)
    }
    return array.join('&')
}

export function invalidator(path: string) {
    return (url: URL) => url.origin === API_HOST && url.pathname === path
}

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout)
    })
}