import mysql from 'mysql2/promise';
import { MYSQL_HOST, MYSQL_ROOT_PASSWORD, MYSQL_DATABASE } from './config'

const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: 'root',
    password: MYSQL_ROOT_PASSWORD,
    multipleStatements: true
});

await connection.query(
`drop database if exists ${MYSQL_DATABASE};
create database ${MYSQL_DATABASE};
use ${MYSQL_DATABASE};`
)

let init_script = await Bun.file('./init.sql').text()

init_script = init_script.split('\n').filter(line => !line.startsWith('delimiter ')).map(line => line.endsWith('$/$/$') ? line.slice(0, -5)+';' : line).join('\n')

await connection.query(init_script)

await connection.end()