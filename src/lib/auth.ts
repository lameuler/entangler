import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser'

const authConfig = {
    auth: {
        clientId: '54ccbe8c-076f-4efb-bc24-237fdb28664d', // This is the ONLY mandatory field that you need to supply.
        authority: 'https://login.microsoftonline.com/common', // Defaults to "https://login.microsoftonline.com/common"
        redirectUri: 'http://localhost:6131', // You must register this URI in the app registration on the Microsoft Entra admin center. Defaults to window.location.href e.g. http://localhost:3000/
        navigateToLoginRequestUrl: true
        //navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
        storeAuthStateInCookie: false
    },
}
const loginRequest = {
    scopes: ["openid", "profile", "email", "api://54ccbe8c-076f-4efb-bc24-237fdb28664d/API.ReadWrite"],
};

const app = new PublicClientApplication(authConfig);

app.initialize().then(() => {
    app.handleRedirectPromise().then(response => {
        console.log('response', response)
        console.log(response?.accessToken)
        const claims = response?.idTokenClaims as any
        if (claims) console.log(claims['oid'], claims['email'])
        console.log(app.getAllAccounts())
        if(response) {
            app.setActiveAccount(response.account)
        }
    }).catch(console.error)
})

export function login() {
    console.log(app)
    app.loginRedirect(loginRequest)
}

export function getToken() {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    // app.getA``
    // request.account = app.getAccountByUsername(username);

    return app.acquireTokenSilent(loginRequest)
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails

                return app.acquireTokenRedirect(loginRequest);
            } else {
                console.warn(error);   
            }
        });
}