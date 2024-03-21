
import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query, util_query_row } from '../db'
import { objectColumns } from '../utils'
import Fuse, { type IFuseOptions } from 'fuse.js'

const router = Router()

const FILTERS = ['member', 'manager', 'owner', 'favourite', 'public', 'private']

const fuseOptions: IFuseOptions<any> = {
    keys: [{ name: 'name', weight: 2 }, 'description']
}

router.get('/teams', async (req, res, next) => {
    let u_id = null
    try {
        const { token, user } = await authenticate(req, res, next)
        u_id = user
    } catch (e) {} // not logged in

    req.query.filter
    let search = null
    if(typeof req.query.q === 'string') {
        search = decodeURI(req.query.q.replaceAll('+', ' ').trim())
    }

    try {
        const [raw] = await query('call userteams(?)', [u_id])
        console.log(u_id, raw)

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            let teams = results.map(r => objectColumns(r, ['t_id', 'name', 'description', 'public', 'favourites', 'is_fav', 'role'] as const))

            if (search) {
                const fuse = new Fuse(teams, fuseOptions)
                teams = fuse.search(search).map(result => result.item)
            }

            res.json({ search, teams })
        } else {
            res.json({ search, teams: null })
        }
    } catch (e) {
        const err = e as { status: number, message: string }
        res.status(err.status).json({ error: err.message })
    }
})

export const teamRouter = router