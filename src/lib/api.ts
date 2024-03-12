import { getToken } from './auth'

const BASE_URL = 'https://quantum-entang.ler.sg'

export function request(path: string, token: string) {
    return fetch(new URL(path, BASE_URL), {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}