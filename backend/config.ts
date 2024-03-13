const port_env = Number(process.env.API_PORT)
export const API_PORT = isFinite(port_env) ? port_env : 6231

export const MYSQL_HOST = process.env.MYSQL_HOST as string ?? 'localhost'
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE as string ?? 'sample'
const MYSQL_ROOT_PASSWORD_FILE = process.env.MYSQL_ROOT_PASSWORD_FILE as string ?? './.secret/MYSQL_ROOT_PASSWORD'
export const MYSQL_ROOT_PASSWORD = await Bun.file(MYSQL_ROOT_PASSWORD_FILE).text()