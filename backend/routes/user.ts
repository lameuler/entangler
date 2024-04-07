// import { router } from '../api';
import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query, update, util_query_row } from '../db'
import { objectColumns } from '../utils'
import { validate } from 'email-validator'
import bodyParser from 'body-parser'
import { error } from '../api'
import Fuse from 'fuse.js'

const KEY = ['u_id'] as const
const VALUES = ['name', 'email', 'is_member', 'is_manager'] as const
const COLUMNS = [...KEY, ...VALUES] as const
const TABLE = 'user'

async function getUser(u_id: string) {
    const [results] = await query('select '+COLUMNS.join(',')+' from '+TABLE+' where u_id = ?', [u_id])

    console.log('getUser', results)
    if (Array.isArray(results) && results.length === 1) {
        console.log(results.length, results/* , Object.keys(results[0]).length */)
        return objectColumns(results[0], COLUMNS)
    } else {
        return null
    }
}

const router = Router()

router.get('/user/me', async (req, res, next) => {
    try {
        const { token, user } = await authenticate(req, res, next)
        console.log(token)

        const result = await getUser(user)
        // console.log('user:result')
        if (result === null) {
            await insert(TABLE, COLUMNS, [{
                u_id: user,
                name: token.name,
                email: token.email
            }])

            const added = await getUser(user)

            try {
                await query('insert into member (u_id, t_id) values (?, ?) on duplicate key update u_id=u_id', [user, 'tUB7ZVuLhgxTP4Vd'])
                await query('insert into member (u_id, t_id) values (?, ?) on duplicate key update u_id=u_id', [user, 'eCNWfCKg_km0KdgQ'])
                await query('insert into manager (u_id, t_id) values (?, ?) on duplicate key update u_id=u_id', [user, 'tUB7ZVuLhgxTP4Vd'])
            } catch (e) {
                console.log(e)
            }

            res.json({ user: {
                ...added,
                isNew: true
            } })
        } else {
            res.json({ user: result })
        }
    } catch (e) {
        error(e, res)
    }
})

router.post('/user/me', bodyParser.json(), async (req, res, next) => {
    console.log(req.body)
    
    try {
        const { user } = await authenticate(req, res, next)
        let errors = []
        // validate
        if (req.body === undefined) {
            res.status(400).json({ error: 'no body' })
            return
        }
        
        const { name, email } = req.body
        if (name && typeof name === 'string') {
            if (name.match(/^\s+$/)) {
                errors.push('name cannot be blank')
            } else if (name.trim().length > 64) {
                errors.push('name can only be up to 64 characters long')
            }
        } else {
            errors.push('string `name` missing')
        }

        if (email && typeof email === 'string') {
            if (!validate(email)) {
                errors.push('invalid email')
            } else if (name.trim().length > 64) {
                errors.push('email can only be up to 64 characters long')
            }
        } else {
            errors.push('string `email` missing')
        }

        if (errors.length === 0) {
            await update(TABLE, KEY, VALUES, { u_id: user }, req.body)
            res.json({ user: await getUser(user) })
        } else {
            res.status(400).json({ error: errors.join('; ') })
        }

    } catch (e) {
        error(e, res)
    }
})

router.get('/users', async (req, res, next) => {
    try {
        await authenticate(req, res, next)

        const [raw] = await query('select u.u_id, u.name, u.email from user u where not exists (select * from member m where m.u_id=u.u_id and m.t_id=?)', [req.query.exclude ?? null])

        if (Array.isArray(raw)) {
            const users = raw.map(u => objectColumns(u, ['u_id', 'name', 'email'] as const)).filter(x=>x)
    
            const fuse = new Fuse(users, { keys: ['name', 'email'] })

            const result = fuse.search(typeof req.query.q === 'string' ? req.query.q : '', { limit: 8 }).map(r => r.item)

            res.send({ users: result })
        }
        res.status(404).send({ error: 'Failed to search users' })
    } catch (e) {
        error(e, res)
    }
})

export const userRouter = router