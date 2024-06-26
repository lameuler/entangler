import { readonly, writable } from 'svelte/store'

export function join(pathname: string, name: string, up: number = 0) {
    return '/' + [
        ...pathname.split('/').filter(s=>s).slice(0, -Math.abs(up) || undefined),
        ...name.split('/').filter(s=>s)
    ].join('/')
}

export function title(pathname: string) {
    return titleCase(pathname.split('/').filter(s=>s).pop()?.toLowerCase() ?? '')
}

export function titleCase(string: string) {
    return string.split(/\s+/).filter(w=>w).map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')
}

export function media(query: string) {
    const state = writable<boolean>()

    const onMount = () => {
        const mediaQuery = matchMedia(query)
        const listener = (event: MediaQueryListEvent) => {
            state.set(event.matches)
        }
        state.set(mediaQuery.matches)
        mediaQuery.addEventListener('change', listener)

        return () => mediaQuery.removeEventListener('change', listener)
    }

    return [readonly(state), onMount] as const
}

export function roundDate(offset: number = 0) {
    const date = new Date()
    date.setMinutes(Math.ceil((date.getMinutes()+offset)/30)*30)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}

export function s(n: number) {
    return n===1 ? '' : 's'
}