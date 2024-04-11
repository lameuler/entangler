export function objectColumns<T extends readonly string[]>(object: any, columns: T, all=true): { [Key in T[number]]?: any } | null {
    const result: any = {}
    if(!object) {
        return null
    }
    for (const col of columns) {
        if(object[col] !== undefined) {
            const raw = object[col]
            if (typeof raw === 'string') result[col] = raw.trim()
            else if (Buffer.isBuffer(raw)) result[col] = raw.toString()
            else if (raw instanceof Date) result[col] = raw.toISOString()
            else result[col] = raw // number, boolean, null etc
        } else if (all) {
            return null
        }
    }
    return result
}

type FiltersResult<T extends {[key: string]: string[]}> = {
    result: { [Key in keyof T]?: number }
    filters: string[]|null
}

export function parseFilters<T extends {[key: string]: string[]}>(filter: any, options: T): FiltersResult<T> {
    const result: FiltersResult<T> = { result: {}, filters: null }
    if (typeof filter === 'string' ) {
        const params = filter.split(',').map(decodeURIComponent).filter(s => !s.match(/^\s*$/))
        const filterNames: { [Key in keyof T]?: string} = {}
        for (const key in options) {
            options[key].forEach((option, i) => {
                if (params.includes(option)) {
                    result.result[key] = i
                    filterNames[key] = option
                }
            })
        }
        const filters: string[] = []
        for (const key in filterNames) {
            const option = filterNames[key]
            if(option) {
                filters.push(option)
            }
        }
        if (filters.length > 0)
            result.filters = filters
    }
    return result
}

export function formatDate(d: Date) {
    const minutes = d.getUTCMinutes().toLocaleString(undefined, { minimumIntegerDigits: 2, maximumFractionDigits: 0 })
    return d.getUTCFullYear()+'-'+(d.getUTCMonth()+1)+'-'+d.getUTCDate()+' '+d.getUTCHours()+':'+minutes+':00'
}