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
            [245, 240, 'Armchair'],
            [12,100, 'Lamp'],
            [3, 34, 'Table']
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

export function insert(table: string, columns: string[], rows: any[][]) {
    let query = 'insert into `'+table+'` (' + columns.map(c => '`'+c+'`').join(',') + ') values '
    const values: any[] = []
    query += rows.filter(row => row.length === columns.length).map(row => {
        values.push(...row)
        return util_query_row(rows.length)
    }).join(',')

    console.log(query)
    return pool.execute(query, values)
}

function util_query_row(n: number) {
    return '('+Array(n).fill('?').join(',')+')'
}