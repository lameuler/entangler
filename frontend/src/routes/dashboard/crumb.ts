import { writable } from 'svelte/store'

export type Crumb = {
    name: string,
    path?: string
}

export const crumbs = writable<Crumb[]>()