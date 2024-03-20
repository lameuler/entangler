import express from 'express'
import { router, public_routes } from './api'
import { bearerStrategy } from './auth'

import passport, { type AuthenticateCallback } from 'passport'
import passportAzureAd from 'passport-azure-ad'

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

const authConfig = {
    tenantID: "d72a7172-d5f8-4889-9a85-d7424751592a",
    clientID: "54ccbe8c-076f-4efb-bc24-237fdb28664d"
}

app.use(passport.initialize());

passport.use(bearerStrategy);

app.use(router)

/* app.use('/', (req, res, next) => {
        passport.authenticate('oauth-bearer', {
            session: false
        }, (err: any, user?: Express.User | false | null, token?: object | string | Array<string | undefined>) => {
            // console.log('BB', err, user, token)
            console.log('request::::', req.path, req.method)
            if (public_routes.some(route => typeof route === 'string' ? (req.path === route) : (req.path === route.route && route.methods.includes(req.method)))) {
                console.log('skipping authentication')
                return next()
            }
            
            // Error during authorization
            if (err) {
                return res.status(401).json({ error: err.message });
            }
        
            if (!user) {
                // If no user object found, send a 401 response.
                return res.status(401).json({ error: 'Unauthorized' });
            }
        
            if (token) {
                // access token payload will be available in req.authInfo downstream
                req.authInfo = token;
                req.user = user;
                return next();
            }
        })(req, res, next);
    },
    router
); */

app.listen(API_PORT, () => {
    console.log(`Listening on port ${API_PORT}...`)
})