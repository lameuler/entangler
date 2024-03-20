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
    res.redirect(302, 'https://entang.ler.sg')
})

router.get('/random', (req, res) => {
    res.json({ random: `Hello world for the ${Math.round(Math.random() * 100)}th time` })
})

router.get('/secret', async (req, res, next) => {
    try {
        const { token, user } = await authenticate(req, res, next)
        console.log(token)
        res.json({ secret: 'The secret phrase is pineapple!' })
    } catch (e) {
        const err = e as { status: number, message: string }
        res.status(err.status).json({ error: err.message })
    }
})