import { goto } from '$app/navigation'
import { browser } from '$app/environment';
import { PublicClientApplication, InteractionRequiredAuthError, type AccountInfo, NavigationClient, type NavigationOptions } from '@azure/msal-browser'
import { writable } from 'svelte/store';
import { redirect } from '@sveltejs/kit'

const authConfig = {
    auth: {
        clientId: '54ccbe8c-076f-4efb-bc24-237fdb28664d', // This is the ONLY mandatory field that you need to supply.
        authority: 'https://login.microsoftonline.com/common', // Defaults to "https://login.microsoftonline.com/common"
        redirectUri: 'http://localhost:6131/authorize', // You must register this URI in the app registration on the Microsoft Entra admin center. Defaults to window.location.href e.g. http://localhost:3000/
        navigateToLoginRequestUrl: true
        //navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: any, message: string, containsPii: boolean) => {
                // console.log('msal::', level, message, containsPii)
            }
        }
    }
}
const loginRequest = {
    scopes: ["openid", "profile", "email", "api://54ccbe8c-076f-4efb-bc24-237fdb28664d/API.ReadWrite"],
};

class Navigator extends NavigationClient {
    async navigateInternal(url: string, options: NavigationOptions): Promise<boolean> {
        goto(url, {
            replaceState: options.noHistory
        })
        return false
    }
}

const app = new PublicClientApplication(authConfig);

if (browser) {
    app.initialize().then(() => {
        const accounts = app.getAllAccounts()
        console.log('auth:init', accounts.length)
        if(accounts.length === 1) {
            app.setActiveAccount(accounts[0])
            account.set(app.getActiveAccount())
            console.log('logged in to user', app.getActiveAccount()?.name)
        }

        app.enableAccountStorageEvents()
        app.addEventCallback(event => {
            console.log('auth:event',event)
            account.set(app.getActiveAccount())
        })
        app.setNavigationClient(new Navigator())
    })
}

export async function handleRedirect() {
    const result = await app.handleRedirectPromise()
    console.log('auth:redirect-result', result)
    console.log(result?.accessToken)
    const claims = result?.idTokenClaims as any
    if (claims) console.log(claims['oid'], claims['email'])

    console.log(app.getAllAccounts())
    if(result) {
        app.setActiveAccount(result.account)
        account.set(app.getActiveAccount())
    }
    return result !== null
}

export async function login(redirect?: string, select?: boolean) {
    console.log(app)
    await app.clearCache()
    app.loginRedirect({
        ...loginRequest,
        prompt: select ? 'select_account' : undefined,
        redirectStartPage: '?redirect='+redirect
    })
}

export async function logout() {
    console.log('auth:pre-clear', app.getAllAccounts().length)
    await app.clearCache()
    console.log('auth:post-clear', app.getAllAccounts().length)
    account.set(app.getActiveAccount())
}

export async function getToken() {
    if (browser) {
        const result = await app.acquireTokenSilent(loginRequest)
        // app.setActiveAccount(result.account)
        // account.set(app.getActiveAccount())
        return result.accessToken
    } else {
        return null
    }
}

export const account = writable<AccountInfo|null>(null)

export async function tokenOrRedirect(location='/') {
    let token = null
    try {
        token = await getToken()
    } catch (err) {}
    if (token) {
        return token
    } else {
        redirect(302, '/login?redirect='+location)
    }
}

export async function tokenOrGoto(location='/', replaceState=true) {
    let token = null
    try {
        token = await getToken()
    } catch (err) {}
    if (token) {
        return token
    } else {
        goto('/login?redirect='+location, { replaceState })
    }
}