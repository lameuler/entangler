import express from 'express'
import { router } from './api'
import { bearerStrategy } from './auth'

import passport from 'passport'

import cors from 'cors'
import { API_PORT } from './config'
const ORIGINS = ['https://entang.ler.sg', 'http://localhost:6131', 'https://entangler.pages.dev']

const app = express()

app.options('*', cors({
    origin: ORIGINS
}))
app.use(cors({
    origin: ORIGINS
}))

app.use(passport.initialize());

passport.use(bearerStrategy);

app.use(router)

app.listen(API_PORT, () => {
    console.log(`Listening on port ${API_PORT}...`)
})