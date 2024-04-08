import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query } from '../db'
import { formatDate, objectColumns, parseFilters } from '../utils'
import Fuse, { type IFuseOptions } from 'fuse.js'
import { error } from '../api'
import { isManager } from './team'
import bodyParser from 'body-parser'
import { nanoid } from 'nanoid'

const router = Router()

const COLUMNS = ['dep_id','req_id','request','t_id','team','creator_id','create_date','start','end','note']

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

router.post('/request/:id/deploy', bodyParser.json(), async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)

        const [reqraw] = await query('select req_id, t_id from request where req_id=?', [req.params.id])

        if (!Array.isArray(reqraw) || reqraw.length !== 1) {
            throw { status: 404, message: 'Request not found' }
        }

        const request = objectColumns(reqraw[0], ['req_id', 't_id'])

        if (!request) throw { status: 404, message: 'Request not found' }

        if (!(await isManager(request.t_id, user))) {
            res.status(401).send({ error: 'Unauthorized' })
        }

        const deployment = objectColumns(req.body.deployment, [...COLUMNS, 'items', 'services'], false)

        console.log(deployment?.items, deployment?.services)

        if (!deployment) throw { status: 400, message: 'No deployment given' }


        const dep_id = nanoid(10)

        const start = new Date(deployment.start)
        const end = new Date (deployment.end)
        if (isFinite(start.getTime()) && isFinite(end.getTime()) && end.getTime() >= start.getTime()) {
            deployment.start = formatDate(start)
            deployment.end = formatDate(end)
        } else {
            throw { status: 400, message: 'Invalid date(s)' }
        }

        await insert('deployment', ['dep_id','req_id','t_id','creator_id','create_date','start','end','note'], [{ ...deployment, dep_id, req_id: req.params.id, t_id: request.t_id, creator_id: user, create_date: formatDate(new Date()) }])

        if (Array.isArray(deployment.items) && deployment.items.length > 0) {
            const ins: { [column: string]: any }[] = []
            deployment.items.forEach(i => {
                const item = objectColumns(i, ['item', 'count'])
                if (item && typeof item.count === 'number' && item.count > 0) {
                    ins.push({ ...item, dep_id, t_id: request.t_id })
                }
            })
            await insert('item_dep', ['item', 'count', 'dep_id', 't_id'], ins)
        }
        if (Array.isArray(deployment.services) && deployment.services.length > 0) {
            const ins: { [column: string]: any }[] = []
            deployment.services.forEach(s => {
                const service = objectColumns(s, ['service', 'members'])
                if (service && Array.isArray(service.members)) {
                    service.members.forEach(m => {
                        const member = objectColumns(m, ['u_id', 'role'])
                        if (member) ins.push({ ...member, service: service.service, dep_id, t_id: request.t_id })
                    })
                }
            })
            await insert('service_dep', ['service', 'dep_id', 't_id', 'u_id', 'role'], ins)
        }

        res.send({ dep_id })

    } catch (e) {
        error(e, res)
    }
})

router.delete('/deployment/:id', async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)

        const [depraw] = await query('select dep_id, req_id, t_id from deployment where dep_id=?', [req.params.id])

        if (!Array.isArray(depraw) || depraw.length !== 1) throw { status: 404, message: 'Deployment not found' }

        const deployment = objectColumns(depraw[0], ['dep_id', 'req_id', 't_id'])

        if(!deployment) throw { status: 404, message: 'Deployment not found' }

        if(!(await isManager(deployment.t_id, user))) throw { status: 401, message: 'Unauthorized' }

        await query('delete from deployment where dep_id=?', [req.params.id])

        res.sendStatus(200)
    } catch (e) {
        error(e, res)
    }
})

export const deploymentRouter = router