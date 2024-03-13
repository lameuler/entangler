import type { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import passportAzureAd from 'passport-azure-ad'

const authConfig = {
    tenantID: "d72a7172-d5f8-4889-9a85-d7424751592a",
    clientID: "54ccbe8c-076f-4efb-bc24-237fdb28664d"
}

export const bearerStrategy = new passportAzureAd.BearerStrategy({
    identityMetadata: `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`,
    // issuer: `https://login.microsoftonline.com/${authConfig.tenantID}/v2.0`,
    clientID: authConfig.clientID,
    validateIssuer: false,
    passReqToCallback: true
}, (req, token, done) => {

    // Verify Client ID: only the app itself is allowed to access the API
    if (token.azp !== authConfig.clientID) {
        return done(new Error('Unauthorized'), {}, "Client not allowed");
    }

    // Verify that access token has correct scope
    if (token.scp !== 'API.ReadWrite') {
        return done(new Error('Unauthorized'), null, "No delegated or app permission claims found");
    }
    /**
     * If needed, pass down additional user info to route using the second argument below.
     * This information will be available in the req.user object.
     */
    return done(null, token.oid, token);
});

export function authenticate(req: Request, res: Response, next: NextFunction) {
    return new Promise<{ token: object, user: string}>((resolve, reject) => {
        passport.authenticate('oauth-bearer', {
            session: false,
            // tenantIdOrName - does not seem to exist??
        }, (err: any, user?: string, token?: object) => {
            // console.log('BB', err, user, token)
            
            // Error during authorization
            if (err) {
                // res.status(401).json({ error: err.message })
                reject({ status: 401, message: err.message });
            }
        
            if (!user) {
                // If no user object found, send a 401 response.
                // res.status(401).json({ error: 'Unauthorized' })
                reject({ status: 401, message: 'Unauthorized' });
            }
        
            if (token && user) {
                resolve({ token, user });
            }
        })(req, res, next);
    })
    
}