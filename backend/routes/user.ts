// import { router } from '../api';
import { Router } from 'express'
import { authenticate } from '../auth'
import { insert, query, update, util_query_row } from '../db'
import { objectColumns } from '../utils'
import { validate } from 'email-validator'
import bodyParser from 'body-parser'

const KEY = ['u_id'] as const
const VALUES = ['name', 'email'] as const
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

            res.json({ user: {
                ...added,
                isNew: true
            } })
        } else {
            res.json({ user: result })
        }
    } catch (e) {
        const err = e as { status: number|undefined, message: string }
        res.status(err.status ?? 500).json({ error: err.message })
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
        const err = e as { status?: number, message: string }

        if (typeof err.status === 'number') {   
            res.status(err.status).json({ error: err.message })
        } else {
            res.status(500).json({ error: 'Server error while processing request' })
        }
        console.log(err)
    }
})

router.get('/user/:user', async (req, res, next) => {
    try {
        await authenticate(req, res, next)

        const user = req.params.user
        res.json({ user: await getUser(user) })
    } catch (e) {
        const err = e as { status: number, message: string }
        res.status(err.status).json({ error: err.message })
    }
})

export const userRouter = router