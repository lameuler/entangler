import mysql from 'mysql2/promise';
import { MYSQL_HOST, MYSQL_ROOT_PASSWORD, MYSQL_DATABASE } from './config'

const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: 'root',
    password: MYSQL_ROOT_PASSWORD,
    database: MYSQL_DATABASE,
    connectionLimit: 20,
});

async function testing() {
    try {
        // await pool.query("insert into `ikea` (`cost`, `stock`, `name`) values (245, 240, 'Boomer2')")
        await insert('ikea', ['cost', 'stock', 'name'], [
            { cost: 245, stock: 240, name: 'Armchair'},
            { cost: 12, stock: 100, name: 'Lamp'},
            { cost: 3, stock: 34, name: 'Table'}
        ])
    } catch (err) {
        console.log('hi', (err as any).code === 'ER_DUP_ENTRY')
        console.log(err)
    }
    
    try {
        const [results, fields] = await pool.query(
          'select * from ikea'
        );
      
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }

    console.log('attempting to close pool...')
    await pool.end()
    console.log('pool closed sucessfully. bye!')
    process.exit()
}

if (import.meta.main)
    await testing()

export function query(query: string, values?: any[]) {
    return pool.execute(query, values)
}

export function insert(table: string, columns: readonly string[], items: { [column: string]: any }[]) {
    let query = 'insert into `'+table+'` (' + columns.map(c => '`'+c+'`').join(',') + ') values '
    const values: any[] = []
    query += items/* .filter(row => row.length === columns.length) */.map(item => {
        const row = columns.map(col => item[col] ?? null)
        values.push(...row)
        return '('+util_query_row(row.length)+')'
    }).join(',')

    console.log(query)
    return pool.execute(query, values)
}

export function update(table: string, key_cols: readonly string[], val_cols: readonly string[], key: { [column: string]: any }, value: { [column: string]: any }) {
    let query = 'update '+table+' set '
    const values: any[] = []
    query += Object.entries(value).map(([col, val]) => {
        if (val_cols.includes(col)) {
            values.push(val)
            return col+' = ?'
        } else return null
    }).filter(e => e).join(', ')
    query += ' where '
    query += Object.entries(key).map(([col, val]) => {
        if (key_cols.includes(col)) {
            values.push(val)
            return col+' = ?'
        } else return null
    }).filter(e => e).join(' and ')

    console.log(query)
    return pool.execute(query, values)
}

export function util_query_row(n: number) {
    return Array(n).fill('?').join(',')
}