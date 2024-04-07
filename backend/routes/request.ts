import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query } from '../db'
import { formatDate, objectColumns, parseFilters } from '../utils'
import Fuse, { type IFuseOptions } from 'fuse.js'
import { error } from '../api'
import bodyParser from 'body-parser'
import { nanoid } from 'nanoid'

const router = Router()

const COLUMNS = ['req_id','t_id','team','u_id','user','date','dates','name','description','committee','note','status'] as const

const fuseOptions: IFuseOptions<any> = {
    keys: [{ name: 'name', weight: 2 }, 'description']
}

async function getDates(req_id: string) {
    try {
        const [raw_dates] = await query('select * from req_date where req_id=? order by start', [req_id])
        if (Array.isArray(raw_dates)) {
            const dates = raw_dates.map(d => objectColumns(d, ['start', 'end', 'description']))
            return dates
        }
    } catch (e) {}
    return []
}

async function getItems(req_id: string) {
    try {
        const [raw_items] = await query('select * from item_req where req_id=?', [req_id])
        if (Array.isArray(raw_items)) {
            const items = raw_items.map(d => objectColumns(d, ['item', 'count']))
            return items
        }
    } catch (e) {}
    return []
}

async function getServices(req_id: string) {
    try {
        const [raw_services] = await query('select * from service_req where req_id=?', [req_id])
        if (Array.isArray(raw_services)) {
            const services= raw_services.map(d => objectColumns(d, ['service']))
            return services
        }
    } catch (e) {}
    return []
}

async function getDeployments(req_id: string) {
    try {
        const [raw_deps] = await query('select * from deployment where req_id=? order by start', [req_id])
        if (Array.isArray(raw_deps)) {
            const deps = raw_deps.map(d => objectColumns(d, ['dep_id', 'start', 'end', 'approver_id', 'approve_date', 'note']))
            return deps
        }
    } catch (e) {}
    return []
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
        
        const [raw] = await query('call userrequests(?,?,?,?,?,?)',
            [user, team, null, creator, result.is_managed ?? null, result.is_status ?? null])

        if(Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            let requests = results.map(r => objectColumns({ ...r, dates: [], items: [], services: [], deps: [] }, [...COLUMNS, 'items', 'services', 'deps'] as const))

            for (const request of requests) {
                if (request) {
                    await Promise.all([
                        getDates(request.req_id).then(dates => request.dates = dates),
                        getItems(request.req_id).then(items => request.items = items),
                        getServices(request.req_id).then(services => request.services = services),
                        getDeployments(request.req_id).then(deps => request.deps = deps)
                    ])
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

router.get('/request/:id', async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)

        const [raw] = await query('call userrequests(?,?,?,?,?,?)', [user, req.query.team ?? null, req.params.id, null, true, null])

        if (Array.isArray(raw)) {
            const results = Array.isArray(raw[0]) ? raw[0] : raw
            const request = objectColumns({ ...results[0], dates: [], items: [], services: [] }, [...COLUMNS, 'items', 'services'] as const)
            if (request) {
                await Promise.all([
                    getDates(request.req_id).then(dates => request.dates = dates),
                    getItems(request.req_id).then(items => request.items = items),
                    getServices(request.req_id).then(services => request.services = services)
                ])
            }
            res.send({ request })
            return
        }
        res.status(404).send({ error: 'Request not found' })
    } catch (e) {
        error(e, res)
    }
})

router.post('/team/:id/request', bodyParser.json(), async (req, res, next) => {
    try {
        const { user } = await authenticate(req, res, next)

        const request = objectColumns(req.body?.request, ['name', 'description', 'committee', 'dates', 'items', 'services'])

        if (!request) {
            throw { status: 400, message: 'No request provided' }
        }

        const req_id = nanoid(10)
        console.log(req_id)

        await insert('request', ['req_id', 't_id', 'u_id', 'date', 'name', 'description', 'committee'], [{ ...request, req_id, t_id: req.params.id, u_id: user, date: formatDate(new Date())}])

        if (Array.isArray(request.dates)) {
            const dates: { [x: string]: any }[] = []
            for (const raw of request.dates) {
                const date = objectColumns(raw, ['start', 'end', 'description'])
                if (date) {
                    date.start = formatDate(new Date(date.start))
                    date.end = formatDate(new Date(date.end))
                    date.description = typeof date.description === 'string' ? date.description.trim() : ''
                    if (!dates.some(d => d.start === date.start && d.end === date.end && d.description.toLowerCase() === date.description.toLowerCase())) {
                        dates.push({
                            ...date,
                            req_id
                        })
                    }
                }
            }
            console.log(dates)
            await insert('req_date', ['req_id', 'start', 'end', 'description'], dates)
        }
        if (Array.isArray(request.items)) {
            const items: { [x: string]: any }[] = []
            for (const raw of request.items) {
                const item = objectColumns(raw, ['item', 'count'])
                if (item) {
                    item.count = Number(item.count)
                    if (item.count > 0) {
                        if (!items.some(i => i.item === item.item)) {
                            item.req_id = req_id
                            item.t_id = req.params.id
                            items.push(item)
                        }
                    }
                }
            }
            console.log(items)
            await insert('item_req', ['req_id', 'item', 't_id', 'count'], items)
        }
        if (Array.isArray(request.services)) {
            const services: { [x: string]: any }[] = []
            for (const raw of request.services) {
                const service = objectColumns(raw, ['service'])
                if (service) {
                    if (!services.some(s => s.service === service.service)) {
                        service.req_id = req_id
                        service.t_id = req.params.id
                        services.push(service)
                    }
                }
            }
            console.log(services)
            await insert('service_req', ['req_id', 'service', 't_id'], services)
            res.send({ req_id })
        }
    } catch (e) {
        console.log(e)
        error(e, res)
    }
})

export const requestRouter = router