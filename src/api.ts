import { getDefaultClient } from '@wethinkt/ts-thinkt';

export const apiClient = getDefaultClient();

const SESSION_TOKEN_KEY = 'thinkt-auth-token';

// Read auth token from URL hash fragment (#token=...).
// The server passes it this way so it never appears in server logs.
// Once extracted, the token is saved to sessionStorage so it survives
// page refreshes (but is cleared when the tab/browser closes).
function getToken(): string | undefined {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.slice(1));
        const token = params.get('token') ?? undefined;
        if (token) {
            sessionStorage.setItem(SESSION_TOKEN_KEY, token);
            // Clear the token from the URL bar to avoid leaking it in copy/paste
            window.history.replaceState(null, '', window.location.pathname);
            return token;
        }
    }
    return sessionStorage.getItem(SESSION_TOKEN_KEY) ?? undefined;
}

const token = getToken();

// The Vite dev server proxies /api to the Go backend.
// We configure the client to hit relative paths.
apiClient.setConfig({
    baseUrl: '',
    ...(token ? { token } : {}),
});
