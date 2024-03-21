type ObjectResult<T extends readonly string[]> = {
    [Key in T[number]]?: any;
};

export function objectColumns<T extends readonly string[]>(object: any, columns: T, all=true): ObjectResult<T> | null {
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