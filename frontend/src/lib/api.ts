import { getToken } from './auth'
import { dev } from '$app/environment'
import { goto } from '$app/navigation'

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
    details: string
    handle: string
    public: 0 | 1
    favourites: number
    fav: boolean
    role: number
}

export type Item = {
    t_id: string,
    item: string,
    description: string,
    visible: boolean,
    count: number,
    category: string
}

export type Service = {
    t_id: string,
    item: string,
    description: string,
    visible: boolean,
    category: string
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

export async function getTeamElement(fetch: FetchFunction, element: 'items' | 'services' | 'members', token?: string|null, team?: string|null) {
    if(!team) return null

    const response = await request(fetch, '/team/'+encodeURI(team)+'/'+element, token)
    const results = await response.json()

    if (response.status !== 200) {
        throw {
            ...results,
            status: response.status
        }
    }

    if (results[element]) {
        return results[element]
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

export function search(path: string, q?: string, filter?: string) {
    const params: { q?: string, filter?: string } = {}
    if (q) params.q = encodeParam(q)
    if (filter) params.filter = filter
    const search = searchParams(params)
    if (search)
        goto(path+'?'+search)
    else
        goto(path)
}

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout)
    })
}