
export function objectColumns(object: any, columns: string[], all=true): any | null {
    const result: any = {}
    if(!object) {
        return null
    }
    for (const col of columns) {
        if(object[col] !== undefined) {
            const raw = object[col]
            result[col] = Buffer.isBuffer(raw) ? raw.toString() : raw
        } else if (all) {
            return null
        }
    }
    return result
}