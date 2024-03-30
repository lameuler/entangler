
import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query, update, util_query_row } from '../db'
import { objectColumns, parseFilters } from '../utils'
import Fuse, { type IFuseOptions } from 'fuse.js'
import bodyParser from 'body-parser'
import { nanoid } from 'nanoid'

const router = Router()

const KEYS = ['t_id'] as const

const VALUES = ['name', 'description', 'details', 'public', 'handle'] as const

const COLUMNS = [...KEYS, ...VALUES] as const

const COLUMNS_DERIVED = [...COLUMNS, 'favourites', 'fav', 'role'] as const

const ITEM_COLUMNS = ['t_id', 'item', 'description', 'count', 'visible', 'category'] as const

const SERVICE_COLUMNS = ['t_id', 'item', 'description', 'visible', 'category'] as const

const OPTIONS = {
    'is_public': ['private', 'public'],
    'is_fav': ['', 'favourite'],
    'is_role': ['', 'member', 'manager', 'owner']
}

const fuseOptions: IFuseOptions<any> = {
    keys: [{ name: 'name', weight: 2 }, 'description']
}

router.get('/teams', async (req, res, next) => {
    let u_id = null
    try {
        const { token, user } = await authenticate(req, res, next)
        u_id = user
    } catch (e) {} // not logged in

    const { result, filters } = parseFilters(req.query.filter, OPTIONS)
    
    let search = null
    if(typeof req.query.q === 'string') {
        search = decodeURI(req.query.q.replaceAll('+', ' ').trim())
    }

    try {
        const [raw] = await query('call userteams(?,?,?,?,?)',
            [u_id, null, result.is_public ?? null, result.is_fav ?? null, result.is_role ?? null])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            let teams = results.map(r => objectColumns(r, COLUMNS_DERIVED))

            if (search) {
                const fuse = new Fuse(teams, fuseOptions)
                teams = fuse.search(search).map(result => result.item)
            }

            res.json({ search, teams, filters })
        } else {
            res.json({ search, teams: null, filters })
        }
    } catch (e) {
        const err = e as { status: number, message: string }
        res.status(err.status).json({ error: err.message })
    }
})

async function checkHandle(value: any, t_id?: string) {
    const handle = String(value ?? '').toLowerCase()
    if (handle.match(/^[a-z0-9_.]{3,20}$/g)) {
        const [result] = await query('select handle from team where handle=? and (? is null or t_id!=?)', [handle, t_id ?? null, t_id ?? null])
        if (Array.isArray(result)) {
            return { handle, available: result.length === 0}
        } else {
            return { handle, available: null}
        }
    } else {
        throw { status: 400, message: 'Handle must be between 3 and 20 characters long and can only contain letters, numbers, underscores, or periods.' }
    }
}

router.post('/teams/checkHandle', bodyParser.json(), async (req, res, next) => {
    try {
        await authenticate(req, res, next)
        const result = await checkHandle(req.body?.handle, req.body?.t_id)
        res.json(result)
    } catch (e) {
        const err = e as { status: number|undefined, message: string }
        res.status(err.status ?? 500).json({ error: err.message })
    }
})

async function validateTeam(team: any) {
    const data = objectColumns(team, VALUES, false)
    if (data) {
        if ((typeof data.name === 'string' && data.name.match(/^\s*$/)) || data.name === null) {
            throw { status: 400, message: 'Name cannot be blank' }
        } else if (typeof data.name !== 'string')  {
            data.name = undefined
        }
        const valHandle = await checkHandle(data.handle, team.t_id)
        if (valHandle.available === true) {
            data.handle = valHandle.handle
        } else if (valHandle.available === false) {
            throw { status: 400, message: 'Handle not available' }
        } else if (data.handle !== null) {
            data.handle = undefined
        }
        if (typeof data.description === 'string' || data.description === null) {
            data.description = data.description?.slice(0,150)
        } else data.description = undefined

        if (typeof data.details === 'string' || data.details === null) {
            data.details = data.details.slice(0,1000)
        } else data.details = undefined

        if (!(typeof data.public === 'boolean' || data.public === 0 || data.public === 1)) {
            data.public = undefined
        }
        return data
    } else {
        throw { status: 400, message: 'Invalid body' }
    }
}

router.post('/team/create', bodyParser.json(), async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)
        const body = req.body ?? {}
        body.name ??= null
        const team = {...await validateTeam(body), t_id: nanoid(10), owner_id: user}
        const columns = Object.entries(team).filter(([key, val]) => val !== undefined).map(([key]) => key)
        await insert('team', columns, [team])
        res.status(200).json({ t_id: body.t_id })
    } catch (e) {
        const err = e as { status: number|undefined, message: string }
        res.status(err.status ?? 500).json({ error: err.message })
    }
})

router.get('/team/:id', async (req, res, next) => {
    let u_id = null
    try {
        const { user } = await authenticate(req, res, next)
        u_id = user
    } catch (e) {}

    try {

        const [raw] = await query('call userteams(?,?,?,?,?)', [u_id, req.params.id, null, null, null])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            if (results.length === 1) {
                const result = objectColumns(results[0], [...COLUMNS_DERIVED, 'details'] as const)
                res.json({ team: result })
                return
            }
        }
        res.status(404).json({ error: 'Team not found' })
    } catch (e) {
        const err = e as { status: number|undefined, message: string }
        res.status(err.status ?? 500).json({ error: err.message })
    }
})

router.post('/team/:id', bodyParser.json(), async (req, res, next) => {
    try {
        await authenticate(req, res, next)
        const body = req.body ?? {}
        const team = await validateTeam({...body, t_id: req.params.id})
        const columns = Object.entries(team).filter(([key, val]) => val !== undefined).map(([key]) => key)
        console.log(team, columns)
        await update('team', KEYS, columns, { t_id: req.params.id }, team)
        res.status(200).json({ t_id: body.t_id })
    } catch (e) {
        const err = e as { status: number|undefined, message: string }
        res.status(err.status ?? 500).json({ error: err.message })
    }
})

router.get('/team/:id/items', async (req, res, next) => {
    try {
        await authenticate(req, res, next)

        const [raw] = await query('select * from item where t_id=?', [req.params.id])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            const items = results.map(r => objectColumns(r, ITEM_COLUMNS))
            
            res.json({ items })
            return
        }
        res.status(404).json({ error: 'Not found' })
    } catch (e) {
        const err = e as { status: number|undefined, message: string }
        res.status(err.status ?? 500).json({ error: err.message })
    }
})

router.get('/team/:id/services', async (req, res, next) => {
    try {
        await authenticate(req, res, next)

        const [raw] = await query('select * from service where t_id=?', [req.params.id])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            results.map(r => objectColumns(r, SERVICE_COLUMNS))
            
            res.json({ services: results })
            return
        }
        res.status(404).json({ error: 'Not found' })
    } catch (e) {
        const err = e as { status: number|undefined, message: string }
        res.status(err.status ?? 500).json({ error: err.message })
    }
})

export const teamRouter = router