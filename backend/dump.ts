import type { RowDataPacket } from 'mysql2'
import { query } from './db'

const TABLES = ['user','team','manager','member','favourite','request','req_date','deployment',
                'item','service','can_serve','item_req','service_req','item_dep','service_dep']
const DERIVED_ATTR = ['user.is_member', 'user.is_manager', 'team.favourites']
const DERIVED_VALUE: {
    from: string, to: string, fields: string[] | { [from: string]: string }
}[] = [{
    from: 'team',
    to: 'manager',
    fields: {
        't_id': 't_id',
        'owner_id': 'u_id'
    }
}, {
    from: 'team',
    to: 'member',
    fields: {
        't_id': 't_id',
        'owner_id': 'u_id'
    }
}, {
    from: 'manager',
    to: 'member',
    fields: ['t_id', 'u_id']
}]

type DerivedWithValue = {
    to: string
    values: { [s: string]: string }
    fields: string[] | { [s:string]: string }
}

export async function dump_all_data(omit_derived: boolean = false) {
    let sql = ''
    const derived: DerivedWithValue[] = []
    for (const table of TABLES) {
        const [result, fields] = await query(`select * from ${table}`)
        if (Array.isArray(result)) {
            const fieldnames = fields.map(f => f.name).filter(f => !omit_derived || !DERIVED_ATTR.includes(table+'.'+f))
            const insert = 'insert into `'+table+'` (`'+fieldnames.join('`,`')+'`) values\n'
            + result.map(function(row) {
                const data = (row as RowDataPacket)
                
                for (const derv of derived) {
                    if (derv.to === table) {
                        const dfields = Array.isArray(derv.fields) ? derv.fields : Object.values(derv.fields)
                        if (dfields.every(f => derv.values[f] === serialize(data[f]))) {
                            return undefined
                        }
                    }
                }
                for (const derv of DERIVED_VALUE) {
                    if (derv.from === table) {
                        const v: DerivedWithValue = { to: derv.to, fields: derv.fields, values: {} }
                        const dfields = Array.isArray(derv.fields) ? derv.fields : Object.keys(derv.fields)
                        dfields.forEach((f, i) => {
                            const to = Array.isArray(derv.fields) ? derv.fields[i] : derv.fields[f]
                            v.values[to] = serialize(data[f])
                        })
                        derived.push(v)
                    }
                }

                return '('+fieldnames.map(col => (col in row) ? serialize(data[col]) : 'null').join(', ')+')'

            }).filter(r=>r).join(',\n')+';\n\n'

            sql += insert
        }
    }
    return sql
}

function serialize(value: any) {
    if (Buffer.isBuffer(value)) {
        return '"'+value.toString()+'"'
    } else if (typeof value === 'string') {
        return '"'+value+'"'
    } else if (typeof value === 'number') {
        return value.toString()
    } else if (value instanceof Date) {
        return '"'+value.toISOString().replaceAll(/[A-Z]/g,' ').trim()+'"'
    }else return 'null'
}

if(import.meta.main) {
    const omit = process.argv.includes('--omit')
    if (omit) console.log('Omitting derived fields...')
    const sql = await dump_all_data(omit)
    await Bun.write('data.sql', sql)
    console.log('Data written into `data.sql`')
    process.exit()
}