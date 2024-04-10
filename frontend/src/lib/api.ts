import { getToken } from './auth'
import { dev } from '$app/environment'
import { goto } from '$app/navigation'

const API_HOST = dev ? 'http://localhost:6231' : 'https://quantum-entang.ler.sg'

export type FetchFunction = (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>

export async function request(fetch: FetchFunction, path: string, token?: string|null, method: string = 'GET', body?: any) {
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
    const response = await fetch(new URL(path, API_HOST), options)
    const type = response.headers.get('Content-Type')
    let result = undefined
    if (type?.includes('json')) {
        result = await response.json()
        if (response.status >= 300) throw new Error(result.error, { cause: { status: response.status } })
    } else if (type?.includes('text')) {
        result = await response.text()
        if (response.status >= 300) throw new Error(result, { cause: { status: response.status } })
    }
    return result
}

export type User = {
    u_id: string
    name: string
    email: string
    is_member: boolean
    is_manager: boolean
    isNew?: boolean
}

export interface Team {
    t_id: string
    name: string
    description?: string
    details?: string
    handle?: string
    public: 0 | 1
}

export interface TeamResult extends Team {
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
    const result = await request(fetch, '/user/me', token)
    if (result.user && result.user.u_id && result.user.name && result.user.email) {
        return {
            u_id: result.user.u_id,
            name: result.user.name,
            email: result.user.email,
            is_member: result.user.is_member ?? false,
            is_manager: result.user.is_manager ?? false,
            isNew: result.user.isNew
        }
    }
    return null
}

export async function updateUser(fetch: FetchFunction, token: string, update: { name: string, email: string }) {
    await request(fetch, '/user/me', token, 'POST', update)
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

    const result = await request(fetch, path, token)

    if (result.teams) {
        return result
    }
    return null
}

export async function getTeam(fetch: FetchFunction, token?: string|null, team?: string|null) {
    if(!team) return null

    const result = await request(fetch, '/team/'+encodeURI(team), token)

    if (result.team) {
        return result.team
    }
    return null
}

export async function getTeamElement(fetch: FetchFunction, element: 'items' | 'services' | 'members', token?: string|null, team?: string|null) {
    if(!team) return null

    const results = await request(fetch, '/team/'+encodeURI(team)+'/'+element, token)

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