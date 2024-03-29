
import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query, util_query_row } from '../db'
import { objectColumns, parseFilters } from '../utils'
import Fuse, { type IFuseOptions } from 'fuse.js'

const router = Router()

const COLUMNS = ['t_id', 'name', 'description', 'public', 'handle', 'favourites', 'fav', 'role'] as const

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
            let teams = results.map(r => objectColumns(r, COLUMNS))

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

router.get('/team/:id', async (req, res, next) => {
    let u_id = null
    try {
        const { token, user } = await authenticate(req, res, next)
        u_id = user
        console.log(token)
    } catch (e) {}

    try {

        const [raw] = await query('call userteams(?,?,?,?,?)', [u_id, req.params.id, null, null, null])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            if (results.length === 1) {
                const result = objectColumns(results[0], [...COLUMNS, 'details'] as const)
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