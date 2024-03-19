
import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query, util_query_row } from '../db'
import { objectColumns } from '../utils'

const router = Router()

router.get('/teams', async (req, res, next) => {
    let u_id = null
    try {
        const { token, user } = await authenticate(req, res, next)
        u_id = user
    } catch (e) {} // not logged in
    try {
        const [raw] = await query('call userteams(?)', [u_id])
        console.log(u_id, raw)

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            const teams = results.map(r => objectColumns(r, ['t_id', 'name', 'description', 'public', 'favourites', 'is_fav', 'role']))
            res.json({ teams })
        } else {
            res.json({ teams: null })
        }
    } catch (e) {
        const err = e as { status: number, message: string }
        res.status(err.status).json({ error: err.message })
    }
})

export const teamRouter = router