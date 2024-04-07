import express from 'express'
import { bearerStrategy } from './auth'
import { userRouter } from './routes/user'
import { teamRouter } from './routes/team'
import { requestRouter } from './routes/request'
import { deploymentRouter } from './routes/deployment'

import passport from 'passport'

import cors from 'cors'
import { API_PORT } from './config'
const ORIGINS = ['https://entang.ler.sg', 'http://localhost:6131', 'https://entangler.pages.dev']

const app = express()

app.options('*', cors())
app.use(cors({
    origin: ORIGINS
}))
app.disable('etag');

app.use(passport.initialize());

passport.use(bearerStrategy);

app.use(userRouter)
app.use(teamRouter)
app.use(requestRouter)
app.use(deploymentRouter)

app.get("/", (req, res) => {
    res.redirect(302, 'https://entang.ler.sg')
})

app.listen(API_PORT, () => {
    console.log(`Listening on port ${API_PORT}...`)
})