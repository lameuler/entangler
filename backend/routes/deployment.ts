import { Router } from 'express'
import { authenticate } from '../auth'
import { query } from '../db'
import { objectColumns, parseFilters } from '../utils'
import Fuse, { type IFuseOptions } from 'fuse.js'
import { error } from '../api'
import { isManager } from './team'
import bodyParser from 'body-parser'

const router = Router()

const COLUMNS = ['dep_id','req_id','request','t_id','team','creator_id','start','end','note']

const fuseOptions: IFuseOptions<any> = {
    keys: [{ name: 'request', weight: 2 }, 'note']
}

router.get('/user/deployments', async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)

        let search = null
        if(typeof req.query.q === 'string') {
            search = decodeURI(req.query.q.replaceAll('+', ' ').trim())
        }

        const { result, filters } = parseFilters(req.query.filter, {
            is_approved: ['pending','approved']
        })
        
        const [raw] = await query('call userdeployments(?,?)', [user, result.is_approved ?? null])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            let deployments = results.map(r => objectColumns(r, ['dep_id', 'req_id', 'request', 't_id', 'team', 'start', 'end', 'note', 'service', 'role', 'approved']))

            if (search) {
                const fuse = new Fuse(deployments, fuseOptions)
                deployments = fuse.search(search).map(result => result.item)
            }

            res.json({ deployments, filters })
        } else {
            res.json({ deployments: null, filters })
        }
    } catch (e) {
        error(e, res)
    }
})

router.get('/team/:id/deployments', async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)

        if (!(await isManager(req.params.id, user))) {
            res.status(401).send({ error: 'Unauthorized' })
        }

        let search = null
        if(typeof req.query.q === 'string') {
            search = decodeURI(req.query.q.replaceAll('+', ' ').trim())
        }

        const request = (typeof req.query.request === 'string') ? req.query.request : null

        const { result, filters } = parseFilters(req.query.filter, {
            is_approved: ['pending','approved']
        })
        
        const [raw] = await query('call teamdeployments(?,?,?)', [req.params.id, request, result.is_approved ?? null])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            let deployments = results.map(r => objectColumns(r, COLUMNS))

            for (const dep of deployments) {
                if (dep) {
                    // get items
                    try {
                        const [raw_items] = await query('select * from item_dep where dep_id=? and t_id=?', [dep.dep_id, dep.t_id])
                        if (Array.isArray(raw_items)) {
                            const items = raw_items.map(d => objectColumns(d, ['dep_id', 'item', 't_id', 'count']))
                            dep.items = items
                        }
                    } catch (e) {}
                    
                    // get services
                    try {
                        const services: {[s: string]: { u_id: string, role: string }[]} = {}
                        const [raw_services] = await query('select * from service_dep where dep_id=? and t_id=?', [dep.dep_id, dep.t_id])
                        if (Array.isArray(raw_services)) {
                            const service_deps = raw_services.map(d => objectColumns(d, ['dep_id', 'service', 't_id', 'u_id', 'role']))
                            service_deps.forEach(s => {
                                if (s) services[s.service] = (services[s.service] ?? []).concat({ u_id: s.u_id, role: s.role })
                            })
                            dep.services = Object.keys(services).map(service => { return { service, dep_id: dep.dep_id, t_id: dep.t_id, members: services[service] }})
                        } else dep.services = []
                    } catch (e) {}
                }
            }

            if (search) {
                const fuse = new Fuse(deployments, fuseOptions)
                deployments = fuse.search(search).map(result => result.item)
            }

            res.json({ deployments, filters })
        } else {
            res.json({ deployments: null, filters })
        }
    } catch (e) {
        error(e, res)
    }
})

router.post('/team/:id/deployments', bodyParser.json(), async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)
        if (!(await isManager(req.params.id, user))) {
            res.status(401).send({ error: 'Unauthorized' })
        }

    } catch (e) {
        error(e, res)
    }
})

export const deploymentRouter = router