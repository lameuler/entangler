import express from 'express'
import { authenticate } from './auth'
import { query } from './db'
import { userRouter } from './routes/user'
import { teamRouter } from './routes/team'

export const router = express.Router()

router.use(userRouter)
router.use(teamRouter)

export const public_routes = [
    { route: '/', methods: ['GET'] },
    '/random'
]

router.get("/", (req, res) => {
    console.log('CC', req.authInfo, (req.user as string))
    res.send(req.headers)
})

router.get('/random', (req, res) => {
    res.send(`Hello world for the ${Math.round(Math.random() * 100)}th time`)
})

router.get('/secret', async (req, res, next) => {
    try {
        const { token, user } = await authenticate(req, res, next)
        console.log(token)
        res.send('The secret phrase is pineapple!')
    } catch (e) {
        const err = e as { status: number, message: string }
        res.status(err.status).json({ error: err.message })
    }
})

router.get('/teams', async (req, res) => {
    // res.send('Teams!!!')
    try {
        const [results, fields] = await query('select * from `ikea`')
        res.json(results)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Internal Server Error', details: 'An error occurred when querying the database.'})
    }
})

router.put('/teams/*', async (req, res, next) => {
    try {
        const { token, user } = await authenticate(req, res, next)
        res.send('Your team is: '+user)
    } catch (e) {
        const err = e as { status: number, message: string }
        res.status(err.status).json({ error: err.message })
    }
})