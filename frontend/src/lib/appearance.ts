import { writable } from 'svelte/store'

export const MEDIA_DARK = '(prefers-color-scheme: dark)'
export const STORAGE_KEY = 'appearance'

export const options = {
    theme: ['auto','light','dark'] as const
}

export type AppearanceKeys = keyof typeof options
export type Appearance = {[Key in AppearanceKeys]: (typeof options[Key][number])}
export type AppearanceUpdate = {[Key in AppearanceKeys]?: (typeof options[Key][number]|undefined)}

const appearanceStore = writable<Appearance>()

export const appearance = {
    set(appearance: string|null|undefined | [string|null|undefined, string|null|undefined]) {
        this.update(() => appearance)
    },
    update(updater: (old: Appearance) => string|null|undefined | [string|null|undefined, string|null|undefined]) {
        appearanceStore.update(old => {
            let newValue: {[key: string]: string} = {}
            const raw = updater(old)
            const rawNew = Array.isArray(raw) ? raw : [raw, undefined]
            const appearance = parseAppearance(rawNew[0] ?? '')

            type K = keyof Appearance
            Object.entries(options).forEach(([key, opts]) => newValue[key] = appearance[key as K] ?? old?.[key as K] ?? opts[0])
            const value = newValue as Appearance

            const browser = typeof window !== 'undefined'
            if (value['theme'] === 'auto') {
                value['theme'] = browser ? (matchMedia(MEDIA_DARK).matches ? 'dark' : 'light') : 'auto'
            }
            
            const className = Object.values(value).join(' ')

            if (browser) {
                document.documentElement.className = className
                if (rawNew[1] !== className) {
                    localStorage.setItem(STORAGE_KEY, className)
                    console.log('write', className)
                }
            }
            return value
        })
    },
    subscribe: appearanceStore.subscribe
}

export type AppearanceStore = typeof appearance

function parseAppearance(classes: string|null|undefined): AppearanceUpdate {
    const classList = (classes ?? '').toLowerCase().split(' ')
    const result: {[key: string]: (string|undefined)} = {}
    Object.entries(options).forEach(([key, value])=> {
        result[key] = undefined
        for (let cls of value) {
            if (classList.includes(cls)) {
                result[key] = cls
                break
            }
        }
    })
    return result as AppearanceUpdate
}

export function listener() {
    appearance.set([document.documentElement.className, localStorage.getItem(STORAGE_KEY)])

    const mediaHandler = (event: MediaQueryListEvent) => {
        appearance.set(event.matches ? 'dark' : 'light')
    }
    matchMedia(MEDIA_DARK).addEventListener('change',mediaHandler)

    const storageHandler = (event: StorageEvent) => {
        if(event.key === STORAGE_KEY && event.newValue !== event.oldValue) {
            appearance.set([event.newValue, event.newValue])
        }
    }
    addEventListener('storage', storageHandler)

    return () => {
        matchMedia(MEDIA_DARK).removeEventListener('change', mediaHandler)
        removeEventListener('storage', storageHandler)
    }
}

export const initScript = `<script>(function(){document.documentElement.className = localStorage.getItem('${STORAGE_KEY}') ?? (matchMedia('${MEDIA_DARK}').matches ? 'dark' : 'light')})()</script>`