import { Router } from 'express'
import { authenticate } from '../auth'
import { query } from '../db'
import { objectColumns, parseFilters } from '../utils'
import Fuse, { type IFuseOptions } from 'fuse.js'
import { error } from '../api'

const router = Router()

const COLUMNS = ['req_id','t_id','team','u_id','date','dates','deps','name','description','committee','note','status'] as const

const fuseOptions: IFuseOptions<any> = {
    keys: [{ name: 'name', weight: 2 }, 'description']
}

router.get('/requests', async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)

        let search = null
        if(typeof req.query.q === 'string') {
            search = decodeURI(req.query.q.replaceAll('+', ' ').trim())
        }

        const creator = (typeof req.query.creator === 'string') ? req.query.creator : null
        const team = (typeof req.query.team === 'string') ? req.query.team : null

        const { result, filters } = parseFilters(req.query.filter, {
            is_managed: ['created','managed'],
            is_status: ['pending','rejected','approved']
        })
        
        const [raw] = await query('call userrequests(?,?,?,?,?)',
            [user, team, creator, result.is_managed ?? null, result.is_status ?? null])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            let requests = results.map(r => objectColumns({ ...r, dates: null, deps: null }, COLUMNS))

            for (const request of requests) {
                if (request) {
                    // get dates
                    try {
                        const [raw_dates] = await query('select * from req_date where req_id=? order by start', [request.req_id])
                        if (Array.isArray(raw_dates)) {
                            const dates = raw_dates.map(d => objectColumns(d, ['req_id', 'start', 'end', 'description']))
                            request.dates = dates
                        }
                    } catch (e) {}
                    
                    // get deployments
                    try {
                        const [raw_deps] = await query('select * from deployment where req_id=? and t_id=? order by start', [request.req_id, request.t_id])
                        if (Array.isArray(raw_deps)) {
                            const deps = raw_deps.map(d => objectColumns(d, ['dep_id', 'req_id', 't_id', 'start', 'end', 'approver_id', 'approve_date', 'note']))
                            request.deps = deps
                        }
                    } catch (e) {}
                }
            }

            if (search) {
                const fuse = new Fuse(requests, fuseOptions)
                requests = fuse.search(search).map(result => result.item)
                console.log('post',requests.length)
            }

            res.json({ requests, filters })
        } else {
            res.json({ requests: null, filters })
        }
    } catch (e) {
        error(e, res)
    }
})

export const requestRouter = router